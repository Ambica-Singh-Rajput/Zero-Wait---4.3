import React, { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle, Clock, AlertTriangle, User, Calendar, Pill, FileText, Shield, Stethoscope, Activity, Download, Send } from 'lucide-react'
import { DischargeWorkflow, AIDischargeContent, DischargeMedication, AIDietPlan } from '../types/dischargeTypes'
import { DischargeService } from '../services/dischargeService'
import { useAuth } from '../context/AuthContext'

interface DischargeApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  workflow: DischargeWorkflow | null
  onApprovalComplete?: (workflow: DischargeWorkflow) => void
}

const DischargeApprovalModal: React.FC<DischargeApprovalModalProps> = ({
  isOpen,
  onClose,
  workflow,
  onApprovalComplete
}) => {
  const { state: authState } = useAuth()
  const [activeTab, setActiveTab] = useState<'summary' | 'medications' | 'diet' | 'timeline' | 'approvals'>('summary')
  const [isApproving, setIsApproving] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [localWorkflow, setLocalWorkflow] = useState<DischargeWorkflow | null>(workflow)

  useEffect(() => {
    setLocalWorkflow(workflow)
  }, [workflow])

  if (!isOpen || !localWorkflow) return null

  const handleApprove = async () => {
    if (!authState.user) return

    setIsApproving(true)
    try {
      const dischargeService = DischargeService.getInstance()
      const approverType = authState.user.userType === 'doctor' ? 'doctor' : 'nurse'
      
      const success = await dischargeService.approveDischarge(
        localWorkflow.id,
        approverType,
        authState.user.id,
        `${authState.user.firstName} ${authState.user.lastName}`
      )

      if (success) {
        // Update local workflow
        const updatedWorkflow = dischargeService.getWorkflow(localWorkflow.id)
        if (updatedWorkflow) {
          setLocalWorkflow(updatedWorkflow)
          if (onApprovalComplete) {
            onApprovalComplete(updatedWorkflow)
          }
        }
      }
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return

    try {
      const dischargeService = DischargeService.getInstance()
      // Add rejection to approvals
      const updatedWorkflow = dischargeService.updateWorkflow(localWorkflow.id, {
        approvals: [
          ...localWorkflow.approvals,
          {
            id: `approval-${Date.now()}`,
            type: authState.user?.userType === 'doctor' ? 'doctor' : 'nurse',
            approverName: `${authState.user?.firstName} ${authState.user?.lastName}`,
            approverId: authState.user?.id || '',
            status: 'rejected',
            comments: rejectReason,
            approvedAt: new Date()
          }
        ],
        status: 'cancelled'
      })

      if (updatedWorkflow) {
        setLocalWorkflow(updatedWorkflow)
        setShowRejectForm(false)
        setRejectReason('')
      }
    } catch (error) {
      console.error('Rejection failed:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderSummary = () => (
    <div className="space-y-6">
      {/* AI Confidence Score */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-800">AI-Generated Summary</h4>
            <p className="text-sm text-blue-600 mt-1">Confidence Score: {localWorkflow.aiGeneratedContent.confidence}%</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{localWorkflow.aiGeneratedContent.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discharge Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2 text-blue-600" />
          Discharge Summary
        </h4>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded-lg">
            {localWorkflow.aiGeneratedContent.summary}
          </pre>
        </div>
      </div>

      {/* Follow-up Care */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="mr-2 text-green-600" />
          Follow-up Care
        </h4>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded-lg">
            {localWorkflow.aiGeneratedContent.followUpCare}
          </pre>
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h4 className="font-semibold text-amber-800 mb-4 flex items-center">
          <AlertTriangle className="mr-2" />
          Important Warnings
        </h4>
        <ul className="space-y-2">
          {localWorkflow.aiGeneratedContent.warnings.map((warning, index) => (
            <li key={index} className="text-sm text-amber-700 flex items-start">
              <span className="mr-2">#{index + 1}</span>
              <span>{warning}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-semibold text-green-800 mb-4 flex items-center">
          <CheckCircle className="mr-2" />
          Recommendations
        </h4>
        <ul className="space-y-2">
          {localWorkflow.aiGeneratedContent.recommendations.map((recommendation, index) => (
            <li key={index} className="text-sm text-green-700 flex items-start">
              <span className="mr-2">#{index + 1}</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderMedications = () => (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Pill className="mr-2 text-purple-600" />
          Discharge Medications ({localWorkflow.aiGeneratedContent.medications.length})
        </h4>
        <div className="space-y-4">
          {localWorkflow.aiGeneratedContent.medications.map((med, index) => (
            <div key={med.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-gray-800">{med.name}</h5>
                  <p className="text-sm text-gray-600">{med.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">${med.cost.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{med.insuranceCoverage}% covered</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Dosage:</p>
                  <p className="font-medium">{med.dosage} {med.frequency}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration:</p>
                  <p className="font-medium">{med.duration}</p>
                </div>
                <div>
                  <p className="text-gray-600">Route:</p>
                  <p className="font-medium">{med.route}</p>
                </div>
                <div>
                  <p className="text-gray-600">Type:</p>
                  <p className="font-medium">{med.isGeneric ? 'Generic' : 'Brand'}</p>
                </div>
              </div>

              {med.allergyCheck.hasAllergy && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    <AlertTriangle className="inline mr-1" size={16} />
                    ALLERGY ALERT: {med.allergyCheck.allergen}
                  </p>
                  {med.allergyCheck.alternative && (
                    <p className="text-sm text-red-600 mt-1">
                      Alternative: {med.allergyCheck.alternative}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Instructions:</strong> {med.instructions}
                </p>
              </div>

              {(med.sideEffects.length > 0 || med.warnings.length > 0) && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {med.sideEffects.length > 0 && (
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-yellow-800 font-medium">Side Effects:</p>
                      <p className="text-xs text-yellow-700">{med.sideEffects.join(', ')}</p>
                    </div>
                  )}
                  {med.warnings.length > 0 && (
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-800 font-medium">Warnings:</p>
                      <p className="text-xs text-orange-700">{med.warnings.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDiet = () => {
    const diet = localWorkflow.aiGeneratedContent.dietPlan
    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2 text-green-600" />
            AI-Generated Diet Plan
          </h4>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Diet Type</p>
              <p className="font-semibold text-blue-800">{diet.type}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Duration</p>
              <p className="font-semibold text-green-800">{diet.duration}</p>
            </div>
          </div>

          {/* Restrictions */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-800 mb-3">Dietary Restrictions</h5>
            <div className="flex flex-wrap gap-2">
              {diet.restrictions.map((restriction, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {restriction}
                </span>
              ))}
            </div>
          </div>

          {/* Meal Plan */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-800 mb-3">Daily Meal Plan</h5>
            <div className="space-y-3">
              {diet.mealPlan.map((meal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-gray-800">{meal.meal}</h6>
                    <span className="text-sm text-gray-600">{meal.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{meal.foods.join(', ')}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Portions: {meal.portions}</span>
                    <span className="text-gray-600">Calories: {meal.calories}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplements */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-800 mb-3">Recommended Supplements</h5>
            <div className="space-y-3">
              {diet.supplements.map((supplement, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-medium text-gray-800">{supplement.name}</h6>
                      <p className="text-sm text-gray-600">{supplement.dosage} {supplement.frequency}</p>
                      <p className="text-sm text-gray-600">{supplement.purpose}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">${supplement.cost.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{supplement.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-800 mb-3">Hydration Plan</h5>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Daily Intake</p>
                  <p className="font-semibold text-blue-800">{diet.hydration.dailyIntake}ml</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Frequency</p>
                  <p className="font-semibold text-blue-800">{diet.hydration.frequency}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-blue-600">Recommended:</p>
                <p className="text-sm text-blue-800">{diet.hydration.types.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h5 className="font-medium text-gray-800 mb-3">Special Instructions</h5>
            <ul className="space-y-2">
              {diet.specialInstructions.map((instruction, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="mr-2">#{index + 1}</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const renderTimeline = () => (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="mr-2 text-blue-600" />
          Discharge Timeline
        </h4>
        <div className="space-y-4">
          {localWorkflow.timeline.map((event, index) => (
            <div key={event.id} className="flex items-start space-x-4">
              <div className={`w-3 h-3 rounded-full mt-1 ${
                event.status === 'success' ? 'bg-green-500' :
                event.status === 'error' ? 'bg-red-500' :
                event.status === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-800">{event.event}</h5>
                  <span className="text-sm text-gray-500">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {event.user} - {event.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="mr-2 text-purple-600" />
          Department Status
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {localWorkflow.departments.map((dept) => (
            <div key={dept.department} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-800 capitalize">{dept.department}</h5>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.status)}`}>
                  {dept.status}
                </span>
              </div>
              {dept.assignedTo && (
                <p className="text-sm text-gray-600">Assigned to: {dept.assignedTo}</p>
              )}
              {dept.startedAt && (
                <p className="text-xs text-gray-500">
                  Started: {dept.startedAt.toLocaleTimeString()}
                </p>
              )}
              {dept.completedAt && (
                <p className="text-xs text-gray-500">
                  Completed: {dept.completedAt.toLocaleTimeString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderApprovalHistory = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="text-blue-600 mr-2" size={20} />
          Approval History & Status
        </h4>
        
        {/* Current Approval Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-700 mb-2">Doctor Approval</h5>
            {(() => {
              const doctorApproval = localWorkflow.approvals.find(a => a.type === 'doctor')
              return (
                <div className="space-y-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    doctorApproval?.status === 'approved' ? 'bg-green-100 text-green-800' :
                    doctorApproval?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctorApproval?.status === 'approved' && <CheckCircle size={16} className="mr-1" />}
                    {doctorApproval?.status === 'rejected' && <XCircle size={16} className="mr-1" />}
                    {!doctorApproval && <Clock size={16} className="mr-1" />}
                    {doctorApproval?.status === 'approved' ? 'Approved' :
                     doctorApproval?.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </div>
                  {doctorApproval && (
                    <div className="text-sm text-gray-600">
                      <p><strong>By:</strong> {doctorApproval.approverName}</p>
                      <p><strong>At:</strong> {doctorApproval.approvedAt ? new Date(doctorApproval.approvedAt).toLocaleString() : 'N/A'}</p>
                      {doctorApproval.comments && (
                        <p><strong>Comments:</strong> {doctorApproval.comments}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-700 mb-2">Nurse Approval</h5>
            {(() => {
              const nurseApproval = localWorkflow.approvals.find(a => a.type === 'nurse')
              return (
                <div className="space-y-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    nurseApproval?.status === 'approved' ? 'bg-green-100 text-green-800' :
                    nurseApproval?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {nurseApproval?.status === 'approved' && <CheckCircle size={16} className="mr-1" />}
                    {nurseApproval?.status === 'rejected' && <XCircle size={16} className="mr-1" />}
                    {!nurseApproval && <Clock size={16} className="mr-1" />}
                    {nurseApproval?.status === 'approved' ? 'Approved' :
                     nurseApproval?.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </div>
                  {nurseApproval && (
                    <div className="text-sm text-gray-600">
                      <p><strong>By:</strong> {nurseApproval.approverName}</p>
                      <p><strong>At:</strong> {nurseApproval.approvedAt ? new Date(nurseApproval.approvedAt).toLocaleString() : 'N/A'}</p>
                      {nurseApproval.comments && (
                        <p><strong>Comments:</strong> {nurseApproval.comments}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-blue-900">Overall Status</h5>
              <p className="text-sm text-blue-700 mt-1">
                {localWorkflow.approvals.filter(a => a.status === 'approved').length} of 2 required approvals completed
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-medium ${
              localWorkflow.approvals.filter(a => a.status === 'approved').length >= 2 
                ? 'bg-green-100 text-green-800' 
                : localWorkflow.approvals.some(a => a.status === 'rejected')
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {localWorkflow.approvals.filter(a => a.status === 'approved').length >= 2 
                ? 'Ready for Processing' 
                : localWorkflow.approvals.some(a => a.status === 'rejected')
                ? 'Cancelled'
                : 'Pending Approvals'}
            </div>
          </div>
        </div>

        {/* Detailed Approval Timeline */}
        <div>
          <h5 className="font-medium text-gray-700 mb-3">Approval Timeline</h5>
          <div className="space-y-3">
            {localWorkflow.approvals.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Clock size={32} className="mx-auto mb-2" />
                <p>No approvals yet</p>
              </div>
            ) : (
              localWorkflow.approvals
                .sort((a, b) => (a.approvedAt?.getTime() || 0) - (b.approvedAt?.getTime() || 0))
                .map((approval) => (
                  <div key={approval.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`mt-1 ${
                      approval.status === 'approved' ? 'text-green-600' :
                      approval.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {approval.status === 'approved' ? <CheckCircle size={20} /> :
                       approval.status === 'rejected' ? <XCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {approval.type} Approval
                          </p>
                          <p className="text-sm text-gray-600">{approval.approverName}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                          approval.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {approval.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {approval.approvedAt ? new Date(approval.approvedAt).toLocaleString() : 'N/A'}
                      </p>
                      {approval.comments && (
                        <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-700">{approval.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Patient Discharge History */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <User className="text-blue-600 mr-2" size={20} />
          Patient Discharge Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600"><strong>Patient Name:</strong></p>
            <p className="font-medium">{localWorkflow.patientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600"><strong>Patient ID:</strong></p>
            <p className="font-medium">{localWorkflow.patientId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600"><strong>Attending Doctor:</strong></p>
            <p className="font-medium">{localWorkflow.doctorName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600"><strong>Initiated:</strong></p>
            <p className="font-medium">{new Date(localWorkflow.initiatedAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600"><strong>Current Status:</strong></p>
            <p className="font-medium capitalize">{localWorkflow.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600"><strong>Est. Completion:</strong></p>
            <p className="font-medium">{new Date(localWorkflow.estimatedCompletion).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const canApprove = authState.user && (
    (authState.user.userType === 'doctor' && !localWorkflow.approvals.some(a => a.type === 'doctor' && a.status === 'approved')) ||
    (authState.user.userType === 'nurse' && !localWorkflow.approvals.some(a => a.type === 'nurse' && a.status === 'approved'))
  )

  const isFullyApproved = localWorkflow.approvals.filter(a => a.status === 'approved').length >= 2

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Discharge Approval</h2>
              <p className="text-blue-100 mt-1">
                Patient: {localWorkflow.patientName} | ID: {localWorkflow.patientId}
              </p>
              <p className="text-blue-100">
                Status: <span className="font-semibold capitalize">{localWorkflow.status}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {[
              { id: 'summary', label: 'Summary', icon: FileText },
              { id: 'medications', label: 'Medications', icon: Pill },
              { id: 'diet', label: 'Diet Plan', icon: Activity },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'approvals', label: 'Approval History', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {activeTab === 'summary' && renderSummary()}
          {activeTab === 'medications' && renderMedications()}
          {activeTab === 'diet' && renderDiet()}
          {activeTab === 'timeline' && renderTimeline()}
          {activeTab === 'approvals' && renderApprovalHistory()}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Approvals:</span> {localWorkflow.approvals.filter(a => a.status === 'approved').length}/2
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Est. Completion:</span> {localWorkflow.estimatedCompletion.toLocaleTimeString()}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {canApprove && !isFullyApproved && (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <XCircle size={18} />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isApproving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                    <span>Approve</span>
                  </button>
                </>
              )}

              {isFullyApproved && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="font-medium">Fully Approved - Processing Departments</span>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Reject Form Modal */}
        {showRejectForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Discharge Plan</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide reason for rejection..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DischargeApprovalModal
