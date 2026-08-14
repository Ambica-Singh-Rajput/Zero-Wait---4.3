import { NursePatient, VitalSigns } from '../data/nursePatientData'
import AlertService from './alertService'

export class VitalSignsMonitor {
  private static instance: VitalSignsMonitor
  private monitoringInterval: NodeJS.Timeout | null = null
  private alertService: AlertService
  private lastAlerts: Map<string, Date> = new Map()
  private readonly ALERT_COOLDOWN = 5 * 60 * 1000 // 5 minutes between alerts for same patient

  private constructor() {
    this.alertService = AlertService.getInstance()
  }

  static getInstance(): VitalSignsMonitor {
    if (!VitalSignsMonitor.instance) {
      VitalSignsMonitor.instance = new VitalSignsMonitor()
    }
    return VitalSignsMonitor.instance
  }

  // Start monitoring vital signs
  startMonitoring(patients: NursePatient[]): void {
    console.log('Starting vital signs monitoring for', patients.length, 'patients')
    
    // Clear existing interval
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    // Monitor every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.checkVitalSigns(patients)
    }, 30000)

    // Initial check
    this.checkVitalSigns(patients)
  }

  // Stop monitoring
  stopMonitoring(): void {
    console.log('Stopping vital signs monitoring')
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
  }

  // Check all patients' vital signs
  private async checkVitalSigns(patients: NursePatient[]): Promise<void> {
    const now = new Date()
    
    for (const patient of patients) {
      if (patient.vitalSigns && patient.vitalSigns.length > 0) {
        const latestVitalSign = patient.vitalSigns[0]
        const status = latestVitalSign.status
        
        // Check if patient needs notification
        if (status === 'critical' || status === 'warning') {
          const lastAlertTime = this.lastAlerts.get(patient.id)
          const canAlert = !lastAlertTime || (now.getTime() - lastAlertTime.getTime() > this.ALERT_COOLDOWN)
          
          if (canAlert) {
            await this.sendVitalSignsAlert(patient, latestVitalSign, status)
            this.lastAlerts.set(patient.id, now)
          }
        }
      }
    }
  }

  // Send alert for abnormal vital signs
  private async sendVitalSignsAlert(
    patient: NursePatient, 
    vitalSign: VitalSigns, 
    status: 'warning' | 'critical'
  ): Promise<void> {
    try {
      console.log(`Sending ${status} alert for ${patient.name} in Room ${patient.room}`)
      
      // Create alert through AlertService
      const alert = await this.alertService.createPatientAlert(
        patient.id,
        patient.name,
        patient.room,
        status,
        vitalSign
      )

      console.log(`Vital signs alert sent successfully:`, alert)
    } catch (error) {
      console.error('Failed to send vital signs alert:', error)
    }
  }

  // Get current monitoring status
  isMonitoring(): boolean {
    return this.monitoringInterval !== null
  }

  // Get last alert times for debugging
  getLastAlerts(): Map<string, Date> {
    return new Map(this.lastAlerts)
  }

  // Check specific patient immediately
  async checkPatientVitalSigns(patient: NursePatient): Promise<void> {
    if (patient.vitalSigns && patient.vitalSigns.length > 0) {
      const latestVitalSign = patient.vitalSigns[0]
      const status = latestVitalSign.status
      
      if (status === 'critical' || status === 'warning') {
        await this.sendVitalSignsAlert(patient, latestVitalSign, status)
        this.lastAlerts.set(patient.id, new Date())
      }
    }
  }

  // Clear alert cooldown for a patient (for testing)
  clearAlertCooldown(patientId: string): void {
    this.lastAlerts.delete(patientId)
  }
}

export default VitalSignsMonitor
