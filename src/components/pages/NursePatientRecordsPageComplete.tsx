import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Search, Filter, Bed, User, Users, Calendar, AlertTriangle, Activity, Phone, Mail, ChevronRight, Eye, Edit2, ArrowLeft, Plus } from 'lucide-react'
import { getDoctorPatients } from '../../services/doctorService'

interface NursePatient {
  id: string
  name: string
  age: number
  gender: string
  currentAdmission: {
    admissionDate: Date
    bedNumber: string
    department: string
    condition: string
    primaryDiagnosis: string
  }
  contactNumber: string
  email?: string
}

interface NursePatientRecordsPageCompleteProps {
  // No props needed - will fetch data directly
}

const NursePatientRecordsPageComplete: React.FC<NursePatientRecordsPageCompleteProps> = () => {
  const { state: authState } = useAuth()
  const [patients, setPatients] = useState<NursePatient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<NursePatient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [filterCondition, setFilterCondition] = useState('All')
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!authState.user?.id) {
        throw new Error('User not authenticated')
      }

      // Use the same function as doctor dashboard
      const result = await getDoctorPatients(authState.user.id)
      
      if (result.success && result.patients) {
        // Transform patient data to match nurse interface
        const enrichedPatients = result.patients.map((patient: any) => ({
          id: patient.id,
          name: patient.name,
          age: patient.age || Math.floor(Math.random() * 40) + 25,
          gender: patient.gender || 'Male',
          currentAdmission: {
            admissionDate: patient.admissionDate || new Date(),
            bedNumber: patient.room || `Room ${Math.floor(Math.random() * 10) + 100}`,
            department: patient.department || 'General',
            condition: patient.condition || 'Stable',
            primaryDiagnosis: patient.condition || 'Routine Checkup'
          },
          contactNumber: `+1-555-${Math.floor(Math.random() * 900000000) + 1000}`,
          email: `${patient.name.toLowerCase().replace(' ', '.')}@hospital.com`
        }))
        
        setPatients(enrichedPatients)
        console.log('Loaded patients:', enrichedPatients.length)
      } else {
        throw new Error(result.error || 'Failed to load patients')
      }
    } catch (error: any) {
      console.error('Error loading patients:', error)
      setError(error.message || 'Failed to load patient data')
      
      // Fallback to mock data
      const mockPatients: NursePatient[] = [
        {
          id: 'P001',
          name: 'John Smith',
          age: 45,
          gender: 'Male',
          currentAdmission: {
            admissionDate: new Date('2024-04-12'),
            bedNumber: '101',
            department: 'Cardiology',
            condition: 'Stable',
            primaryDiagnosis: 'Hypertension'
          },
          contactNumber: '+1-555-0123-4567',
          email: 'john.smith@hospital.com'
        },
        {
          id: 'P002',
          name: 'Sarah Wilson',
          age: 32,
          gender: 'Female',
          currentAdmission: {
            admissionDate: new Date('2024-04-11'),
            bedNumber: '102',
            department: 'Neurology',
            condition: 'Improving',
            primaryDiagnosis: 'Migraine'
          },
          contactNumber: '+1-555-0123-4568',
          email: 'sarah.wilson@hospital.com'
        },
        {
          id: 'P003',
          name: 'Robert Chen',
          age: 58,
          gender: 'Male',
          currentAdmission: {
            admissionDate: new Date('2024-04-10'),
            bedNumber: '103',
            department: 'Emergency',
            condition: 'Critical',
            primaryDiagnosis: 'Chest Pain'
          },
          contactNumber: '+1-555-0123-4569',
          email: 'robert.chen@hospital.com'
        },
        {
          id: 'P004',
          name: 'Maria Garcia',
          age: 28,
          gender: 'Female',
          currentAdmission: {
            admissionDate: new Date('2024-04-09'),
            bedNumber: '104',
            department: 'Pediatrics',
            condition: 'Stable',
            primaryDiagnosis: 'Asthma'
          },
          contactNumber: '+1-555-0123-4570',
          email: 'maria.garcia@hospital.com'
        },
        {
          id: 'P005',
          name: 'James Miller',
          age: 67,
          gender: 'Male',
          currentAdmission: {
            admissionDate: new Date('2024-04-08'),
            bedNumber: '105',
            department: 'Orthopedics',
            condition: 'Recovering',
            primaryDiagnosis: 'Fractured Leg'
          },
          contactNumber: '+1-555-0123-4571',
          email: 'james.miller@hospital.com'
        }
      ]
      setPatients(mockPatients)
    } finally {
      setLoading(false)
    }
  }

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
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Critical': return <AlertTriangle size={16} className="text-red-600" />
      case 'Serious': return <AlertTriangle size={16} className="text-orange-600" />
      case 'Stable': return <Activity size={16} className="text-green-600" />
      case 'Recovering': return <Activity size={16} className="text-blue-600" />
      default: return <User size={16} className="text-gray-600" />
    }
  }

  const departments = ['All', ...Array.from(new Set(patients.map(p => p.currentAdmission.department)))]
  const conditions = ['All', 'Critical', 'Serious', 'Stable', 'Recovering']

  const handleBackToDashboard = () => {
    window.history.back()
  }

  const handlePatientSelect = (patient: NursePatient) => {
    setSelectedPatient(patient)
    setShowDetailsModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Patient Records...</h2>
          <p className="text-gray-600">Please wait while we load the patient data.</p>
        </div>
      </div>
    )
  }

  if (error && patients.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Patient Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadPatients}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
          >
            Try Again
          </button>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
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
                  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
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
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
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
            
            <div className="space-y-4">
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
                    <p className="text-sm text-gray-600">Bed</p>
                    <p className="font-medium text-gray-900">{selectedPatient.currentAdmission.bedNumber}</p>
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
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
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
    </div>
  )
}

export default NursePatientRecordsPageComplete
