import React, { useState, useEffect } from 'react'
import { ArrowLeft, Users, FileText, Calendar, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react'
import { DischargeService } from '../../services/dischargeService'

interface DischargeRecord {
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  dischargeDate: Date
  workflowId: string
  status: string
  approvals: Array<{
    id: string
    type: string
    approverName: string
    approverId: string
    status: string
    approvedAt: Date
  }>
  timeline: Array<{
    id: string
    timestamp: Date
    event: string
    department: string
    description: string
    user: string
    status: string
  }>
}

const DischargeHistoryPage: React.FC = () => {
  const [dischargeHistory, setDischargeHistory] = useState<DischargeRecord[]>([])
  const [filteredHistory, setFilteredHistory] = useState<DischargeRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<DischargeRecord | null>(null)

  useEffect(() => {
    loadDischargeHistory()
  }, [])

  useEffect(() => {
    let filtered = dischargeHistory

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredHistory(filtered)
  }, [searchTerm, dischargeHistory])

  const loadDischargeHistory = () => {
    try {
      const dischargeService = DischargeService.getInstance()
      const history = dischargeService.getDischargeHistory()
      setDischargeHistory(history)
      setFilteredHistory(history)
    } catch (error) {
      console.error('Error loading discharge history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    window.history.back()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />
      case 'processing':
        return <Clock size={16} className="text-yellow-600" />
      case 'pending':
        return <AlertCircle size={16} className="text-gray-600" />
      default:
        return <AlertCircle size={16} className="text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Discharge History...</h2>
          <p className="text-gray-600">Please wait while we load the discharge records.</p>
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
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <FileText className="text-blue-600" size={24} />
                <h1 className="text-xl font-semibold text-gray-900">Discharge History</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users size={16} />
              <span>{filteredHistory.length} Discharged Patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by patient name, doctor name, or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Discharge Records */}
        <div className="space-y-4">
          {filteredHistory.map((record) => (
            <div
              key={record.workflowId}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="flex items-start justify-between">
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{record.patientName}</h3>
                      <p className="text-sm text-gray-600">ID: {record.patientId}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)}
                    <span>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                  </div>
                </div>

                {/* Discharge Details */}
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <Calendar size={14} />
                    <span>{record.dischargeDate.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Dr. {record.doctorName}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {record.approvals.length} approvals
                  </div>
                </div>
              </div>

              {/* Timeline Preview */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Recent Activity:</p>
                <div className="space-y-1">
                  {record.timeline.slice(-2).map((event, index) => (
                    <div key={event.id} className="text-xs text-gray-600">
                      <span className="font-medium">{event.user}:</span> {event.event}
                      <span className="text-gray-500 ml-2">
                        {event.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <FileText className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Discharge Records Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No patients have been discharged yet'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Discharge Details</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>

              {/* Patient Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Patient Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedRecord.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patient ID</p>
                      <p className="font-medium">{selectedRecord.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Discharge Date</p>
                      <p className="font-medium">{selectedRecord.dischargeDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Attending Doctor</p>
                      <p className="font-medium">Dr. {selectedRecord.doctorName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approvals */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Approvals</h3>
                <div className="space-y-2">
                  {selectedRecord.approvals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="font-medium">{approval.approverName}</p>
                        <p className="text-sm text-gray-600">{approval.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">{approval.status}</p>
                        <p className="text-xs text-gray-500">
                          {approval.approvedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-2">
                  {selectedRecord.timeline.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3">
                      <div className="flex-shrink-0">
                        {event.status === 'success' ? (
                          <CheckCircle size={16} className="text-green-600 mt-1" />
                        ) : (
                          <Clock size={16} className="text-yellow-600 mt-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.user} - {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DischargeHistoryPage
