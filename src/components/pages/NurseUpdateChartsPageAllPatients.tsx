import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clipboard, Heart, Thermometer, Wind, Droplets, Activity, Save, X, CheckCircle, Edit3, User, Calendar, AlertCircle } from 'lucide-react'
import { nursePatients, getMedicationSchedule, getRealTimeUpdates, ScheduledMedication, NursePatient } from '../../data/nursePatientData'

interface NurseUpdateChartsPageProps {
  patients: NursePatient[]
  setPatients: React.Dispatch<React.SetStateAction<NursePatient[]>>
}

const NurseUpdateChartsPage: React.FC<NurseUpdateChartsPageProps> = ({ patients, setPatients }) => {
  const [medicationSchedule, setMedicationSchedule] = useState<ScheduledMedication[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [editingVitals, setEditingVitals] = useState<string | null>(null)
  const [vitalSigns, setVitalSigns] = useState<{[key: string]: any}>({})
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [progressNotes, setProgressNotes] = useState<{[key: string]: string}>({})

  // Real-time updates are handled by parent NurseDashboard
  // to prevent overriding manual changes

  useEffect(() => {
    setMedicationSchedule(getMedicationSchedule())
  }, [])

  const handleVitalSignsChange = (patientId: string, field: string, value: string) => {
    setVitalSigns(prev => ({
      ...prev,
      [patientId]: {
        ...prev[patientId],
        [field]: value
      }
    }))
  }

  const handleMedicationAdminister = (medId: string) => {
    // Find the medication and update its status
    const updatedSchedule = medicationSchedule.map(med => 
      med.id === medId 
        ? { ...med, administered: true, administeredAt: new Date() }
        : med
    )
    setMedicationSchedule(updatedSchedule)
    
    const medication = medicationSchedule.find(m => m.id === medId)
    setSuccessMessage(`Medication "${medication?.name}" administered successfully to ${medication?.patientName}!`)
    setShowSuccessModal(true)
  }

  const handleSaveVitals = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    const vitals = vitalSigns[patientId]
    
    if (!vitals || !vitals.systolic || !vitals.diastolic || !vitals.heartRate || !vitals.temperature || !vitals.oxygenSaturation || !vitals.respiratoryRate) {
      alert('Please fill in all vital signs fields before saving.')
      return
    }

    // Update patient vitals - add new reading to the front of the array
    const updatedPatients = patients.map(p => 
      p.id === patientId 
        ? {
            ...p,
            vitalSigns: [
              {
                bloodPressure: {
                  systolic: parseInt(vitals.systolic),
                  diastolic: parseInt(vitals.diastolic)
                },
                heartRate: parseInt(vitals.heartRate),
                temperature: parseFloat(vitals.temperature),
                oxygenSaturation: parseInt(vitals.oxygenSaturation),
                respiratoryRate: parseInt(vitals.respiratoryRate || 16),
                status: 'normal' as const,
                timestamp: new Date(),
                nurse: 'Current Nurse'
              },
              ...p.vitalSigns // Keep existing vital signs history
            ]
          }
        : p
    )
    setPatients(updatedPatients)

    // Clear the form
    setVitalSigns(prev => {
      const newState = { ...prev }
      delete newState[patientId]
      return newState
    })
    setEditingVitals(null)

    setSuccessMessage(`Vital signs saved successfully for ${patient?.name}!`)
    setShowSuccessModal(true)
  }

  const handleSaveProgress = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    const notes = progressNotes[patientId]

    if (!notes) {
      alert('Please enter progress notes before saving.')
      return
    }

    // Update patient condition and notes
    const updatedPatients = patients.map(p => 
      p.id === patientId 
        ? {
            ...p,
            condition: notes || p.condition,
            lastUpdate: new Date()
          }
        : p
    )
    setPatients(updatedPatients)

    // Clear the form
    setProgressNotes(prev => {
      const newState = { ...prev }
      delete newState[patientId]
      return newState
    })
    setEditingNotes(null)

    setSuccessMessage(`Progress notes saved successfully for ${patient?.name}!`)
    setShowSuccessModal(true)
  }

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
                <Clipboard className="text-blue-600" size={24} />
                <h1 className="text-xl font-semibold text-gray-900">Update Charts</h1>
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
        {/* All Patients Records */}
        <div className="space-y-6">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Patient Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Room {patient.room} | {patient.age}y, {patient.gender}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(patient.priority)}`}>
                      {patient.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Current Vital Signs */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Current Vital Signs</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-600">BP</div>
                      <div className="font-semibold text-sm">
                        {patient.vitalSigns[0].bloodPressure.systolic}/{patient.vitalSigns[0].bloodPressure.diastolic}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-600">HR</div>
                      <div className="font-semibold text-sm">{patient.vitalSigns[0].heartRate}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-600">Temp</div>
                      <div className="font-semibold text-sm">{patient.vitalSigns[0].temperature}°F</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-600">O2</div>
                      <div className="font-semibold text-sm">{patient.vitalSigns[0].oxygenSaturation}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-600">RR</div>
                      <div className="font-semibold text-sm">{patient.vitalSigns[0].respiratoryRate}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Last updated: {patient.vitalSigns[0].timestamp.toLocaleString()} by {patient.vitalSigns[0].nurse}
                  </div>
                </div>

                {/* Vital Signs Update Form */}
                {editingVitals === patient.id ? (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Enter New Vital Signs:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Systolic BP</label>
                        <input
                          type="number"
                          placeholder="120"
                          value={vitalSigns[patient.id]?.systolic || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'systolic', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Diastolic BP</label>
                        <input
                          type="number"
                          placeholder="80"
                          value={vitalSigns[patient.id]?.diastolic || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'diastolic', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Heart Rate</label>
                        <input
                          type="number"
                          placeholder="72"
                          value={vitalSigns[patient.id]?.heartRate || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'heartRate', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Temperature (°F)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="98.6"
                          value={vitalSigns[patient.id]?.temperature || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'temperature', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">O2 Saturation (%)</label>
                        <input
                          type="number"
                          placeholder="98"
                          value={vitalSigns[patient.id]?.oxygenSaturation || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'oxygenSaturation', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Respiratory Rate</label>
                        <input
                          type="number"
                          placeholder="16"
                          value={vitalSigns[patient.id]?.respiratoryRate || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'respiratoryRate', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveVitals(patient.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
                      >
                        <Save size={14} className="mr-1" />
                        Save Vitals
                      </button>
                      <button
                        onClick={() => setEditingVitals(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <button
                      onClick={() => setEditingVitals(patient.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
                    >
                      <Edit3 size={14} className="mr-1" />
                      Update Vital Signs
                    </button>
                  </div>
                )}

                {/* Progress Notes */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Current Condition</h4>
                  <p className="text-sm text-gray-600 mb-3">{patient.condition}</p>
                  
                  {editingNotes === patient.id ? (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Progress Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Enter progress notes..."
                        value={progressNotes[patient.id] || ''}
                        onChange={(e) => setProgressNotes(prev => ({ ...prev, [patient.id]: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 text-sm mb-2"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveProgress(patient.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center"
                        >
                          <Save size={14} className="mr-1" />
                          Save Notes
                        </button>
                        <button
                          onClick={() => setEditingNotes(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingNotes(patient.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center"
                    >
                      <Edit3 size={14} className="mr-1" />
                      Update Progress Notes
                    </button>
                  )}
                </div>

                {/* Medication Administration */}
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Medication Administration</h4>
                  <div className="space-y-2">
                    {medicationSchedule
                      .filter(med => med.patientName === patient.name && !med.administered)
                      .map(medication => (
                        <div key={medication.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm text-gray-900">{medication.name}</h5>
                            <p className="text-xs text-gray-600">{medication.dosage} - {medication.frequency}</p>
                            <p className="text-xs text-gray-500">Scheduled: {medication.nextDose.toLocaleTimeString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              medication.urgency === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                              medication.urgency === 'DUE SOON' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {medication.urgency}
                            </span>
                            <button
                              onClick={() => handleMedicationAdminister(medication.id)}
                              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs flex items-center"
                            >
                              <CheckCircle size={12} className="mr-1" />
                              Administer
                            </button>
                          </div>
                        </div>
                      ))}
                    {medicationSchedule.filter(med => med.patientName === patient.name && !med.administered).length === 0 && (
                      <p className="text-gray-500 text-center py-2 text-sm">No pending medications for this patient</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {patients.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Clipboard className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Found</h3>
              <p className="text-gray-600">No patient records are available at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Success!</h3>
              <p className="text-gray-600 text-center mb-4">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NurseUpdateChartsPage
