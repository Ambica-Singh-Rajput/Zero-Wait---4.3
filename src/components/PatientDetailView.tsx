import React, { useState } from 'react'
import { ArrowLeft, User, Calendar, Phone, Mail, Bed, AlertTriangle, Activity, FileText, Pill, TestTube, Heart, Stethoscope, Clock, MapPin, Download, Edit, Plus, Send, CheckCircle } from 'lucide-react'
import { Patient } from '../types/patientTypes'
import { DischargeWorkflow } from '../types/dischargeTypes'
import { DischargeService } from '../services/dischargeService'
import DischargeApprovalModal from './DischargeApprovalModal'
import { useAuth } from '../context/AuthContext'

interface PatientDetailViewProps {
  patient: Patient
  onBack: () => void
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack }) => {
  const { state: authState } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'medications' | 'reports' | 'treatment'>('overview')
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [currentDischargeWorkflow, setCurrentDischargeWorkflow] = useState<DischargeWorkflow | null>(null)
  const [isInitiatingDischarge, setIsInitiatingDischarge] = useState(false)

  const handleInitiateDischarge = async () => {
    if (!authState.user) {
      console.log('No authenticated user found')
      return
    }

    console.log('Initiating discharge for patient:', patient.name)
    setIsInitiatingDischarge(true)
    try {
      const dischargeService = DischargeService.getInstance()
      console.log('Calling discharge service...')
      const workflow = await dischargeService.initiateDischarge(
        patient,
        authState.user.id,
        `${authState.user.firstName} ${authState.user.lastName}`
      )
      
      console.log('Discharge workflow created:', workflow)
      setCurrentDischargeWorkflow(workflow)
      setShowDischargeModal(true)
    } catch (error) {
      console.error('Failed to initiate discharge:', error)
    } finally {
      setIsInitiatingDischarge(false)
    }
  }

  const handleDischargeApprovalComplete = (workflow: DischargeWorkflow) => {
    setCurrentDischargeWorkflow(workflow)
    // Update UI to show discharge status
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'Serious': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200'
      case 'Recovering': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="mr-2 text-blue-600" />
          Current Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Condition</p>
            <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(patient.currentAdmission.condition)}`}>
              {patient.currentAdmission.condition}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pain Level</p>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < patient.currentStatus.painLevel ? 'bg-red-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{patient.currentStatus.painLevel}/10</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Activity Level</p>
            <p className="font-medium">{patient.currentStatus.activityLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Diet Type</p>
            <p className="font-medium">{patient.currentStatus.diet.type}</p>
          </div>
        </div>
      </div>

      {/* Current Vitals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Heart className="mr-2 text-red-600" />
          Current Vitals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Blood Pressure</p>
            <p className="text-lg font-semibold">{patient.currentStatus.vitals.bloodPressure.systolic}/{patient.currentStatus.vitals.bloodPressure.diastolic}</p>
            <p className="text-xs text-gray-500">mmHg</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Heart Rate</p>
            <p className="text-lg font-semibold">{patient.currentStatus.vitals.heartRate.value}</p>
            <p className="text-xs text-gray-500">bpm</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-lg font-semibold">{patient.currentStatus.vitals.temperature.value}°F</p>
            <p className="text-xs text-gray-500">Fahrenheit</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">O2 Saturation</p>
            <p className="text-lg font-semibold">{patient.currentStatus.vitals.oxygenSaturation.value}%</p>
            <p className="text-xs text-gray-500">SpO2</p>
          </div>
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Pill className="mr-2 text-purple-600" />
          Current Medications
        </h3>
        <div className="space-y-3">
          {patient.currentStatus.currentMedications.map(med => (
            <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage} - {med.frequency} ({med.route})</p>
                <p className="text-xs text-gray-500">Prescribed by {med.prescribedBy}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next dose:</p>
                <p className="text-sm font-medium">{med.nextDose?.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diet Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2 text-green-600" />
          Diet Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Diet Type</p>
            <p className="font-medium">{patient.currentStatus.diet.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Restrictions</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {patient.currentStatus.diet.restrictions.map((restriction, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  {restriction}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Special Instructions</p>
            <p className="text-sm">{patient.currentStatus.diet.specialInstructions}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-6">
      {/* Admission History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="mr-2 text-blue-600" />
          Admission History
        </h3>
        <div className="space-y-4">
          {patient.medicalHistory.admissionHistory.map(admission => (
            <div key={admission.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{admission.reason}</p>
                  <p className="text-sm text-gray-600">Department: {admission.department}</p>
                  <p className="text-sm text-gray-600">Bed: {admission.bedNumber}</p>
                  <p className="text-sm text-gray-600">Doctor: {admission.attendingDoctor}</p>
                  <p className="text-sm text-gray-600">Diagnosis: {admission.diagnosis}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{admission.admissionDate.toLocaleDateString()}</p>
                  {admission.dischargeDate && (
                    <p className="text-xs text-gray-500">Discharged: {admission.dischargeDate.toLocaleDateString()}</p>
                  )}
                  {admission.lengthOfStay && (
                    <p className="text-xs text-gray-500">LOS: {admission.lengthOfStay} days</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Surgery History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Stethoscope className="mr-2 text-purple-600" />
          Surgery History
        </h3>
        <div className="space-y-4">
          {patient.medicalHistory.surgeries.map(surgery => (
            <div key={surgery.id} className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{surgery.surgeryType}</p>
                  <p className="text-sm text-gray-600">Surgeon: {surgery.surgeon}</p>
                  <p className="text-sm text-gray-600">Hospital: {surgery.hospital}</p>
                  <p className="text-sm text-gray-600">Anesthesia: {surgery.anesthesia}</p>
                  <p className="text-sm text-gray-600">Duration: {surgery.duration}</p>
                  {surgery.notes && <p className="text-sm text-gray-600">Notes: {surgery.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{surgery.surgeryDate.toLocaleDateString()}</p>
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    surgery.outcome === 'Successful' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {surgery.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medication History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Pill className="mr-2 text-green-600" />
          Medication History
        </h3>
        <div className="space-y-3">
          {patient.medicalHistory.medications.map(med => (
            <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{med.medicationName}</p>
                <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                <p className="text-sm text-gray-600">Purpose: {med.purpose}</p>
                <p className="text-xs text-gray-500">Prescribed by {med.prescribedBy}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{med.startDate.toLocaleDateString()}</p>
                {med.endDate && <p className="text-xs text-gray-500">to {med.endDate.toLocaleDateString()}</p>}
                <p className={`text-xs px-2 py-1 rounded-full ${
                  med.effectiveness === 'Excellent' ? 'bg-green-100 text-green-800' : 
                  med.effectiveness === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {med.effectiveness}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMedications = () => (
    <div className="space-y-6">
      {/* Current Medications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Pill className="mr-2 text-purple-600" />
          Current Medications
        </h3>
        <div className="space-y-4">
          {patient.currentStatus.currentMedications.map(med => (
            <div key={med.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{med.name}</h4>
                  <p className="text-gray-600">{med.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{med.dosage}</p>
                  <p className="text-sm text-gray-600">{med.frequency}</p>
                  <p className="text-sm text-gray-600">{med.route}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Started:</p>
                  <p>{med.startDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Prescribed by:</p>
                  <p>{med.prescribedBy}</p>
                </div>
                {med.nextDose && (
                  <div>
                    <p className="text-gray-600">Next dose:</p>
                    <p>{med.nextDose.toLocaleString()}</p>
                  </div>
                )}
                {med.specialInstructions && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Special instructions:</p>
                    <p className="text-orange-600">{med.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medication History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="mr-2 text-blue-600" />
          Previous Medications
        </h3>
        <div className="space-y-3">
          {patient.medicalHistory.medications.map(med => (
            <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{med.medicationName}</p>
                <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                <p className="text-sm text-gray-600">Purpose: {med.purpose}</p>
                <p className="text-xs text-gray-500">Prescribed by {med.prescribedBy}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{med.startDate.toLocaleDateString()}</p>
                {med.endDate && <p className="text-xs text-gray-500">to {med.endDate.toLocaleDateString()}</p>}
                <p className={`text-xs px-2 py-1 rounded-full ${
                  med.effectiveness === 'Excellent' ? 'bg-green-100 text-green-800' : 
                  med.effectiveness === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {med.effectiveness}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      {/* Lab Reports */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TestTube className="mr-2 text-orange-600" />
          Lab Reports
        </h3>
        <div className="space-y-4">
          {patient.reports.labReports.map(report => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{report.testName}</h4>
                  <p className="text-sm text-gray-600">{report.category}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === 'Critical' ? 'bg-red-100 text-red-800' :
                  report.status === 'Abnormal' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Result:</p>
                  <p className="font-medium">{report.result}</p>
                </div>
                <div>
                  <p className="text-gray-600">Normal Range:</p>
                  <p>{report.normalRange}</p>
                </div>
                <div>
                  <p className="text-gray-600">Test Date:</p>
                  <p>{report.testDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Reported by:</p>
                  <p>{report.reportedBy}</p>
                </div>
                {report.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Notes:</p>
                    <p className="text-orange-600">{report.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imaging Reports */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2 text-blue-600" />
          Imaging Reports
        </h3>
        <div className="space-y-4">
          {patient.reports.imagingReports.map(report => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{report.imagingType}</h4>
                  <p className="text-sm text-gray-600">{report.bodyPart}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{report.studyDate.toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600">Dr. {report.radiologist}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Findings:</p>
                  <p className="text-sm">{report.findings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Impression:</p>
                  <p className="text-sm font-medium">{report.impression}</p>
                </div>
                {report.recommendation && (
                  <div>
                    <p className="text-sm text-gray-600">Recommendation:</p>
                    <p className="text-sm text-blue-600">{report.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="mr-2 text-green-600" />
          Other Test Results
        </h3>
        <div className="space-y-3">
          {patient.reports.testResults.map(test => (
            <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{test.testType}</p>
                <p className="text-sm text-gray-600">Result: {test.result}</p>
                {test.normalRange && <p className="text-xs text-gray-500">Normal: {test.normalRange}</p>}
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  test.status === 'Critical' ? 'bg-red-100 text-red-800' :
                  test.status === 'Abnormal' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {test.status}
                </div>
                <p className="text-xs text-gray-500">{test.testDate.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTreatment = () => (
    <div className="space-y-6">
      {/* Ongoing Treatments */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Heart className="mr-2 text-red-600" />
          Ongoing Treatments
        </h3>
        <div className="space-y-4">
          {patient.treatment.ongoingTreatments.map(treatment => (
            <div key={treatment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{treatment.name}</h4>
                  <p className="text-sm text-gray-600">{treatment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{treatment.frequency}</p>
                  <p className="text-xs text-gray-500">Started: {treatment.startDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Purpose:</p>
                  <p className="text-sm">{treatment.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response:</p>
                  <p className="text-sm font-medium text-green-600">{treatment.response}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prescribed by:</p>
                  <p className="text-sm">{treatment.prescribedBy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planned Procedures */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="mr-2 text-blue-600" />
          Planned Procedures
        </h3>
        <div className="space-y-4">
          {patient.treatment.plannedProcedures.map(procedure => (
            <div key={procedure.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{procedure.name}</h4>
                  <p className="text-sm text-gray-600">{procedure.expectedOutcome}</p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    procedure.urgency === 'Emergency' ? 'bg-red-100 text-red-800' :
                    procedure.urgency === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {procedure.urgency}
                  </div>
                  <p className="text-sm font-medium">{procedure.scheduledDate.toLocaleDateString()}</p>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    procedure.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    procedure.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                    procedure.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {procedure.status}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {procedure.preparation.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Preparation:</p>
                    <ul className="list-disc list-inside text-sm">
                      {procedure.preparation.map((prep, idx) => (
                        <li key={idx}>{prep}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {procedure.risks.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Risks:</p>
                    <ul className="list-disc list-inside text-sm">
                      {procedure.risks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {procedure.surgeon && (
                  <div>
                    <p className="text-sm text-gray-600">Surgeon:</p>
                    <p className="text-sm">{procedure.surgeon}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Stethoscope className="mr-2 text-purple-600" />
          Consultations
        </h3>
        <div className="space-y-4">
          {patient.treatment.consultations.map(consultation => (
            <div key={consultation.id} className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{consultation.consultantType}</p>
                  <p className="text-sm text-gray-600">Dr. {consultation.consultantName}</p>
                  <p className="text-sm text-gray-600">Reason: {consultation.reason}</p>
                  <p className="text-sm text-gray-600">Findings: {consultation.findings}</p>
                  <p className="text-sm text-gray-600">Recommendations: {consultation.recommendations}</p>
                  {consultation.followUp && <p className="text-sm text-blue-600">Follow-up: {consultation.followUp}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{consultation.date.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                <span>Back to Patient List</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download size={16} />
                <span>Export</span>
              </button>
              {authState.user?.userType === 'doctor' && (
                <button 
                  onClick={handleInitiateDischarge}
                  disabled={isInitiatingDischarge}
                  className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentDischargeWorkflow?.status === 'approved' || currentDischargeWorkflow?.status === 'processing' || currentDischargeWorkflow?.status === 'completed'
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isInitiatingDischarge ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : currentDischargeWorkflow?.status === 'approved' || currentDischargeWorkflow?.status === 'processing' || currentDischargeWorkflow?.status === 'completed' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Send size={16} />
                  )}
                  <span>
                    {isInitiatingDischarge 
                      ? 'Initiating...' 
                      : currentDischargeWorkflow?.status === 'approved' || currentDischargeWorkflow?.status === 'processing' || currentDischargeWorkflow?.status === 'completed'
                        ? 'Discharge Approved'
                        : 'Discharge'
                    }
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Info Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{patient.name}</h1>
              <div className="flex items-center space-x-6 text-blue-100">
                <span>{patient.age} years, {patient.gender}</span>
                <span>Blood Group: {patient.bloodGroup}</span>
                <div className="flex items-center space-x-1">
                  <Phone size={16} />
                  <span>{patient.contactNumber}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center space-x-1">
                    <Mail size={16} />
                    <span>{patient.email}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Bed size={20} />
                <span className="font-semibold">{patient.currentAdmission.bedNumber}</span>
              </div>
              <div className="text-sm text-blue-100">
                <p>{patient.currentAdmission.department}</p>
                <p>Dr. {patient.currentAdmission.attendingDoctor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'medications', label: 'Medications', icon: Pill },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'treatment', label: 'Treatment', icon: Heart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'medications' && renderMedications()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'treatment' && renderTreatment()}
      </div>

      {/* Discharge Approval Modal */}
      {showDischargeModal && currentDischargeWorkflow && (
        <DischargeApprovalModal
          isOpen={showDischargeModal}
          onClose={() => setShowDischargeModal(false)}
          workflow={currentDischargeWorkflow}
          onApprovalComplete={handleDischargeApprovalComplete}
        />
      )}
    </div>
  )
}

export default PatientDetailView
