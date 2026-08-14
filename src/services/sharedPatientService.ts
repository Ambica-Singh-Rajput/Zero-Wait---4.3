import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { DischargeService } from './dischargeService'
import { nursePatients, NursePatient, Medication, VitalSigns } from '../data/nursePatientData'

export interface SharedPatient {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female'
  room: string
  bedNumber: string
  department: string
  admissionDate: Date
  attendingDoctor: string
  condition: string
  status: 'stable' | 'critical' | 'improving' | 'discharge-ready'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  bloodGroup: string
  allergies: string[]
  currentMedications: Medication[]
  vitalSigns: VitalSigns[]
  lastUpdate: Date
  dischargeStatus?: 'not-discharged' | 'discharged'
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  // Additional fields for doctor dashboard
  lastVisit?: Date
  totalAppointments?: number
  appointmentStatus?: string
}

class SharedPatientService {
  private static instance: SharedPatientService
  private patients: SharedPatient[] = []
  private listeners: Set<(patients: SharedPatient[]) => void> = new Set()

  private constructor() {
    this.initializePatients()
  }

  static getInstance(): SharedPatientService {
    if (!SharedPatientService.instance) {
      SharedPatientService.instance = new SharedPatientService()
    }
    return SharedPatientService.instance
  }

  private initializePatients() {
    // Initialize with nurse patient data
    this.patients = nursePatients.map(patient => ({
      ...patient,
      lastVisit: patient.admissionDate,
      totalAppointments: 1,
      appointmentStatus: 'active'
    }))

    // Try to sync with Firebase if available
    this.syncWithFirebase().catch(error => {
      console.log('Firebase sync not available, using local data')
    })

    // Notify listeners
    this.notifyListeners()
  }

  private async syncWithFirebase() {
    try {
      // Get all patients from Firebase
      const patientsQuery = query(collection(db, 'patients'))
      const patientsSnapshot = await getDocs(patientsQuery)
      
      const firebasePatients: SharedPatient[] = []
      
      patientsSnapshot.forEach((doc) => {
        const patientData = doc.data()
        firebasePatients.push({
          id: doc.id,
          name: patientData.name || 'Unknown Patient',
          age: patientData.age || 0,
          gender: patientData.gender || 'Male',
          room: patientData.room || 'Unknown',
          bedNumber: patientData.bedNumber || 'Unknown',
          department: patientData.department || 'General',
          admissionDate: patientData.admissionDate?.toDate() || new Date(),
          attendingDoctor: patientData.attendingDoctor || 'Unknown Doctor',
          condition: patientData.condition || 'Unknown',
          status: patientData.status || 'stable',
          priority: patientData.priority || 'medium',
          bloodGroup: patientData.bloodGroup || 'O+',
          allergies: patientData.allergies || [],
          currentMedications: patientData.currentMedications || [],
          vitalSigns: patientData.vitalSigns || [],
          lastUpdate: patientData.lastUpdate?.toDate() || new Date(),
          dischargeStatus: patientData.dischargeStatus || 'not-discharged',
          emergencyContact: patientData.emergencyContact || { name: '', relationship: '', phone: '' },
          lastVisit: patientData.lastVisit?.toDate() || new Date(),
          totalAppointments: patientData.totalAppointments || 1,
          appointmentStatus: patientData.appointmentStatus || 'active'
        })
      })

      // Merge Firebase data with local data
      this.mergePatients(firebasePatients)
    } catch (error) {
      console.error('Error syncing with Firebase:', error)
    }
  }

  private mergePatients(firebasePatients: SharedPatient[]) {
    // Create a map of existing patients by ID
    const patientMap = new Map<string, SharedPatient>()
    this.patients.forEach(patient => patientMap.set(patient.id, patient))

    // Update or add Firebase patients
    firebasePatients.forEach(firebasePatient => {
      const existingPatient = patientMap.get(firebasePatient.id)
      if (existingPatient) {
        // Update existing patient with Firebase data
        Object.assign(existingPatient, firebasePatient)
      } else {
        // Add new patient from Firebase
        patientMap.set(firebasePatient.id, firebasePatient)
      }
    })

    // Convert back to array
    this.patients = Array.from(patientMap.values())
  }

  private notifyListeners() {
    const activePatients = this.getActivePatients()
    this.listeners.forEach(listener => listener(activePatients))
  }

  getActivePatients(): SharedPatient[] {
    // Filter out discharged patients
    try {
      const dischargeService = DischargeService.getInstance()
      const completedWorkflows = dischargeService.getAllWorkflows().filter(w => w.status === 'completed')
      const dischargedPatientIds = completedWorkflows.map(w => w.patientId)
      
      return this.patients.filter(patient => !dischargedPatientIds.includes(patient.id))
    } catch (error) {
      console.error('Error filtering discharged patients:', error)
      return this.patients
    }
  }

