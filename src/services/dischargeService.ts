import { Patient } from '../types/patientTypes'
import { DischargeWorkflow, AIDischargeContent, DischargeMedication, AIDietPlan, DailyMealPlan } from '../types/dischargeTypes'
import { DischargeNotificationService } from './notificationService'
import { createDemoDischargeWorkflows } from '../data/demoData'

const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || 'AIzaSyCbubGrkxoLO4gBOvn-eClA8QEvqCyOf3k'

export class DischargeService {
  private static instance: DischargeService
  private activeWorkflows: Map<string, DischargeWorkflow> = new Map()
  private dischargeHistory: Map<string, any> = new Map() // Track discharged patients
  private dischargedPatients: Set<string> = new Set() // Track patient IDs that have been discharged

  static getInstance(): DischargeService {
    if (!DischargeService.instance) {
      DischargeService.instance = new DischargeService()
      // Load from local storage, or seed demo workflows if empty
      if (!DischargeService.instance.loadState()) {
        DischargeService.instance.seedDemoWorkflows()
      }
    }
    return DischargeService.instance
  }

  private loadState(): boolean {
    try {
      const stored = localStorage.getItem('discharge_workflows')
      if (stored) {
        const parsed = JSON.parse(stored)
        const restoreDates = (obj: any) => {
          if (obj === null || typeof obj !== 'object') return obj
          for (const key in obj) {
            if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])) {
              obj[key] = new Date(obj[key])
            } else if (typeof obj[key] === 'object') {
              restoreDates(obj[key])
            }
          }
          return obj
        }
        const workflows = restoreDates(parsed)
        if (workflows.length > 0) {
          workflows.forEach((wf: any) => {
            this.activeWorkflows.set(wf.id, wf)
          })
          return true
        }
      }
    } catch (e) {
      console.error('Failed to load workflows', e)
    }
    return false
  }

  private saveState() {
    try {
      const workflows = Array.from(this.activeWorkflows.values())
      localStorage.setItem('discharge_workflows', JSON.stringify(workflows))
    } catch (e) {
      console.error('Failed to save workflows', e)
    }
  }

  private _setWorkflow(id: string, wf: DischargeWorkflow) {
    this.activeWorkflows.set(id, wf)
    this.saveState()
  }

  private _deleteWorkflow(id: string) {
    this.activeWorkflows.delete(id)
    this.saveState()
  }

  private seedDemoWorkflows() {
    if (this.activeWorkflows.size > 0) return // already seeded
    const demoWorkflows = createDemoDischargeWorkflows()
    demoWorkflows.forEach((wf: DischargeWorkflow) => {
      this._setWorkflow(wf.id, wf)
    })
  }

  async initiateDischarge(patient: Patient, doctorId: string, doctorName: string): Promise<DischargeWorkflow> {
    const workflow = this.createInitialWorkflow(patient, doctorId, doctorName)
    this._setWorkflow(workflow.id, workflow)

    // Start AI processing
    this.processDischargeWithAI(workflow.id)

    return workflow
  }

  private createInitialWorkflow(patient: Patient, doctorId: string, doctorName: string): DischargeWorkflow {
    const now = new Date()
    const estimatedCompletion = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours

    return {
      id: `discharge-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId,
      doctorName,
      initiatedAt: now,
      status: 'ai-processing',
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
      departments: this.initializeDepartmentStatus(),
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
          description: `Dr. ${doctorName} initiated discharge process for ${patient.name}`,
          user: doctorName,
          status: 'info'
        }
      ]
    }
  }

  private initializeDepartmentStatus() {
    return [
      {
        department: 'billing' as const,
        status: 'pending' as const,
        details: {
          billing: {
            totalAmount: 0,
            breakdown: [],
            patientResponsibility: 0,
            paymentStatus: 'pending' as const
          }
        }
      },
      {
        department: 'pharmacy' as const,
        status: 'pending' as const,
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
        department: 'laboratory' as const,
        status: 'pending' as const,
        details: {
          laboratory: {
            reports: [],
            preparedBy: '',
            deliveryMethod: 'both' as const,
            status: 'preparing' as const
          }
        }
      },
      {
        department: 'insurance' as const,
        status: 'pending' as const,
        details: {
          insurance: {
            provider: '',
            policyNumber: '',
            coverageAmount: 0,
            claimStatus: 'pending' as const,
            processingTime: 60,
            documents: []
          }
        }
      },
      {
        department: 'nursing' as const,
        status: 'pending' as const,
        details: {
          nursing: {
            dischargeInstructions: '',
            followUpCare: '',
            educationProvided: [],
            patientUnderstanding: 'good' as const,
            nurseName: ''
          }
        }
      }
    ]
  }

  private async processDischargeWithAI(workflowId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) return

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000))

      const aiContent = await this.generateAIDischargeContent(workflow.patientId)
      
      // Update workflow with AI content
      workflow.aiGeneratedContent = aiContent
      workflow.status = 'pending-approval'
      workflow.currentStep.status = 'completed'
      workflow.currentStep.completedAt = new Date()

      // Add timeline event
      workflow.timeline.push({
        id: `timeline-${Date.now()}`,
        timestamp: new Date(),
        event: 'AI Discharge Summary Generated',
        department: 'ai',
        description: `AI generated comprehensive discharge summary with ${aiContent.confidence}% confidence`,
        user: 'AI System',
        status: 'success'
      })

      // Send notifications to doctor and nurse for approval
      const notificationService = DischargeNotificationService.getInstance()
      await notificationService.sendAIContentReadyNotifications(workflow)

      this._setWorkflow(workflowId, workflow)
    } catch (error) {
      console.error('AI processing failed:', error)
      workflow.status = 'cancelled'
      workflow.currentStep.status = 'failed'
      this._setWorkflow(workflowId, workflow)
    }
  }

  private async generateAIDischargeContent(patientId: string): Promise<AIDischargeContent> {
    // In a real implementation, this would call Gemini API
    // For now, we'll generate realistic mock content based on patient data
    
    const mockPatient = this.getMockPatientData(patientId)
    const now = new Date()

    const medications = this.generateMedications(mockPatient)
    const dietPlan = this.generateDietPlan(mockPatient)
    const summary = this.generateDischargeSummary(mockPatient, medications, dietPlan)

    return {
      summary,
      medications,
      dietPlan,
      followUpCare: this.generateFollowUpCare(mockPatient),
      warnings: this.generateWarnings(mockPatient, medications),
      recommendations: this.generateRecommendations(mockPatient),
      generatedAt: now,
      confidence: 92
    }
  }

  private getMockPatientData(patientId: string): Patient {
    // This would normally fetch from database
    return {
      id: patientId,
      name: 'Rajesh Kumar Sharma',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      contactNumber: '+91-98765-43210',
      email: 'rajesh.sharma@email.com',
      emergencyContact: {
        name: 'Priya Sharma',
        relationship: 'Wife',
        phone: '+91-98765-43211'
      },
      currentAdmission: {
        admissionDate: new Date('2024-01-15'),
        bedNumber: 'ICU-001',
        department: 'Cardiology',
        attendingDoctor: 'Dr. Amit Verma',
        condition: 'Stable',
        primaryDiagnosis: 'Acute Myocardial Infarction',
        secondaryDiagnoses: ['Hypertension', 'Type 2 Diabetes']
      },
      medicalHistory: {
        allergies: ['Penicillin', 'Sulfa drugs'],
        chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Coronary Artery Disease'],
        surgeries: [
          {
            id: 'surg-001',
            surgeryType: 'Percutaneous Coronary Intervention (PCI)',
            surgeryDate: new Date('2024-01-15'),
            surgeon: 'Dr. Amit Verma',
            hospital: 'Apollo Hospitals',
            anesthesia: 'Local Anesthesia',
            duration: '45 minutes',
            outcome: 'Successful',
            followUpRequired: true,
            notes: 'Stent placed in LAD artery'
          }
        ],
        medications: [],
        admissionHistory: []
      },
      currentStatus: {
        vitals: {
          bloodPressure: { systolic: 120, diastolic: 80, lastChecked: new Date() },
          heartRate: { value: 72, lastChecked: new Date() },
          temperature: { value: 98.4, lastChecked: new Date() },
          oxygenSaturation: { value: 96, lastChecked: new Date() },
          respiratoryRate: { value: 16, lastChecked: new Date() }
        },
        currentMedications: [
          {
            id: 'curr-med-001',
            name: 'Aspirin',
            dosage: '75mg',
            frequency: 'Once daily',
            route: 'Oral',
            startDate: new Date('2024-01-15'),
            prescribedBy: 'Dr. Amit Verma',
            purpose: 'Antiplatelet therapy'
          }
        ],
        diet: {
          type: 'Cardiac',
          restrictions: ['Low salt', 'Low fat', 'No caffeine', 'No alcohol'],
          supplements: ['Omega-3 fatty acids', 'Vitamin D'],
          specialInstructions: 'Small frequent meals, avoid heavy meals at night',
          lastUpdated: new Date(),
          prescribedBy: 'Dr. Amit Verma'
        },
        activityLevel: 'Limited Mobility',
        painLevel: 2
      },
      reports: {
        labReports: [],
        imagingReports: [],
        testResults: []
      },
      treatment: {
        ongoingTreatments: [],
        plannedProcedures: [],
        consultations: []
      }
    }
  }

  private generateMedications(patient: Patient): DischargeMedication[] {
    const baseMeds = [
      {
        id: 'med-001',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        duration: 'Lifelong',
        route: 'Oral' as const,
        instructions: 'Take with food to prevent stomach upset',
        purpose: 'Prevent blood clots after heart attack',
        sideEffects: ['Stomach irritation', 'Bleeding risk'],
        warnings: ['Stop taking if scheduled for surgery'],
        interactions: ['NSAIDs', 'Blood thinners'],
        allergyCheck: {
          hasAllergy: false,
          allergen: ''
        },
        cost: 15.99,
        insuranceCoverage: 80,
        isGeneric: true,
        brandName: 'Ecotrin'
      },
      {
        id: 'med-002',
        name: 'Metoprolol',
        dosage: '25mg',
        frequency: 'Twice daily',
        duration: '3 months',
        route: 'Oral' as const,
        instructions: 'Do not stop suddenly, taper off gradually',
        purpose: 'Beta blocker to protect heart',
        sideEffects: ['Fatigue', 'Dizziness', 'Slow heartbeat'],
        warnings: ['May cause dizziness when standing up'],
        interactions: ['Other beta blockers', 'Calcium channel blockers'],
        allergyCheck: {
          hasAllergy: false,
          allergen: ''
        },
        cost: 25.50,
        insuranceCoverage: 85,
        isGeneric: true,
        brandName: 'Lopressor'
      },
      {
        id: 'med-003',
        name: 'Atorvastatin',
        dosage: '40mg',
        frequency: 'Once daily at bedtime',
        duration: 'Lifelong',
        route: 'Oral' as const,
        instructions: 'Take in the evening, avoid grapefruit juice',
        purpose: 'Lower cholesterol',
        sideEffects: ['Muscle pain', 'Liver enzyme elevation'],
        warnings: ['Report muscle pain immediately'],
        interactions: ['Grapefruit juice', 'Some antibiotics'],
        allergyCheck: {
          hasAllergy: false,
          allergen: ''
        },
        cost: 45.00,
        insuranceCoverage: 90,
        isGeneric: true,
        brandName: 'Lipitor'
      }
    ]

    // Check for allergies and suggest alternatives
    return baseMeds.map(med => {
      if (patient.medicalHistory.allergies.some(allergy => 
        med.name.toLowerCase().includes(allergy.toLowerCase()))) {
        return {
          ...med,
          allergyCheck: {
            hasAllergy: true,
            allergen: patient.medicalHistory.allergies.find(a => 
              med.name.toLowerCase().includes(a.toLowerCase())) || '',
            alternative: this.getAlternativeMedication(med.name)
          }
        }
      }
      return med
    })
  }

  private getAlternativeMedication(medicationName: string): string {
    const alternatives: { [key: string]: string } = {
      'Aspirin': 'Clopidogrel 75mg daily',
      'Penicillin': 'Azithromycin 500mg daily',
      'Sulfa': 'Doxycycline 100mg twice daily'
    }
    return alternatives[medicationName] || 'Consult pharmacist for alternative'
  }

  private generateDietPlan(patient: Patient): AIDietPlan {
    const isDiabetic = patient.medicalHistory.chronicConditions.includes('Type 2 Diabetes')
    const isCardiac = patient.currentAdmission.department === 'Cardiology'

    return {
      type: isDiabetic ? 'Diabetic' : (isCardiac ? 'Cardiac' : 'Regular'),
      duration: '3 months',
      restrictions: [
        'Low sodium (less than 2g/day)',
        'Low saturated fat',
        'No trans fats',
        'Limit added sugars',
        'Avoid processed foods'
      ],
      recommendations: [
        'Eat 5-6 small meals throughout the day',
        'Include lean proteins (fish, chicken, legumes)',
        'Choose whole grains over refined grains',
        'Consume plenty of fruits and vegetables',
        'Stay hydrated with water and herbal teas'
      ],
      mealPlan: [
        {
          meal: 'Breakfast',
          time: '7:00 AM',
          foods: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'],
          portions: '1 cup oatmeal, 1/2 cup berries, 1 cup yogurt',
          calories: 350,
          restrictions: ['No added sugar']
        },
        {
          meal: 'Lunch',
          time: '12:30 PM',
          foods: ['Grilled salmon', 'Brown rice', 'Steamed vegetables'],
          portions: '4oz fish, 1/2 cup rice, 1 cup vegetables',
          calories: 450,
          restrictions: ['Minimal salt']
        },
        {
          meal: 'Dinner',
          time: '6:30 PM',
          foods: ['Chicken breast', 'Quinoa', 'Mixed green salad'],
          portions: '4oz chicken, 1 cup quinoa, 2 cups salad',
          calories: 400,
          restrictions: ['Light dressing only']
        },
        {
          meal: 'Snack',
          time: '3:00 PM',
          foods: ['Apple', 'Almonds'],
          portions: '1 medium apple, 1/4 cup almonds',
          calories: 200,
          restrictions: []
        }
      ],
      supplements: [
        {
          name: 'Omega-3 Fish Oil',
          dosage: '1000mg',
          frequency: 'Once daily with meal',
          purpose: 'Heart health and inflammation reduction',
          duration: '3 months',
          cost: 18.99
        },
        {
          name: 'Vitamin D3',
          dosage: '2000 IU',
          frequency: 'Once daily',
          purpose: 'Bone health and immune support',
          duration: '3 months',
          cost: 12.99
        },
        {
          name: 'Coenzyme Q10',
          dosage: '100mg',
          frequency: 'Once daily',
          purpose: 'Heart muscle support',
          duration: '3 months',
          cost: 25.99
        }
      ],
      hydration: {
        dailyIntake: 2000, // ml
        frequency: 'Throughout the day',
        types: ['Water', 'Herbal tea', 'Coconut water'],
        restrictions: ['Avoid sugary drinks', 'Limit caffeine to 1 cup/day']
      },
      specialInstructions: [
        'Prepare meals with minimal salt and oil',
        'Read food labels for sodium content',
        'Choose fresh or frozen vegetables over canned',
        'Avoid fried and fast foods completely'
      ],
      basedOn: ['Post-MI recovery', 'Hypertension', 'Type 2 Diabetes']
    }
  }

  private generateDischargeSummary(patient: Patient, medications: DischargeMedication[], dietPlan: AIDietPlan): string {
    return `
DISCHARGE SUMMARY

Patient Information:
- Name: ${patient.name}
- Age: ${patient.age} years
- Gender: ${patient.gender}
- Blood Group: ${patient.bloodGroup}

Admission Details:
- Admission Date: ${patient.currentAdmission.admissionDate.toLocaleDateString()}
- Department: ${patient.currentAdmission.department}
- Attending Physician: ${patient.currentAdmission.attendingDoctor}
- Primary Diagnosis: ${patient.currentAdmission.primaryDiagnosis}

Hospital Course:
Patient was admitted for management of acute myocardial infarction. Successfully underwent percutaneous coronary intervention (PCI) with stent placement to left anterior descending artery. Post-procedure course was uncomplicated with stable hemodynamics and resolution of chest pain.

Current Condition:
- Vital Signs: Stable
- Pain Level: ${patient.currentStatus.painLevel}/10
- Activity Level: ${patient.currentStatus.activityLevel}
- Diet Status: Tolerating ${patient.currentStatus.diet.type} diet

Discharge Medications (${medications.length}):
${medications.map(med => `- ${med.name} ${med.dosage} ${med.frequency} for ${med.duration}`).join('\n')}

Dietary Recommendations:
- Diet Type: ${dietPlan.type}
- Duration: ${dietPlan.duration}
- Key Restrictions: ${dietPlan.restrictions.slice(0, 3).join(', ')}

Follow-up Care:
- Cardiology follow-up in 1 week
- Continue cardiac rehabilitation
- Monitor blood pressure and blood sugar at home
- Return to emergency department for chest pain, shortness of breath, or other concerning symptoms

Activity Guidelines:
- Light walking for 10-15 minutes, 3 times daily
- No heavy lifting (>10 lbs) for 2 weeks
- Gradual increase in activity as tolerated
- Avoid strenuous exercise until cleared by cardiologist

Wound Care:
- Keep puncture site clean and dry
- Watch for signs of infection (redness, swelling, drainage)
- Report any bleeding or bruising immediately

Emergency Warning Signs:
Seek immediate medical attention for:
- Chest pain or pressure
- Shortness of breath
- Dizziness or fainting
- Irregular heartbeat
- New onset of weakness or numbness

Medication Allergies:
${patient.medicalHistory.allergies.length > 0 ? 
  patient.medicalHistory.allergies.map(allergy => `- ${allergy}`).join('\n') : 
  'No known medication allergies'}

This discharge plan has been generated by AI and reviewed by your healthcare team. Please follow all instructions carefully and attend all follow-up appointments.
    `.trim()
  }

  private generateFollowUpCare(patient: Patient): string {
    return `
Follow-up Appointments:
1. Cardiology Clinic - ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} at 10:00 AM
   - Dr. Amit Verma
   - Bring all medications and discharge papers
   - ECG and echocardiogram scheduled

2. Primary Care Physician - ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()} at 2:00 PM
   - Review overall health status
   - Discuss long-term medication management

