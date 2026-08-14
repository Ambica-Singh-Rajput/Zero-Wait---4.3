// Real-time patient data for nurse dashboard
export interface NursePatient {
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
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  route: string
  prescribedBy: string
  startDate: Date
  nextDose: Date
  administered: boolean
  notes?: string
}

export interface VitalSigns {
  timestamp: Date
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  temperature: number
  oxygenSaturation: number
  respiratoryRate: number
  nurse: string
  status: 'normal' | 'warning' | 'critical'
}

export interface EmergencyAlert {
  id: string
  patientId: string
  patientName: string
  room: string
  type: 'code-blue' | 'code-red' | 'code-yellow' | 'rapid-response'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  acknowledgedBy?: string
  resolved: boolean
  resolvedAt?: Date
}

// Real-time patient data
export const nursePatients: NursePatient[] = [
  {
    id: 'P001',
    name: 'Sarah Wilson',
    age: 45,
    gender: 'Female',
    room: '101',
    bedNumber: '101-A',
    department: 'Cardiology',
    admissionDate: new Date('2024-04-10T08:30:00'),
    attendingDoctor: 'Dr. Amit Verma',
    condition: 'Post-MI cardiac monitoring',
    status: 'stable',
    priority: 'high',
    bloodGroup: 'A+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    currentMedications: [
      {
        id: 'M001',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        route: 'Oral',
        prescribedBy: 'Dr. Amit Verma',
        startDate: new Date('2024-04-10T09:00:00'),
        nextDose: new Date('2024-04-12T21:00:00'),
        administered: false,
        notes: 'Low dose for cardiac protection'
      },
      {
        id: 'M002',
        name: 'Metoprolol',
        dosage: '25mg',
        frequency: 'Twice daily',
        route: 'Oral',
        prescribedBy: 'Dr. Amit Verma',
        startDate: new Date('2024-04-10T09:00:00'),
        nextDose: new Date('2024-04-12T09:00:00'),
        administered: false,
        notes: 'Beta blocker for heart rate control'
      }
    ],
    vitalSigns: [
      {
        timestamp: new Date('2024-04-12T14:30:00'),
        bloodPressure: { systolic: 125, diastolic: 82 },
        heartRate: 78,
        temperature: 98.4,
        oxygenSaturation: 97,
        respiratoryRate: 18,
        nurse: 'Nurse Johnson',
        status: 'normal'
      },
      {
        timestamp: new Date('2024-04-12T10:30:00'),
        bloodPressure: { systolic: 128, diastolic: 85 },
        heartRate: 82,
        temperature: 98.6,
        oxygenSaturation: 96,
        respiratoryRate: 20,
        nurse: 'Nurse Smith',
        status: 'normal'
      }
    ],
    lastUpdate: new Date('2024-04-12T14:30:00'),
    emergencyContact: {
      name: 'Robert Wilson',
      relationship: 'Husband',
      phone: '+1-555-0123-4567'
    }
  },
  {
    id: 'P002',
    name: 'James Miller',
    age: 62,
    gender: 'Male',
    room: '203',
    bedNumber: '203-B',
    department: 'Pulmonology',
    admissionDate: new Date('2024-04-08T16:45:00'),
    attendingDoctor: 'Dr. Priya Sharma',
    condition: 'COPD exacerbation',
    status: 'improving',
    priority: 'medium',
    bloodGroup: 'O+',
    allergies: ['Latex', 'Tree nuts'],
    currentMedications: [
      {
        id: 'M003',
        name: 'Albuterol',
        dosage: '2.5mg',
        frequency: 'Every 4-6 hours PRN',
        route: 'Inhalation',
        prescribedBy: 'Dr. Priya Sharma',
        startDate: new Date('2024-04-08T17:00:00'),
        nextDose: new Date('2024-04-12T18:00:00'),
        administered: true,
        notes: 'Bronchodilator for breathing difficulties'
      },
      {
        id: 'M004',
        name: 'Prednisone',
        dosage: '40mg',
        frequency: 'Once daily',
        route: 'Oral',
        prescribedBy: 'Dr. Priya Sharma',
        startDate: new Date('2024-04-08T17:00:00'),
        nextDose: new Date('2024-04-13T08:00:00'),
        administered: false,
        notes: 'Steroid for inflammation reduction'
      }
    ],
    vitalSigns: [
      {
        timestamp: new Date('2024-04-12T14:15:00'),
        bloodPressure: { systolic: 135, diastolic: 88 },
        heartRate: 92,
        temperature: 99.1,
        oxygenSaturation: 94,
        respiratoryRate: 24,
        nurse: 'Nurse Davis',
        status: 'warning'
      },
      {
        timestamp: new Date('2024-04-12T10:15:00'),
        bloodPressure: { systolic: 138, diastolic: 90 },
        heartRate: 95,
        temperature: 99.2,
        oxygenSaturation: 93,
        respiratoryRate: 26,
        nurse: 'Nurse Chen',
        status: 'warning'
      }
    ],
    lastUpdate: new Date('2024-04-12T14:15:00'),
    emergencyContact: {
      name: 'Mary Miller',
      relationship: 'Daughter',
      phone: '+1-555-0234-5678'
    }
  },
  {
    id: 'P003',
    name: 'Lisa Davis',
    age: 28,
    gender: 'Female',
    room: '105',
    bedNumber: '105-A',
    department: 'General Surgery',
    admissionDate: new Date('2024-04-11T11:20:00'),
    attendingDoctor: 'Dr. Rajesh Kumar',
    condition: 'Post-appendectomy recovery',
    status: 'improving',
    priority: 'low',
    bloodGroup: 'B+',
    allergies: ['None known'],
    currentMedications: [
      {
        id: 'M005',
        name: 'Morphine',
        dosage: '2mg',
        frequency: 'Every 4 hours PRN',
        route: 'IV',
        prescribedBy: 'Dr. Rajesh Kumar',
        startDate: new Date('2024-04-11T12:00:00'),
        nextDose: new Date('2024-04-12T16:00:00'),
        administered: true,
        notes: 'Pain management post-surgery'
      },
      {
        id: 'M006',
        name: 'Cefazolin',
        dosage: '1g',
        frequency: 'Every 8 hours',
        route: 'IV',
        prescribedBy: 'Dr. Rajesh Kumar',
        startDate: new Date('2024-04-11T12:00:00'),
        nextDose: new Date('2024-04-12T20:00:00'),
        administered: false,
        notes: 'Antibiotic prophylaxis'
      }
    ],
    vitalSigns: [
      {
        timestamp: new Date('2024-04-12T14:00:00'),
        bloodPressure: { systolic: 118, diastolic: 76 },
        heartRate: 72,
        temperature: 98.2,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        nurse: 'Nurse Williams',
        status: 'normal'
      }
    ],
    lastUpdate: new Date('2024-04-12T14:00:00'),
    emergencyContact: {
      name: 'Tom Davis',
      relationship: 'Husband',
      phone: '+1-555-0345-6789'
    }
  },
  {
    id: 'P004',
    name: 'Robert Chen',
    age: 71,
    gender: 'Male',
    room: 'ICU-01',
    bedNumber: 'ICU-01-A',
    department: 'Neurology',
    admissionDate: new Date('2024-04-09T22:30:00'),
    attendingDoctor: 'Dr. Sarah Johnson',
    condition: 'Post-stroke rehabilitation',
    status: 'critical',
    priority: 'urgent',
    bloodGroup: 'AB+',
    allergies: ['Aspirin', 'Iodine'],
    currentMedications: [
      {
        id: 'M007',
        name: 'Warfarin',
        dosage: '5mg',
        frequency: 'Once daily',
        route: 'Oral',
        prescribedBy: 'Dr. Sarah Johnson',
        startDate: new Date('2024-04-10T09:00:00'),
        nextDose: new Date('2024-04-12T21:00:00'),
        administered: false,
        notes: 'Anticoagulant therapy'
      },
      {
        id: 'M008',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        route: 'Oral',
        prescribedBy: 'Dr. Sarah Johnson',
        startDate: new Date('2024-04-10T09:00:00'),
        nextDose: new Date('2024-04-12T09:00:00'),
        administered: true,
        notes: 'ACE inhibitor for blood pressure'
      }
    ],
    vitalSigns: [
      {
        timestamp: new Date('2024-04-12T14:45:00'),
        bloodPressure: { systolic: 165, diastolic: 95 },
        heartRate: 110,
        temperature: 99.8,
        oxygenSaturation: 89,
        respiratoryRate: 28,
        nurse: 'Nurse Garcia',
        status: 'critical'
      },
      {
        timestamp: new Date('2024-04-12T14:30:00'),
        bloodPressure: { systolic: 160, diastolic: 92 },
        heartRate: 105,
        temperature: 99.5,
        oxygenSaturation: 90,
        respiratoryRate: 26,
        nurse: 'Nurse Martinez',
        status: 'critical'
      }
    ],
    lastUpdate: new Date('2024-04-12T14:45:00'),
    emergencyContact: {
      name: 'Jennifer Chen',
      relationship: 'Daughter',
      phone: '+1-555-0456-7890'
    }
  },
  {
    id: 'P005',
    name: 'Maria Rodriguez',
    age: 35,
    gender: 'Female',
    room: '302',
    bedNumber: '302-B',
    department: 'Obstetrics',
    admissionDate: new Date('2024-04-11T14:15:00'),
    attendingDoctor: 'Dr. Emily Brown',
    condition: 'Post-delivery monitoring',
    status: 'stable',
    priority: 'medium',
    bloodGroup: 'O-',
    allergies: ['Penicillin', 'Eggs'],
    currentMedications: [
      {
        id: 'M009',
        name: 'Iron supplement',
        dosage: '325mg',
        frequency: 'Twice daily',
        route: 'Oral',
        prescribedBy: 'Dr. Emily Brown',
        startDate: new Date('2024-04-11T15:00:00'),
        nextDose: new Date('2024-04-12T20:00:00'),
        administered: false,
        notes: 'Post-delivery anemia prevention'
      },
      {
        id: 'M010',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours PRN',
        route: 'Oral',
        prescribedBy: 'Dr. Emily Brown',
        startDate: new Date('2024-04-11T15:00:00'),
        nextDose: new Date('2024-04-12T18:00:00'),
        administered: true,
        notes: 'Pain management'
      }
    ],
    vitalSigns: [
      {
        timestamp: new Date('2024-04-12T14:20:00'),
        bloodPressure: { systolic: 110, diastolic: 70 },
        heartRate: 75,
        temperature: 98.0,
        oxygenSaturation: 99,
        respiratoryRate: 16,
        nurse: 'Nurse Thompson',
        status: 'normal'
      }
    ],
    lastUpdate: new Date('2024-04-12T14:20:00'),
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relationship: 'Husband',
      phone: '+1-555-0567-8901'
    }
  }
]

