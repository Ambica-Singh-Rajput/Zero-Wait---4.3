import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Stethoscope, Calendar, Users, FileText, User, Clock, MessageSquare, Search, Plus, Activity, LogOut, UserCheck, Bed, AlertTriangle, Heart, Pill, TestTube, ArrowLeft } from 'lucide-react'
import { getDoctorAppointments, getDoctorPatients, getDoctorConsultations, Consultation } from '../services/doctorService'
import { Appointment } from '../services/patientService'
import { Patient } from '../types/patientTypes'
import PatientList from './PatientList'
import PatientDetailView from './PatientDetailView'
import PatientListWidget from './PatientListWidget'
import AppointmentManagementWidget from './AppointmentManagementWidget'
import PrescriptionManagerWidget from './PrescriptionManagerWidget'
import MedicalRecordsViewer from './MedicalRecordsViewer'
import DischargeApprovalsPage from './pages/DischargeApprovalsPage'
import DischargeHistoryPage from './pages/DischargeHistoryPage'

const DoctorDashboard: React.FC = () => {
  const { state: authState, logout } = useAuth()
  const [activeView, setActiveView] = useState<'dashboard' | 'patients' | 'patient-detail' | 'discharge-history'>('dashboard')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [activeWidget, setActiveWidget] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<{
    appointments: Appointment[]
    patients: any[]
    consultations: Consultation[]
    todayAppointments: Appointment[]
    isLoading: boolean
  }>({
    appointments: [],
    patients: [],
    consultations: [],
    todayAppointments: [],
    isLoading: true
  })

  useEffect(() => {
    if (authState.user) {
      loadDashboardData()
    }
  }, [authState.user])

  const loadDashboardData = async () => {
    if (!authState.user) return
    
    setDashboardData(prev => ({ ...prev, isLoading: true }))
    
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const [appointmentsResult, patientsResult, consultationsResult, todayAppointmentsResult] = await Promise.all([
        getDoctorAppointments(authState.user.id),
        getDoctorPatients(authState.user.id),
        getDoctorConsultations(authState.user.id),
        getDoctorAppointments(authState.user.id, today)
      ])
      
      setDashboardData({
        appointments: appointmentsResult.success ? appointmentsResult.appointments : [],
        patients: patientsResult.success ? patientsResult.patients : [],
        consultations: consultationsResult.success ? consultationsResult.consultations : [],
        todayAppointments: todayAppointmentsResult.success ? todayAppointmentsResult.appointments : [],
        isLoading: false
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setDashboardData(prev => ({ ...prev, isLoading: false }))
    }
  }

  const patientStats = {
    totalPatients: dashboardData.patients.length,
    todayAppointments: dashboardData.todayAppointments.length,
    pendingReports: dashboardData.consultations.filter(c => c.status === 'in-progress').length,
    emergencyConsults: dashboardData.todayAppointments.filter((a: any) => a.type === 'emergency').length
  }

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setActiveView('patient-detail')
  }

  const handleBackToDashboard = () => {
    setActiveView('dashboard')
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

  const handleBackToPatients = () => {
    setActiveView('patients')
    setSelectedPatient(null)
  }

  // Show different views based on activeView
  if (activeView === 'patient-detail' && selectedPatient) {
    return (
      <PatientDetailView 
        patient={selectedPatient} 
        onBack={handleBackToPatients}
      />
    )
  }

  if (activeView === 'discharge-history') {
    return <DischargeHistoryPage />
  }

  if (activeView === 'patients') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Dashboard</span>
                </button>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
                  <p className="text-gray-600">View and manage patient records</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          <PatientList onPatientSelect={handlePatientSelect} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Stethoscope size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Dr. {authState.user?.firstName} {authState.user?.lastName}
                </h1>
                <p className="text-gray-600">{authState.user?.specialization || 'General Medicine'}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <User size={14} className="mr-1" />
                  License: {authState.user?.licenseNumber || 'Not provided'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">{patientStats.totalPatients}</p>
              </div>
              <Users className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{patientStats.todayAppointments}</p>
              </div>
              <Calendar className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-800">{patientStats.pendingReports}</p>
              </div>
              <FileText className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Emergency Consults</p>
                <p className="text-2xl font-bold text-gray-800">{patientStats.emergencyConsults}</p>
              </div>
              <MessageSquare className="text-red-500" size={24} />
            </div>
          </div>

          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
            onClick={() => setActiveView('patients')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Patient Management</p>
                <p className="text-xl font-bold">View All Patients</p>
              </div>
              <Bed className="text-blue-200" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Today's Appointments</h2>
              <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="space-y-4">
              {dashboardData.isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading appointments...</p>
                </div>
              ) : dashboardData.todayAppointments.length > 0 ? (
                dashboardData.todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => setActiveWidget('appointment-details')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{appointment.doctorName}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Clock size={14} className="mr-1" />
                          {appointment.time}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveWidget('appointments')}
                className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors"
              >
                <Calendar className="text-green-600" size={20} />
                <span className="text-green-700 font-medium">Manage Appointments</span>
              </button>
              <button 
                onClick={() => setActiveView('patients')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
              >
                <Users className="text-blue-600" size={20} />
                <span className="text-blue-700 font-medium">Patient Records</span>
              </button>
              <button 
                onClick={() => setActiveWidget('prescriptions')}
                className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors"
              >
                <FileText className="text-orange-600" size={20} />
                <span className="text-orange-700 font-medium">Write Prescription</span>
              </button>
              <button 
                onClick={() => setActiveWidget('records')}
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
              >
                <Activity className="text-purple-600" size={20} />
                <span className="text-purple-700 font-medium">Medical Records</span>
              </button>
              <button 
                onClick={() => setActiveWidget('discharge')}
                className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
              >
                <UserCheck className="text-emerald-600" size={20} />
                <span className="text-emerald-700 font-medium">Discharge Approval</span>
              </button>
              <button 
                onClick={() => setActiveView('discharge-history')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
              >
                <FileText className="text-blue-600" size={20} />
                <span className="text-blue-700 font-medium">Discharge History</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Widgets */}
        {activeWidget === 'patients' && (
          <PatientListWidget onClose={() => setActiveWidget(null)} />
        )}
        
        {activeWidget === 'appointments' && (
          <AppointmentManagementWidget onClose={() => setActiveWidget(null)} />
        )}
        
        {activeWidget === 'prescriptions' && (
          <PrescriptionManagerWidget onClose={() => setActiveWidget(null)} />
        )}
        
        {activeWidget === 'records' && (
          <MedicalRecordsViewer onClose={() => setActiveWidget(null)} />
        )}
        
        {activeWidget === 'discharge' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setActiveWidget(null)}
                className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
              <DischargeApprovalsPage userType="doctor" />
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <LogOut size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Confirm Logout</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout from the doctor dashboard?
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

export default DoctorDashboard
