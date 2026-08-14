import React, { useState, useEffect } from 'react'
import { ArrowLeft, Activity, AlertCircle, TrendingUp, Heart, Thermometer, Droplets, Wind } from 'lucide-react'
import { nursePatients, getRealTimeUpdates, NursePatient } from '../../data/nursePatientData'

const NurseVitalSignsPage: React.FC = () => {
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPatients = getRealTimeUpdates()
      setPatients(updatedPatients)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'normal': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const criticalPatients = patients.filter(p => p.vitalSigns[0].status === 'critical')
  const warningPatients = patients.filter(p => p.vitalSigns[0].status === 'warning')
  const normalPatients = patients.filter(p => p.vitalSigns[0].status === 'normal')

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
                <Activity className="text-orange-600" size={24} />
                <h1 className="text-xl font-semibold text-gray-900">Vital Signs Monitoring</h1>
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
        {/* Critical Alerts */}
        {criticalPatients.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="text-red-600" size={24} />
                <h2 className="text-xl font-semibold text-red-800">Critical Alerts</h2>
                <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                  {criticalPatients.length}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {criticalPatients.map(patient => (
                  <div key={patient.id} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">Room {patient.room}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-semibold">
                        CRITICAL
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-gray-500 text-xs">BP</div>
                        <div className="font-semibold text-red-600">
                          {patient.vitalSigns[0].bloodPressure.systolic}/{patient.vitalSigns[0].bloodPressure.diastolic}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs">HR</div>
                        <div className="font-semibold text-red-600">{patient.vitalSigns[0].heartRate}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs">Temp</div>
                        <div className="font-semibold">{patient.vitalSigns[0].temperature}°F</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs">O2</div>
                        <div className="font-semibold text-red-600">{patient.vitalSigns[0].oxygenSaturation}%</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      {patient.vitalSigns[0].timestamp.toLocaleTimeString()} by {patient.vitalSigns[0].nurse}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <Activity className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Normal</p>
                <p className="text-3xl font-bold text-green-700">{normalPatients.length}</p>
              </div>
              <Heart className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Warning</p>
                <p className="text-3xl font-bold text-yellow-700">{warningPatients.length}</p>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Critical</p>
                <p className="text-3xl font-bold text-red-700">{criticalPatients.length}</p>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div key={patient.id} className={`rounded-xl border ${getStatusColor(patient.vitalSigns[0].status)}`}>
              <div className="p-6">
                {/* Patient Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Room {patient.room}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    patient.vitalSigns[0].status === 'critical' ? 'bg-red-600 text-white' :
                    patient.vitalSigns[0].status === 'warning' ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {patient.vitalSigns[0].status.toUpperCase()}
                  </span>
                </div>

                {/* Vital Signs Display */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <Heart size={16} />
                        <span>Blood Pressure</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {patient.vitalSigns[0].bloodPressure.systolic}/{patient.vitalSigns[0].bloodPressure.diastolic}
                      </div>
                      <div className="text-xs text-gray-500">mmHg</div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <Heart size={16} />
                        <span>Heart Rate</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{patient.vitalSigns[0].heartRate}</div>
                      <div className="text-xs text-gray-500">bpm</div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <Thermometer size={16} />
                        <span>Temperature</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{patient.vitalSigns[0].temperature}°F</div>
                      <div className="text-xs text-gray-500">Fahrenheit</div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <Droplets size={16} />
                        <span>O2 Saturation</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{patient.vitalSigns[0].oxygenSaturation}%</div>
                      <div className="text-xs text-gray-500">Saturation</div>
                    </div>
                  </div>

                  {/* Respiratory Rate */}
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Wind size={16} />
                      <span>Respiratory Rate</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{patient.vitalSigns[0].respiratoryRate}</div>
                    <div className="text-xs text-gray-500">breaths/min</div>
                  </div>

                  {/* Trend Information */}
                  {patient.vitalSigns.length > 1 && (
                    <div className="bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <TrendingUp size={16} />
                        <span>Previous Reading</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <div>BP: {patient.vitalSigns[1].bloodPressure.systolic}/{patient.vitalSigns[1].bloodPressure.diastolic} mmHg</div>
                        <div>HR: {patient.vitalSigns[1].heartRate} bpm</div>
                        <div>Temp: {patient.vitalSigns[1].temperature}°F</div>
                        <div>O2: {patient.vitalSigns[1].oxygenSaturation}%</div>
                      </div>
                    </div>
                  )}

                  {/* Nurse Information */}
                  <div className="text-xs text-gray-600 bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span>Last recorded: {patient.vitalSigns[0].timestamp.toLocaleString()}</span>
                      <span>by {patient.vitalSigns[0].nurse}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-300 flex space-x-2">
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                    Update Vitals
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NurseVitalSignsPage
