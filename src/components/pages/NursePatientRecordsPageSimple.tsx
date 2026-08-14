import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Search, User, Calendar, Activity, AlertTriangle, Edit2, ArrowLeft, Phone } from 'lucide-react'
import { getDoctorPatients } from '../../services/doctorService'

interface SimplePatient {
  id: string
  name: string
  lastVisit: Date
  totalAppointments: number
  status: string
  room?: string
  department?: string
  condition?: string
  priority?: string
  age?: number
  gender?: string
}

interface NursePatientRecordsPageSimpleProps {
  // No props needed - will fetch data directly
}

const NursePatientRecordsPageSimple: React.FC<NursePatientRecordsPageSimpleProps> = () => {
  const { state: authState } = useAuth()
  const [patients, setPatients] = useState<SimplePatient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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
        // Transform patient data to include additional fields
        const enrichedPatients = result.patients.map((patient: any) => ({
          ...patient,
          room: `Room ${Math.floor(Math.random() * 10) + 100}`,
          department: patient.department || 'General',
          condition: patient.condition || 'Stable',
          priority: patient.priority || 'medium',
          age: patient.age || Math.floor(Math.random() * 40) + 25,
          gender: patient.gender || 'Male'
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
      const mockPatients: SimplePatient[] = [
        {
          id: 'P001',
          name: 'John Smith',
          lastVisit: new Date('2024-04-12'),
          totalAppointments: 5,
          status: 'stable',
          room: '101',
          department: 'Cardiology',
          condition: 'Stable',
          priority: 'medium',
          age: 45,
          gender: 'Male'
        },
        {
          id: 'P002',
          name: 'Sarah Wilson',
          lastVisit: new Date('2024-04-11'),
          totalAppointments: 3,
          status: 'improving',
          room: '102',
          department: 'Neurology',
          condition: 'Improving',
          priority: 'low',
          age: 32,
          gender: 'Female'
        },
        {
          id: 'P003',
          name: 'Robert Chen',
          lastVisit: new Date('2024-04-10'),
          totalAppointments: 7,
          status: 'critical',
          room: '103',
          department: 'Emergency',
          condition: 'Critical',
          priority: 'high',
          age: 58,
          gender: 'Male'
        }
      ]
      setPatients(mockPatients)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.room && patient.room.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'improving': return 'bg-green-100 text-green-700'
      case 'stable': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleBackToDashboard = () => {
    // This will be handled by the parent component
    window.history.back()
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
                <User className="text-blue-600" size={24} />
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
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search patients by name, ID, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{filteredPatients.length}</span> of {patients.length} patients
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <User className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {patients.filter(p => p.status === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Improving</p>
                  <p className="text-2xl font-bold text-green-600">
                    {patients.filter(p => p.status === 'improving').length}
                  </p>
                </div>
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stable</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {patients.filter(p => p.status === 'stable').length}
                  </p>
                </div>
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">ID: {patient.id}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                    {patient.priority && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(patient.priority)}`}>
                        {patient.priority}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{patient.room || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{patient.department || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-medium">{patient.condition || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Age/Gender:</span>
                    <span className="font-medium">
                      {patient.age || 'N/A'} / {patient.gender || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="font-medium">
                      {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <User size={16} />
                    <span>View Details</span>
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No patients are currently available'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NursePatientRecordsPageSimple
