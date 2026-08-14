import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clipboard, Heart, Thermometer, Wind, Droplets, Activity, Save, X } from 'lucide-react'
import { nursePatients, getMedicationSchedule, getRealTimeUpdates, ScheduledMedication, NursePatient } from '../../data/nursePatientData'

const NurseUpdateChartsPage: React.FC = () => {
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [medicationSchedule, setMedicationSchedule] = useState<ScheduledMedication[]>([])
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPatients = getRealTimeUpdates()
      setPatients(updatedPatients)
      setMedicationSchedule(getMedicationSchedule())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
    // In a real app, this would call the API
    console.log(`Administering medication: ${medId}`)
  }

  const handleSaveVitals = (patientId: string) => {
    // In a real app, this would save to the database
    console.log(`Saving vitals for patient: ${patientId}`, vitalSigns[patientId])
    // Clear the form
    setVitalSigns(prev => {
      const newState = { ...prev }
      delete newState[patientId]
      return newState
    })
  }

  const handleSaveProgress = (patientId: string) => {
    // In a real app, this would save to the database
    console.log(`Saving progress for patient: ${patientId}`, {
      status: patientStatus[patientId],
      notes: progressNotes[patientId]
    })
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
        {/* Vital Signs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Heart className="mr-3 text-red-600" size={28} />
            Record Vital Signs
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  {/* Patient Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Room {patient.room}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.vitalSigns[0].status === 'critical' ? 'bg-red-100 text-red-700' :
                        patient.vitalSigns[0].status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {patient.vitalSigns[0].status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Current Vitals Display */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-2">Current Readings</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">BP</div>
                        <div className="font-semibold">
                          {patient.vitalSigns[0].bloodPressure.systolic}/{patient.vitalSigns[0].bloodPressure.diastolic}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">HR</div>
                        <div className="font-semibold">{patient.vitalSigns[0].heartRate}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Temp</div>
                        <div className="font-semibold">{patient.vitalSigns[0].temperature}°F</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">O2</div>
                        <div className="font-semibold">{patient.vitalSigns[0].oxygenSaturation}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs Form */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Enter New Readings:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">BP (Systolic/Diastolic)</label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="120"
                            value={vitalSigns[patient.id]?.systolic || ''}
                            onChange={(e) => handleVitalSignsChange(patient.id, 'systolic', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="number"
                            placeholder="80"
                            value={vitalSigns[patient.id]?.diastolic || ''}
                            onChange={(e) => handleVitalSignsChange(patient.id, 'diastolic', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Heart Rate</label>
                        <input
                          type="number"
                          placeholder="72"
                          value={vitalSigns[patient.id]?.heartRate || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'heartRate', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Temperature (°F)</label>
                        <input
                          type="number"
                          placeholder="98.6"
                          value={vitalSigns[patient.id]?.temperature || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'temperature', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">O2 Saturation (%)</label>
                        <input
                          type="number"
                          placeholder="98"
                          value={vitalSigns[patient.id]?.oxygenSaturation || ''}
                          onChange={(e) => handleVitalSignsChange(patient.id, 'oxygenSaturation', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Respiratory Rate</label>
                      <input
                        type="number"
                        placeholder="16"
                        value={vitalSigns[patient.id]?.respiratoryRate || ''}
                        onChange={(e) => handleVitalSignsChange(patient.id, 'respiratoryRate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Progress Notes</label>
                      <textarea
                        value={vitalSigns[patient.id]?.notes || ''}
                        onChange={(e) => handleVitalSignsChange(patient.id, 'notes', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        rows={2}
                        placeholder="Patient progress and observations..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleSaveVitals(patient.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Save size={16} className="mr-1" />
                      Save Vitals
                    </button>
                    <button
                      onClick={() => {
                        setVitalSigns(prev => {
                          const newState = { ...prev }
                          delete newState[patient.id]
                          return newState
                        })
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 flex items-center justify-center"
                    >
                      <X size={16} className="mr-1" />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medication Administration Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="mr-3 text-emerald-600" size={28} />
            Medication Administration
          </h2>
          <div className="space-y-4">
            {medicationSchedule.slice(0, 6).map((med) => (
              <div key={med.id} className={`rounded-lg border ${
                med.urgency === 'OVERDUE' ? 'border-red-200 bg-red-50' :
                med.urgency === 'DUE SOON' ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-200 bg-white'
              }`}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-gray-900">{med.patientName}</span>
                        <span className="text-sm text-gray-600">Room {med.patientRoom}</span>
                        {med.urgency === 'OVERDUE' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-semibold">
                            OVERDUE
                          </span>
                        )}
                        {med.urgency === 'DUE SOON' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-semibold">
                            DUE SOON
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        {med.name} - {med.dosage} ({med.route}) - {med.frequency}
                      </div>
                      <div className="text-xs text-gray-500">
                        Next dose: {new Date(med.nextDose).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMedicationAdminister(med.id)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                      >
                        Administer
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Progress Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Clipboard className="mr-3 text-purple-600" size={28} />
            Treatment Progress
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.slice(0, 6).map((patient) => (
              <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  {/* Patient Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Room {patient.room}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'critical' ? 'bg-red-100 text-red-700' :
                      patient.status === 'stable' ? 'bg-green-100 text-green-700' :
                      patient.status === 'improving' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {patient.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Progress Form */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Current Status</label>
                      <select
                        value={patientStatus[patient.id] || patient.status}
                        onChange={(e) => setPatientStatus(prev => ({
                          ...prev,
                          [patient.id]: e.target.value
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="stable">Stable</option>
                        <option value="improving">Improving</option>
                        <option value="declining">Declining</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Progress Notes</label>
                      <textarea
                        value={progressNotes[patient.id] || ''}
                        onChange={(e) => setProgressNotes(prev => ({
                          ...prev,
                          [patient.id]: e.target.value
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        rows={3}
                        placeholder="Detailed progress notes..."
                      ></textarea>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="mb-1">Condition: {patient.condition}</div>
                      <div>Attending: {patient.attendingDoctor}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleSaveProgress(patient.id)}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center justify-center"
                    >
                      <Save size={16} className="mr-1" />
                      Update Progress
                    </button>
                    <button
                      onClick={() => {
                        setProgressNotes(prev => {
                          const newState = { ...prev }
                          delete newState[patient.id]
                          return newState
                        })
                        setPatientStatus(prev => {
                          const newState = { ...prev }
                          delete newState[patient.id]
                          return newState
                        })
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 flex items-center justify-center"
                    >
                      <X size={16} className="mr-1" />
                      Clear
                    </button>
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

export default NurseUpdateChartsPage
