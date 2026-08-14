import React, { useState, useEffect } from 'react'
import { ArrowLeft, AlertTriangle, AlertCircle, Phone, Clock, CheckCircle, X, Send, Plus, Filter } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { nursePatients, emergencyAlerts, getRealTimeUpdates, NursePatient, EmergencyAlert } from '../../data/nursePatientData'

const NurseEmergencyPage: React.FC = () => {
  const { state: authState } = useAuth()
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>(emergencyAlerts)
  const [showReportForm, setShowReportForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')
  const nurseName = authState.user ? `${authState.user.firstName} ${authState.user.lastName}` : 'Current Nurse'

  // Form state
  const [emergencyForm, setEmergencyForm] = useState({
    patientId: '',
    type: '',
    severity: '',
    message: ''
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPatients = getRealTimeUpdates()
      setPatients(updatedPatients)
      
      // Simulate random emergency generation (5% chance)
      if (Math.random() < 0.05 && emergencies.length < 10) {
        const randomPatient = patients[Math.floor(Math.random() * patients.length)]
        const newEmergency: EmergencyAlert = {
          id: `emergency-${Date.now()}`,
          patientId: randomPatient.id,
          patientName: randomPatient.name,
          room: randomPatient.room,
          type: 'code-blue',
          severity: 'critical',
          message: `Patient requires immediate medical attention`,
          timestamp: new Date(),
          acknowledgedBy: undefined,
          resolved: false
        }
        setEmergencies(prev => [newEmergency, ...prev])
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [patients, emergencies])

  const filteredEmergencies = emergencies.filter(e => {
    if (filter === 'all') return true
    if (filter === 'active') return !e.resolved
    if (filter === 'resolved') return e.resolved
    return true
  })

  const activeEmergencies = emergencies.filter(e => !e.resolved)
  const resolvedEmergencies = emergencies.filter(e => e.resolved)
  const criticalEmergencies = emergencies.filter(e => e.severity === 'critical')

  const handleReportEmergency = () => {
    console.log('Reporting emergency:', emergencyForm)
    
    if (emergencyForm.patientId && emergencyForm.type && emergencyForm.severity && emergencyForm.message) {
      const patient = patients.find(p => p.id === emergencyForm.patientId)
      if (patient) {
        const newEmergency: EmergencyAlert = {
          id: `emergency-${Date.now()}`,
          patientId: emergencyForm.patientId,
          patientName: patient.name,
          room: patient.room,
          type: emergencyForm.type as 'code-blue' | 'code-red' | 'code-yellow' | 'rapid-response',
          severity: emergencyForm.severity as 'low' | 'medium' | 'high' | 'critical',
          message: emergencyForm.message,
          timestamp: new Date(),
          acknowledgedBy: undefined,
          resolved: false
        }
        setEmergencies(prev => [newEmergency, ...prev])
        console.log('Emergency reported successfully:', newEmergency)
        
        // Reset form
        setEmergencyForm({
          patientId: '',
          type: '',
          severity: '',
          message: ''
        })
        setShowReportForm(false)
      }
    }
  }

  const handleAcknowledgeEmergency = (emergencyId: string) => {
    console.log('Acknowledging emergency:', emergencyId)
    
    setEmergencies(prev => prev.map(e => 
      e.id === emergencyId 
        ? { 
            ...e, 
            acknowledgedBy: nurseName,
            acknowledgedAt: new Date()
          }
        : e
    ))
    
    console.log(`Emergency ${emergencyId} acknowledged by ${nurseName}`)
  }

  const handleResolveEmergency = (emergencyId: string) => {
    console.log('Resolving emergency:', emergencyId)
    
    setEmergencies(prev => prev.map(e => 
      e.id === emergencyId 
        ? { 
            ...e, 
            resolved: true, 
            resolvedAt: new Date(),
            resolvedBy: nurseName
          }
        : e
    ))
    
    console.log(`Emergency ${emergencyId} resolved by ${nurseName}`)
  }

  const getEmergencyTypeColor = (type: string) => {
    switch (type) {
      case 'code-blue': return 'bg-blue-100 text-blue-800'
      case 'code-red': return 'bg-red-100 text-red-800'
      case 'code-yellow': return 'bg-yellow-100 text-yellow-800'
      case 'rapid-response': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
                <AlertTriangle className="text-red-600" size={24} />
                <h1 className="text-xl font-semibold text-gray-900">Emergency Reporting</h1>
              </div>
            </div>
            <button
              onClick={() => setShowReportForm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Report Emergency
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({emergencies.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'active' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active ({activeEmergencies.length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'resolved' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resolved ({resolvedEmergencies.length})
            </button>
          </div>
        </div>

        {/* Active Emergencies Alert */}
        {activeEmergencies.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="text-red-600" size={24} />
                <h2 className="text-xl font-semibold text-red-800">Active Emergencies</h2>
                <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                  {activeEmergencies.length}
                </span>
              </div>
              <div className="space-y-3">
                {activeEmergencies.map((emergency) => (
                  <div key={emergency.id} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getEmergencyTypeColor(emergency.type)}`}>
                            {emergency.type.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className="font-semibold text-gray-900">{emergency.patientName}</span>
                          <span className="text-sm text-gray-600">Room {emergency.room}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(emergency.severity)}`}>
                            {emergency.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-gray-700 mb-2">{emergency.message}</div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {emergency.timestamp.toLocaleString()}
                          </span>
                          {emergency.acknowledgedBy && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={12} className="mr-1" />
                              Acknowledged by {emergency.acknowledgedBy}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!emergency.acknowledgedBy && (
                          <button
                            onClick={() => handleAcknowledgeEmergency(emergency.id)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveEmergency(emergency.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Active</p>
                <p className="text-3xl font-bold text-red-700">{activeEmergencies.length}</p>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Resolved</p>
                <p className="text-3xl font-bold text-green-700">{resolvedEmergencies.length}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Critical</p>
                <p className="text-3xl font-bold text-orange-700">{criticalEmergencies.length}</p>
              </div>
              <AlertTriangle className="text-orange-600" size={32} />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Patients</p>
                <p className="text-3xl font-bold text-blue-700">{patients.length}</p>
              </div>
              <Phone className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Emergency List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Emergency History</h2>
          {filteredEmergencies.length > 0 ? (
            <div className="space-y-3">
              {filteredEmergencies.map((emergency) => (
                <div key={emergency.id} className={`rounded-lg border p-4 ${
                  emergency.resolved 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-red-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getEmergencyTypeColor(emergency.type)}`}>
                          {emergency.type.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="font-semibold text-gray-900">{emergency.patientName}</span>
                        <span className="text-sm text-gray-600">Room {emergency.room}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(emergency.severity)}`}>
                          {emergency.severity.toUpperCase()}
                        </span>
                        {emergency.resolved && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-semibold">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <div className="text-gray-700 mb-2">{emergency.message}</div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {emergency.timestamp.toLocaleString()}
                        </span>
                        {emergency.acknowledgedBy && (
                          <span className="flex items-center text-green-600">
                            <CheckCircle size={12} className="mr-1" />
                            Acknowledged by {emergency.acknowledgedBy}
                          </span>
                        )}
                        {emergency.resolvedAt && (
                          <span className="flex items-center text-blue-600">
                            <CheckCircle size={12} className="mr-1" />
                            Resolved at {emergency.resolvedAt.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {!emergency.resolved && (
                      <div className="flex space-x-2">
                        {!emergency.acknowledgedBy && (
                          <button
                            onClick={() => handleAcknowledgeEmergency(emergency.id)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveEmergency(emergency.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No emergencies found for the selected filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Emergency Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Report Emergency</h3>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <select
                    value={emergencyForm.patientId}
                    onChange={(e) => setEmergencyForm({...emergencyForm, patientId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select patient...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - Room {patient.room}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Type
                  </label>
                  <select
                    value={emergencyForm.type}
                    onChange={(e) => setEmergencyForm({...emergencyForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select type...</option>
                    <option value="code-blue">Code Blue</option>
                    <option value="code-red">Code Red</option>
                    <option value="code-yellow">Code Yellow</option>
                    <option value="rapid-response">Rapid Response</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={emergencyForm.severity}
                    onChange={(e) => setEmergencyForm({...emergencyForm, severity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select severity...</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={emergencyForm.message}
                    onChange={(e) => setEmergencyForm({...emergencyForm, message: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Describe the emergency..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleReportEmergency}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <Send size={16} className="mr-2" />
                  Report Emergency
                </button>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NurseEmergencyPage
