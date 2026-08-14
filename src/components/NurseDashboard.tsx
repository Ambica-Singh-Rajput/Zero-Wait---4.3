import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Heart, Users, Clipboard, AlertTriangle, LogOut, User, Clock, Activity, Bell, CheckCircle, FileText, Search, Calendar, RefreshCw, Pill, ArrowLeft, TrendingUp, AlertCircle, Plus, Filter } from 'lucide-react'
import { DischargeWorkflow, DischargeNotification } from '../types/dischargeTypes'
import { DischargeService } from '../services/dischargeService'
import { DischargeNotificationService } from '../services/notificationService'
import DischargeApprovalModal from './DischargeApprovalModal'
import SharedPatientService from '../services/sharedPatientService'
import { emergencyAlerts, getMedicationSchedule, Medication, VitalSigns, EmergencyAlert, ScheduledMedication } from '../data/nursePatientData'
import { SharedPatient } from '../services/sharedPatientService'

// Import page components
import NursePatientRecordsPage from './pages/NursePatientRecordsPageWorking'
import NurseVitalSignsPage from './pages/NurseVitalSignsPageWithAlerts'
import NotificationPanel from './NotificationPanel'
import AlertService from '../services/alertService'
import VitalSignsMonitor from '../services/vitalSignsMonitor'
import NurseMedicationPage from './pages/NurseMedicationPageFixed'
import NurseUpdateChartsPage from './pages/NurseUpdateChartsPageAllPatients'
import NurseEmergencyPage from './pages/NurseEmergencyPageWorking'
import DischargeApprovalsPage from './pages/DischargeApprovalsPage'

