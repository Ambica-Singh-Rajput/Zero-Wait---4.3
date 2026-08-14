/**
 * demoData.ts
 * Rich dummy/demo data for all doctor dashboard features.
 * Used to power a fully-working demo without needing a live Firebase database.
 */

const today = new Date()
const todayStr = today.toISOString().split('T')[0]
const yesterday = new Date(today)
yesterday.setDate(today.getDate() - 1)
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)
const fmt = (d: Date) => d.toISOString().split('T')[0]

// Demo Patients
export const DEMO_PATIENTS = [
  {
    id: 'patient-001', name: 'Ravi Kumar', age: 45, gender: 'Male', bloodGroup: 'O+',
    phone: '+91 9876543210', email: 'ravi.kumar@email.com', address: 'Jubilee Hills, Hyderabad',
    admissionDate: fmt(yesterday), ward: 'Cardiology Ward B', bed: 'B-12', condition: 'stable',
    diagnosis: 'Hypertension, Type 2 Diabetes', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    vitalSigns: [{ id: 'vs-001', timestamp: new Date().toISOString(), bloodPressure: '128/82', heartRate: 78, temperature: 98.6, oxygenSaturation: 97, respiratoryRate: 16, status: 'normal', recordedBy: 'Nurse Priya' }],
    medications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', status: 'active' }, { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'active' }],
    allergies: ['Penicillin'], insuranceProvider: 'Star Health Insurance', insurancePolicyNo: 'SH-2024-78901'
  },
  {
    id: 'patient-002', name: 'Sunita Sharma', age: 38, gender: 'Female', bloodGroup: 'A+',
    phone: '+91 9123456789', email: 'sunita.sharma@email.com', address: 'Banjara Hills, Hyderabad',
    admissionDate: fmt(yesterday), ward: 'General Medicine', bed: 'GM-05', condition: 'critical',
    diagnosis: 'Acute Appendicitis (Post-op)', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    vitalSigns: [{ id: 'vs-002', timestamp: new Date().toISOString(), bloodPressure: '110/70', heartRate: 95, temperature: 100.2, oxygenSaturation: 95, respiratoryRate: 20, status: 'critical', recordedBy: 'Nurse Meena' }],
    medications: [{ name: 'Cefazolin', dosage: '1g IV', frequency: 'Every 8 hours', status: 'active' }, { name: 'Morphine', dosage: '5mg', frequency: 'As needed', status: 'active' }],
    allergies: ['Sulfonamides'], insuranceProvider: 'United India Insurance', insurancePolicyNo: 'UI-2024-45632'
  },
  {
    id: 'patient-003', name: 'Arjun Reddy', age: 62, gender: 'Male', bloodGroup: 'B+',
    phone: '+91 9988776655', email: 'arjun.reddy@email.com', address: 'Kondapur, Hyderabad',
    admissionDate: fmt(today), ward: 'Orthopedics', bed: 'OT-03', condition: 'stable',
    diagnosis: 'Left Knee Osteoarthritis', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    vitalSigns: [{ id: 'vs-003', timestamp: new Date().toISOString(), bloodPressure: '132/86', heartRate: 72, temperature: 98.4, oxygenSaturation: 98, respiratoryRate: 15, status: 'normal', recordedBy: 'Nurse Kavitha' }],
    medications: [{ name: 'Diclofenac', dosage: '75mg', frequency: 'Twice daily', status: 'active' }, { name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily', status: 'active' }],
    allergies: [], insuranceProvider: 'Max Bupa', insurancePolicyNo: 'MB-2024-11233'
  },
  {
    id: 'patient-004', name: 'Lakshmi Devi', age: 55, gender: 'Female', bloodGroup: 'AB+',
    phone: '+91 9765432109', email: 'lakshmi.devi@email.com', address: 'Madhapur, Hyderabad',
    admissionDate: fmt(yesterday), ward: 'Neurology', bed: 'NE-08', condition: 'stable',
    diagnosis: 'Migraine with Aura', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    vitalSigns: [{ id: 'vs-004', timestamp: new Date().toISOString(), bloodPressure: '118/76', heartRate: 68, temperature: 98.2, oxygenSaturation: 99, respiratoryRate: 14, status: 'normal', recordedBy: 'Nurse Rani' }],
    medications: [{ name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', status: 'active' }, { name: 'Topiramate', dosage: '25mg', frequency: 'Twice daily', status: 'active' }],
    allergies: ['Aspirin'], insuranceProvider: 'HDFC Ergo', insurancePolicyNo: 'HE-2024-88990'
  },
  {
    id: 'patient-005', name: 'Mohammed Irfan', age: 29, gender: 'Male', bloodGroup: 'O-',
    phone: '+91 9654321098', email: 'irfan.m@email.com', address: 'Tolichowki, Hyderabad',
    admissionDate: fmt(today), ward: 'Pulmonology', bed: 'PL-02', condition: 'stable',
    diagnosis: 'Community Acquired Pneumonia', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    vitalSigns: [{ id: 'vs-005', timestamp: new Date().toISOString(), bloodPressure: '124/80', heartRate: 88, temperature: 101.1, oxygenSaturation: 93, respiratoryRate: 22, status: 'abnormal', recordedBy: 'Nurse Sundar' }],
    medications: [{ name: 'Azithromycin', dosage: '500mg', frequency: 'Once daily', status: 'active' }, { name: 'Salbutamol', dosage: '2.5mg', frequency: 'Every 6 hours', status: 'active' }],
    allergies: [], insuranceProvider: 'Religare Health', insurancePolicyNo: 'RH-2024-66778'
  }
]

// Demo Appointments
export const DEMO_APPOINTMENTS = [
  { id: 'apt-001', patientId: 'patient-001', patientName: 'Ravi Kumar', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Cardiology', date: todayStr, time: '09:00 AM', type: 'follow-up', status: 'confirmed', notes: 'Follow-up for hypertension management', createdAt: new Date() },
  { id: 'apt-002', patientId: 'patient-002', patientName: 'Sunita Sharma', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'General Surgery', date: todayStr, time: '10:30 AM', type: 'post-op', status: 'in-progress', notes: 'Post-appendectomy check - Day 1', createdAt: new Date() },
  { id: 'apt-003', patientId: 'patient-003', patientName: 'Arjun Reddy', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Orthopedics', date: todayStr, time: '11:00 AM', type: 'consultation', status: 'confirmed', notes: 'Knee pain assessment and X-ray review', createdAt: new Date() },
  { id: 'apt-004', patientId: 'patient-004', patientName: 'Lakshmi Devi', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Neurology', date: todayStr, time: '02:00 PM', type: 'routine', status: 'pending', notes: 'Migraine treatment review', createdAt: new Date() },
  { id: 'apt-005', patientId: 'patient-005', patientName: 'Mohammed Irfan', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Pulmonology', date: todayStr, time: '03:30 PM', type: 'emergency', status: 'confirmed', notes: 'Oxygen level monitoring - Pneumonia case', createdAt: new Date() },
  { id: 'apt-006', patientId: 'patient-001', patientName: 'Ravi Kumar', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Cardiology', date: fmt(yesterday), time: '10:00 AM', type: 'consultation', status: 'completed', notes: 'Initial consultation - BP and Sugar review', createdAt: new Date(yesterday) },
  { id: 'apt-007', patientId: 'patient-004', patientName: 'Lakshmi Devi', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Neurology', date: fmt(tomorrow), time: '11:30 AM', type: 'follow-up', status: 'confirmed', notes: 'Follow-up for Topiramate dosage adjustment', createdAt: new Date() }
]

// Demo Prescriptions
export const DEMO_PRESCRIPTIONS = [
  {
    id: 'rx-001', patientId: 'patient-001', patientName: 'Ravi Kumar', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    diagnosis: 'Hypertension & Type 2 Diabetes',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (morning)', duration: '30 days', instructions: 'Take with or without food' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily (with meals)', duration: '30 days', instructions: 'Take with food to reduce GI side effects' },
      { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily (night)', duration: '30 days', instructions: 'Avoid grapefruit' }
    ],
    notes: 'Monitor BP and blood sugar daily. Low-salt, low-sugar diet. Follow up in 2 weeks.',
    createdAt: new Date(yesterday), isActive: true
  },
  {
    id: 'rx-002', patientId: 'patient-002', patientName: 'Sunita Sharma', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    diagnosis: 'Post-Appendectomy Infection Prophylaxis',
    medications: [
      { name: 'Cefazolin', dosage: '1g IV', frequency: 'Every 8 hours', duration: '5 days', instructions: 'IV administration only' },
      { name: 'Morphine', dosage: '5mg', frequency: 'Every 4 hours as needed', duration: '3 days', instructions: 'Only for breakthrough pain' },
      { name: 'Ondansetron', dosage: '4mg', frequency: 'Every 8 hours', duration: '2 days', instructions: 'For post-op nausea' }
    ],
    notes: 'Wound dressing every 24 hours. Liquid diet for 48 hours then soft diet.',
    createdAt: new Date(today), isActive: true
  },
  {
    id: 'rx-003', patientId: 'patient-003', patientName: 'Arjun Reddy', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    diagnosis: 'Knee Osteoarthritis - Pain Management',
    medications: [
      { name: 'Diclofenac', dosage: '75mg', frequency: 'Twice daily (after meals)', duration: '14 days', instructions: 'Do not take on empty stomach' },
      { name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily (before breakfast)', duration: '14 days', instructions: 'Gastroprotection while on NSAID' },
      { name: 'Calcium + Vitamin D3', dosage: '500mg/400IU', frequency: 'Once daily', duration: '60 days', instructions: 'Bone health supplement' }
    ],
    notes: 'Physiotherapy recommended 3x/week. Avoid weight-bearing exercises initially.',
    createdAt: new Date(today), isActive: true
  }
]

// Demo Consultations
export const DEMO_CONSULTATIONS = [
  {
    id: 'cons-001', appointmentId: 'apt-006', patientId: 'patient-001', patientName: 'Ravi Kumar',
    doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    chiefComplaint: 'Persistent high blood pressure and fatigue',
    symptoms: ['Headache', 'Dizziness', 'Fatigue', 'Blurred vision'],
    vitals: { bloodPressure: '148/92', heartRate: 82, temperature: 98.6, weight: 78, height: 172, oxygenSaturation: 97 },
    examination: 'Bilateral pedal edema grade 1. Heart sounds S1 S2 normal. Lungs clear.',
    diagnosis: 'Stage 2 Hypertension with Diabetes Mellitus Type 2',
    treatmentPlan: 'Started Amlodipine 5mg OD. Continue Metformin. Dietary counseling given.',
    followUpDate: new Date(tomorrow), prescriptions: ['rx-001'],
    labOrdersRequested: ['HbA1c', 'Lipid Profile', 'Serum Creatinine', 'ECG'],
    notes: 'Patient cooperative. Lifestyle modification counselling done.',
    consultationDate: new Date(yesterday), status: 'completed'
  },
  {
    id: 'cons-002', appointmentId: 'apt-002', patientId: 'patient-002', patientName: 'Sunita Sharma',
    doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
    chiefComplaint: 'Severe right lower quadrant abdominal pain',
    symptoms: ['Severe RLQ pain', 'Nausea', 'Vomiting', 'Fever 100.2F', 'Anorexia'],
    vitals: { bloodPressure: '112/72', heartRate: 102, temperature: 100.2, weight: 62, height: 163, oxygenSaturation: 96 },
    examination: 'Rebound tenderness at McBurney point. Rovsing sign positive. Guarding present.',
    diagnosis: 'Acute Appendicitis confirmed by USG. Appendectomy performed successfully.',
    treatmentPlan: 'IV antibiotics, pain management, post-operative care, gradual diet resumption.',
    prescriptions: ['rx-002'], labOrdersRequested: ['CBC', 'CRP', 'LFT', 'Wound culture'],
    notes: 'Surgery completed without complications. Patient recovering well.',
    consultationDate: new Date(today), status: 'in-progress'
  }
]

// Demo Medical History
export const DEMO_MEDICAL_HISTORY: Record<string, any> = {
  'patient-001': {
    healthRecords: [
      { id: 'hr-001', patientId: 'patient-001', type: 'Vital Signs', description: 'Routine vitals check - BP elevated', vitals: { bloodPressure: '148/92', heartRate: 82, temperature: 98.6, oxygenSaturation: 97 }, diagnosis: 'Stage 2 Hypertension', treatment: 'Antihypertensive therapy initiated', createdAt: new Date(yesterday), createdBy: 'demo-doctor' },
      { id: 'hr-002', patientId: 'patient-001', type: 'Lab Report', description: 'HbA1c: 7.8% - Elevated. Lipid profile: Total cholesterol 220mg/dL.', vitals: {}, diagnosis: 'Type 2 Diabetes - Suboptimal control', treatment: 'Metformin dose review, dietary counseling', createdAt: new Date(yesterday), createdBy: 'demo-doctor' }
    ],
    appointments: [{ id: 'apt-001', patientId: 'patient-001', patientName: 'Ravi Kumar', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Cardiology', date: todayStr, time: '09:00 AM', type: 'follow-up', status: 'confirmed', notes: 'Follow-up for hypertension management', createdAt: new Date() }],
    prescriptions: [{ id: 'rx-001', patientId: 'patient-001', patientName: 'Ravi Kumar', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', diagnosis: 'Hypertension & Type 2 Diabetes', medications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }], notes: 'Monitor BP daily.', createdAt: new Date(yesterday), isActive: true }]
  },
  'patient-002': {
    healthRecords: [
      { id: 'hr-003', patientId: 'patient-002', type: 'Surgery Note', description: 'Laparoscopic appendectomy performed. No complications.', vitals: { bloodPressure: '110/70', heartRate: 95, temperature: 100.2, oxygenSaturation: 95 }, diagnosis: 'Acute Appendicitis', treatment: 'Emergency appendectomy', createdAt: new Date(today), createdBy: 'demo-doctor' }
    ],
    appointments: [{ id: 'apt-002', patientId: 'patient-002', patientName: 'Sunita Sharma', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'General Surgery', date: todayStr, time: '10:30 AM', type: 'post-op', status: 'in-progress', notes: 'Post-appendectomy check - Day 1', createdAt: new Date() }],
    prescriptions: [{ id: 'rx-002', patientId: 'patient-002', patientName: 'Sunita Sharma', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', diagnosis: 'Post-Appendectomy', medications: [{ name: 'Cefazolin', dosage: '1g IV', frequency: 'Every 8 hours', duration: '5 days' }], notes: 'Liquid diet for 48 hours.', createdAt: new Date(today), isActive: true }]
  },
  'patient-003': {
    healthRecords: [
      { id: 'hr-004', patientId: 'patient-003', type: 'X-Ray Report', description: 'Left knee X-ray shows grade 3 osteoarthritis. Joint space narrowing present.', vitals: { bloodPressure: '132/86', heartRate: 72, temperature: 98.4, oxygenSaturation: 98 }, diagnosis: 'Left Knee Osteoarthritis Grade III', treatment: 'NSAIDs, physiotherapy, knee brace', createdAt: new Date(today), createdBy: 'demo-doctor' }
    ],
    appointments: [{ id: 'apt-003', patientId: 'patient-003', patientName: 'Arjun Reddy', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', specialty: 'Orthopedics', date: todayStr, time: '11:00 AM', type: 'consultation', status: 'confirmed', notes: 'Knee pain assessment and X-ray review', createdAt: new Date() }],
    prescriptions: [{ id: 'rx-003', patientId: 'patient-003', patientName: 'Arjun Reddy', doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma', diagnosis: 'Knee Osteoarthritis', medications: [{ name: 'Diclofenac', dosage: '75mg', frequency: 'Twice daily', duration: '14 days' }], notes: 'Physiotherapy 3x/week.', createdAt: new Date(today), isActive: true }]
  }
}

// Demo Discharge Workflows (returns array for DischargeService seeding)
export const createDemoDischargeWorkflows = () => {
  const now = new Date()
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  return [
    {
      id: 'discharge-demo-001',
      patientId: 'patient-001', patientName: 'Ravi Kumar',
      doctorId: 'demo-doctor', doctorName: 'Dr. Amit Verma',
      initiatedAt: twoHoursAgo,
      status: 'pending-approval',
      currentStep: { id: 'step-approval', name: 'Awaiting Doctor Approval', description: 'Ready for final approvals', status: 'in-progress', department: 'doctor', estimatedTime: 30, startedAt: twoHoursAgo },
      estimatedCompletion: new Date(now.getTime() + 60 * 60 * 1000),
      departments: [
        { department: 'billing', status: 'completed', completedAt: new Date(now.getTime() - 60 * 60 * 1000), details: { billing: { totalAmount: 45000, breakdown: [{ item: 'Room charges (2 days)', amount: 20000 }, { item: 'Consultation', amount: 8000 }, { item: 'Lab tests', amount: 7000 }, { item: 'Medicines', amount: 5000 }, { item: 'Nursing', amount: 5000 }], patientResponsibility: 9000, paymentStatus: 'partial', notes: 'Insurance claim ?36,000 processed.' } } },
        { department: 'pharmacy', status: 'completed', completedAt: new Date(now.getTime() - 90 * 60 * 1000), details: { pharmacy: { medications: [{ name: 'Amlodipine 5mg', quantity: 30, instructions: 'Once daily' }, { name: 'Metformin 500mg', quantity: 60, instructions: 'Twice daily' }], totalCost: 850, preparedBy: 'Pharmacist Ramesh', readyForPickup: true, instructions: ['Store at room temperature'] } } },
        { department: 'laboratory', status: 'completed', completedAt: new Date(now.getTime() - 45 * 60 * 1000), details: { laboratory: { reports: ['CBC', 'HbA1c', 'Lipid Profile', 'ECG'], preparedBy: 'Lab Tech Siva', deliveryMethod: 'both', status: 'delivered' } } },
        { department: 'insurance', status: 'completed', completedAt: new Date(now.getTime() - 30 * 60 * 1000), details: { insurance: { provider: 'Star Health Insurance', policyNumber: 'SH-2024-78901', coverageAmount: 36000, claimStatus: 'approved', processingTime: 45, documents: ['Discharge Summary', 'Bill', 'Lab Reports'] } } },
        { department: 'nursing', status: 'in-progress', details: { nursing: { dischargeInstructions: 'Monitor BP and blood sugar twice daily. Follow low-salt diet.', followUpCare: 'Cardiology OPD in 2 weeks', educationProvided: ['BP monitoring', 'Diabetic diet', 'Exercise'], patientUnderstanding: 'good', nurseName: 'Nurse Priya' } } }
      ],
      aiGeneratedContent: {
        summary: 'Patient Ravi Kumar (45M) is being discharged after successful management of Stage 2 Hypertension and Type 2 Diabetes Mellitus. BP normalized to 128/82 on Amlodipine. HbA1c reduced from 7.8% to 7.2% with Metformin. Patient is stable, ambulatory, and understands medication regimen.',
        medications: [
          { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Morning with water', warnings: ['Monitor for ankle swelling'], category: 'antihypertensive' },
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'With meals', warnings: ['Avoid alcohol'], category: 'antidiabetic' }
        ],
        dietPlan: {
          type: 'Diabetic-Cardiac', duration: '3 months',
          restrictions: ['High salt foods', 'Refined sugar', 'Saturated fats', 'Alcohol'],
          recommendations: ['Fresh vegetables', 'Whole grains', 'Lean protein', 'Low-fat dairy'],
          mealPlan: [{ day: 'Day 1', breakfast: 'Oats with skim milk + fruit', lunch: 'Brown rice + dal + vegetables', dinner: 'Chapati + sabzi + salad', snacks: ['Nuts', 'Buttermilk'] }],
          supplements: ['Vitamin D3 1000IU daily'],
          hydration: { dailyIntake: 2500, frequency: 'Every 2 hours', types: ['Water', 'Coconut water'], restrictions: ['Sugary drinks', 'Alcohol'] },
          specialInstructions: ['Limit sodium to 1500mg/day', 'Eat small frequent meals'],
          basedOn: ['Hypertension', 'Diabetes']
        },
        followUpCare: 'Cardiology OPD in 2 weeks. Fasting glucose check in 1 week.',
        warnings: ['Report chest pain or shortness of breath immediately', 'Monitor BP twice daily'],
        recommendations: ['Daily 30-minute walk', 'Stress management'],
        generatedAt: twoHoursAgo, confidence: 94
      },
      approvals: [],
      timeline: [
        { id: 'tl-1', timestamp: twoHoursAgo, event: 'Discharge Initiated', department: 'doctor', description: 'Dr. Amit Verma initiated discharge for Ravi Kumar', user: 'Dr. Amit Verma', status: 'success' },
        { id: 'tl-2', timestamp: new Date(twoHoursAgo.getTime() + 10 * 60 * 1000), event: 'AI Summary Generated', department: 'ai', description: 'AI generated discharge summary with 94% confidence', user: 'AI System', status: 'success' },
        { id: 'tl-3', timestamp: new Date(twoHoursAgo.getTime() + 20 * 60 * 1000), event: 'Billing Completed', department: 'billing', description: 'Total bill: Rs.45,000. Insurance: Rs.36,000. Patient: Rs.9,000', user: 'Billing Team', status: 'success' },
        { id: 'tl-4', timestamp: new Date(now.getTime() - 45 * 60 * 1000), event: 'Pharmacy Ready', department: 'pharmacy', description: 'All discharge medications packed and ready', user: 'Pharmacist Ramesh', status: 'success' }
      ]
    }
  ] as any[]
}
