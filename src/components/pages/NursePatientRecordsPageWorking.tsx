import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Search, Filter, Bed, User, Users, Calendar, AlertTriangle, Activity, Phone, Mail, ChevronRight, Eye, Edit2, ArrowLeft, Plus } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  route: string
  prescribedBy: string
  startDate: Date
  endDate?: Date
  timeGiven: string[]
  notes?: string
}

interface Vitals {
  id: string
  timestamp: Date
  bloodPressure: string
  heartRate: number
  temperature: number
  oxygenSaturation: number
  respiratoryRate: number
  weight?: number
  height?: number
  notes?: string
}

interface FoodIntake {
  id: string
  date: Date
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foodItems: string[]
  calories: number
  dietaryRestrictions: string[]
  notes?: string
  completed: boolean
}

interface NursePatient {
  id: string
  name: string
  age: number
  gender: string
  bloodType: string
  allergies: string[]
  currentAdmission: {
    admissionDate: Date
    bedNumber: string
    department: string
    condition: string
    primaryDiagnosis: string
    secondaryDiagnoses: string[]
    admittingDoctor: string
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }
  contactNumber: string
  email?: string
  medications: Medication[]
  vitals: Vitals[]
  foodIntake: FoodIntake[]
  medicalHistory: string[]
  notes: string
}

