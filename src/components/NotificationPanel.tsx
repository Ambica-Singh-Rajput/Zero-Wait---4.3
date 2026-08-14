import React, { useState, useEffect } from 'react'
import { Bell, X, AlertTriangle, CheckCircle, Info, AlertCircle, Clock, User } from 'lucide-react'
import AlertService, { NurseNotification } from '../services/alertService'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  nurseName: string
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, nurseName }) => {
  const [notifications, setNotifications] = useState<NurseNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const alertService = AlertService.getInstance()
    
    // Initial load
    setNotifications(alertService.getNotifications())
    setUnreadCount(alertService.getUnreadCount())

    // Subscribe to updates
    const handleNotificationsUpdate = (updatedNotifications: NurseNotification[]) => {
      setNotifications(updatedNotifications)
      setUnreadCount(alertService.getUnreadCount())
    }

    alertService.subscribe(handleNotificationsUpdate)

    return () => {
      alertService.unsubscribe(handleNotificationsUpdate)
    }
  }, [])

  const getNotificationIcon = (type: string, severity: string) => {
    switch (type) {
      case 'patient-alert':
        return severity === 'critical' ? 
          <AlertTriangle className="text-red-500" size={20} /> : 
          <AlertCircle className="text-orange-500" size={20} />
      case 'system':
        return <Info className="text-blue-500" size={20} />
      case 'medication':
        return <Clock className="text-purple-500" size={20} />
      case 'emergency':
        return <AlertTriangle className="text-red-600" size={20} />
      default:
        return <Bell className="text-gray-500" size={20} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'high': return 'border-orange-200 bg-orange-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-gray-200 bg-gray-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    const alertService = AlertService.getInstance()
    alertService.markNotificationAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    const alertService = AlertService.getInstance()
    alertService.markAllAsRead()
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <Bell className="text-gray-600" size={24} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-4 border-b">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${getSeverityColor(notification.severity)} ${
                      !notification.read ? 'border-l-4' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium text-gray-900 ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadgeColor(notification.severity)}`}>
                            {notification.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                          {notification.message}
                        </p>
                        
                        {/* AI Precautions for Patient Alerts */}
                        {notification.type === 'patient-alert' && notification.precautions && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                            <h5 className="text-sm font-semibold text-blue-900 mb-2">AI-Generated Precautions:</h5>
                            <ul className="space-y-1">
                              {notification.precautions.map((precaution, index) => (
                                <li key={index} className="text-xs text-blue-800 flex items-start">
                                  <span className="text-blue-600 mr-2">·</span>
                                  {precaution}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationPanel
