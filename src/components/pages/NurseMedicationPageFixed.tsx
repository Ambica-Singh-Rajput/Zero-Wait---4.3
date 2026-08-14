import React, { useState, useEffect } from 'react'
import { ArrowLeft, Pill, AlertCircle, Clock, CheckCircle, Calendar, User, Filter } from 'lucide-react'
import { nursePatients, getMedicationSchedule, getRealTimeUpdates, ScheduledMedication, NursePatient } from '../../data/nursePatientData'

const NurseMedicationPage: React.FC = () => {
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [medicationSchedule, setMedicationSchedule] = useState<ScheduledMedication[]>([])
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due-soon'>('all')
  const [administeredMedications, setAdministeredMedications] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load initial medication schedule
    const initialSchedule = getMedicationSchedule()
    setMedicationSchedule(initialSchedule)
    
    const interval = setInterval(() => {
      const updatedPatients = getRealTimeUpdates()
      setPatients(updatedPatients)
      
      // Only update schedule for non-administered medications
      setMedicationSchedule(prev => {
        const freshSchedule = getMedicationSchedule()
        return freshSchedule.map(med => {
          const administeredMed = prev.find(m => m.id === med.id)
          if (administeredMed && administeredMed.administered) {
            return administeredMed // Keep administered state
          }
          return med // Use fresh data for non-administered
        })
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAdministerMedication = (medicationId: string) => {
    console.log('Administering medication:', medicationId)
    
    // Mark medication as administered in our local state
    setAdministeredMedications(prev => new Set([...prev, medicationId]))
    
    // Update the medication schedule to show administered state
    setMedicationSchedule(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { 
              ...med, 
              administered: true, 
              administeredAt: new Date()
            }
          : med
      )
    )

    // Show success feedback
    const medication = medicationSchedule.find(med => med.id === medicationId)
    if (medication) {
      console.log(`Successfully administered ${medication.name} to ${medication.patientName}`)
    }
  }

  const handleRescheduleMedication = (medicationId: string) => {
    console.log('Rescheduling medication:', medicationId)
    
    // Update the medication schedule with a new time (1 hour from now)
    const newTime = new Date()
    newTime.setHours(newTime.getHours() + 1)
    
    setMedicationSchedule(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, nextDose: newTime, urgency: 'DUE SOON' }
          : med
      )
    )
  }

  const filteredMedications = medicationSchedule.filter(med => {
    if (filter === 'all') return true
    if (filter === 'overdue') return med.urgency === 'OVERDUE'
    if (filter === 'due-soon') return med.urgency === 'DUE SOON'
    return true
  })

  const overdueCount = medicationSchedule.filter(m => m.urgency === 'OVERDUE' && !m.administered).length
  const dueSoonCount = medicationSchedule.filter(m => m.urgency === 'DUE SOON' && !m.administered).length

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
                <Pill className="text-emerald-600" size={24} />
                <h1 className="text-xl font-semibold text-gray-900">Medication Administration</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock size={16} />
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
              <h3 className="text-lg font-semibold text-red-800">Overdue</h3>
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-red-700 mb-2">{overdueCount}</p>
            <p className="text-sm text-red-600">Require immediate attention</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-800">Due Soon</h3>
              <Clock className="text-yellow-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-yellow-700 mb-2">{dueSoonCount}</p>
            <p className="text-sm text-yellow-600">Within next 2 hours</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">Administered</h3>
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-700 mb-2">{administeredMedications.size}</p>
            <p className="text-sm text-green-600">Completed today</p>
          </div>
        </div>

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
              All ({medicationSchedule.length})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'overdue' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setFilter('due-soon')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'due-soon' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Due Soon ({dueSoonCount})
            </button>
          </div>
        </div>

        {/* Overdue Medications Alert */}
        {overdueCount > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="text-red-600" size={20} />
                <h3 className="font-semibold text-red-800">Overdue Medications</h3>
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                  {overdueCount}
                </span>
              </div>
              <div className="space-y-2">
                {medicationSchedule.filter(m => m.urgency === 'OVERDUE' && !m.administered).map((med) => (
                  <div key={med.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{med.patientName}</span>
                        <span className="text-sm text-gray-600">Room {med.patientRoom}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-semibold">
                          OVERDUE
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {med.name} - {med.dosage} ({med.route})
                      </div>
                      <div className="text-xs text-gray-500">
                        Scheduled: {new Date(med.nextDose).toLocaleString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAdministerMedication(med.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center"
                    >
                      <Pill size={14} className="mr-1" />
                      Administer Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medication Schedule */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Scheduled Medications</h2>
          {filteredMedications.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMedications.map((med) => (
                <div key={med.id} className={`rounded-lg border ${
                  med.administered ? 'border-green-200 bg-green-50' :
                  med.urgency === 'OVERDUE' ? 'border-red-200 bg-red-50' :
                  med.urgency === 'DUE SOON' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-white'
                }`}>
                  <div className="p-6">
                    {/* Medication Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{med.patientName}</h3>
                          <span className="text-sm text-gray-600">Room {med.patientRoom}</span>
                          {med.administered ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                              ADMINISTERED
                            </span>
                          ) : med.urgency === 'OVERDUE' ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                              OVERDUE
                            </span>
                          ) : med.urgency === 'DUE SOON' ? (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">
                              DUE SOON
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Medication Details */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Medication:</span>
                          <div className="font-semibold text-gray-900">{med.name}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Dosage:</span>
                          <div className="text-gray-900">{med.dosage}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Route:</span>
                          <div className="text-gray-900">{med.route}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Frequency:</span>
                          <div className="text-gray-900">{med.frequency}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-500 text-sm">Next Dose:</span>
                        <div className="text-sm font-semibold text-gray-900 mt-1">
                          {new Date(med.nextDose).toLocaleString()}
                        </div>
                      </div>

                      {med.notes && (
                        <div>
                          <span className="text-gray-500 text-sm">Notes:</span>
                          <div className="text-sm text-gray-700 mt-1 bg-white bg-opacity-50 rounded p-2">
                            {med.notes}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-gray-600">
                        Prescribed by: {med.prescribedBy}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {med.administered ? (
                        <div className="flex items-center justify-center p-3 bg-green-100 rounded-lg">
                          <CheckCircle className="text-green-600 mr-2" size={20} />
                          <span className="text-green-800 font-medium">Medication Administered</span>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAdministerMedication(med.id)}
                            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Pill size={16} className="mr-1" />
                            Administer
                          </button>
                          <button 
                            onClick={() => handleRescheduleMedication(med.id)}
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                          >
                            Reschedule
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Pill size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No medications scheduled for the selected filter</p>
            </div>
          )}
        </div>

        {/* All Patient Medications */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Patient Medications</h2>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <span className="text-sm text-gray-600">Room {patient.room}</span>
                </div>
                <div className="space-y-2">
                  {patient.currentMedications.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{med.name}</div>
                        <div className="text-sm text-gray-600">{med.dosage} - {med.frequency}</div>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NurseMedicationPage
