export interface DischargeWorkflow {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  initiatedAt: Date
  status: 'initiated' | 'ai-processing' | 'pending-approval' | 'approved' | 'processing' | 'completed' | 'cancelled'
  currentStep: DischargeStep
  estimatedCompletion: Date
  departments: DepartmentStatus[]
  aiGeneratedContent: AIDischargeContent
  approvals: Approval[]
  timeline: DischargeTimeline[]
}

export interface DischargeStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  department: string
  estimatedTime: number // in minutes
  startedAt?: Date
  completedAt?: Date
  assignedTo?: string
  notes?: string
}

export interface DepartmentStatus {
  department: 'billing' | 'pharmacy' | 'laboratory' | 'insurance' | 'nursing'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  assignedTo?: string
  startedAt?: Date
  completedAt?: Date
  details?: DepartmentDetails
  errors?: string[]
}

export interface DepartmentDetails {
  billing?: {
    totalAmount: number
    breakdown: BillingBreakdown[]
    insuranceCoverage?: number
    patientResponsibility: number
    paymentStatus: 'pending' | 'partial' | 'paid'
  }
  pharmacy?: {
    medications: DischargeMedication[]
    totalCost: number
    preparedBy: string
    readyForPickup: boolean
    instructions: string[]
  }
  laboratory?: {
    reports: LabReport[]
    preparedBy: string
    deliveryMethod: 'digital' | 'physical' | 'both'
    status: 'preparing' | 'ready' | 'delivered'
  }
  insurance?: {
    provider: string
    policyNumber: string
    coverageAmount: number
    claimStatus: 'pending' | 'approved' | 'partial' | 'denied'
    approvedAmount?: number
    processingTime: number
    documents: InsuranceDocument[]
  }
  nursing?: {
    dischargeInstructions: string
    followUpCare: string
    educationProvided: string[]
    patientUnderstanding: 'excellent' | 'good' | 'fair' | 'poor'
    nurseName: string
  }
}

export interface AIDischargeContent {
  summary: string
  medications: DischargeMedication[]
  dietPlan: AIDietPlan
  followUpCare: string
  warnings: string[]
  recommendations: string[]
  generatedAt: Date
  confidence: number // 0-100
  reviewedBy?: string
  reviewedAt?: Date
}

export interface DischargeMedication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation' | 'Subcutaneous'
  instructions: string
  purpose: string
  sideEffects: string[]
  warnings: string[]
  interactions: string[]
  allergyCheck: {
    hasAllergy: boolean
    allergen: string
    alternative?: string
  }
  cost: number
  insuranceCoverage: number
  isGeneric: boolean
  brandName?: string
}

export interface AIDietPlan {
  type: 'Regular' | 'Soft' | 'Liquid' | 'NPO' | 'Diabetic' | 'Cardiac' | 'Renal' | 'Custom'
  duration: string
  restrictions: string[]
  recommendations: string[]
  mealPlan: DailyMealPlan[]
  supplements: Supplement[]
  hydration: HydrationPlan
  specialInstructions: string[]
  basedOn: string[] // What conditions this plan is based on
}

export interface DailyMealPlan {
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  time: string
  foods: string[]
  portions: string
  calories: number
  restrictions: string[]
}

export interface Supplement {
  name: string
  dosage: string
  frequency: string
  purpose: string
  duration: string
  cost: number
}

export interface HydrationPlan {
  dailyIntake: number // in ml
  frequency: string
  types: string[]
  restrictions: string[]
}

export interface Approval {
  id: string
  type: 'doctor' | 'nurse' | 'pharmacy' | 'billing'
  approverName: string
  approverId: string
  status: 'pending' | 'approved' | 'rejected' | 'needs-changes'
  approvedAt?: Date
  comments?: string
  requestedChanges?: string[]
}

export interface DischargeTimeline {
  id: string
  timestamp: Date
  event: string
  department: string
  description: string
  user: string
  status: 'info' | 'warning' | 'error' | 'success'
}