const NursePatientRecordsPageWorking: React.FC = () => {
  const { state: authState } = useAuth()
  const [patients, setPatients] = useState<NursePatient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<NursePatient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [filterCondition, setFilterCondition] = useState('All')
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<NursePatient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load mock patients immediately to ensure page works
    const mockPatients: NursePatient[] = [
      {
        id: 'P001',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        currentAdmission: {
          admissionDate: new Date('2024-04-12'),
          bedNumber: 'Room 101',
          department: 'Cardiology',
          condition: 'Stable',
          primaryDiagnosis: 'Hypertension',
          secondaryDiagnoses: ['Type 2 Diabetes', 'High Cholesterol'],
          admittingDoctor: 'Dr. Sarah Johnson',
          emergencyContact: {
            name: 'Mary Smith',
            relationship: 'Spouse',
            phone: '+1-555-0123-4568'
          }
        },
        contactNumber: '+1-555-0123-4567',
        email: 'john.smith@hospital.com',
        medications: [
          {
            id: 'M001',
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            route: 'Oral',
            prescribedBy: 'Dr. Sarah Johnson',
            startDate: new Date('2024-04-12'),
            timeGiven: ['08:00'],
            notes: 'Take with food'
          },
          {
            id: 'M002',
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            route: 'Oral',
            prescribedBy: 'Dr. Sarah Johnson',
            startDate: new Date('2024-04-12'),
            timeGiven: ['08:00', '20:00']
          }
        ],
        vitals: [
          {
            id: 'V001',
            timestamp: new Date('2024-04-13T08:00:00'),
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 98.6,
            oxygenSaturation: 98,
            respiratoryRate: 16,
            weight: 180,
            height: 72
          },
          {
            id: 'V002',
            timestamp: new Date('2024-04-13T12:00:00'),
            bloodPressure: '118/78',
            heartRate: 70,
            temperature: 98.4,
            oxygenSaturation: 99,
            respiratoryRate: 15
          }
        ],
        foodIntake: [
          {
            id: 'F001',
            date: new Date('2024-04-13'),
            mealType: 'breakfast',
            foodItems: ['Oatmeal', 'Banana', 'Orange juice'],
            calories: 350,
            dietaryRestrictions: ['Low sodium', 'Low sugar'],
            completed: true
          },
          {
            id: 'F002',
            date: new Date('2024-04-13'),
            mealType: 'lunch',
            foodItems: ['Grilled chicken', 'Brown rice', 'Steamed vegetables'],
            calories: 450,
            dietaryRestrictions: ['Low sodium', 'Low sugar'],
            completed: false
          }
        ],
        medicalHistory: ['Hypertension (diagnosed 2018)', 'Type 2 Diabetes (diagnosed 2020)', 'Appendectomy (2015)'],
        notes: 'Patient is stable and responding well to treatment. Family supportive.'
      },
      {
        id: 'P002',
        name: 'Sarah Wilson',
        age: 32,
        gender: 'Female',
        bloodType: 'A+',
        allergies: ['None'],
        currentAdmission: {
          admissionDate: new Date('2024-04-11'),
          bedNumber: 'Room 102',
          department: 'Neurology',
          condition: 'Improving',
          primaryDiagnosis: 'Migraine',
          secondaryDiagnoses: ['Cluster headaches'],
          admittingDoctor: 'Dr. Michael Brown',
          emergencyContact: {
            name: 'David Wilson',
            relationship: 'Husband',
            phone: '+1-555-0123-4569'
          }
        },
        contactNumber: '+1-555-0123-4568',
        email: 'sarah.wilson@hospital.com',
        medications: [
          {
            id: 'M003',
            name: 'Sumatriptan',
            dosage: '100mg',
            frequency: 'As needed',
            route: 'Oral',
            prescribedBy: 'Dr. Michael Brown',
            startDate: new Date('2024-04-11'),
            timeGiven: [],
            notes: 'Take at onset of migraine'
          }
        ],
        vitals: [
          {
            id: 'V003',
            timestamp: new Date('2024-04-13T09:00:00'),
            bloodPressure: '110/70',
            heartRate: 68,
            temperature: 98.2,
            oxygenSaturation: 99,
            respiratoryRate: 14
          }
        ],
        foodIntake: [
          {
            id: 'F003',
            date: new Date('2024-04-13'),
            mealType: 'breakfast',
            foodItems: ['Toast', 'Coffee', 'Yogurt'],
            calories: 280,
            dietaryRestrictions: ['None'],
            completed: true
          }
        ],
        medicalHistory: ['Migraines (diagnosed 2015)', 'Anxiety (diagnosed 2018)'],
        notes: 'Patient responding well to treatment. Migraine frequency decreasing.'
      },
      {
        id: 'P003',
        name: 'Robert Chen',
        age: 58,
        gender: 'Male',
        bloodType: 'B+',
        allergies: ['Aspirin'],
        currentAdmission: {
          admissionDate: new Date('2024-04-10'),
          bedNumber: 'Room 103',
          department: 'Emergency',
          condition: 'Critical',
          primaryDiagnosis: 'Chest Pain',
          secondaryDiagnoses: ['Hypertension', 'Diabetes'],
          admittingDoctor: 'Dr. Emily Davis',
          emergencyContact: {
            name: 'Lisa Chen',
            relationship: 'Daughter',
            phone: '+1-555-0123-4570'
          }
        },
        contactNumber: '+1-555-0123-4569',
        email: 'robert.chen@hospital.com',
        medications: [
          {
            id: 'M004',
            name: 'Nitroglycerin',
            dosage: '0.4mg',
            frequency: 'As needed',
            route: 'Sublingual',
            prescribedBy: 'Dr. Emily Davis',
            startDate: new Date('2024-04-10'),
            timeGiven: ['02:00', '06:00'],
            notes: 'For chest pain episodes'
          }
        ],
        vitals: [
          {
            id: 'V004',
            timestamp: new Date('2024-04-13T10:30:00'),
            bloodPressure: '160/95',
            heartRate: 95,
            temperature: 99.1,
            oxygenSaturation: 94,
            respiratoryRate: 22
          }
        ],
        foodIntake: [
          {
            id: 'F004',
            date: new Date('2024-04-13'),
            mealType: 'breakfast',
            foodItems: ['Clear liquids'],
            calories: 150,
            dietaryRestrictions: ['Low sodium', 'Clear liquids'],
            completed: false
          }
        ],
        medicalHistory: ['Hypertension (diagnosed 2010)', 'Diabetes (diagnosed 2012)', 'Previous MI (2018)'],
        notes: 'Critical condition. Monitoring for cardiac enzymes. Family informed.'
      },
      {
        id: 'P004',
        name: 'Maria Garcia',
        age: 28,
        gender: 'Female',
        bloodType: 'O+',
        allergies: ['Latex'],
        currentAdmission: {
          admissionDate: new Date('2024-04-09'),
          bedNumber: 'Room 104',
          department: 'Pediatrics',
          condition: 'Stable',
          primaryDiagnosis: 'Asthma',
          secondaryDiagnoses: ['Seasonal allergies'],
          admittingDoctor: 'Dr. James Wilson',
          emergencyContact: {
            name: 'Carlos Garcia',
            relationship: 'Father',
            phone: '+1-555-0123-4571'
          }
        },
        contactNumber: '+1-555-0123-4570',
        email: 'maria.garcia@hospital.com',
        medications: [
          {
            id: 'M005',
            name: 'Albuterol',
            dosage: '2.5mg',
            frequency: 'Every 4-6 hours',
            route: 'Inhalation',
            prescribedBy: 'Dr. James Wilson',
            startDate: new Date('2024-04-09'),
            timeGiven: ['08:00', '14:00', '20:00'],
            notes: 'Use spacer device'
          }
        ],
        vitals: [
          {
            id: 'V005',
            timestamp: new Date('2024-04-13T11:00:00'),
            bloodPressure: '100/65',
            heartRate: 85,
            temperature: 98.0,
            oxygenSaturation: 97,
            respiratoryRate: 18,
            weight: 110,
            height: 60
          }
        ],
        foodIntake: [
          {
            id: 'F005',
            date: new Date('2024-04-13'),
            mealType: 'breakfast',
            foodItems: ['Pancakes', 'Milk', 'Fruit'],
            calories: 320,
            dietaryRestrictions: ['None'],
            completed: true
          }
        ],
        medicalHistory: ['Asthma (diagnosed 2018)', 'Seasonal allergies'],
        notes: 'Stable on current regimen. Parents educated on trigger avoidance.'
      },
      {
        id: 'P005',
        name: 'James Miller',
        age: 67,
        gender: 'Male',
        bloodType: 'AB+',
        allergies: ['None'],
        currentAdmission: {
          admissionDate: new Date('2024-04-08'),
          bedNumber: 'Room 105',
          department: 'Orthopedics',
          condition: 'Recovering',
          primaryDiagnosis: 'Fractured Leg',
          secondaryDiagnoses: ['Osteoporosis'],
          admittingDoctor: 'Dr. Robert Taylor',
          emergencyContact: {
            name: 'Susan Miller',
            relationship: 'Wife',
            phone: '+1-555-0123-4573'
          }
        },
        contactNumber: '+1-555-0123-4571',
        email: 'james.miller@hospital.com',
        medications: [
          {
            id: 'M006',
            name: 'Oxycodone',
            dosage: '5mg',
            frequency: 'Every 6 hours',
            route: 'Oral',
            prescribedBy: 'Dr. Robert Taylor',
            startDate: new Date('2024-04-08'),
            timeGiven: ['06:00', '12:00', '18:00', '00:00'],
            notes: 'For pain management'
          }
        ],
        vitals: [
          {
            id: 'V006',
            timestamp: new Date('2024-04-13T07:00:00'),
            bloodPressure: '125/80',
            heartRate: 75,
            temperature: 98.3,
            oxygenSaturation: 98,
            respiratoryRate: 16,
            weight: 175,
            height: 68
          }
        ],
        foodIntake: [
          {
            id: 'F006',
            date: new Date('2024-04-13'),
            mealType: 'breakfast',
            foodItems: ['Eggs', 'Toast', 'Orange juice'],
            calories: 380,
            dietaryRestrictions: ['High calcium'],
            completed: true
          }
        ],
        medicalHistory: ['Osteoporosis (diagnosed 2015)', 'Hypertension (diagnosed 2018)'],
        notes: 'Recovering well from surgery. Pain managed with medication.'
      },
      {
        id: 'P006',
        name: 'Emily Davis',
        age: 41,
        gender: 'Female',
        bloodType: 'A-',
        allergies: ['Sulfa drugs'],
        currentAdmission: {
          admissionDate: new Date('2024-04-07'),
          bedNumber: 'Room 106',
          department: 'General Surgery',
          condition: 'Serious',
          primaryDiagnosis: 'Appendicitis',
          secondaryDiagnoses: ['Post-op infection'],
          admittingDoctor: 'Dr. Amanda White',
          emergencyContact: {
            name: 'Mark Davis',
            relationship: 'Husband',
            phone: '+1-555-0123-4574'
          }
        },
        contactNumber: '+1-555-0123-4572',
        email: 'emily.davis@hospital.com',
        medications: [
          {
            id: 'M007',
            name: 'Cefazolin',
            dosage: '1g',
            frequency: 'Every 8 hours',
            route: 'IV',
            prescribedBy: 'Dr. Amanda White',
            startDate: new Date('2024-04-07'),
            timeGiven: ['06:00', '14:00', '22:00'],
            notes: 'Antibiotic for infection'
          }
        ],
        vitals: [
          {
            id: 'V007',
            timestamp: new Date('2024-04-13T08:00:00'),
            bloodPressure: '115/75',
            heartRate: 88,
            temperature: 99.8,
            oxygenSaturation: 96,
            respiratoryRate: 20
          }
        ],
        foodIntake: [
          {
            id: 'F007',
            date: new Date('2024-04-13'),
            mealType: 'breakfast',
            foodItems: ['Clear liquids'],
            calories: 200,
            dietaryRestrictions: ['Clear liquids'],
            completed: false
          }
        ],
        medicalHistory: ['Appendicitis (current)', 'Hypothyroidism (diagnosed 2010)'],
        notes: 'Post-operative day 6. Monitoring for infection. Appetite improving.'
      }
    ]
    
    setPatients(mockPatients)
    setLoading(false)
    console.log('Loaded mock patients:', mockPatients.length)
  }, [])

  useEffect(() => {
    let filtered = patients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentAdmission.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentAdmission.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Department filter
    if (filterDepartment !== 'All') {
      filtered = filtered.filter(patient => patient.currentAdmission.department === filterDepartment)
    }

    // Condition filter
    if (filterCondition !== 'All') {
      filtered = filtered.filter(patient => patient.currentAdmission.condition === filterCondition)
    }

    setFilteredPatients(filtered)
  }, [searchTerm, filterDepartment, filterCondition, patients])

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'Serious': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200'
      case 'Recovering': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Improving': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Critical': return <AlertTriangle size={16} className="text-red-600" />
      case 'Serious': return <AlertTriangle size={16} className="text-orange-600" />
      case 'Stable': return <Activity size={16} className="text-green-600" />
      case 'Recovering': return <Activity size={16} className="text-blue-600" />
      case 'Improving': return <Activity size={16} className="text-blue-600" />
      default: return <User size={16} className="text-gray-600" />
    }
  }

  const departments = ['All', ...Array.from(new Set(patients.map(p => p.currentAdmission.department)))]
  const conditions = ['All', 'Critical', 'Serious', 'Stable', 'Recovering', 'Improving']

  const handleBackToDashboard = () => {
    window.history.back()
  }

  const handlePatientSelect = (patient: NursePatient) => {
    setSelectedPatient(patient)
    setShowDetailsModal(true)
  }

  const handleEditPatient = (patient: NursePatient) => {
    setEditingPatient(patient)
    setShowEditModal(true)
  }

  const handleSavePatient = (updatedPatient: NursePatient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p))
    setFilteredPatients(filteredPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p))
    setShowEditModal(false)
    setEditingPatient(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Patient Records...</h2>
          <p className="text-gray-600">Please wait while we load patient data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <Users className="text-blue-600" size={24} />
                <h1 className="text-xl font-semibold text-gray-900">Patient Records</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity size={16} />
              <span>Live Updates</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, bed number, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{filteredPatients.length}</span> of {patients.length} Patients
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Department:</span>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Condition:</span>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
              onClick={() => handlePatientSelect(patient)}
            >
              <div className="flex items-start justify-between">
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getConditionColor(patient.currentAdmission.condition)}`}>
                    {getConditionIcon(patient.currentAdmission.condition)}
                    <span>{patient.currentAdmission.condition}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePatientSelect(patient)
                    }}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditPatient(patient)
                    }}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Bed size={16} className="text-gray-500" />
                  <span className="text-gray-700">Bed: <strong>{patient.currentAdmission.bedNumber}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-gray-700">Admitted: <strong>{patient.currentAdmission.admissionDate.toLocaleDateString()}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle size={16} className="text-gray-500" />
                  <span className="text-gray-700">Dept: <strong>{patient.currentAdmission.department}</strong></span>
                </div>
              </div>

              {/* Primary Diagnosis */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Primary Diagnosis:</p>
                <p className="text-sm text-gray-600">{patient.currentAdmission.primaryDiagnosis}</p>
              </div>

              {/* Contact Info */}
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Phone size={14} />
                  <span>{patient.contactNumber}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center space-x-1">
                    <Mail size={14} />
                    <span>{patient.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No patients are currently available'}
            </p>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium text-gray-900">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium text-gray-900">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Type</p>
                    <p className="font-medium text-gray-900">{selectedPatient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bed</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.bedNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Admitting Doctor</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.admittingDoctor}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Allergies</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Primary Diagnosis</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.primaryDiagnosis}</p>
                  </div>
                  {selectedPatient.currentAdmission.secondaryDiagnoses.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Secondary Diagnoses</p>
                      <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.secondaryDiagnoses.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedPatient.contactNumber}</p>
                  </div>
                  {selectedPatient.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedPatient.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.emergencyContact.name} ({selectedPatient.currentAdmission.emergencyContact.relationship})</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medical History</h3>
                <ul className="space-y-1">
                  {selectedPatient.medicalHistory.map((history, index) => (
                    <li key={index} className="text-sm text-gray-700">- {history}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Medications */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Medications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedPatient.medications.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPatient.medications.map((med) => (
                      <div key={med.id} className="border-l-4 border-blue-500 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{med.name}</p>
                            <p className="text-sm text-gray-600">{med.dosage} - {med.frequency} - {med.route}</p>
                            <p className="text-sm text-gray-500">Prescribed by: {med.prescribedBy}</p>
                            {med.notes && <p className="text-sm text-gray-500">Notes: {med.notes}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Start: {med.startDate.toLocaleDateString()}</p>
                            {med.timeGiven.length > 0 && (
                              <p className="text-xs text-gray-500">Times: {med.timeGiven.join(', ')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No medications prescribed</p>
                )}
              </div>
            </div>

            {/* Vitals */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Vitals</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedPatient.vitals.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPatient.vitals.slice(-3).map((vital) => (
                      <div key={vital.id} className="border-l-4 border-green-500 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{vital.timestamp.toLocaleString()}</p>
                            <div className="grid grid-cols-3 gap-4 mt-1">
                              <div>
                                <p className="text-sm text-gray-600">BP: <span className="font-medium">{vital.bloodPressure}</span></p>
                                <p className="text-sm text-gray-600">HR: <span className="font-medium">{vital.heartRate}</span></p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Temp: <span className="font-medium">{vital.temperature}°F</span></p>
                                <p className="text-sm text-gray-600">O2: <span className="font-medium">{vital.oxygenSaturation}%</span></p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">RR: <span className="font-medium">{vital.respiratoryRate}</span></p>
                                {vital.weight && <p className="text-sm text-gray-600">Weight: <span className="font-medium">{vital.weight} lbs</span></p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No vitals recorded</p>
                )}
              </div>
            </div>

            {/* Food Intake */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Food Intake</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedPatient.foodIntake.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPatient.foodIntake.map((food) => (
                      <div key={food.id} className="border-l-4 border-orange-500 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{food.date.toLocaleDateString()} - {food.mealType}</p>
                            <p className="text-sm text-gray-600">{food.foodItems.join(', ')}</p>
                            <p className="text-sm text-gray-600">Calories: {food.calories}</p>
                            {food.dietaryRestrictions.length > 0 && (
                              <p className="text-sm text-gray-600">Restrictions: {food.dietaryRestrictions.join(', ')}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${food.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {food.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No food intake recorded</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Nursing Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{selectedPatient.notes}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                onClick={() => {
                  setShowDetailsModal(false)
                  handleEditPatient(selectedPatient)
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Edit Patient
              </button>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditModal && editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Complete Patient Information</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingPatient.name}
                      onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={editingPatient.age}
                      onChange={(e) => setEditingPatient({...editingPatient, age: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={editingPatient.gender}
                      onChange={(e) => setEditingPatient({...editingPatient, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                    <select
                      value={editingPatient.bloodType}
                      onChange={(e) => setEditingPatient({...editingPatient, bloodType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Allergies</h3>
                <div className="space-y-2">
                  {editingPatient.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={allergy}
                        onChange={(e) => {
                          const newAllergies = [...editingPatient.allergies]
                          newAllergies[index] = e.target.value
                          setEditingPatient({...editingPatient, allergies: newAllergies})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newAllergies = editingPatient.allergies.filter((_, i) => i !== index)
                          setEditingPatient({...editingPatient, allergies: newAllergies})
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingPatient({...editingPatient, allergies: [...editingPatient.allergies, '']})}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Allergy
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editingPatient.contactNumber}
                      onChange={(e) => setEditingPatient({...editingPatient, contactNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingPatient.email || ''}
                      onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={editingPatient.currentAdmission.emergencyContact.name}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        currentAdmission: {
                          ...editingPatient.currentAdmission,
                          emergencyContact: {
                            ...editingPatient.currentAdmission.emergencyContact,
                            name: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={editingPatient.currentAdmission.emergencyContact.phone}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        currentAdmission: {
                          ...editingPatient.currentAdmission,
                          emergencyContact: {
                            ...editingPatient.currentAdmission.emergencyContact,
                            phone: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number</label>
                    <input
                      type="text"
                      value={editingPatient.currentAdmission.bedNumber}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        currentAdmission: {...editingPatient.currentAdmission, bedNumber: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={editingPatient.currentAdmission.department}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        currentAdmission: {...editingPatient.currentAdmission, department: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Surgery">General Surgery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select
                      value={editingPatient.currentAdmission.condition}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        currentAdmission: {...editingPatient.currentAdmission, condition: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Stable">Stable</option>
                      <option value="Improving">Improving</option>
                      <option value="Critical">Critical</option>
                      <option value="Serious">Serious</option>
                      <option value="Recovering">Recovering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis</label>
                    <input
                      type="text"
                      value={editingPatient.currentAdmission.primaryDiagnosis}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        currentAdmission: {...editingPatient.currentAdmission, primaryDiagnosis: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admitting Doctor</label>
                    <input
                      type="text"
                      value={editingPatient.currentAdmission.admittingDoctor}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        currentAdmission: {...editingPatient.currentAdmission, admittingDoctor: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medical History</h3>
                <div className="space-y-2">
                  {editingPatient.medicalHistory.map((history, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={history}
                        onChange={(e) => {
                          const newHistory = [...editingPatient.medicalHistory]
                          newHistory[index] = e.target.value
                          setEditingPatient({...editingPatient, medicalHistory: newHistory})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newHistory = editingPatient.medicalHistory.filter((_, i) => i !== index)
                          setEditingPatient({...editingPatient, medicalHistory: newHistory})
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingPatient({...editingPatient, medicalHistory: [...editingPatient.medicalHistory, '']})}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Medical History
                  </button>
                </div>
              </div>

              {/* Medications */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medications</h3>
                <div className="space-y-4">
                  {editingPatient.medications.map((med, index) => (
                    <div key={med.id} className="border border-gray-300 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => {
                              const newMeds = [...editingPatient.medications]
                              newMeds[index] = {...med, name: e.target.value}
                              setEditingPatient({...editingPatient, medications: newMeds})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => {
                              const newMeds = [...editingPatient.medications]
                              newMeds[index] = {...med, dosage: e.target.value}
                              setEditingPatient({...editingPatient, medications: newMeds})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => {
                              const newMeds = [...editingPatient.medications]
                              newMeds[index] = {...med, frequency: e.target.value}
                              setEditingPatient({...editingPatient, medications: newMeds})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                          <select
                            value={med.route}
                            onChange={(e) => {
                              const newMeds = [...editingPatient.medications]
                              newMeds[index] = {...med, route: e.target.value}
                              setEditingPatient({...editingPatient, medications: newMeds})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Oral">Oral</option>
                            <option value="IV">IV</option>
                            <option value="IM">IM</option>
                            <option value="Sublingual">Sublingual</option>
                            <option value="Inhalation">Inhalation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prescribed By</label>
                          <input
                            type="text"
                            value={med.prescribedBy}
                            onChange={(e) => {
                              const newMeds = [...editingPatient.medications]
                              newMeds[index] = {...med, prescribedBy: e.target.value}
                              setEditingPatient({...editingPatient, medications: newMeds})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <input
                            type="text"
                            value={med.notes || ''}
                            onChange={(e) => {
                              const newMeds = [...editingPatient.medications]
                              newMeds[index] = {...med, notes: e.target.value}
                              setEditingPatient({...editingPatient, medications: newMeds})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            const newMeds = editingPatient.medications.filter((_, i) => i !== index)
                            setEditingPatient({...editingPatient, medications: newMeds})
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove Medication
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newMed: Medication = {
                        id: `M${Date.now()}`,
                        name: '',
                        dosage: '',
                        frequency: '',
                        route: 'Oral',
                        prescribedBy: '',
                        startDate: new Date(),
                        timeGiven: []
                      }
                      setEditingPatient({...editingPatient, medications: [...editingPatient.medications, newMed]})
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Medication
                  </button>
                </div>
              </div>

              {/* Vitals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Vitals</h3>
                <div className="space-y-4">
                  {editingPatient.vitals.map((vital, index) => (
                    <div key={vital.id} className="border border-gray-300 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                          <input
                            type="text"
                            value={vital.bloodPressure}
                            onChange={(e) => {
                              const newVitals = [...editingPatient.vitals]
                              newVitals[index] = {...vital, bloodPressure: e.target.value}
                              setEditingPatient({...editingPatient, vitals: newVitals})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                          <input
                            type="number"
                            value={vital.heartRate}
                            onChange={(e) => {
                              const newVitals = [...editingPatient.vitals]
                              newVitals[index] = {...vital, heartRate: parseInt(e.target.value)}
                              setEditingPatient({...editingPatient, vitals: newVitals})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={vital.temperature}
                            onChange={(e) => {
                              const newVitals = [...editingPatient.vitals]
                              newVitals[index] = {...vital, temperature: parseFloat(e.target.value)}
                              setEditingPatient({...editingPatient, vitals: newVitals})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                          <input
                            type="number"
                            value={vital.oxygenSaturation}
                            onChange={(e) => {
                              const newVitals = [...editingPatient.vitals]
                              newVitals[index] = {...vital, oxygenSaturation: parseInt(e.target.value)}
                              setEditingPatient({...editingPatient, vitals: newVitals})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
                          <input
                            type="number"
                            value={vital.respiratoryRate}
                            onChange={(e) => {
                              const newVitals = [...editingPatient.vitals]
                              newVitals[index] = {...vital, respiratoryRate: parseInt(e.target.value)}
                              setEditingPatient({...editingPatient, vitals: newVitals})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                          <input
                            type="number"
                            value={vital.weight || ''}
                            onChange={(e) => {
                              const newVitals = [...editingPatient.vitals]
                              newVitals[index] = {...vital, weight: e.target.value ? parseInt(e.target.value) : undefined}
                              setEditingPatient({...editingPatient, vitals: newVitals})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            const newVitals = editingPatient.vitals.filter((_, i) => i !== index)
                            setEditingPatient({...editingPatient, vitals: newVitals})
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove Vitals
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newVital: Vitals = {
                        id: `V${Date.now()}`,
                        timestamp: new Date(),
                        bloodPressure: '',
                        heartRate: 0,
                        temperature: 0,
                        oxygenSaturation: 0,
                        respiratoryRate: 0
                      }
                      setEditingPatient({...editingPatient, vitals: [...editingPatient.vitals, newVital]})
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Vitals
                  </button>
                </div>
              </div>

              {/* Food Intake */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Food Intake</h3>
                <div className="space-y-4">
                  {editingPatient.foodIntake.map((food, index) => (
                    <div key={food.id} className="border border-gray-300 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                          <select
                            value={food.mealType}
                            onChange={(e) => {
                              const newFood = [...editingPatient.foodIntake]
                              newFood[index] = {...food, mealType: e.target.value as any}
                              setEditingPatient({...editingPatient, foodIntake: newFood})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                          <input
                            type="number"
                            value={food.calories}
                            onChange={(e) => {
                              const newFood = [...editingPatient.foodIntake]
                              newFood[index] = {...food, calories: parseInt(e.target.value)}
                              setEditingPatient({...editingPatient, foodIntake: newFood})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Food Items (comma separated)</label>
                          <input
                            type="text"
                            value={food.foodItems.join(', ')}
                            onChange={(e) => {
                              const newFood = [...editingPatient.foodIntake]
                              newFood[index] = {...food, foodItems: e.target.value.split(', ').map(item => item.trim())}
                              setEditingPatient({...editingPatient, foodIntake: newFood})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions (comma separated)</label>
                          <input
                            type="text"
                            value={food.dietaryRestrictions.join(', ')}
                            onChange={(e) => {
                              const newFood = [...editingPatient.foodIntake]
                              newFood[index] = {...food, dietaryRestrictions: e.target.value.split(', ').map(item => item.trim())}
                              setEditingPatient({...editingPatient, foodIntake: newFood})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Completed</label>
                          <select
                            value={food.completed ? 'true' : 'false'}
                            onChange={(e) => {
                              const newFood = [...editingPatient.foodIntake]
                              newFood[index] = {...food, completed: e.target.value === 'true'}
                              setEditingPatient({...editingPatient, foodIntake: newFood})
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="true">Completed</option>
                            <option value="false">Pending</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            const newFood = editingPatient.foodIntake.filter((_, i) => i !== index)
                            setEditingPatient({...editingPatient, foodIntake: newFood})
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove Food Entry
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newFood: FoodIntake = {
                        id: `F${Date.now()}`,
                        date: new Date(),
                        mealType: 'breakfast',
                        foodItems: [],
                        calories: 0,
                        dietaryRestrictions: [],
                        completed: false
                      }
                      setEditingPatient({...editingPatient, foodIntake: [...editingPatient.foodIntake, newFood]})
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Food Entry
                  </button>
                </div>
              </div>

              {/* Nursing Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Nursing Notes</h3>
                <textarea
                  value={editingPatient.notes}
                  onChange={(e) => setEditingPatient({...editingPatient, notes: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter nursing notes..."
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSavePatient(editingPatient)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NursePatientRecordsPageWorking