3. Cardiac Rehabilitation - Starting ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
   - Monitored exercise program
   - Education on heart-healthy lifestyle
   - Stress management techniques

Home Monitoring:
- Blood pressure: Check daily, log readings
- Blood sugar: Check fasting and 2 hours after meals (if diabetic)
- Weight: Weigh daily, report gain of >2 lbs in 24 hours
- Symptoms: Keep diary of any chest discomfort, palpitations, or shortness of breath

Lifestyle Modifications:
- Quit smoking completely
- Limit alcohol to no more than 1 drink per day
- Maintain heart-healthy diet
- Achieve and maintain healthy weight
- Manage stress through relaxation techniques
- Get adequate sleep (7-8 hours nightly)

When to Call Your Doctor:
- Blood pressure consistently >140/90 or <90/60
- Blood sugar outside target range (if diabetic)
- New or worsening symptoms
- Side effects from medications
- Questions about your care plan

Emergency Department Visit:
Go to emergency department or call 911 for:
- Chest pain, pressure, or discomfort lasting >5 minutes
- Sudden severe shortness of breath
- Fainting or severe dizziness
- Sudden weakness or numbness on one side of body
- Severe headache with no known cause
    `.trim()
  }

  private generateWarnings(patient: Patient, medications: DischargeMedication[]): string[] {
    const warnings = [
      'Do not stop taking any medication without consulting your doctor',
      'Take all medications exactly as prescribed',
      'Keep all follow-up appointments',
      'Call 911 for chest pain that doesn\'t improve with rest'
    ]

    if (patient.medicalHistory.allergies.length > 0) {
      warnings.push(`Avoid all medications containing: ${patient.medicalHistory.allergies.join(', ')}`)
    }

    medications.forEach(med => {
      if (med.warnings.length > 0) {
        warnings.push(...med.warnings)
      }
    })

    return warnings
  }

  private generateRecommendations(patient: Patient): string[] {
    return [
      'Join a cardiac support group for emotional support',
      'Consider home blood pressure monitoring',
      'Install a medical alert system if living alone',
      'Keep a list of all medications and allergies in your wallet',
      'Inform family members about your condition and emergency plan',
      'Prepare an emergency kit with your medications',
      'Consider advanced directive planning',
      'Maintain a healthy sleep schedule',
      'Practice stress reduction techniques daily',
      'Stay socially connected with friends and family'
    ]
  }

  getWorkflow(workflowId: string): DischargeWorkflow | undefined {
    return this.activeWorkflows.get(workflowId)
  }

  updateWorkflow(workflowId: string, updates: Partial<DischargeWorkflow>): DischargeWorkflow | undefined {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) return undefined

    const updatedWorkflow = { ...workflow, ...updates }
    this._setWorkflow(workflowId, updatedWorkflow)
    return updatedWorkflow
  }

  getAllWorkflows(): DischargeWorkflow[] {
    return Array.from(this.activeWorkflows.values())
  }

  async approveDischarge(workflowId: string, approverType: 'doctor' | 'nurse', approverId: string, approverName: string): Promise<boolean> {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) return false

    // Add approval
    workflow.approvals.push({
      id: `approval-${Date.now()}`,
      type: approverType,
      approverName,
      approverId,
      status: 'approved',
      approvedAt: new Date()
    })

    // Add timeline event
    workflow.timeline.push({
      id: `timeline-${Date.now()}`,
      timestamp: new Date(),
      event: `${approverType.charAt(0).toUpperCase() + approverType.slice(1)} Approval`,
      department: approverType,
      description: `${approverName} approved the discharge plan`,
      user: approverName,
      status: 'success'
    })

    // Check if all required approvals are present
    const hasDoctorApproval = workflow.approvals.some(a => a.type === 'doctor' && a.status === 'approved')
    const hasNurseApproval = workflow.approvals.some(a => a.type === 'nurse' && a.status === 'approved')

    // Send notifications based on approval status
    const notificationService = DischargeNotificationService.getInstance()
    console.log(`Approval received: ${approverType}, Doctor: ${hasDoctorApproval}, Nurse: ${hasNurseApproval}`)
    
    if (approverType === 'doctor' && !hasNurseApproval) {
      // Doctor approved - notify nurse that approval is needed
      console.log('Sending nurse approval notification...')
      await notificationService.sendNurseApprovalNotification(workflow)
      console.log('Nurse approval notification sent!')
    } else if (approverType === 'nurse' && !hasDoctorApproval) {
      // Nurse approved - notify doctor that approval is needed
      await notificationService.sendDepartmentStatusNotification(workflow, 'nursing', 'approved')
    }

    if (hasDoctorApproval && hasNurseApproval) {
      workflow.status = 'processing'
      await this.startDepartmentProcessing(workflowId)
      
      // Send completion notifications
      await notificationService.sendDischargeInitiationNotifications(workflow)
    }

    this._setWorkflow(workflowId, workflow)
    return true
  }

  // New method to handle final discharge completion and patient removal
  async completeDischarge(workflowId: string): Promise<boolean> {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) return false

    // Add patient to discharged list
    this.dischargedPatients.add(workflow.patientId)
    
    // Add to discharge history
    const dischargeRecord = {
      patientId: workflow.patientId,
      patientName: workflow.patientName,
      doctorId: workflow.doctorId,
      doctorName: workflow.doctorName,
      dischargeDate: new Date(),
      workflowId: workflow.id,
      status: 'completed',
      aiGeneratedContent: workflow.aiGeneratedContent,
      approvals: workflow.approvals,
      timeline: workflow.timeline
    }
    
    this.dischargeHistory.set(workflow.patientId, dischargeRecord)
    
    // Remove from active workflows
    this._deleteWorkflow(workflowId)
    
    return true
  }

  // Check if patient is discharged
  isPatientDischarged(patientId: string): boolean {
    return this.dischargedPatients.has(patientId)
  }

  // Get discharge history
  getDischargeHistory(): any[] {
    return Array.from(this.dischargeHistory.values())
  }

  // Get discharge record for specific patient
  getDischargeRecord(patientId: string): any | undefined {
    return this.dischargeHistory.get(patientId)
  }

  // Filter out discharged patients from patient list
  filterActivePatients(patients: any[]): any[] {
    return patients.filter(patient => !this.dischargedPatients.has(patient.id))
  }

  private async startDepartmentProcessing(workflowId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) return

    // Simulate department processing
    const departments = ['billing', 'pharmacy', 'laboratory', 'insurance', 'nursing']
    
    for (const dept of departments) {
      await this.processDepartment(workflowId, dept)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate processing time
    }

    // Mark as completed
    workflow.status = 'completed'
    workflow.currentStep.status = 'completed'
    workflow.currentStep.completedAt = new Date()
    
    // Complete the discharge and remove patient from active list
    await this.completeDischarge(workflowId)
    
    this._setWorkflow(workflowId, workflow)
  }

  private async processDepartment(workflowId: string, department: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) return

    const deptStatus = workflow.departments.find(d => d.department === department)
    if (!deptStatus) return

    deptStatus.status = 'processing'
    deptStatus.startedAt = new Date()

    // Simulate department-specific processing
    switch (department) {
      case 'billing':
        await this.processBilling(workflow, deptStatus)
        break
      case 'pharmacy':
        await this.processPharmacy(workflow, deptStatus)
        break
      case 'laboratory':
        await this.processLaboratory(workflow, deptStatus)
        break
      case 'insurance':
        await this.processInsurance(workflow, deptStatus)
        break
      case 'nursing':
        await this.processNursing(workflow, deptStatus)
        break
    }

    deptStatus.status = 'completed'
    deptStatus.completedAt = new Date()
    
    this._setWorkflow(workflowId, workflow)
  }

  private async processBilling(workflow: DischargeWorkflow, deptStatus: any): Promise<void> {
    // Calculate total costs
    const medicationCost = workflow.aiGeneratedContent.medications.reduce((sum, med) => sum + med.cost, 0)
    const supplementCost = workflow.aiGeneratedContent.dietPlan.supplements.reduce((sum, sup) => sum + sup.cost, 0)
    const roomCharge = 1500 // Per day
    const doctorFee = 500
    const procedureFee = 2000
    const labFee = 300
    const totalCost = medicationCost + supplementCost + roomCharge + doctorFee + procedureFee + labFee

    deptStatus.details.billing = {
      totalAmount: totalCost,
      breakdown: [
        { category: 'Room Charges', description: 'ICU stay (5 days)', amount: roomCharge * 5, insuranceCovered: true, quantity: 5, unitPrice: roomCharge },
        { category: 'Doctor Fees', description: 'Attending physician', amount: doctorFee, insuranceCovered: true, quantity: 1, unitPrice: doctorFee },
        { category: 'Procedure', description: 'PCI with stent', amount: procedureFee, insuranceCovered: true, quantity: 1, unitPrice: procedureFee },
        { category: 'Laboratory', description: 'Lab tests and reports', amount: labFee, insuranceCovered: true, quantity: 1, unitPrice: labFee },
        { category: 'Medications', description: 'Discharge medications', amount: medicationCost, insuranceCovered: true, quantity: 1, unitPrice: medicationCost },
        { category: 'Supplements', description: 'Dietary supplements', amount: supplementCost, insuranceCovered: false, quantity: 1, unitPrice: supplementCost }
      ],
      insuranceCoverage: totalCost * 0.8,
      patientResponsibility: totalCost * 0.2,
      paymentStatus: 'pending'
    }
  }

  private async processPharmacy(workflow: DischargeWorkflow, deptStatus: any): Promise<void> {
    deptStatus.details.pharmacy = {
      medications: workflow.aiGeneratedContent.medications,
      totalCost: workflow.aiGeneratedContent.medications.reduce((sum, med) => sum + med.cost, 0),
      preparedBy: 'Pharmacist John Smith',
      readyForPickup: true,
      instructions: [
        'Take medications with food unless otherwise specified',
        'Store at room temperature away from moisture',
        'Keep out of reach of children',
        'Do not share medications with others'
      ]
    }
  }

  private async processLaboratory(workflow: DischargeWorkflow, deptStatus: any): Promise<void> {
    deptStatus.details.laboratory = {
      reports: [
        {
          id: 'lab-001',
          testName: 'Complete Blood Count',
          category: 'Hematology',
          result: 'Within normal limits',
          normalRange: 'Standard ranges',
          status: 'Normal',
          testDate: new Date(),
          digitalCopy: '/reports/cbc.pdf',
          physicalCopy: true
        },
        {
          id: 'lab-002',
          testName: 'Cardiac Enzymes',
          category: 'Biochemistry',
          result: 'Troponin I: 0.02 ng/mL (normal)',
          normalRange: '<0.04 ng/mL',
          status: 'Normal',
          testDate: new Date(),
          digitalCopy: '/reports/cardiac_enzymes.pdf',
          physicalCopy: true
        }
      ],
      preparedBy: 'Lab Technician Sarah Johnson',
      deliveryMethod: 'both',
      status: 'ready'
    }
  }

  private async processInsurance(workflow: DischargeWorkflow, deptStatus: any): Promise<void> {
    deptStatus.details.insurance = {
      provider: 'HealthGuard Insurance',
      policyNumber: 'HG-123456789',
      coverageAmount: 50000,
      claimStatus: 'approved',
      approvedAmount: 4000,
      processingTime: 45,
      documents: [
        {
          type: 'claim-form',
          name: 'Insurance Claim Form',
          url: '/documents/claim_form.pdf',
          uploadedAt: new Date(),
          status: 'submitted'
        },
        {
          type: 'medical-report',
          name: 'Discharge Summary',
          url: '/documents/discharge_summary.pdf',
          uploadedAt: new Date(),
          status: 'submitted'
        }
      ]
    }
  }

  private async processNursing(workflow: DischargeWorkflow, deptStatus: any): Promise<void> {
    deptStatus.details.nursing = {
      dischargeInstructions: 'Patient and family educated on medication administration, diet restrictions, activity guidelines, and warning signs. Demonstrated proper technique for taking blood pressure and blood sugar readings.',
      followUpCare: 'Scheduled home health nursing visits for wound care assessment and medication compliance monitoring.',
      educationProvided: [
        'Medication administration and timing',
        'Dietary restrictions and meal planning',
        'Activity progression and warning signs',
        'Home monitoring techniques',
        'Emergency response procedures'
      ],
      patientUnderstanding: 'excellent',
      nurseName: 'Nurse Practitioner Emily Davis'
    }
  }
}
