import React, { useState, useEffect } from 'react'
import { ArrowLeft, AlertTriangle, AlertCircle, Phone, Clock, CheckCircle, X, Send, Plus, Filter } from 'lucide-react'
import { nursePatients, emergencyAlerts, getRealTimeUpdates, NursePatient, EmergencyAlert } from '../../data/nursePatientData'

const NurseEmergencyPage: React.FC = () => {
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>(emergencyAlerts)
  const [showReportForm, setShowReportForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')

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
    setEmergencies(prev => prev.map(e => 
      e.id === emergencyId 
        ? { ...e, acknowledgedBy: 'Current Nurse' }
        : e
    ))
  }

  const handleResolveEmergency = (emergencyId: string) => {
    setEmergencies(prev => prev.map(e => 
      e.id === emergencyId 
        ? { ...e, resolved: true, resolvedAt: new Date() }
        : e
    ))
  }

  const getEmergencyTypeColor = (type: string) => {
    switch (type) {
      case 'code-blue': return 'bg-red-100 text-red-700'
      case 'code-red': return 'bg-orange-100 text-orange-700'
      case 'code-yellow': return 'bg-yellow-100 text-yellow-700'
      case 'rapid-response': return 'bg-purple-100 text-purple-700'
      case 'critical-lab': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
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
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle size={16} />
              <span>Live Monitoring</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Action Buttons */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Report New Emergency
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center">
            <Phone size={20} className="mr-2" />
            Emergency Contacts
          </button>
        </div>

        {/* Emergency Reporting Form */}
        {showReportForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Report New Emergency</h3>
              <button
                onClick={() => setShowReportForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select
                  value={emergencyForm.patientId}
                  onChange={(e) => setEmergencyForm(prev => ({ ...prev, patientId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - Room {patient.room}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type</label>
                <select
                  value={emergencyForm.type}
                  onChange={(e) => setEmergencyForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="code-blue">Code Blue - Cardiac Arrest</option>
                  <option value="code-red">Code Red - Fire Emergency</option>
                  <option value="code-yellow">Code Yellow - Missing Patient</option>
                  <option value="rapid-response">Rapid Response</option>
                  <option value="critical-lab">Critical Lab Values</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEmergencyForm(prev => ({ ...prev, severity: 'critical' }))}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    emergencyForm.severity === 'critical' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setEmergencyForm(prev => ({ ...prev, severity: 'high' }))}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    emergencyForm.severity === 'high' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => setEmergencyForm(prev => ({ ...prev, severity: 'medium' }))}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    emergencyForm.severity === 'medium' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setEmergencyForm(prev => ({ ...prev, severity: 'low' }))}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    emergencyForm.severity === 'low' 
                      ? 'bg-gray-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Low
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Description</label>
              <textarea
                value={emergencyForm.message}
                onChange={(e) => setEmergencyForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Describe emergency situation in detail..."
              ></textarea>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleReportEmergency}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Send size={16} className="mr-1" />
                Send Emergency Alert
              </button>
              <button
                onClick={() => setShowReportForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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

        {/* Emergency History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency History</h2>
          <div className="space-y-4">
            {filteredEmergencies.map((emergency) => (
              <div key={emergency.id} className={`rounded-lg border ${
                emergency.resolved ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="p-6">
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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          emergency.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {emergency.resolved ? 'RESOLVED' : 'ACTIVE'}
                        </span>
                      </div>
                      <div className="text-gray-700 mb-2">{emergency.message}</div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {emergency.timestamp.toLocaleString()}
                        </span>
                        {emergency.resolvedAt && (
                          <span className="flex items-center text-green-600">
                            <CheckCircle size={12} className="mr-1" />
                            Resolved at {emergency.resolvedAt.toLocaleString()}
                          </span>
                        )}
                        {emergency.acknowledgedBy && !emergency.resolved && (
                          <span className="flex items-center text-blue-600">
                            <CheckCircle size={12} className="mr-1" />
                            Acknowledged by {emergency.acknowledgedBy}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NurseEmergencyPage
