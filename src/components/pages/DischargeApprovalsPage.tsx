import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, User, Calendar, Search, Filter, Eye, Download, RefreshCw } from 'lucide-react'
import { DischargeWorkflow } from '../../types/dischargeTypes'
import { DischargeService } from '../../services/dischargeService'
import { useAuth } from '../../context/AuthContext'
import DischargeApprovalModal from '../DischargeApprovalModal'

interface DischargeApprovalsPageProps {
  userType: 'doctor' | 'nurse'
}

const DischargeApprovalsPage: React.FC<DischargeApprovalsPageProps> = ({ userType }) => {
  const { state: authState } = useAuth()
  const [workflows, setWorkflows] = useState<DischargeWorkflow[]>([])
  const [filteredWorkflows, setFilteredWorkflows] = useState<DischargeWorkflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<DischargeWorkflow | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processing' | 'completed'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkflows()
  }, [userType])

  useEffect(() => {
    filterWorkflows()
  }, [workflows, searchTerm, statusFilter])

  const loadWorkflows = async () => {
    try {
      console.log(`=== LOADING WORKFLOWS FOR ${userType.toUpperCase()} ===`)
      setLoading(true)
      const dischargeService = DischargeService.getInstance()
      const allWorkflows = dischargeService.getAllWorkflows()

      console.log(`Found ${allWorkflows.length} total workflows:`)
      allWorkflows.forEach((workflow, index) => {
        console.log(`  ${index + 1}. ${workflow.patientName} (${workflow.id}) - Status: ${workflow.status}`)
      })

      setWorkflows(allWorkflows)
      console.log(`=== WORKFLOWS LOADED SUCCESSFULLY ===`)
    } catch (error) {
      console.error(`Failed to load ${userType} workflows:`, error)
    } finally {
      setLoading(false)
    }
  }

  const filterWorkflows = () => {
    let filtered = workflows

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(workflow => {
        if (statusFilter === 'pending') {
          return workflow.status === 'pending-approval'
        } else if (statusFilter === 'approved') {
          return workflow.approvals.some(a => a.type === userType && a.status === 'approved')
        } else if (statusFilter === 'rejected') {
          return workflow.approvals.some(a => a.type === userType && a.status === 'rejected')
        } else {
          return workflow.status === statusFilter
        }
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(workflow =>
        workflow.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredWorkflows(filtered)
  }

  const handleReviewWorkflow = (workflow: DischargeWorkflow) => {
    setSelectedWorkflow(workflow)
    setShowApprovalModal(true)
  }

  const handleApprovalComplete = (updatedWorkflow: DischargeWorkflow) => {
    // Update the workflow in the list
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w))
    setShowApprovalModal(false)
    setSelectedWorkflow(null)
  }

  const getStatusColor = (workflow: DischargeWorkflow) => {
    const userApproval = workflow.approvals.find(a => a.type === userType)
    
    if (userApproval) {
      if (userApproval.status === 'approved') return 'text-green-600 bg-green-50'
      if (userApproval.status === 'rejected') return 'text-red-600 bg-red-50'
    }
    
    if (workflow.status === 'pending-approval') return 'text-yellow-600 bg-yellow-50'
    if (workflow.status === 'processing') return 'text-blue-600 bg-blue-50'
    if (workflow.status === 'completed') return 'text-green-600 bg-green-50'
    if (workflow.status === 'cancelled') return 'text-red-600 bg-red-50'
    
    return 'text-gray-600 bg-gray-50'
  }

  const getStatusIcon = (workflow: DischargeWorkflow) => {
    const userApproval = workflow.approvals.find(a => a.type === userType)
    
    if (userApproval) {
      if (userApproval.status === 'approved') return <CheckCircle size={16} />
      if (userApproval.status === 'rejected') return <XCircle size={16} />
    }
    
    if (workflow.status === 'pending-approval') return <Clock size={16} />
    if (workflow.status === 'processing') return <RefreshCw size={16} />
    if (workflow.status === 'completed') return <CheckCircle size={16} />
    if (workflow.status === 'cancelled') return <XCircle size={16} />
    
    return <Clock size={16} />
  }

  const getStatusText = (workflow: DischargeWorkflow) => {
    const userApproval = workflow.approvals.find(a => a.type === userType)
    
    if (userApproval) {
      if (userApproval.status === 'approved') return 'Approved by You'
      if (userApproval.status === 'rejected') return 'Rejected by You'
    }
    
    if (workflow.status === 'pending-approval') return 'Pending Approval'
    if (workflow.status === 'processing') return 'Processing'
    if (workflow.status === 'completed') return 'Completed'
    if (workflow.status === 'cancelled') return 'Cancelled'
    
    return 'Pending'
  }

  const getApprovalStatus = (workflow: DischargeWorkflow) => {
    const doctorApproval = workflow.approvals.find(a => a.type === 'doctor')
    const nurseApproval = workflow.approvals.find(a => a.type === 'nurse')
    
    return {
      doctor: doctorApproval?.status || 'pending',
      nurse: nurseApproval?.status || 'pending'
    }
  }

  const getPriorityColor = (priority: string) => {
    // Default to medium priority since priority is not in the interface
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
          <p className="text-gray-600">Loading discharge approvals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-900">
                {userType === 'doctor' ? 'Doctor' : 'Nurse'} Discharge Approvals
              </h1>
            </div>
            <button
              onClick={loadWorkflows}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {workflows.filter(w => w.status === 'pending-approval').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved by You</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows.filter(w => w.approvals.some(a => a.type === userType && a.status === 'approved')).length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected by You</p>
                <p className="text-2xl font-bold text-red-600">
                  {workflows.filter(w => w.approvals.some(a => a.type === userType && a.status === 'rejected')).length}
                </p>
              </div>
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {workflows.filter(w => w.status === 'processing').length}
                </p>
              </div>
              <RefreshCw className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by patient name, ID, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved by You</option>
                  <option value="rejected">Rejected by You</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Discharge Requests List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discharge requests found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No discharge requests available'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approvals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Your Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWorkflows.map((workflow) => {
                    const approvalStatus = getApprovalStatus(workflow)
                    return (
                      <tr key={workflow.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{workflow.patientName}</div>
                            <div className="text-sm text-gray-500">ID: {workflow.patientId}</div>
                            <div className="text-sm text-gray-500">Doctor: {workflow.doctorName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow)}`}>
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                              approvalStatus.doctor === 'approved' ? 'bg-green-100 text-green-800' :
                              approvalStatus.doctor === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              Doctor: {approvalStatus.doctor === 'approved' ? '✓' : approvalStatus.doctor === 'rejected' ? '✗' : '○'}
                            </div>
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                              approvalStatus.nurse === 'approved' ? 'bg-green-100 text-green-800' :
                              approvalStatus.nurse === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              Nurse: {approvalStatus.nurse === 'approved' ? '✓' : approvalStatus.nurse === 'rejected' ? '✗' : '○'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow)}`}>
                            {getStatusIcon(workflow)}
                            <span className="ml-1">{getStatusText(workflow)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(workflow.initiatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleReviewWorkflow(workflow)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
                          >
                            <Eye size={12} className="mr-1" />
                            Review
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {selectedWorkflow && (
        <DischargeApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false)
            setSelectedWorkflow(null)
          }}
          workflow={selectedWorkflow}
          onApprovalComplete={handleApprovalComplete}
        />
      )}
    </div>
  )
}

export default DischargeApprovalsPage
