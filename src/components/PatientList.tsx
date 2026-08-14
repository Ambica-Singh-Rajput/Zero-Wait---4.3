import React, { useState, useEffect } from 'react'
import { Search, Filter, Bed, User, Users, Calendar, AlertTriangle, Activity, Phone, Mail, ChevronRight, Eye, FileText } from 'lucide-react'
import { Patient } from '../types/patientTypes'
import { getMockPatients } from '../mocks/patientMockData'
import { DischargeService } from '../services/dischargeService'

const PatientList: React.FC<{ onPatientSelect: (patient: Patient) => void }> = ({ onPatientSelect }) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [filterCondition, setFilterCondition] = useState('All')
  const [dischargingPatient, setDischargingPatient] = useState<string | null>(null)

  useEffect(() => {
    // Load mock patients and filter out discharged ones
    const mockPatients = getMockPatients()
    const dischargeService = DischargeService.getInstance()
    const activePatients = dischargeService.filterActivePatients(mockPatients)
    setPatients(activePatients)
    setFilteredPatients(activePatients)
  }, [])

  const handleDischarge = async (patient: Patient) => {
    setDischargingPatient(patient.id)
    
    try {
      // Get current user (doctor) - in real app this would come from auth context
      const doctorId = 'doctor-001'
      const doctorName = 'Dr. Amit Verma'
      
      // Initiate discharge process
      const dischargeService = DischargeService.getInstance()
      const workflow = await dischargeService.initiateDischarge(patient, doctorId, doctorName)
      
      // Simulate doctor approval (in real app, this would be a separate UI step)
      await dischargeService.approveDischarge(workflow.id, 'doctor', doctorId, doctorName)
      
      // Simulate nurse approval (in real app, this would be a separate UI step)
      await dischargeService.approveDischarge(workflow.id, 'nurse', 'nurse-001', 'Nurse Sarah Johnson')
      
      // Remove patient from list immediately after discharge approval
      const updatedPatients = patients.filter(p => p.id !== patient.id)
      setPatients(updatedPatients)
      setFilteredPatients(updatedPatients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.currentAdmission.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.currentAdmission.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      ))
      
      alert(`${patient.name} has been discharged successfully and removed from the patient list!`)
    } catch (error) {
      console.error('Discharge error:', error)
      alert('Error during discharge process. Please try again.')
    } finally {
      setDischargingPatient(null)
    }
  }

  useEffect(() => {
    let filtered = patients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentAdmission.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentAdmission.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Department filter
    if (filterDepartment !== 'All') {
      filtered = filtered.filter(patient => patient.currentAdmission.department === filterDepartment)
    }

    // Condition filter
    if (filterCondition !== 'All') {
      filtered = filtered.filter(patient => patient.currentAdmission.condition === filterCondition)
    }

    setFilteredPatients(filtered)
  }, [searchTerm, filterDepartment, filterCondition, patients])

  const departments = ['All', ...Array.from(new Set(patients.map(p => p.currentAdmission.department)))]
  const conditions = ['All', 'Critical', 'Serious', 'Stable', 'Recovering']

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'Serious': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200'
      case 'Recovering': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Critical': return <AlertTriangle size={16} className="text-red-600" />
      case 'Serious': return <AlertTriangle size={16} className="text-orange-600" />
      case 'Stable': return <Activity size={16} className="text-green-600" />
      case 'Recovering': return <Activity size={16} className="text-blue-600" />
      default: return <User size={16} className="text-gray-600" />
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Users className="mr-2 text-blue-600" />
          Patient List
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {filteredPatients.length} Patients
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, bed number, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Department:</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Condition:</span>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
            onClick={() => onPatientSelect(patient)}
          >
            <div className="flex items-start justify-between">
              {/* Patient Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getConditionColor(patient.currentAdmission.condition)}`}>
                    {getConditionIcon(patient.currentAdmission.condition)}
                    <span>{patient.currentAdmission.condition}</span>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Bed size={16} className="text-gray-500" />
                    <span className="text-gray-700">Bed: <strong>{patient.currentAdmission.bedNumber}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-700">Admitted: <strong>{patient.currentAdmission.admissionDate.toLocaleDateString()}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle size={16} className="text-gray-500" />
                    <span className="text-gray-700">Dept: <strong>{patient.currentAdmission.department}</strong></span>
                  </div>
                </div>

                {/* Primary Diagnosis */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Primary Diagnosis:</p>
                  <p className="text-sm text-gray-600">{patient.currentAdmission.primaryDiagnosis}</p>
                </div>

                {/* Contact Info */}
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone size={14} />
                    <span>{patient.contactNumber}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{patient.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPatientSelect(patient)
                  }}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDischarge(patient)
                  }}
                  disabled={dischargingPatient === patient.id}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText size={16} />
                  <span>{dischargingPatient === patient.id ? 'Discharging...' : 'Discharge'}</span>
                </button>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600">No patients found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default PatientList