  getAllPatients(): SharedPatient[] {
    return [...this.patients]
  }

  getPatientById(id: string): SharedPatient | undefined {
    return this.patients.find(patient => patient.id === id)
  }

  updatePatient(id: string, updates: Partial<SharedPatient>): boolean {
    const patientIndex = this.patients.findIndex(patient => patient.id === id)
    if (patientIndex === -1) return false

    this.patients[patientIndex] = {
      ...this.patients[patientIndex],
      ...updates,
      lastUpdate: new Date()
    }

    // Try to sync with Firebase
    this.syncPatientToFirebase(this.patients[patientIndex])

    // Notify listeners
    this.notifyListeners()

    return true
  }

  private async syncPatientToFirebase(patient: SharedPatient) {
    try {
      const patientRef = doc(db, 'patients', patient.id)
      await setDoc(patientRef, {
        ...patient,
        admissionDate: Timestamp.fromDate(patient.admissionDate),
        lastUpdate: Timestamp.fromDate(patient.lastUpdate),
        lastVisit: patient.lastVisit ? Timestamp.fromDate(patient.lastVisit) : null
      }, { merge: true })
    } catch (error) {
      console.error('Error syncing patient to Firebase:', error)
    }
  }

  addPatient(patient: Omit<SharedPatient, 'id'>): SharedPatient {
    const newPatient: SharedPatient = {
      ...patient,
      id: `P${String(this.patients.length + 1).padStart(3, '0')}`,
      lastUpdate: new Date(),
      lastVisit: patient.admissionDate,
      totalAppointments: 1,
      appointmentStatus: 'active'
    }

    this.patients.push(newPatient)

    // Try to sync with Firebase
    this.syncPatientToFirebase(newPatient)

    // Notify listeners
    this.notifyListeners()

    return newPatient
  }

  removePatient(id: string): boolean {
    const patientIndex = this.patients.findIndex(patient => patient.id === id)
    if (patientIndex === -1) return false

    this.patients.splice(patientIndex, 1)

    // Try to remove from Firebase
    deleteDoc(doc(db, 'patients', id)).catch(error => {
      console.error('Error removing patient from Firebase:', error)
    })

    // Notify listeners
    this.notifyListeners()

    return true
  }

  subscribeToPatients(listener: (patients: SharedPatient[]) => void): () => void {
    this.listeners.add(listener)
    
    // Immediately call with current data
    listener(this.getActivePatients())

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Method for doctor dashboard compatibility
  async getDoctorPatients(doctorId: string): Promise<{ success: boolean; patients: SharedPatient[]; error?: string }> {
    try {
      // Get all active patients
      const activePatients = this.getActivePatients()

      // Filter by attending doctor if needed
      const doctorPatients = doctorId ? 
        activePatients.filter(patient => patient.attendingDoctor.includes(doctorId) || patient.attendingDoctor === doctorId) :
        activePatients

      return {
        success: true,
        patients: doctorPatients
      }
    } catch (error: any) {
      return {
        success: false,
        patients: [],
        error: error.message
      }
    }
  }

  // Method for nurse dashboard compatibility
  getNursePatients(): SharedPatient[] {
    return this.getActivePatients()
  }

  // Update patient status (for discharge workflow integration)
  updatePatientStatus(patientId: string, status: 'stable' | 'critical' | 'improving' | 'discharge-ready'): boolean {
    return this.updatePatient(patientId, { status })
  }

  // Mark patient as discharged
  markPatientAsDischarged(patientId: string): boolean {
    return this.updatePatient(patientId, { dischargeStatus: 'discharged' })
  }

  // Search patients
  searchPatients(searchTerm: string): SharedPatient[] {
    const activePatients = this.getActivePatients()
    const term = searchTerm.toLowerCase()
    
    return activePatients.filter(patient => 
      patient.name.toLowerCase().includes(term) ||
      patient.id.toLowerCase().includes(term) ||
      patient.room.toLowerCase().includes(term) ||
      patient.condition.toLowerCase().includes(term)
    )
  }

  // Get patients by department
  getPatientsByDepartment(department: string): SharedPatient[] {
    const activePatients = this.getActivePatients()
    return activePatients.filter(patient => patient.department === department)
  }

  // Get patients by status
  getPatientsByStatus(status: string): SharedPatient[] {
    const activePatients = this.getActivePatients()
    return activePatients.filter(patient => patient.status === status)
  }

  // Get critical patients
  getCriticalPatients(): SharedPatient[] {
    const activePatients = this.getActivePatients()
    return activePatients.filter(patient => 
      patient.status === 'critical' || 
      patient.priority === 'urgent' ||
      patient.priority === 'high'
    )
  }
}

export default SharedPatientService
export { SharedPatientService }
