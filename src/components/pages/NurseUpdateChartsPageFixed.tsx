import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clipboard, Heart, Thermometer, Wind, Droplets, Activity, Save, X, CheckCircle } from 'lucide-react'
import { nursePatients, getMedicationSchedule, getRealTimeUpdates, ScheduledMedication, NursePatient } from '../../data/nursePatientData'

interface NurseUpdateChartsPageProps {
  patients: NursePatient[]
  setPatients: React.Dispatch<React.SetStateAction<NursePatient[]>>
}

const NurseUpdateChartsPage: React.FC<NurseUpdateChartsPageProps> = ({ patients, setPatients }) => {
  const [medicationSchedule, setMedicationSchedule] = useState<ScheduledMedication[]>([])
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Real-time updates are handled by parent NurseDashboard
  // to prevent overriding manual changes

  useEffect(() => {
    setMedicationSchedule(getMedicationSchedule())
  }, [])

  // Form states
  const [vitalSigns, setVitalSigns] = useState<{[key: string]: any}>({})
  const [medicationNotes, setMedicationNotes] = useState<{[key: string]: string}>({})
  const [progressNotes, setProgressNotes] = useState<{[key: string]: string}>({})
  const [patientStatus, setPatientStatus] = useState<{[key: string]: string}>({})

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

    setSuccessMessage(`Vital signs saved successfully for ${patient?.name}!`)
    setShowSuccessModal(true)
  }

  const handleSaveProgress = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    const status = patientStatus[patientId]
    const notes = progressNotes[patientId]

    if (!status && !notes) {
      alert('Please enter status or progress notes before saving.')
      return
    }

    // Update patient condition and notes
    const updatedPatients = patients.map(p => 
      p.id === patientId 
        ? {
            ...p,
            condition: notes || p.condition,
            status: (status as any) || p.status,
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
    setPatientStatus(prev => {
      const newState = { ...prev }
      delete newState[patientId]
      return newState
    })

    setSuccessMessage(`Progress notes saved successfully for ${patient?.name}!`)
    setShowSuccessModal(true)
  }

  const handleMedicationNoteChange = (patientId: string, value: string) => {
    setMedicationNotes(prev => ({
      ...prev,
      [patientId]: value
    }))
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
            {/* Vital Signs Entry */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Vital Signs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={vitalSigns[selectedPatient.id]?.systolic || ''}
                    onChange={(e) => handleVitalSignsChange(selectedPatient.id, 'systolic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={vitalSigns[selectedPatient.id]?.diastolic || ''}
                    onChange={(e) => handleVitalSignsChange(selectedPatient.id, 'diastolic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                  <input
                    type="number"
                    placeholder="72"
                    value={vitalSigns[selectedPatient.id]?.heartRate || ''}
                    onChange={(e) => handleVitalSignsChange(selectedPatient.id, 'heartRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={vitalSigns[selectedPatient.id]?.temperature || ''}
                    onChange={(e) => handleVitalSignsChange(selectedPatient.id, 'temperature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O2 Saturation (%)</label>
                  <input
                    type="number"
                    placeholder="98"
                    value={vitalSigns[selectedPatient.id]?.oxygenSaturation || ''}
                    onChange={(e) => handleVitalSignsChange(selectedPatient.id, 'oxygenSaturation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
                  <input
                    type="number"
                    placeholder="16"
                    value={vitalSigns[selectedPatient.id]?.respiratoryRate || ''}
                    onChange={(e) => handleVitalSignsChange(selectedPatient.id, 'respiratoryRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveVitals(selectedPatient.id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save size={16} className="mr-2" />
                Save Vital Signs
              </button>
            </div>

            {/* Medication Administration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Medication Administration</h2>
              <div className="space-y-4">
                {medicationSchedule
                  .filter(med => med.patientName === selectedPatient.name && !med.administered)
                  .map(medication => (
                    <div key={medication.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                        <p className="text-sm text-gray-500">Scheduled: {medication.nextDose.toLocaleTimeString()}</p>
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
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Administer
                        </button>
                      </div>
                    </div>
                  ))}
                {medicationSchedule.filter(med => med.patientName === selectedPatient.name && !med.administered).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No pending medications for this patient</p>
                )}
              </div>
            </div>

            {/* Progress Notes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment Progress</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Status</label>
                  <select
                    value={patientStatus[selectedPatient.id] || ''}
                    onChange={(e) => setPatientStatus(prev => ({ ...prev, [selectedPatient.id]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select status...</option>
                    <option value="stable">Stable</option>
                    <option value="improving">Improving</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed progress notes..."
                    value={progressNotes[selectedPatient.id] || ''}
                    onChange={(e) => setProgressNotes(prev => ({ ...prev, [selectedPatient.id]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => handleSaveProgress(selectedPatient.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Progress Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {!selectedPatient && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Clipboard className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
            <p className="text-gray-600">Choose a patient from the dropdown to update their charts and vital signs.</p>
          </div>
        )}
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
