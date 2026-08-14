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
  Timestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Appointment, HealthRecord } from './patientService'
import SharedPatientService from './sharedPatientService'
import { DEMO_PATIENTS, DEMO_APPOINTMENTS, DEMO_PRESCRIPTIONS, DEMO_CONSULTATIONS, DEMO_MEDICAL_HISTORY } from '../data/demoData'

export interface Prescription {
  id?: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]
  diagnosis: string
  notes?: string
  createdAt: Date
  isActive: boolean
}

export interface Consultation {
  id?: string
  appointmentId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  chiefComplaint: string
  symptoms: string[]
  vitals?: {
    bloodPressure?: string
    heartRate?: number
    temperature?: number
    weight?: number
    height?: number
    oxygenSaturation?: number
  }
  examination: string
  diagnosis: string
  treatmentPlan: string
  followUpDate?: Date
  prescriptions: string[]
  labOrdersRequested?: string[]
  notes: string
  consultationDate: Date
  status: 'in-progress' | 'completed' | 'cancelled'
}

export interface DoctorSchedule {
  id?: string
  doctorId: string
  date: string
  timeSlots: {
    time: string
    isAvailable: boolean
    appointmentId?: string
    patientName?: string
  }[]
  totalSlots: number
  bookedSlots: number
}

// Patient Management - Returns demo patients for reliable demo experience
export const getDoctorPatients = async (doctorId: string) => {
  try {
    // Return demo patients directly for demo reliability
    return { success: true, patients: DEMO_PATIENTS }
  } catch (error: any) {
    console.error('Error fetching doctor patients:', error)
    return { success: false, error: error.message, patients: [] }
  }
}

export const searchPatients = async (doctorId: string, searchTerm: string) => {
  try {
    const patientsResult = await getDoctorPatients(doctorId)
    if (!patientsResult.success) {
      return patientsResult
    }

    const filteredPatients = patientsResult.patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return { success: true, patients: filteredPatients }
  } catch (error: any) {
    console.error('Error searching patients:', error)
    return { success: false, error: error.message, patients: [] }
  }
}

// Appointment Management - Returns demo appointments for reliable demo experience
export const getDoctorAppointments = async (doctorId: string, date?: string) => {
  try {
    let appointments = [...DEMO_APPOINTMENTS]
    if (date) {
      appointments = appointments.filter(a => a.date === date)
    }
    return { success: true, appointments }
  } catch (error: any) {
    console.error('Error fetching doctor appointments:', error)
    return { success: false, error: error.message, appointments: [] }
  }
}

export const updateAppointmentByDoctor = async (appointmentId: string, updates: Partial<Appointment>) => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId)
    await updateDoc(appointmentRef, {
      ...updates,
      updatedAt: new Date()
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Error updating appointment:', error)
    return { success: false, error: error.message }
  }
}

// Prescription Management
export const createPrescription = async (prescription: Omit<Prescription, 'id' | 'createdAt'>) => {
  try {
    const prescriptionData: Prescription = {
      ...prescription,
      createdAt: new Date()
    }
    
    const docRef = await addDoc(collection(db, 'prescriptions'), prescriptionData)
    return { success: true, id: docRef.id, prescription: { ...prescriptionData, id: docRef.id } }
  } catch (error: any) {
    console.error('Error creating prescription:', error)
    return { success: false, error: error.message }
  }
}

export const getPatientPrescriptions = async (patientId: string, doctorId?: string) => {
  try {
    // Return demo prescriptions for reliable demo experience
    const prescriptions = DEMO_PRESCRIPTIONS.filter(p =>
      p.patientId === patientId && (doctorId ? p.doctorId === doctorId : true)
    )
    // If no patient match found, return all prescriptions for demo
    return { success: true, prescriptions: prescriptions.length > 0 ? prescriptions : DEMO_PRESCRIPTIONS }
  } catch (error: any) {
    console.error('Error fetching prescriptions:', error)
    return { success: false, error: error.message, prescriptions: [] }
  }
}

// Medical Records Management - Returns demo data for reliable demo experience
export const getPatientMedicalHistory = async (patientId: string, doctorId?: string) => {
  try {
    const demoHistory = DEMO_MEDICAL_HISTORY[patientId]
    if (demoHistory) {
      return { success: true, medicalHistory: demoHistory }
    }
    // Fallback: return first patient's history for unknown patients
    const fallbackKey = Object.keys(DEMO_MEDICAL_HISTORY)[0]
    return { success: true, medicalHistory: DEMO_MEDICAL_HISTORY[fallbackKey] }
  } catch (error: any) {
    console.error('Error fetching medical history:', error)
    return { success: false, error: error.message }
  }
}

