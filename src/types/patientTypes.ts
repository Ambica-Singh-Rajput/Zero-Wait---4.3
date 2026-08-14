export interface Patient {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  bloodGroup: string
  contactNumber: string
  email?: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  currentAdmission: {
    admissionDate: Date
    bedNumber: string
    department: string
    attendingDoctor: string
    condition: 'Critical' | 'Serious' | 'Stable' | 'Recovering'
    primaryDiagnosis: string
    secondaryDiagnoses?: string[]
  }
  medicalHistory: {
    admissionHistory: Admission[]
    medications: MedicationHistory[]
    allergies: string[]
    chronicConditions: string[]
    surgeries: Surgery[]
  }
  currentStatus: {
    vitals: PatientVitals
    currentMedications: CurrentMedication[]
    diet: DietPlan
    activityLevel: 'Bed Rest' | 'Limited Mobility' | 'Assisted Walking' | 'Full Mobility'
    painLevel: number // 0-10 scale
  }
  reports: {
    labReports: LabReport[]
    imagingReports: ImagingReport[]
    testResults: TestResult[]
  }
  treatment: {
    ongoingTreatments: Treatment[]
    plannedProcedures: Procedure[]
    consultations: Consultation[]
  }
}

export interface Admission {
  id: string
  admissionDate: Date
  dischargeDate?: Date
  reason: string
  department: string
  bedNumber: string
  attendingDoctor: string
  diagnosis: string
  treatment: string
  outcome?: string
  lengthOfStay?: number
}

export interface MedicationHistory {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  startDate: Date
  endDate?: Date
  prescribedBy: string
  purpose: string
  sideEffects?: string[]
  effectiveness?: 'Poor' | 'Fair' | 'Good' | 'Excellent'
}

export interface Surgery {
  id: string
  surgeryDate: Date
  surgeryType: string
  surgeon: string
  hospital: string
  anesthesia: string
  duration: string
  complications?: string[]
  outcome: 'Successful' | 'Complications' | 'Ongoing Issues'
  followUpRequired: boolean
  notes?: string
}

export interface PatientVitals {
  bloodPressure: {
    systolic: number
    diastolic: number
    lastChecked: Date
  }
  heartRate: {
    value: number
    lastChecked: Date
  }
  temperature: {
    value: number
    lastChecked: Date
  }
  oxygenSaturation: {
    value: number
    lastChecked: Date
  }
  respiratoryRate: {
    value: number
    lastChecked: Date
  }
  weight?: {
    value: number
    lastChecked: Date
  }
  height?: {
    value: number
    lastChecked: Date
  }
}

export interface CurrentMedication {
  id: string
  name: string
  dosage: string
  frequency: string
  route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation' | 'Subcutaneous'
  startDate: Date
  prescribedBy: string
  purpose: string
  nextDose?: Date
  specialInstructions?: string
}

export interface DietPlan {
  type: 'Regular' | 'Soft' | 'Liquid' | 'NPO' | 'Diabetic' | 'Cardiac' | 'Renal' | 'Custom'
  restrictions: string[]
  supplements: string[]
  specialInstructions: string
  lastUpdated: Date
  prescribedBy: string
}

export interface LabReport {
  id: string
  testName: string
  category: 'Blood' | 'Urine' | 'Biochemistry' | 'Hematology' | 'Microbiology' | 'Other'
  result: string
  normalRange: string
  status: 'Normal' | 'Abnormal' | 'Critical'
  testDate: Date
  reportedBy: string
  notes?: string
}

export interface ImagingReport {
  id: string
  imagingType: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'PET Scan' | 'Other'
  bodyPart: string
  findings: string
  impression: string
  recommendation?: string
  studyDate: Date
  radiologist: string
  images?: string[]
}

export interface TestResult {
  id: string
  testType: string
  result: string
  normalRange?: string
  status: 'Normal' | 'Abnormal' | 'Critical'
  testDate: Date
  performedBy: string
  notes?: string
}

export interface Treatment {
  id: string
  name: string
  type: 'Medication' | 'Therapy' | 'Procedure' | 'Lifestyle' | 'Other'
  startDate: Date
  endDate?: Date
  frequency: string
  purpose: string
  response: string
  prescribedBy: string
}

export interface Procedure {
  id: string
  name: string
  scheduledDate: Date
  urgency: 'Routine' | 'Urgent' | 'Emergency'
  preparation: string[]
  risks: string[]
  expectedOutcome: string
  surgeon?: string
  anesthesiologist?: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
}

export interface Consultation {
  id: string
  consultantType: string
  consultantName: string
  date: Date
  reason: string
  findings: string
  recommendations: string
  followUp?: string
}