// Real-time emergency alerts
export const emergencyAlerts: EmergencyAlert[] = [
  {
    id: 'E001',
    patientId: 'P004',
    patientName: 'Robert Chen',
    room: 'ICU-01',
    type: 'code-blue',
    severity: 'critical',
    message: 'Patient experiencing severe hypertension and arrhythmia - Immediate medical attention required',
    timestamp: new Date('2024-04-12T14:45:00'),
    resolved: false
  },
  {
    id: 'E002',
    patientId: 'P002',
    patientName: 'James Miller',
    room: '203',
    type: 'rapid-response',
    severity: 'medium',
    message: 'Patient showing increased respiratory distress - Assessment needed',
    timestamp: new Date('2024-04-12T14:15:00'),
    acknowledgedBy: 'Nurse Davis',
    resolved: false
  },
  {
    id: 'E003',
    patientId: 'P001',
    patientName: 'Sarah Wilson',
    room: '101',
    type: 'code-yellow',
    severity: 'low',
    message: 'Patient family unable to locate patient in cafeteria - Search initiated',
    timestamp: new Date('2024-04-12T12:30:00'),
    acknowledgedBy: 'Nurse Johnson',
    resolved: true
  }
]

// Real-time updates simulation
export function getRealTimeUpdates(): NursePatient[] {
  // Simulate real-time updates to patient data
  const updatedPatients = [...nursePatients]
  
  // Check for discharged patients and update their status
  try {
    const { DischargeService } = require('../services/dischargeService')
    const dischargeService = DischargeService.getInstance()
    const completedWorkflows = dischargeService.getAllWorkflows().filter((w: any) => w.status === 'completed')
    
    updatedPatients.forEach((patient: any) => {
      const completedWorkflow = completedWorkflows.find((w: any) => w.patientId === patient.id)
      if (completedWorkflow && !patient.dischargeStatus) {
        patient.dischargeStatus = 'discharged'
        console.log(`Patient ${patient.name} marked as discharged`)
      }
    })
  } catch (error) {
    console.log('Error checking discharge status:', error)
  }
  
  // Randomly update some vitals for non-discharged patients
  updatedPatients.forEach((patient: any, index: number) => {
    if (patient.dischargeStatus === 'discharged') return // Skip discharged patients
    
    if (Math.random() > 0.7) { // 30% chance of update
      const now = new Date()
      const newVitalSign: VitalSigns = {
        timestamp: new Date(now.getTime() - Math.random() * 300000), // Random time in last 5 minutes
        bloodPressure: { 
          systolic: patient.vitalSigns[0].bloodPressure.systolic + Math.floor(Math.random() * 10 - 5),
          diastolic: patient.vitalSigns[0].bloodPressure.diastolic + Math.floor(Math.random() * 8 - 4)
        },
        heartRate: patient.vitalSigns[0].heartRate + Math.floor(Math.random() * 10 - 5),
        temperature: patient.vitalSigns[0].temperature + (Math.random() * 2 - 1),
        oxygenSaturation: Math.min(100, Math.max(85, patient.vitalSigns[0].oxygenSaturation + Math.floor(Math.random() * 6 - 3))),
        respiratoryRate: patient.vitalSigns[0].respiratoryRate + Math.floor(Math.random() * 4 - 2),
        nurse: `Nurse ${['Johnson', 'Smith', 'Davis', 'Chen', 'Williams', 'Garcia', 'Martinez', 'Thompson'][Math.floor(Math.random() * 8)]}`,
        status: patient.status === 'critical' ? 'critical' : (Math.random() > 0.8 ? 'warning' : 'normal')
      }
      
      return {
        ...patient,
        vitalSigns: [newVitalSign, ...patient.vitalSigns],
        lastUpdate: newVitalSign.timestamp
      }
    }
    return patient
  })
  
  return updatedPatients
}

export interface ScheduledMedication extends Medication {
  patientName: string
  patientRoom: string
  urgency: 'OVERDUE' | 'DUE SOON'
}

export const getMedicationSchedule = (): ScheduledMedication[] => {
  const now = new Date()
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000)
  
  return nursePatients.flatMap(patient => 
    patient.currentMedications
      .filter(med => !med.administered && new Date(med.nextDose) <= nextHour)
      .map(med => ({
        ...med,
        patientName: patient.name,
        patientRoom: patient.room,
        urgency: (new Date(med.nextDose) <= now ? 'OVERDUE' : 'DUE SOON') as 'OVERDUE' | 'DUE SOON'
      }))
  ).sort((a, b) => new Date(a.nextDose).getTime() - new Date(b.nextDose).getTime())
}
