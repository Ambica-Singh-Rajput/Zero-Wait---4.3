import React, { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, AlertTriangle, Users, FileText, Pill, Activity, Calendar, TrendingUp, Filter, Search, RefreshCw } from 'lucide-react'
import { DischargeWorkflow, DischargeAnalytics } from '../types/dischargeTypes'
import { DischargeService } from '../services/dischargeService'
import { DischargeNotificationService } from '../services/notificationService'

const DischargeTrackingDashboard: React.FC = () => {
  const [workflows, setWorkflows] = useState<DischargeWorkflow[]>([])
  const [filteredWorkflows, setFilteredWorkflows] = useState<DischargeWorkflow[]>([])
  const [analytics, setAnalytics] = useState<DischargeAnalytics | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<DischargeWorkflow | null>(null)

  useEffect(() => {
    loadWorkflows()
    loadAnalytics()
    
    // Set up real-time updates
    const notificationService = DischargeNotificationService.getInstance()
    notificationService.simulateRealTimeUpdates((department, notifications) => {
      console.log(`Real-time update for ${department}:`, notifications)
      loadWorkflows()
    })
  }, [])

  useEffect(() => {
    filterWorkflows()
  }, [workflows, searchTerm, statusFilter, departmentFilter])

  const loadWorkflows = async () => {
    setIsLoading(true)
    try {
      const dischargeService = DischargeService.getInstance()
      const allWorkflows = dischargeService.getAllWorkflows()
      setWorkflows(allWorkflows)
    } catch (error) {
      console.error('Error loading workflows:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    // Mock analytics data
    const mockAnalytics: DischargeAnalytics = {
      totalDischarges: workflows.length,
      averageProcessingTime: 1.8, // hours
      departmentPerformance: {
        billing: { averageTime: 30, successRate: 95, commonErrors: ['Insurance verification delays'] },
        pharmacy: { averageTime: 45, successRate: 98, commonErrors: ['Medication availability'] },
        laboratory: { averageTime: 20, successRate: 99, commonErrors: ['Report formatting'] },
        insurance: { averageTime: 60, successRate: 85, commonErrors: ['Documentation missing'] },
        nursing: { averageTime: 25, successRate: 97, commonErrors: ['Patient education'] }
      },
      aiAccuracy: {
        medicationAccuracy: 94,
        dietAccuracy: 89,
        overallConfidence: 92
      },
      monthlyTrends: [
        { month: 'Jan', discharges: 45, avgTime: 2.1 },
        { month: 'Feb', discharges: 52, avgTime: 1.9 },
        { month: 'Mar', discharges: 48, avgTime: 1.7 },
        { month: 'Apr', discharges: 61, avgTime: 1.5 }
      ]
    }
    setAnalytics(mockAnalytics)
  }

  const filterWorkflows = () => {
    let filtered = workflows

    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(w => w.status === statusFilter)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(w => 
        w.departments.some(d => d.department === departmentFilter && d.status === 'processing')
      )
    }

    setFilteredWorkflows(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending-approval': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ai-processing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />
      case 'processing': return <Clock size={16} className="text-blue-600" />
      case 'pending-approval': return <AlertTriangle size={16} className="text-yellow-600" />
      case 'ai-processing': return <RefreshCw size={16} className="text-purple-600" />
      case 'cancelled': return <XCircle size={16} className="text-red-600" />
      default: return <Clock size={16} className="text-gray-600" />
    }
  }

  const getProgressPercentage = (workflow: DischargeWorkflow) => {
    const completedSteps = workflow.departments.filter(d => d.status === 'completed').length
    return Math.round((completedSteps / workflow.departments.length) * 100)
  }

  const formatTimeRemaining = (estimatedCompletion: Date) => {
    const now = new Date()
    const diff = estimatedCompletion.getTime() - now.getTime()
    
    if (diff <= 0) return 'Completed'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const renderAnalytics = () => {
    if (!analytics) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Discharges</h3>
            <Users className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalDischarges}</p>
          <p className="text-sm text-gray-600 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Avg. Processing Time</h3>
            <Clock className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.averageProcessingTime}h</p>
          <p className="text-sm text-green-600 mt-2">-15% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">AI Accuracy</h3>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.aiAccuracy.overallConfidence}%</p>
          <p className="text-sm text-purple-600 mt-2">Confidence score</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Success Rate</h3>
            <CheckCircle className="text-emerald-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">96%</p>
          <p className="text-sm text-emerald-600 mt-2">Overall completion</p>
        </div>
      </div>
    )
  }

  const renderWorkflowCard = (workflow: DischargeWorkflow) => (
    <div key={workflow.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
         onClick={() => setSelectedWorkflow(workflow)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{workflow.patientName}</h3>
          <p className="text-sm text-gray-600">ID: {workflow.patientId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
            {getStatusIcon(workflow.status)}
            <span className="ml-1">{workflow.status.replace('-', ' ')}</span>
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{getProgressPercentage(workflow)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage(workflow)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Doctor</p>
          <p className="font-medium text-gray-800">{workflow.doctorName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Est. Completion</p>
          <p className="font-medium text-gray-800">{formatTimeRemaining(workflow.estimatedCompletion)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {workflow.departments.map((dept) => (
            <div key={dept.department} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                dept.status === 'completed' ? 'bg-green-500' :
                dept.status === 'processing' ? 'bg-blue-500' :
                dept.status === 'failed' ? 'bg-red-500' :
                'bg-gray-300'
              }`} />
              <span className="text-xs text-gray-600 capitalize">{dept.department}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar size={14} />
          <span>{workflow.initiatedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )

  const renderDepartmentPerformance = () => {
    if (!analytics) return null

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
        <div className="space-y-4">
          {Object.entries(analytics.departmentPerformance).map(([dept, perf]) => (
            <div key={dept} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 capitalize">{dept}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  perf.successRate >= 95 ? 'bg-green-100 text-green-800' :
                  perf.successRate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {perf.successRate}% Success
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Avg. Time</p>
                  <p className="font-medium">{perf.averageTime} min</p>
                </div>
                <div>
                  <p className="text-gray-600">Common Issues</p>
                  <p className="font-medium text-red-600">{perf.commonErrors[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Discharge Tracking Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time monitoring of patient discharge workflows</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadWorkflows}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm outline-none"
            >
              <option value="all">All Status</option>
              <option value="ai-processing">AI Processing</option>
              <option value="pending-approval">Pending Approval</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm outline-none"
            >
              <option value="all">All Departments</option>
              <option value="billing">Billing</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="laboratory">Laboratory</option>
              <option value="insurance">Insurance</option>
              <option value="nursing">Nursing</option>
            </select>
          </div>
        </div>

        {/* Analytics */}
        {renderAnalytics()}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflows List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Active Discharges</h2>
                <span className="text-sm text-gray-600">
                  {filteredWorkflows.length} of {workflows.length} workflows
                </span>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading workflows...</p>
                </div>
              ) : filteredWorkflows.length > 0 ? (
                <div className="space-y-4">
                  {filteredWorkflows.map(renderWorkflowCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No discharge workflows found</p>
                </div>
              )}
            </div>
          </div>

          {/* Department Performance */}
          <div className="lg:col-span-1">
            {renderDepartmentPerformance()}
          </div>
        </div>

        {/* Selected Workflow Detail Modal */}
        {selectedWorkflow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedWorkflow.patientName}</h2>
                    <p className="text-blue-100">Discharge Workflow Details</p>
                  </div>
                  <button
                    onClick={() => setSelectedWorkflow(null)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Workflow Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWorkflow.status)}`}>
                          {selectedWorkflow.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Initiated:</span>
                        <span>{selectedWorkflow.initiatedAt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Completion:</span>
                        <span>{selectedWorkflow.estimatedCompletion.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span>{selectedWorkflow.doctorName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">AI Content</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span>{selectedWorkflow.aiGeneratedContent.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medications:</span>
                        <span>{selectedWorkflow.aiGeneratedContent.medications.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diet Type:</span>
                        <span>{selectedWorkflow.aiGeneratedContent.dietPlan.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approvals:</span>
                        <span>{selectedWorkflow.approvals.filter(a => a.status === 'approved').length}/2</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Department Status</h3>
                  <div className="space-y-3">
                    {selectedWorkflow.departments.map((dept) => (
                      <div key={dept.department} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800 capitalize">{dept.department}</h4>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DischargeTrackingDashboard
