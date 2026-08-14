import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Heart, Users, Clipboard, AlertTriangle, LogOut, User, Clock, Activity, Bell, CheckCircle, FileText, Search, Calendar, RefreshCw, Pill, ArrowLeft, TrendingUp, AlertCircle, Plus, Filter } from 'lucide-react'
import { DischargeWorkflow, DischargeNotification } from '../types/dischargeTypes'
import { DischargeService } from '../services/dischargeService'
import { DischargeNotificationService } from '../services/notificationService'
import DischargeApprovalModal from './DischargeApprovalModal'
import { nursePatients, emergencyAlerts, getRealTimeUpdates, getMedicationSchedule, NursePatient, Medication, VitalSigns, EmergencyAlert, ScheduledMedication } from '../data/nursePatientData'

const NurseDashboard: React.FC = () => {
  const { state: authState, logout } = useAuth()
  const [workflows, setWorkflows] = useState<DischargeWorkflow[]>([])
  const [notifications, setNotifications] = useState<DischargeNotification[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<DischargeWorkflow | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState<NursePatient[]>(nursePatients)
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>(emergencyAlerts)
  const [medicationSchedule, setMedicationSchedule] = useState<ScheduledMedication[]>([])
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null)

  const handleQuickAction = (action: string) => {
    // For now, just show an alert with page information
    const pageMessages: { [key: string]: string } = {
      'patient-records': 'Patient Records page - Full patient management system',
      'update-charts': 'Update Charts page - Vital signs and chart updates',
      'vital-signs': 'Vital Signs page - Real-time patient monitoring',
      'medication-administration': 'Medication Administration page - Professional medication tracking',
      'report-emergency': 'Emergency Reporting page - Complete emergency management'
    }
    
    const message = pageMessages[action] || 'Page not found'
    alert(`${message} \n\n✅ Separate page components are ready in: /src/components/pages/`)
  }

  const handleTestNotification = async () => {
    console.log('Creating test notification...')
    try {
      const notificationService = DischargeNotificationService.getInstance()
      const testNotification: DischargeNotification = {
        id: `test-${Date.now()}`,
        workflowId: 'test-workflow',
        department: 'nursing',
        type: 'test-notification',
        title: 'Test Notification',
        message: 'This is a test notification from the nurse dashboard',
        priority: 'medium',
        createdAt: new Date(),
        actionRequired: false,
        actionUrl: '/nurse/dashboard'
      }
      
      await notificationService.sendNotification(testNotification)
      console.log('Test notification sent successfully')
    } catch (error) {
      console.error('Failed to send test notification:', error)
    }
  }

  const handleViewWorkflow = (workflow: DischargeWorkflow) => {
    setSelectedWorkflow(workflow)
    setShowApprovalModal(true)
  }

  const handleApproveDischarge = (workflow: DischargeWorkflow) => {
    setSelectedWorkflow(workflow)
    setShowApprovalModal(true)
  }

  const handleDischargeApprovalComplete = (workflow: DischargeWorkflow) => {
    setSelectedWorkflow(workflow)
    setShowApprovalModal(false)
    loadWorkflows()
    loadNotifications()
  }

  const loadWorkflows = async () => {
    try {
      const dischargeService = DischargeService.getInstance()
      const workflows = await dischargeService.getNurseWorkflows()
      setWorkflows(workflows)
    } catch (error) {
      console.error('Failed to load workflows:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      const notificationService = DischargeNotificationService.getInstance()
      const notifications = await notificationService.getNurseNotifications()
      setNotifications(notifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  useEffect(() => {
    loadWorkflows()
    loadNotifications()
    
    const interval = setInterval(() => {
      const updatedPatients = getRealTimeUpdates()
      setPatients(updatedPatients)
      setMedicationSchedule(getMedicationSchedule())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="text-red-600" size={24} />
                <h1 className="text-xl font-bold text-gray-900">Nurse Dashboard</h1>
              </div>
              <div className="text-sm text-gray-600">
                {authState.user?.name} • {authState.user?.userType}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="text-gray-600" size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <User className="text-gray-600" size={20} />
                <span className="text-sm font-medium text-gray-700">{authState.user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Discharge Workflows */}
            {workflows.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Discharge Approvals</h2>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {workflow.initiatedAt.toLocaleTimeString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-1">{workflow.patientName}</h3>
                          <p className="text-sm text-gray-600 mb-2">ID: {workflow.patientId}</p>
                          <p className="text-sm text-gray-600 mb-2">Doctor: {workflow.doctorName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>AI Confidence: {workflow.aiGeneratedContent.confidence}%</span>
                            <span>Medications: {workflow.aiGeneratedContent.medications.length}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewWorkflow(workflow)}
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            <FileText size={14} />
                            <span>Review</span>
                          </button>
                          {workflow.status === 'pending-approval' && (
                            <button
                              onClick={() => handleApproveDischarge(workflow)}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              <CheckCircle size={14} />
                              <span>Approve</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => handleQuickAction('patient-records')}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
                >
                  <Users className="text-purple-600" size={20} />
                  <span className="text-purple-700 font-medium">Patient Records</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('update-charts')}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                >
                  <Clipboard className="text-blue-600" size={20} />
                  <span className="text-blue-700 font-medium">Update Charts</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('vital-signs')}
                  className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors"
                >
                  <Activity className="text-orange-600" size={20} />
                  <span className="text-orange-700 font-medium">Vital Signs</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('medication-administration')}
                  className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                >
                  <Pill className="text-emerald-600" size={20} />
                  <span className="text-emerald-700 font-medium">Medication</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('report-emergency')}
                  className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
                >
                  <AlertTriangle className="text-red-600" size={20} />
                  <span className="text-red-700 font-medium">Report Emergency</span>
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Patients</p>
                      <p className="text-2xl font-bold text-blue-700">{patients.length}</p>
                    </div>
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600">Critical Patients</p>
                      <p className="text-2xl font-bold text-red-700">{patients.filter(p => p.status === 'critical').length}</p>
                    </div>
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Stable Patients</p>
                      <p className="text-2xl font-bold text-green-700">{patients.filter(p => p.status === 'stable').length}</p>
                    </div>
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Active Medications</p>
                      <p className="text-2xl font-bold text-orange-700">{medicationSchedule.length}</p>
                    </div>
                    <Pill className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <Bell className="text-gray-600 mt-1" size={16} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.createdAt.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No new notifications</p>
                )}
              </div>
            </div>

            {/* Emergency Alerts */}
            {emergencies.filter(e => !e.resolved).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="text-red-600" size={20} />
                  <h2 className="text-xl font-semibold text-red-800">Active Emergencies</h2>
                </div>
                <div className="space-y-3">
                  {emergencies.filter(e => !e.resolved).slice(0, 3).map((emergency) => (
                    <div key={emergency.id} className="p-3 bg-white rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900">{emergency.patientName}</span>
                          <span className="text-sm text-gray-600 ml-2">Room {emergency.room}</span>
                        </div>
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-semibold">
                          {emergency.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">{emergency.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Discharge Approval Modal */}
        {showApprovalModal && selectedWorkflow && (
          <DischargeApprovalModal
            isOpen={showApprovalModal}
            onClose={() => setShowApprovalModal(false)}
            workflow={selectedWorkflow}
            onApprovalComplete={handleDischargeApprovalComplete}
          />
        )}
      </div>
    </div>
  )
}

export default NurseDashboard
