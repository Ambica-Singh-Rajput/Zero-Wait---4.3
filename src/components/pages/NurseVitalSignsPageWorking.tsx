import React, { useState, useEffect } from 'react'
import { ArrowLeft, Activity, AlertCircle, TrendingUp, Heart, Thermometer, Droplets, Wind, CheckCircle, X } from 'lucide-react'
import { nursePatients, getRealTimeUpdates, NursePatient } from '../../data/nursePatientData'

const NurseVitalSignsPage: React.FC = () => {
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

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

  const handleViewDetails = (patient: NursePatient) => {
    setSelectedPatient(patient)
    setShowDetailsModal(true)
  }

  const handleSetAlert = (patient: NursePatient) => {
    setSelectedPatient(patient)
    setAlertMessage(`Alert set for ${patient.name}. Nurses will be notified of any significant changes in vital signs.`)
    setShowAlertModal(true)
  }

  const handleExportData = (patient: NursePatient) => {
    setSelectedPatient(patient)
    setAlertMessage(`Vital signs data for ${patient.name} exported successfully. Data includes all readings from the past 24 hours with trend analysis.`)
    setShowAlertModal(true)
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-800">Critical Patients</h3>
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-red-700 mb-2">{criticalPatients.length}</p>
            <p className="text-sm text-red-600">Require immediate attention</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-800">Warning</h3>
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-yellow-700 mb-2">{warningPatients.length}</p>
            <p className="text-sm text-yellow-600">Need monitoring</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">Normal</h3>
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-700 mb-2">{normalPatients.length}</p>
            <p className="text-sm text-green-600">Stable condition</p>
          </div>
        </div>

        {/* Critical Patients Alert */}
        {criticalPatients.length > 0 && (
          <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-600" size={20} />
              <h3 className="text-red-800 font-semibold">Critical Alert</h3>
            </div>
            <p className="text-red-700 mt-1">
              {criticalPatients.length} patient(s) require immediate attention. Check vital signs below.
            </p>
          </div>
        )}

        {/* Patient Vital Signs */}
        <div className="space-y-6">
          {patients.map((patient) => (
            <div key={patient.id} className={`bg-white rounded-xl shadow-lg border overflow-hidden ${getStatusColor(patient.vitalSigns[0].status)}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Room {patient.room} | {patient.age}y, {patient.gender}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    patient.vitalSigns[0].status === 'critical' ? 'bg-red-100 text-red-700' :
                    patient.vitalSigns[0].status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {patient.vitalSigns[0].status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="text-red-500" size={16} />
                      <span className="text-sm text-gray-600">Blood Pressure</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {patient.vitalSigns[0].bloodPressure.systolic}/{patient.vitalSigns[0].bloodPressure.diastolic}
                    </p>
                    <p className="text-xs text-gray-500">mmHg</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="text-blue-500" size={16} />
                      <span className="text-sm text-gray-600">Heart Rate</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{patient.vitalSigns[0].heartRate}</p>
                    <p className="text-xs text-gray-500">bpm</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="text-orange-500" size={16} />
                      <span className="text-sm text-gray-600">Temperature</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{patient.vitalSigns[0].temperature}°F</p>
                    <p className="text-xs text-gray-500">Fahrenheit</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wind className="text-teal-500" size={16} />
                      <span className="text-sm text-gray-600">O2 Saturation</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{patient.vitalSigns[0].oxygenSaturation}%</p>
                    <p className="text-xs text-gray-500">SpO2</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewDetails(patient)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
                  >
                    <TrendingUp size={16} className="mr-2" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleSetAlert(patient)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center text-sm"
                  >
                    <AlertCircle size={16} className="mr-2" />
                    Set Alert
                  </button>
                  <button
                    onClick={() => handleExportData(patient)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm"
                  >
                    <Activity size={16} className="mr-2" />
                    Export Data
                  </button>
                </div>

                {/* Last Update */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Last updated: {patient.vitalSigns[0].timestamp.toLocaleString()} by {patient.vitalSigns[0].nurse}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Vital Signs Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPatient.name}</h3>
                <p className="text-sm text-gray-600">Room {selectedPatient.room} | {selectedPatient.age}y, {selectedPatient.gender}</p>
              </div>

              <div className="space-y-6">
                {/* Current Readings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Current Readings</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Blood Pressure</div>
                      <div className="text-xl font-bold text-gray-900">
                        {selectedPatient.vitalSigns[0].bloodPressure.systolic}/{selectedPatient.vitalSigns[0].bloodPressure.diastolic}
                      </div>
                      <div className="text-xs text-gray-500">mmHg</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Heart Rate</div>
                      <div className="text-xl font-bold text-gray-900">{selectedPatient.vitalSigns[0].heartRate}</div>
                      <div className="text-xs text-gray-500">bpm</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Temperature</div>
                      <div className="text-xl font-bold text-gray-900">{selectedPatient.vitalSigns[0].temperature}°F</div>
                      <div className="text-xs text-gray-500">Fahrenheit</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">O2 Saturation</div>
                      <div className="text-xl font-bold text-gray-900">{selectedPatient.vitalSigns[0].oxygenSaturation}%</div>
                      <div className="text-xs text-gray-500">SpO2</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Respiratory Rate</div>
                      <div className="text-xl font-bold text-gray-900">{selectedPatient.vitalSigns[0].respiratoryRate}</div>
                      <div className="text-xs text-gray-500">breaths/min</div>
                    </div>
                  </div>
                </div>

                {/* Historical Data */}
                {selectedPatient.vitalSigns.length > 1 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Historical Data</h4>
                    <div className="space-y-3">
                      {selectedPatient.vitalSigns.slice(1, 5).map((vital, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              Reading #{selectedPatient.vitalSigns.length - index}
                            </span>
                            <span className="text-xs text-gray-500">
                              {vital.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>BP: {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic} mmHg</div>
                            <div>HR: {vital.heartRate} bpm</div>
                            <div>Temp: {vital.temperature}°F</div>
                            <div>O2: {vital.oxygenSaturation}%</div>
                            <div>RR: {vital.respiratoryRate} breaths/min</div>
                            <div>by {vital.nurse}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trend Analysis */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Trend Analysis</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Analysis:</strong> {selectedPatient.name}'s vital signs have been {selectedPatient.vitalSigns[0].status} 
                      over the last {selectedPatient.vitalSigns.length} readings. 
                      {selectedPatient.vitalSigns[0].status === 'normal' 
                        ? ' All parameters are within normal ranges.'
                        : selectedPatient.vitalSigns[0].status === 'warning'
                        ? ' Some parameters require monitoring.'
                        : ' Immediate attention required.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-4">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Alert Set</h3>
              <p className="text-gray-600 text-center mb-4">{alertMessage}</p>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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

export default NurseVitalSignsPage