const NurseDashboard: React.FC = () => {
  const { state: authState, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [workflows, setWorkflows] = useState<DischargeWorkflow[]>([])
  const [notifications, setNotifications] = useState<DischargeNotification[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<DischargeWorkflow | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState<SharedPatient[]>([])
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>(emergencyAlerts)
  const [medicationSchedule, setMedicationSchedule] = useState<ScheduledMedication[]>([])
  const [selectedPatient, setSelectedPatient] = useState<SharedPatient | null>(null)
  const [currentPage, setCurrentPage] = useState<string>('dashboard')
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [alertNotifications, setAlertNotifications] = useState<any[]>([])
  const [unreadAlertCount, setUnreadAlertCount] = useState(0)
  const [alertService] = useState(() => AlertService.getInstance())
  const [vitalSignsMonitor] = useState(() => VitalSignsMonitor.getInstance())
  const [patientsLoading, setPatientsLoading] = useState(true)

  const handleQuickAction = (action: string) => {
    console.log('Quick Action clicked:', action)
    try {
      setCurrentPage(action)
      console.log('Page set to:', action)
    } catch (error) {
      console.error('Error setting page:', error)
    }
  }

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
    setSelectedPatient(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      // AuthenticatedApp will handle redirect to welcome screen
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const renderCurrentPage = () => {
    try {
      console.log('Rendering page:', currentPage)
      
      switch (currentPage) {
        case 'patient-records':
          console.log('Rendering Patient Records page')
          return <NursePatientRecordsPage />
        case 'update-charts':
          console.log('Rendering Update Charts page')
          return <NurseUpdateChartsPage patients={patients} setPatients={setPatients} />
        case 'vital-signs':
          console.log('Rendering Vital Signs page')
          return <NurseVitalSignsPage />
        case 'medication-administration':
          console.log('Rendering Medication page')
          return <NurseMedicationPage />
        case 'report-emergency':
          console.log('Rendering Emergency page')
          return <NurseEmergencyPage />
        case 'discharge-approvals':
          console.log('Rendering Discharge Approvals page')
          return <DischargeApprovalsPage userType="nurse" />
        default:
          console.log('Unknown page, returning null')
          return null
      }
    } catch (error) {
      console.error('Error rendering page:', error)
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-8">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Page</h3>
          <p className="text-red-600">There was an error loading this page. Please try again.</p>
          <button 
            onClick={handleBackToDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      )
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
      const workflows = dischargeService.getAllWorkflows()
      setWorkflows(workflows)
    } catch (error) {
      console.error('Failed to load workflows:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      const notificationService = DischargeNotificationService.getInstance()
      const notifications = notificationService.getDepartmentNotifications('nursing')
      setNotifications(notifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  useEffect(() => {
    loadWorkflows()
    loadNotifications()
    
    // Subscribe to shared patient service
    const sharedPatientService = SharedPatientService.getInstance()
    const unsubscribe = sharedPatientService.subscribeToPatients((activePatients) => {
      setPatients(activePatients)
      setPatientsLoading(false)
      
      // Start vital signs monitoring with active patients
      console.log('Starting vital signs monitoring for automatic notifications')
      vitalSignsMonitor.startMonitoring(activePatients)
    })
    
    const interval = setInterval(() => {
      // Only update medication schedule, Don't override patient changes
      setMedicationSchedule(getMedicationSchedule())
    }, 5000)
    
    return () => {
      clearInterval(interval)
      vitalSignsMonitor.stopMonitoring()
      unsubscribe()
    }
  }, [vitalSignsMonitor])

  // Initialize alert service and subscribe to notifications
  useEffect(() => {
    const handleNotificationsUpdate = (notifications: any[]) => {
      setAlertNotifications(notifications)
      setUnreadAlertCount(alertService.getUnreadCount())
    }

    // Initial load
    setAlertNotifications(alertService.getNotifications())
    setUnreadAlertCount(alertService.getUnreadCount())

    // Subscribe to updates
    alertService.subscribe(handleNotificationsUpdate)

    return () => {
      alertService.unsubscribe(handleNotificationsUpdate)
    }
  }, [alertService])

  // Subscribe to discharge notifications for real-time updates
  useEffect(() => {
    const notificationService = DischargeNotificationService.getInstance()
    
    // Set up polling for new notifications
    const interval = setInterval(() => {
      try {
        const notifications = notificationService.getDepartmentNotifications('nursing')
        setNotifications(notifications)
      } catch (error) {
        console.error('Failed to refresh notifications:', error)
      }
    }, 10000) // Check every 10 seconds

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
                <h1 className="text-xl font-bold text-gray-900">
                  {currentPage !== 'dashboard' ? 'Nurse Portal' : 'Nurse Dashboard'}
                </h1>
              </div>
              <div className="text-sm text-gray-600">
                {`${authState.user?.firstName} ${authState.user?.lastName}`} • {authState.user?.userType}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentPage !== 'dashboard' && (
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Dashboard</span>
                </button>
              )}
              <button
                onClick={() => setShowNotificationPanel(true)}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={20} />
                {unreadAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadAlertCount}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <User className="text-gray-600" size={20} />
                <span className="text-sm font-medium text-gray-700">{`${authState.user?.firstName} ${authState.user?.lastName}`}</span>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
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
        {currentPage === 'dashboard' ? (
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
                    onClick={() => handleQuickAction('discharge-approvals')}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors"
                  >
                    <FileText className="text-green-600" size={20} />
                    <span className="text-green-700 font-medium">Discharge Approvals</span>
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
                  {/* Combine discharge notifications and vital signs alerts */}
                  {[...notifications, ...alertNotifications]
                    .sort((a, b) => new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime())
                    .slice(0, 5)
                    .map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-lg border ${
                          notification.type === 'patient-alert' && notification.severity === 'critical'
                            ? 'bg-red-50 border-red-200'
                            : notification.type === 'patient-alert' && notification.severity === 'high'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-1 ${
                            notification.type === 'patient-alert' && notification.severity === 'critical'
                              ? 'text-red-600'
                              : notification.type === 'patient-alert' && notification.severity === 'high'
                              ? 'text-yellow-600'
                              : 'text-gray-600'
                          }`}>
                            {notification.type === 'patient-alert' ? (
                              <AlertCircle size={16} />
                            ) : (
                              <Bell size={16} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              notification.type === 'patient-alert' && notification.severity === 'critical'
                                ? 'text-red-900'
                                : notification.type === 'patient-alert' && notification.severity === 'high'
                                ? 'text-yellow-900'
                                : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 ${
                              notification.type === 'patient-alert' && notification.severity === 'critical'
                                ? 'text-red-700'
                                : notification.type === 'patient-alert' && notification.severity === 'high'
                                ? 'text-yellow-700'
                                : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notification.timestamp || notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {notifications.length === 0 && alertNotifications.length === 0 && (
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
        ) : (
          renderCurrentPage()
        )}
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

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        nurseName={`${authState.user?.firstName} ${authState.user?.lastName}` || 'Nurse'}
      />
      
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <LogOut size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Confirm Logout</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout from the nurse dashboard?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NurseDashboard
