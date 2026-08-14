import React, { useState, useEffect } from 'react'
import { ArrowLeft, Users, Search, Calendar, Phone, Mail, AlertTriangle, FileText, Heart, Activity, X } from 'lucide-react'
import { nursePatients, getRealTimeUpdates, NursePatient } from '../../data/nursePatientData'

const NursePatientRecordsPage: React.FC = () => {
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPatients = getRealTimeUpdates()
      setPatients(updatedPatients)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
      case 'stable': return 'bg-green-100 text-green-700'
      case 'improving': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.room.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewFullRecord = (patient: NursePatient) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }

  const handleEditPatient = (patient: NursePatient) => {
    console.log('Editing patient:', patient.name)
    alert(`Edit functionality for ${patient.name} would open here with full patient editing form.`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search patients by name, ID, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">
                      {patient.priority.toUpperCase()} | ID: {patient.id} | Room {patient.room}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600">Age/Gender: {patient.age}y, {patient.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart size={16} className="text-gray-400" />
                    <span className="text-gray-600">Blood Group: {patient.bloodGroup}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-gray-600">Department: {patient.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-600">Emergency: {patient.emergencyContact.name}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600 font-medium">Latest Vitals:</span>
                  <div className="grid grid-cols-4 gap-2 mt-1 text-xs">
                    <div className="text-center p-1 bg-white rounded">
                      <div className="text-gray-500">BP</div>
                      <div className="font-semibold">{patient.vitalSigns[0].bloodPressure.systolic}/{patient.vitalSigns[0].bloodPressure.diastolic}</div>
                    </div>
                    <div className="text-center p-1 bg-white rounded">
                      <div className="text-gray-500">HR</div>
                      <div className="font-semibold">{patient.vitalSigns[0].heartRate}</div>
                    </div>
                    <div className="text-center p-1 bg-white rounded">
                      <div className="text-gray-500">Temp</div>
                      <div className="font-semibold">{patient.vitalSigns[0].temperature}°F</div>
                    </div>
                    <div className="text-center p-1 bg-white rounded">
                      <div className="text-gray-500">O2</div>
                      <div className="font-semibold">{patient.vitalSigns[0].oxygenSaturation}%</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {patient.vitalSigns[0].timestamp.toLocaleTimeString()} by {patient.vitalSigns[0].nurse}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t flex space-x-2">
                  <button
                    onClick={() => handleViewFullRecord(patient)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    View Full Record
                  </button>
                  <button 
                    onClick={() => handleEditPatient(patient)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{patients.filter(p => p.status === 'critical').length}</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stable</p>
                <p className="text-2xl font-bold text-green-600">{patients.filter(p => p.status === 'stable').length}</p>
              </div>
              <Heart className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Improving</p>
                <p className="text-2xl font-bold text-blue-600">{patients.filter(p => p.status === 'improving').length}</p>
              </div>
              <Activity className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Patient Full Record</h2>
              <button
                onClick={() => setShowPatientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-gray-600">ID: {selectedPatient.id} | Room: {selectedPatient.room}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedPatient.priority)}`}>
                      {selectedPatient.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age/Gender:</span>
                        <span className="font-medium">{selectedPatient.age}y, {selectedPatient.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Group:</span>
                        <span className="font-medium">{selectedPatient.bloodGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedPatient.department}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Emergency Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedPatient.emergencyContact.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relation:</span>
                        <span className="font-medium">{selectedPatient.emergencyContact.relationship}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedPatient.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Medical Condition</h4>
                    <p className="text-sm text-gray-700">{selectedPatient.condition}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Vitals */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Latest Vitals</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-600">Blood Pressure</div>
                    <div className="text-lg font-semibold">
                      {selectedPatient.vitalSigns[0].bloodPressure.systolic}/{selectedPatient.vitalSigns[0].bloodPressure.diastolic}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-600">Heart Rate</div>
                    <div className="text-lg font-semibold">{selectedPatient.vitalSigns[0].heartRate} bpm</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-600">Temperature</div>
                    <div className="text-lg font-semibold">{selectedPatient.vitalSigns[0].temperature}°F</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-600">O2 Saturation</div>
                    <div className="text-lg font-semibold">{selectedPatient.vitalSigns[0].oxygenSaturation}%</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recorded at {selectedPatient.vitalSigns[0].timestamp.toLocaleString()} by {selectedPatient.vitalSigns[0].nurse}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t">
                <button
                  onClick={() => handleEditPatient(selectedPatient)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Patient Record
                </button>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NursePatientRecordsPage