// BELOW IS THE OLD FIREBASE VERSION (kept for reference but skipped by early return above)
const _getPatientMedicalHistoryFirebase = async (patientId: string, doctorId?: string) => {
  try {
    // Get health records
    let healthRecordsQuery = query(
      collection(db, 'healthRecords'),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    if (doctorId) {
      healthRecordsQuery = query(
        collection(db, 'healthRecords'),
        where('patientId', '==', patientId),
        where('createdBy', '==', doctorId),
        orderBy('createdAt', 'desc')
      )
    }

    // Get appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    )

    // Get prescriptions
    const prescriptionsQuery = query(
      collection(db, 'prescriptions'),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    )

    const [healthRecordsSnapshot, appointmentsSnapshot, prescriptionsSnapshot] = await Promise.all([
      getDocs(healthRecordsQuery),
      getDocs(appointmentsQuery),
      getDocs(prescriptionsQuery)
    ])

    const healthRecords: HealthRecord[] = []
    const appointments: Appointment[] = []
    const prescriptions: Prescription[] = []

    healthRecordsSnapshot.forEach((doc) => {
      healthRecords.push({ id: doc.id, ...doc.data() } as HealthRecord)
    })

    appointmentsSnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() } as Appointment)
    })

    prescriptionsSnapshot.forEach((doc) => {
      prescriptions.push({ id: doc.id, ...doc.data() } as Prescription)
    })

    return { 
      success: true, 
      medicalHistory: {
        healthRecords,
        appointments,
        prescriptions
      }
    }
  } catch (error: any) {
    console.error('Error fetching patient medical history:', error)
    return { success: false, error: error.message }
  }
}

export const addMedicalRecord = async (record: Omit<HealthRecord, 'id' | 'createdAt'>) => {
  try {
    const healthRecord: HealthRecord = {
      ...record,
      createdAt: new Date()
    }
    
    const docRef = await addDoc(collection(db, 'healthRecords'), healthRecord)
    return { success: true, id: docRef.id }
  } catch (error: any) {
    console.error('Error adding medical record:', error)
    return { success: false, error: error.message }
  }
}

// Consultation Management
export const createConsultation = async (consultation: Omit<Consultation, 'id' | 'consultationDate'>) => {
  try {
    const consultationData: Consultation = {
      ...consultation,
      consultationDate: new Date()
    }
    
    const docRef = await addDoc(collection(db, 'consultations'), consultationData)
    return { success: true, id: docRef.id, consultation: { ...consultationData, id: docRef.id } }
  } catch (error: any) {
    console.error('Error creating consultation:', error)
    return { success: false, error: error.message }
  }
}

export const updateConsultation = async (consultationId: string, updates: Partial<Consultation>) => {
  try {
    const consultationRef = doc(db, 'consultations', consultationId)
    await updateDoc(consultationRef, updates)
    
    return { success: true }
  } catch (error: any) {
    console.error('Error updating consultation:', error)
    return { success: false, error: error.message }
  }
}

export const getDoctorConsultations = async (doctorId: string, date?: string) => {
  try {
    // Return demo consultations for reliable demo experience
    let consultations = [...DEMO_CONSULTATIONS]
    if (date) {
      consultations = consultations.filter(c => {
        const cDate = new Date(c.consultationDate).toISOString().split('T')[0]
        return cDate === date
      })
    }
    return { success: true, consultations }
  } catch (error: any) {
    console.error('Error fetching consultations:', error)
    return { success: false, error: error.message, consultations: [] }
  }
}

// Doctor Schedule Management
export const getDoctorSchedule = async (doctorId: string, date: string) => {
  try {
    const scheduleQuery = query(
      collection(db, 'doctorSchedules'),
      where('doctorId', '==', doctorId),
      where('date', '==', date)
    )

    const snapshot = await getDocs(scheduleQuery)
    let schedule: DoctorSchedule | null = null
    
    snapshot.forEach((doc) => {
      schedule = { id: doc.id, ...doc.data() } as DoctorSchedule
    })

    return { success: true, schedule }
  } catch (error: any) {
    console.error('Error fetching doctor schedule:', error)
    return { success: false, error: error.message, schedule: null }
  }
}

export const updateDoctorSchedule = async (scheduleId: string, updates: Partial<DoctorSchedule>) => {
  try {
    const scheduleRef = doc(db, 'doctorSchedules', scheduleId)
    await updateDoc(scheduleRef, updates)
    
    return { success: true }
  } catch (error: any) {
    console.error('Error updating doctor schedule:', error)
    return { success: false, error: error.message }
  }
}