export interface BillingBreakdown {
  category: string
  description: string
  amount: number
  insuranceCovered: boolean
  quantity: number
  unitPrice: number
}

export interface LabReport {
  id: string
  testName: string
  category: string
  result: string
  normalRange: string
  status: 'Normal' | 'Abnormal' | 'Critical'
  testDate: Date
  digitalCopy: string
  physicalCopy: boolean
}

export interface InsuranceDocument {
  type: 'claim-form' | 'medical-report' | 'invoice' | 'prescription' | 'discharge-summary'
  name: string
  url: string
  uploadedAt: Date
  status: 'uploaded' | 'verified' | 'submitted'
}

export interface DischargeNotification {
  id: string
  workflowId: string
  department: string
  type: 'new-discharge' | 'status-update' | 'approval-required' | 'completed' | 'error'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  read: boolean
  actionRequired: boolean
  actionUrl?: string
}

export interface DischargeAnalytics {
  totalDischarges: number
  averageProcessingTime: number // in hours
  departmentPerformance: {
    [key: string]: {
      averageTime: number
      successRate: number
      commonErrors: string[]
    }
  }
  aiAccuracy: {
    medicationAccuracy: number
    dietAccuracy: number
    overallConfidence: number
  }
  monthlyTrends: {
    month: string
    discharges: number
    avgTime: number
  }[]
}

// Example discharge workflow for demonstration
export const createExampleDischargeWorkflow = (patientId: string, patientName: string): DischargeWorkflow => {
  const now = new Date()
  const estimatedCompletion = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

  return {
    id: `discharge-${Date.now()}`,
    patientId,
    patientName,
    doctorId: 'doctor-001',
    doctorName: 'Dr. Amit Verma',
    initiatedAt: now,
    status: 'initiated',
    currentStep: {
      id: 'step-1',
      name: 'AI Discharge Summary Generation',
      description: 'Generating comprehensive discharge summary with medication and diet recommendations',
      status: 'in-progress',
      department: 'ai',
      estimatedTime: 5,
      startedAt: now
    },
    estimatedCompletion,
    departments: [
      {
        department: 'billing',
        status: 'pending',
        details: {
          billing: {
            totalAmount: 0,
            breakdown: [],
            patientResponsibility: 0,
            paymentStatus: 'pending'
          }
        }
      },
      {
        department: 'pharmacy',
        status: 'pending',
        details: {
          pharmacy: {
            medications: [],
            totalCost: 0,
            preparedBy: '',
            readyForPickup: false,
            instructions: []
          }
        }
      },
      {
        department: 'laboratory',
        status: 'pending',
        details: {
          laboratory: {
            reports: [],
            preparedBy: '',
            deliveryMethod: 'both',
            status: 'preparing'
          }
        }
      },
      {
        department: 'insurance',
        status: 'pending',
        details: {
          insurance: {
            provider: '',
            policyNumber: '',
            coverageAmount: 0,
            claimStatus: 'pending',
            processingTime: 60,
            documents: []
          }
        }
      },
      {
        department: 'nursing',
        status: 'pending',
        details: {
          nursing: {
            dischargeInstructions: '',
            followUpCare: '',
            educationProvided: [],
            patientUnderstanding: 'good',
            nurseName: ''
          }
        }
      }
    ],
    aiGeneratedContent: {
      summary: '',
      medications: [],
      dietPlan: {
        type: 'Regular',
        duration: '',
        restrictions: [],
        recommendations: [],
        mealPlan: [],
        supplements: [],
        hydration: {
          dailyIntake: 0,
          frequency: '',
          types: [],
          restrictions: []
        },
        specialInstructions: [],
        basedOn: []
      },
      followUpCare: '',
      warnings: [],
      recommendations: [],
      generatedAt: now,
      confidence: 0
    },
    approvals: [],
    timeline: [
      {
        id: 'timeline-1',
        timestamp: now,
        event: 'Discharge Process Initiated',
        department: 'doctor',
        description: `Dr. Amit Verma initiated discharge process for ${patientName}`,
        user: 'Dr. Amit Verma',
        status: 'info'
      }
    ]
  }
}
