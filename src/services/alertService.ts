// Alert Service for managing patient alerts and notifications
export interface PatientAlert {
  id: string
  patientId: string
  patientName: string
  room: string
  severity: 'critical' | 'warning'
  timestamp: Date
  message: string
  precautions: string[]
  acknowledgedBy?: string
  acknowledgedAt?: Date
  resolved: boolean
  resolvedAt?: Date
}

export interface NurseNotification {
  id: string
  type: 'patient-alert' | 'system' | 'medication' | 'emergency'
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  read: boolean
  actionRequired: boolean
  actionUrl?: string
  patientId?: string
  precautions?: string[]
}

class AlertService {
  private static instance: AlertService
  private alerts: PatientAlert[] = []
  private notifications: NurseNotification[] = []
  private listeners: ((notifications: NurseNotification[]) => void)[] = []

  private constructor() {
    // Initialize with some existing alerts
    this.alerts = []
    this.notifications = []
  }

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService()
    }
    return AlertService.instance
  }

  // Generate AI-powered precautions using Gemini-like logic
  private async generatePrecautions(patientName: string, severity: 'critical' | 'warning', vitalSigns: any): Promise<string[]> {
    // Simulate AI-generated precautions based on severity and vital signs
    const basePrecautions = {
      critical: [
        'Immediate medical assessment required',
        'Prepare emergency response team',
        'Check airway, breathing, circulation (ABCs)',
        'Administer oxygen if SpO2 < 95%',
        'Establish IV access for medications',
        'Continuous cardiac monitoring',
        'Prepare crash cart if needed',
        'Notify attending physician immediately',
        'Document all interventions and responses',
        'Consider ICU transfer if condition deteriorates'
      ],
      warning: [
        'Increase monitoring frequency to every 15 minutes',
        'Reassess vital signs within 30 minutes',
        'Notify charge nurse of patient status',
        'Review medication administration record',
        'Check for recent changes in condition',
        'Prepare for potential escalation',
        'Ensure call bell is within reach',
        'Educate patient on warning signs',
        'Consider consulting with physician',
        'Update care plan as needed'
      ]
    }

    // Add specific precautions based on vital signs
    const specificPrecautions: string[] = []
    
    if (vitalSigns) {
      if (vitalSigns.bloodPressure?.systolic > 180 || vitalSigns.bloodPressure?.diastolic > 110) {
        specificPrecautions.push('Administer antihypertensive medications as ordered')
        specificPrecautions.push('Monitor for signs of hypertensive crisis')
      }
      
      if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) {
        specificPrecautions.push('Continuous ECG monitoring')
        specificPrecautions.push('Check for cardiac medications')
      }
      
      if (vitalSigns.oxygenSaturation < 90) {
        specificPrecautions.push('Immediate oxygen supplementation')
        specificPrecautions.push('Consider airway positioning')
      }
      
      if (vitalSigns.temperature > 101.5) {
        specificPrecautions.push('Administer antipyretics as ordered')
        specificPrecautions.push('Monitor for signs of infection')
      }
    }

    return [...basePrecautions[severity], ...specificPrecautions]
  }

  // Create a new patient alert
  async createPatientAlert(
    patientId: string, 
    patientName: string, 
    room: string, 
    severity: 'critical' | 'warning',
    vitalSigns?: any
  ): Promise<PatientAlert> {
    const precautions = await this.generatePrecautions(patientName, severity, vitalSigns)
    
    const alert: PatientAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      patientId,
      patientName,
      room,
      severity,
      timestamp: new Date(),
      message: `${severity === 'critical' ? 'CRITICAL' : 'WARNING'}: ${patientName} in Room ${room} requires immediate attention`,
      precautions,
      resolved: false
    }

    this.alerts.push(alert)

    // Create nurse notification with AI precautions
    const precautionsText = precautions.slice(0, 5).join('; ')
    const notification: NurseNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'patient-alert',
      title: `${severity === 'critical' ? 'Critical' : 'Warning'} Alert: ${patientName}`,
      message: `${alert.message}\n\nAI-Generated Precautions: ${precautionsText}\n\nClick to see all ${precautions.length} precautions.`,
      severity: severity === 'critical' ? 'critical' : 'high',
      timestamp: new Date(),
      read: false,
      actionRequired: true,
      actionUrl: '/nurse/vital-signs',
      patientId,
      precautions: precautions // Store full precautions list
    }

    this.notifications.unshift(notification)
    this.notifyListeners()

    return alert
  }

  // Get all active alerts
  getActiveAlerts(): PatientAlert[] {
    return this.alerts.filter(alert => !alert.resolved)
  }

  // Get all notifications
  getNotifications(): NurseNotification[] {
    return this.notifications
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string, nurseName: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledgedBy = nurseName
      alert.acknowledgedAt = new Date()
      
      // Create acknowledgment notification
      const notification: NurseNotification = {
        id: `ack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'system',
        title: 'Alert Acknowledged',
        message: `${nurseName} acknowledged alert for ${alert.patientName}`,
        severity: 'low',
        timestamp: new Date(),
        read: false,
        actionRequired: false
      }
      
      this.notifications.unshift(notification)
      this.notifyListeners()
    }
  }

  // Resolve alert
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      alert.resolvedAt = new Date()
      
      // Create resolution notification
      const notification: NurseNotification = {
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'system',
        title: 'Alert Resolved',
        message: `Alert for ${alert.patientName} has been resolved`,
        severity: 'low',
        timestamp: new Date(),
        read: false,
        actionRequired: false
      }
      
      this.notifications.unshift(notification)
      this.notifyListeners()
    }
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: NurseNotification[]) => void): void {
    this.listeners.push(listener)
  }

  // Unsubscribe from notification changes
  unsubscribe(listener: (notifications: NurseNotification[]) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  // Get critical alerts count
  getCriticalAlertsCount(): number {
    return this.alerts.filter(a => !a.resolved && a.severity === 'critical').length
  }

  // Get warning alerts count
  getWarningAlertsCount(): number {
    return this.alerts.filter(a => !a.resolved && a.severity === 'warning').length
  }
}

export default AlertService
