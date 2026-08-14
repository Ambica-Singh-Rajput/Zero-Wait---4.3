import { Patient } from '../types/patientTypes'

export const getMockPatients = (): Patient[] => {
  return [
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      contactNumber: '+1-555-0123-4567',
      email: 'john.smith@hospital.com',
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Wife',
        phone: '+1-555-0123-4568'
      },
      currentAdmission: {
        admissionDate: new Date('2024-04-12'),
        bedNumber: 'Room 101',
        department: 'Cardiology',
        attendingDoctor: 'Dr. Amit Verma',
        condition: 'Stable',
        primaryDiagnosis: 'Hypertension',
        secondaryDiagnoses: ['High Blood Pressure']
      },
      medicalHistory: {
        admissionHistory: [
          {
            id: 'adm-001',
            admissionDate: new Date('2022-03-10'),
            dischargeDate: new Date('2022-03-15'),
            reason: 'Chest Pain',
            department: 'Cardiology',
            bedNumber: 'Ward-205',
            attendingDoctor: 'Dr. Amit Verma',
            diagnosis: 'Stable Angina',
            treatment: 'Medical Management',
            outcome: 'Improved',
            lengthOfStay: 5
          },
          {
            id: 'adm-002',
            admissionDate: new Date('2024-01-15'),
            reason: 'Heart Attack',
            department: 'Cardiology',
            bedNumber: 'ICU-001',
            attendingDoctor: 'Dr. Amit Verma',
            diagnosis: 'Acute MI',
            treatment: 'Emergency Angioplasty'
          }
        ],
        medications: [
          {
            id: 'med-001',
            medicationName: 'Aspirin',
            dosage: '75mg',
            frequency: 'Once daily',
            startDate: new Date('2022-03-15'),
            prescribedBy: 'Dr. Amit Verma',
            purpose: 'Blood thinner',
            effectiveness: 'Good'
          },
          {
            id: 'med-002',
            medicationName: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            startDate: new Date('2021-06-01'),
            prescribedBy: 'Dr. Sneha Patel',
            purpose: 'Diabetes control',
            effectiveness: 'Good'
          }
        ],
        allergies: ['Penicillin', 'Sulfa drugs'],
        chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Coronary Artery Disease'],
        surgeries: [
          {
            id: 'surg-001',
            surgeryDate: new Date('2024-01-15'),
            surgeryType: 'Percutaneous Coronary Intervention (PCI)',
            surgeon: 'Dr. Amit Verma',
            hospital: 'Apollo Hospitals',
            anesthesia: 'Local Anesthesia',
            duration: '45 minutes',
            outcome: 'Successful',
            followUpRequired: true,
            notes: 'Stent placed in LAD artery'
          }
        ]
      },
      currentStatus: {
        vitals: {
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
            lastChecked: new Date()
          },
          heartRate: {
            value: 72,
            lastChecked: new Date()
          },
          temperature: {
            value: 98.4,
            lastChecked: new Date()
          },
          oxygenSaturation: {
            value: 96,
            lastChecked: new Date()
          },
          respiratoryRate: {
            value: 16,
            lastChecked: new Date()
          },
          weight: {
            value: 75,
            lastChecked: new Date()
          },
          height: {
            value: 170,
            lastChecked: new Date()
          }
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
            purpose: 'Antiplatelet therapy',
            nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000),
            specialInstructions: 'Take with food'
          },
          {
            id: 'curr-med-002',
            name: 'Clopidogrel',
            dosage: '75mg',
            frequency: 'Once daily',
            route: 'Oral',
            startDate: new Date('2024-01-15'),
            prescribedBy: 'Dr. Amit Verma',
            purpose: 'Dual antiplatelet therapy',
            nextDose: new Date(Date.now() + 6 * 60 * 60 * 1000)
          },
          {
            id: 'curr-med-003',
            name: 'Metoprolol',
            dosage: '25mg',
            frequency: 'Twice daily',
            route: 'Oral',
            startDate: new Date('2024-01-15'),
            prescribedBy: 'Dr. Amit Verma',
            purpose: 'Beta blocker',
            nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000)
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
        labReports: [
          {
            id: 'lab-001',
            testName: 'Troponin I',
            category: 'Biochemistry',
            result: '0.8 ng/mL',
            normalRange: '<0.04 ng/mL',
            status: 'Critical',
            testDate: new Date('2024-01-15'),
            reportedBy: 'Dr. Lab Technician',
            notes: 'Elevated - consistent with MI'
          },
          {
            id: 'lab-002',
            testName: 'CK-MB',
            category: 'Biochemistry',
            result: '150 U/L',
            normalRange: '0-25 U/L',
            status: 'Critical',
            testDate: new Date('2024-01-15'),
            reportedBy: 'Dr. Lab Technician'
          },
          {
            id: 'lab-003',
            testName: 'Complete Blood Count',
            category: 'Hematology',
            result: 'Hemoglobin: 14.2 g/dL, WBC: 8,500/cu.mm, Platelets: 2,50,000/cu.mm',
            normalRange: 'Hb: 13.5-17.5, WBC: 4,000-11,000, Platelets: 1,50,000-4,50,000',
            status: 'Normal',
            testDate: new Date('2024-01-16'),
            reportedBy: 'Dr. Lab Technician'
          }
        ],
        imagingReports: [
          {
            id: 'img-001',
            imagingType: 'CT Scan',
            bodyPart: 'Chest (Coronary Angiogram)',
            findings: '90% stenosis in proximal LAD artery, mild disease in LCx',
            impression: 'Significant coronary artery disease requiring intervention',
            recommendation: 'PCI with stent placement',
            studyDate: new Date('2024-01-15'),
            radiologist: 'Dr. Radiologist'
          }
        ],
        testResults: [
          {
            id: 'test-001',
            testType: 'ECG',
            result: 'ST elevation in leads V1-V4, Q waves present',
            status: 'Critical',
            testDate: new Date('2024-01-15'),
            performedBy: 'Dr. Amit Verma',
            notes: 'Anterior wall MI'
          }
        ]
      },
      treatment: {
        ongoingTreatments: [
          {
            id: 'treat-001',
            name: 'Cardiac Rehabilitation',
            type: 'Therapy',
            startDate: new Date('2024-01-16'),
            frequency: 'Daily',
            purpose: 'Post-MI recovery',
            response: 'Good',
            prescribedBy: 'Dr. Amit Verma'
          }
        ],
        plannedProcedures: [
          {
            id: 'proc-001',
            name: 'Echocardiogram',
            scheduledDate: new Date('2024-01-20'),
            urgency: 'Routine',
            preparation: ['NPO 4 hours before'],
            risks: ['None'],
            expectedOutcome: 'Assess cardiac function',
            status: 'Scheduled'
          }
        ],
        consultations: [
          {
            id: 'cons-001',
            consultantType: 'Cardiologist',
            consultantName: 'Dr. Amit Verma',
            date: new Date('2024-01-16'),
            reason: 'Post-PCI review',
            findings: 'Patient stable, vitals normal',
            recommendations: 'Continue current medications, follow up in 1 week',
            followUp: '2024-01-23'
          }
        ]
      }
    },
    {
      id: 'P002',
      name: 'Sarah Wilson',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A+',
      contactNumber: '+1-555-0123-4568',
      email: 'sarah.wilson@hospital.com',
      emergencyContact: {
        name: 'Michael Wilson',
        relationship: 'Husband',
        phone: '+1-555-0123-4569'
      },
      currentAdmission: {
        admissionDate: new Date('2024-04-11'),
        bedNumber: 'Room 102',
        department: 'Neurology',
        attendingDoctor: 'Dr. Sneha Patel',
        condition: 'Stable',
        primaryDiagnosis: 'Migraine',
        secondaryDiagnoses: ['Headache Episodes']
      },
      medicalHistory: {
        admissionHistory: [
          {
            id: 'adm-003',
            admissionDate: new Date('2024-01-18'),
            reason: 'Routine delivery monitoring',
            department: 'Obstetrics & Gynecology',
            bedNumber: 'OB-203',
            attendingDoctor: 'Dr. Sneha Patel',
            diagnosis: 'Full term pregnancy',
            treatment: 'Monitoring'
          }
        ],
        medications: [
          {
            id: 'med-003',
            medicationName: 'Folic Acid',
            dosage: '5mg',
            frequency: 'Once daily',
            startDate: new Date('2023-04-01'),
            endDate: new Date('2023-12-01'),
            prescribedBy: 'Dr. Sneha Patel',
            purpose: 'Pregnancy supplement',
            effectiveness: 'Good'
          }
        ],
        allergies: ['No known allergies'],
        chronicConditions: ['Gestational Diabetes'],
        surgeries: [
          {
            id: 'surg-002',
            surgeryDate: new Date('2020-06-15'),
            surgeryType: 'Appendectomy',
            surgeon: 'Dr. Surgeon',
            hospital: 'City Hospital',
            anesthesia: 'General Anesthesia',
            duration: '30 minutes',
            outcome: 'Successful',
            followUpRequired: false
          }
        ]
      },
      currentStatus: {
        vitals: {
          bloodPressure: {
            systolic: 110,
            diastolic: 70,
            lastChecked: new Date()
          },
          heartRate: {
            value: 85,
            lastChecked: new Date()
          },
          temperature: {
            value: 98.6,
            lastChecked: new Date()
          },
          oxygenSaturation: {
            value: 98,
            lastChecked: new Date()
          },
          respiratoryRate: {
            value: 18,
            lastChecked: new Date()
          },
          weight: {
            value: 68,
            lastChecked: new Date()
          }
        },
        currentMedications: [
          {
            id: 'curr-med-004',
            name: 'Insulin',
            dosage: '10 units',
            frequency: 'Twice daily',
            route: 'Subcutaneous',
            startDate: new Date('2024-01-10'),
            prescribedBy: 'Dr. Sneha Patel',
            purpose: 'Gestational diabetes control',
            nextDose: new Date(Date.now() + 3 * 60 * 60 * 1000)
          }
        ],
        diet: {
          type: 'Diabetic',
          restrictions: ['Low sugar', 'Low carbohydrates', 'No sweets'],
          supplements: ['Iron', 'Calcium'],
          specialInstructions: 'Small frequent meals, monitor blood sugar',
          lastUpdated: new Date(),
          prescribedBy: 'Dr. Sneha Patel'
        },
        activityLevel: 'Limited Mobility',
        painLevel: 1
      },
      reports: {
        labReports: [
          {
            id: 'lab-004',
            testName: 'Glucose Tolerance Test',
            category: 'Biochemistry',
            result: '160 mg/dL (2-hour post-glucose)',
            normalRange: '<140 mg/dL',
            status: 'Abnormal',
            testDate: new Date('2024-01-10'),
            reportedBy: 'Dr. Lab Technician',
            notes: 'Gestational diabetes diagnosed'
          },
          {
            id: 'lab-005',
            testName: 'Hemoglobin',
            category: 'Hematology',
            result: '11.5 g/dL',
            normalRange: '11.0-15.5 g/dL',
            status: 'Normal',
            testDate: new Date('2024-01-18'),
            reportedBy: 'Dr. Lab Technician'
          }
        ],
        imagingReports: [
          {
            id: 'img-002',
            imagingType: 'Ultrasound',
            bodyPart: 'Obstetric (Fetal)',
            findings: 'Single live fetus, 36 weeks gestation, normal growth parameters',
            impression: 'Normal pregnancy progression',
            studyDate: new Date('2024-01-18'),
            radiologist: 'Dr. Radiologist'
          }
        ],
        testResults: [
          {
            id: 'test-002',
            testType: 'Non-Stress Test',
            result: 'Reactive, 2 accelerations in 20 minutes',
            status: 'Normal',
            testDate: new Date('2024-01-18'),
            performedBy: 'Dr. Sneha Patel'
          }
        ]
      },
      treatment: {
        ongoingTreatments: [
          {
            id: 'treat-002',
            name: 'Prenatal Care',
            type: 'Therapy',
            startDate: new Date('2023-04-01'),
            frequency: 'Weekly',
            purpose: 'Routine pregnancy monitoring',
            response: 'Excellent',
            prescribedBy: 'Dr. Sneha Patel'
          }
        ],
        plannedProcedures: [
          {
            id: 'proc-002',
            name: 'Delivery',
            scheduledDate: new Date('2024-02-05'),
            urgency: 'Routine',
            preparation: ['NPO 8 hours before if C-section'],
            risks: ['Normal delivery risks'],
            expectedOutcome: 'Successful delivery',
            surgeon: 'Dr. Sneha Patel',
            status: 'Scheduled'
          }
        ],
        consultations: [
          {
            id: 'cons-002',
            consultantType: 'Obstetrician',
            consultantName: 'Dr. Sneha Patel',
            date: new Date('2024-01-18'),
            reason: 'Routine prenatal check',
            findings: 'Patient doing well, fetal movements normal',
            recommendations: 'Continue current management, prepare for delivery',
            followUp: '2024-01-25'
          }
        ]
      }
    },
    {
      id: 'P003',
      name: 'Robert Chen',
      age: 58,
      gender: 'Male',
      bloodGroup: 'B+',
      contactNumber: '+1-555-0123-4569',
      email: 'robert.chen@hospital.com',
      emergencyContact: {
        name: 'Linda Chen',
        relationship: 'Wife',
        phone: '+1-555-0123-4570'
      },
      currentAdmission: {
        admissionDate: new Date('2024-04-10'),
        bedNumber: 'Room 103',
        department: 'Emergency',
        attendingDoctor: 'Dr. Amit Verma',
        condition: 'Critical',
        primaryDiagnosis: 'Chest Pain',
        secondaryDiagnoses: ['Hypertension']
      },
      medicalHistory: {
        admissionHistory: [
          {
            id: 'adm-004',
            admissionDate: new Date('2024-01-08'),
            reason: 'Total Knee Replacement Surgery',
            department: 'Orthopedics',
            bedNumber: 'ORTHO-105',
            attendingDoctor: 'Dr. Prakash Rao',
            diagnosis: 'Severe osteoarthritis',
            treatment: 'Surgical intervention'
          }
        ],
        medications: [
          {
            id: 'med-004',
            medicationName: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            startDate: new Date('2020-01-01'),
            prescribedBy: 'Dr. GP',
            purpose: 'Blood pressure control',
            effectiveness: 'Good'
          }
        ],
        allergies: ['No known allergies'],
        chronicConditions: ['Hypertension', 'Osteoarthritis', 'Cataract'],
        surgeries: [
          {
            id: 'surg-003',
            surgeryDate: new Date('2024-01-08'),
            surgeryType: 'Total Knee Replacement',
            surgeon: 'Dr. Prakash Rao',
            hospital: 'Apollo Hospitals',
            anesthesia: 'Spinal Anesthesia',
            duration: '2 hours',
            outcome: 'Successful',
            followUpRequired: true,
            notes: 'Left knee, cemented prosthesis'
          },
          {
            id: 'surg-004',
            surgeryDate: new Date('2022-03-20'),
            surgeryType: 'Cataract Surgery',
            surgeon: 'Dr. Ophthalmologist',
            hospital: 'Eye Hospital',
            anesthesia: 'Local Anesthesia',
            duration: '30 minutes',
            outcome: 'Successful',
            followUpRequired: false
          }
        ]
      },
      currentStatus: {
        vitals: {
          bloodPressure: {
            systolic: 130,
            diastolic: 85,
            lastChecked: new Date()
          },
          heartRate: {
            value: 78,
            lastChecked: new Date()
          },
          temperature: {
            value: 98.2,
            lastChecked: new Date()
          },
          oxygenSaturation: {
            value: 97,
            lastChecked: new Date()
          },
          respiratoryRate: {
            value: 16,
            lastChecked: new Date()
          },
          weight: {
            value: 80,
            lastChecked: new Date()
          }
        },
        currentMedications: [
          {
            id: 'curr-med-005',
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            route: 'Oral',
            startDate: new Date('2020-01-01'),
            prescribedBy: 'Dr. GP',
            purpose: 'Blood pressure control',
            nextDose: new Date(Date.now() + 8 * 60 * 60 * 1000)
          },
          {
            id: 'curr-med-006',
            name: 'Paracetamol',
            dosage: '650mg',
            frequency: 'Every 6 hours PRN',
            route: 'Oral',
            startDate: new Date('2024-01-08'),
            prescribedBy: 'Dr. Prakash Rao',
            purpose: 'Pain management',
            nextDose: new Date(Date.now() + 1 * 60 * 60 * 1000),
            specialInstructions: 'For pain only, maximum 4 doses/day'
          },
          {
            id: 'curr-med-007',
            name: 'Enoxaparin',
            dosage: '40mg',
            frequency: 'Once daily',
            route: 'Subcutaneous',
            startDate: new Date('2024-01-08'),
            prescribedBy: 'Dr. Prakash Rao',
            purpose: 'DVT prophylaxis',
            nextDose: new Date(Date.now() + 5 * 60 * 60 * 1000)
          }
        ],
        diet: {
          type: 'Regular',
          restrictions: ['Low salt'],
          supplements: ['Calcium', 'Vitamin D'],
          specialInstructions: 'High protein diet for wound healing',
          lastUpdated: new Date(),
          prescribedBy: 'Dr. Prakash Rao'
        },
        activityLevel: 'Assisted Walking',
        painLevel: 3
      },
      reports: {
        labReports: [
          {
            id: 'lab-006',
            testName: 'Complete Blood Count',
            category: 'Hematology',
            result: 'Hb: 13.8 g/dL, WBC: 7,200/cu.mm, Platelets: 2,80,000/cu.mm',
            normalRange: 'Normal ranges',
            status: 'Normal',
            testDate: new Date('2024-01-10'),
            reportedBy: 'Dr. Lab Technician'
          },
          {
            id: 'lab-007',
            testName: 'CRP',
            category: 'Biochemistry',
            result: '8 mg/L',
            normalRange: '<5 mg/L',
            status: 'Abnormal',
            testDate: new Date('2024-01-10'),
            reportedBy: 'Dr. Lab Technician',
            notes: 'Mildly elevated post-surgery'
          }
        ],
        imagingReports: [
          {
            id: 'img-003',
            imagingType: 'X-Ray',
            bodyPart: 'Left Knee',
            findings: 'Total knee replacement prosthesis in good position, no signs of loosening',
            impression: 'Post-operative changes as expected',
            studyDate: new Date('2024-01-09'),
            radiologist: 'Dr. Radiologist'
          }
        ],
        testResults: [
          {
            id: 'test-003',
            testType: 'Doppler Ultrasound',
            result: 'No DVT in lower limbs',
            status: 'Normal',
            testDate: new Date('2024-01-10'),
            performedBy: 'Dr. Radiologist'
          }
        ]
      },
      treatment: {
        ongoingTreatments: [
          {
            id: 'treat-003',
            name: 'Physiotherapy',
            type: 'Therapy',
            startDate: new Date('2024-01-09'),
            frequency: 'Twice daily',
            purpose: 'Post-operative rehabilitation',
            response: 'Good',
            prescribedBy: 'Dr. Prakash Rao'
          }
        ],
        plannedProcedures: [
          {
            id: 'proc-003',
            name: 'Stitch Removal',
            scheduledDate: new Date('2024-01-15'),
            urgency: 'Routine',
            preparation: ['Clean wound area'],
            risks: ['None'],
            expectedOutcome: 'Wound healing assessment',
            status: 'Scheduled'
          }
        ],
        consultations: [
          {
            id: 'cons-003',
            consultantType: 'Orthopedic Surgeon',
            consultantName: 'Dr. Prakash Rao',
            date: new Date('2024-01-10'),
            reason: 'Post-operative review',
            findings: 'Wound clean, patient mobilizing well',
            recommendations: 'Continue physiotherapy, follow up in 1 week',
            followUp: '2024-01-17'
          }
        ]
      }
    },
    {
      id: 'P004',
      name: 'Maria Garcia',
      age: 28,
      gender: 'Female',
      bloodGroup: 'A+',
      contactNumber: '+1-555-0123-4570',
      email: 'maria.garcia@hospital.com',
      emergencyContact: {
        name: 'Carlos Garcia',
        relationship: 'Husband',
        phone: '+1-555-0123-4571'
      },
      currentAdmission: {
        admissionDate: new Date('2024-04-09'),
        bedNumber: 'Room 104',
        department: 'Pediatrics',
        attendingDoctor: 'Dr. Sneha Patel',
        condition: 'Stable',
        primaryDiagnosis: 'Asthma',
        secondaryDiagnoses: ['Allergic Rhinitis']
      },
      medicalHistory: {
        admissionHistory: [
          {
            id: 'adm-005',
            admissionDate: new Date('2024-04-09'),
            reason: 'Asthma Attack',
            department: 'Pediatrics',
            bedNumber: 'Room 104',
            attendingDoctor: 'Dr. Sneha Patel',
            diagnosis: 'Moderate Asthma',
            treatment: 'Nebulization and steroids'
          }
        ],
        medications: [
          {
            id: 'med-008',
            medicationName: 'Albuterol',
            dosage: '2.5mg',
            frequency: 'Every 4-6 hours PRN',
            startDate: new Date('2024-04-09'),
            prescribedBy: 'Dr. Sneha Patel',
            purpose: 'Bronchodilator',
            effectiveness: 'Good'
          }
        ],
        allergies: ['Pollen', 'Dust mites'],
        chronicConditions: ['Asthma', 'Allergic Rhinitis'],
        surgeries: []
      },
      currentStatus: {
        vitals: {
          bloodPressure: {
            systolic: 110,
            diastolic: 70,
            lastChecked: new Date()
          },
          heartRate: {
            value: 85,
            lastChecked: new Date()
          },
          temperature: {
            value: 98.6,
            lastChecked: new Date()
          },
          oxygenSaturation: {
            value: 98,
            lastChecked: new Date()
          },
          respiratoryRate: {
            value: 18,
            lastChecked: new Date()
          },
          weight: {
            value: 65,
            lastChecked: new Date()
          },
          height: {
            value: 160,
            lastChecked: new Date()
          }
        },
        currentMedications: [
          {
            id: 'curr-med-008',
            name: 'Albuterol',
            dosage: '2.5mg',
            frequency: 'Every 4-6 hours PRN',
            route: 'Inhalation',
            startDate: new Date('2024-04-09'),
            prescribedBy: 'Dr. Sneha Patel',
            purpose: 'Bronchodilator',
            nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000)
          }
        ],
        diet: {
          type: 'Asthma-Friendly',
          restrictions: ['Avoid allergens', 'No strong scents'],
          supplements: ['Vitamin C', 'Omega-3'],
          specialInstructions: 'Keep inhaler accessible',
          lastUpdated: new Date(),
          prescribedBy: 'Dr. Sneha Patel'
        },
        activityLevel: 'Normal',
        painLevel: 1
      },
      reports: {
        labReports: [
          {
            id: 'lab-008',
            testName: 'Complete Blood Count',
            category: 'Hematology',
            result: 'Normal ranges',
            status: 'Normal',
            testDate: new Date('2024-04-09'),
            reportedBy: 'Dr. Lab Technician'
          }
        ],
        imagingReports: [],
        testResults: []
      },
      treatment: {
        ongoingTreatments: [
          {
            id: 'treat-004',
            name: 'Asthma Management',
            type: 'Therapy',
            startDate: new Date('2024-04-09'),
            frequency: 'Daily',
            purpose: 'Asthma control',
            response: 'Good',
            prescribedBy: 'Dr. Sneha Patel'
          }
        ],
        plannedProcedures: [],
        consultations: [
          {
            id: 'cons-004',
            consultantType: 'Pediatrician',
            consultantName: 'Dr. Sneha Patel',
            date: new Date('2024-04-10'),
            reason: 'Asthma management',
            findings: 'Patient stable, responding well to treatment',
            recommendations: 'Continue current management',
            followUp: '2024-04-16'
          }
        ]
      }
    },
    {
      id: 'P005',
      name: 'James Miller',
      age: 67,
      gender: 'Male',
      bloodGroup: 'O+',
      contactNumber: '+1-555-0123-4571',
      email: 'james.miller@hospital.com',
      emergencyContact: {
        name: 'Susan Miller',
        relationship: 'Wife',
        phone: '+1-555-0123-4572'
      },
      currentAdmission: {
        admissionDate: new Date('2024-04-08'),
        bedNumber: 'Room 105',
        department: 'Orthopedics',
        attendingDoctor: 'Dr. Prakash Rao',
        condition: 'Recovering',
        primaryDiagnosis: 'Fractured Leg',
        secondaryDiagnoses: ['Osteoarthritis']
      },
      medicalHistory: {
        admissionHistory: [
          {
            id: 'adm-006',
            admissionDate: new Date('2024-04-08'),
            reason: 'Fall',
            department: 'Orthopedics',
            bedNumber: 'Room 105',
            attendingDoctor: 'Dr. Prakash Rao',
            diagnosis: 'Fractured Tibia',
            treatment: 'Surgical intervention'
          }
        ],
        medications: [
          {
            id: 'med-009',
            medicationName: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'Every 6 hours PRN',
            startDate: new Date('2024-04-08'),
            prescribedBy: 'Dr. Prakash Rao',
            purpose: 'Pain management',
            effectiveness: 'Good'
          }
        ],
        allergies: ['No known allergies'],
        chronicConditions: ['Osteoarthritis', 'Hypertension'],
        surgeries: [
          {
            id: 'surg-005',
            surgeryDate: new Date('2024-04-08'),
            surgeryType: 'Internal Fixation',
            surgeon: 'Dr. Prakash Rao',
            hospital: 'Apollo Hospitals',
            anesthesia: 'Spinal Anesthesia',
            duration: '2 hours',
            outcome: 'Successful',
            followUpRequired: true,
            notes: 'Tibia fracture repaired with plate and screws'
          }
        ]
      },
      currentStatus: {
        vitals: {
          bloodPressure: {
            systolic: 130,
            diastolic: 85,
            lastChecked: new Date()
          },
          heartRate: {
            value: 78,
            lastChecked: new Date()
          },
          temperature: {
            value: 98.2,
            lastChecked: new Date()
          },
          oxygenSaturation: {
            value: 97,
            lastChecked: new Date()
          },
          respiratoryRate: {
            value: 16,
            lastChecked: new Date()
          },
          weight: {
            value: 80,
            lastChecked: new Date()
          },
          height: {
            value: 170,
            lastChecked: new Date()
          }
        },
        currentMedications: [
          {
            id: 'curr-med-009',
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'Every 6 hours PRN',
            route: 'Oral',
            startDate: new Date('2024-04-08'),
            prescribedBy: 'Dr. Prakash Rao',
            purpose: 'Pain management',
            nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000)
          }
        ],
        diet: {
          type: 'Regular',
          restrictions: ['No heavy lifting'],
          supplements: ['Calcium', 'Vitamin D'],
          specialInstructions: 'High protein diet for bone healing',
          lastUpdated: new Date(),
          prescribedBy: 'Dr. Prakash Rao'
        },
        activityLevel: 'Assisted Walking',
        painLevel: 3
      },
      reports: {
        labReports: [
          {
            id: 'lab-009',
            testName: 'Complete Blood Count',
            category: 'Hematology',
            result: 'Normal ranges',
            status: 'Normal',
            testDate: new Date('2024-04-08'),
            reportedBy: 'Dr. Lab Technician'
          }
        ],
        imagingReports: [
          {
            id: 'img-004',
            imagingType: 'X-Ray',
            bodyPart: 'Left Leg',
            findings: 'Fractured tibia with surgical hardware in place',
            impression: 'Post-operative changes as expected',
            studyDate: new Date('2024-04-08'),
            radiologist: 'Dr. Radiologist'
          }
        ],
        testResults: []
      },
      treatment: {
        ongoingTreatments: [
          {
            id: 'treat-005',
            name: 'Physiotherapy',
            type: 'Therapy',
            startDate: new Date('2024-04-09'),
            frequency: 'Twice daily',
            purpose: 'Post-operative rehabilitation',
            response: 'Good',
            prescribedBy: 'Dr. Prakash Rao'
          }
        ],
        plannedProcedures: [
          {
            id: 'proc-004',
            name: 'Hardware Removal',
            scheduledDate: new Date('2024-04-22'),
            urgency: 'Routine',
            preparation: ['Pre-operative assessment'],
            risks: ['Infection'],
            expectedOutcome: 'Healed fracture',
            status: 'Scheduled'
          }
        ],
        consultations: [
          {
            id: 'cons-005',
            consultantType: 'Orthopedic Surgeon',
            consultantName: 'Dr. Prakash Rao',
            date: new Date('2024-04-10'),
            reason: 'Post-operative review',
            findings: 'Wound clean, patient mobilizing well',
            recommendations: 'Continue physiotherapy, follow up in 1 week',
            followUp: '2024-04-17'
          }
        ]
      }
    },
    {
      id: 'P006',
      name: 'Emily Davis',
      age: 41,
      gender: 'Female',
      bloodGroup: 'B+',
      contactNumber: '+1-555-0123-4572',
      email: 'emily.davis@hospital.com',
      emergencyContact: {
        name: 'David Davis',
        relationship: 'Husband',
        phone: '+1-555-0123-4573'
      },
      currentAdmission: {
        admissionDate: new Date('2024-04-07'),
        bedNumber: 'Room 106',
        department: 'General Surgery',
        attendingDoctor: 'Dr. Amit Verma',
        condition: 'Serious',
        primaryDiagnosis: 'Appendicitis',
        secondaryDiagnoses: []
      },
      medicalHistory: {
        admissionHistory: [
          {
            id: 'adm-007',
            admissionDate: new Date('2024-04-07'),
            reason: 'Abdominal Pain',
            department: 'General Surgery',
            bedNumber: 'Room 106',
            attendingDoctor: 'Dr. Amit Verma',
            diagnosis: 'Acute Appendicitis',
            treatment: 'Emergency Surgery'
          }
        ],
        medications: [
          {
            id: 'med-010',
            medicationName: 'Antibiotics',
            dosage: '500mg',
            frequency: 'Every 8 hours',
            startDate: new Date('2024-04-07'),
            prescribedBy: 'Dr. Amit Verma',
            purpose: 'Post-operative infection prevention',
            effectiveness: 'Good'
          }
        ],
        allergies: ['Penicillin'],
        chronicConditions: ['No chronic conditions'],
        surgeries: [
          {
            id: 'surg-006',
            surgeryDate: new Date('2024-04-07'),
            surgeryType: 'Laparoscopic Appendectomy',
            surgeon: 'Dr. Amit Verma',
            hospital: 'Apollo Hospitals',
            anesthesia: 'General Anesthesia',
            duration: '1 hour',
            outcome: 'Successful',
            followUpRequired: false
          }
        ]
      },
      currentStatus: {
        vitals: {
          bloodPressure: {
            systolic: 115,
            diastolic: 75,
            lastChecked: new Date()
          },
          heartRate: {
            value: 82,
            lastChecked: new Date()
          },
          temperature: {
            value: 98.4,
            lastChecked: new Date()
          },
          oxygenSaturation: {
            value: 98,
            lastChecked: new Date()
          },
          respiratoryRate: {
            value: 16,
            lastChecked: new Date()
          },
          weight: {
            value: 68,
            lastChecked: new Date()
          },
          height: {
            value: 165,
            lastChecked: new Date()
          }
        },
        currentMedications: [
          {
            id: 'curr-med-010',
            name: 'Antibiotics',
            dosage: '500mg',
            frequency: 'Every 8 hours',
            route: 'IV',
            startDate: new Date('2024-04-07'),
            prescribedBy: 'Dr. Amit Verma',
            purpose: 'Post-operative antibiotics',
            nextDose: new Date(Date.now() + 3 * 60 * 60 * 1000)
          }
        ],
        diet: {
          type: 'Post-Surgery',
          restrictions: ['No heavy foods', 'No dairy for 24 hours'],
          supplements: ['Probiotics', 'Vitamin C'],
          specialInstructions: 'Start with clear liquids, progress to soft foods',
          lastUpdated: new Date(),
          prescribedBy: 'Dr. Amit Verma'
        },
        activityLevel: 'Bed Rest',
        painLevel: 2
      },
      reports: {
        labReports: [
          {
            id: 'lab-010',
            testName: 'Complete Blood Count',
            category: 'Hematology',
            result: 'Normal ranges',
            status: 'Normal',
            testDate: new Date('2024-04-07'),
            reportedBy: 'Dr. Lab Technician'
          }
        ],
        imagingReports: [],
        testResults: []
      },
      treatment: {
        ongoingTreatments: [
          {
            id: 'treat-006',
            name: 'Post-operative Care',
            type: 'Therapy',
            startDate: new Date('2024-04-08'),
            frequency: 'Daily',
            purpose: 'Wound care and recovery',
            response: 'Excellent',
            prescribedBy: 'Dr. Amit Verma'
          }
        ],
        plannedProcedures: [],
        consultations: [
          {
            id: 'cons-006',
            consultantType: 'General Surgeon',
            consultantName: 'Dr. Amit Verma',
            date: new Date('2024-04-08'),
            reason: 'Post-operative review',
            findings: 'Patient recovering well, wound clean',
            recommendations: 'Continue current management, follow up in 3 days',
            followUp: '2024-04-11'
          }
        ]
      }
    }
  ]
}
