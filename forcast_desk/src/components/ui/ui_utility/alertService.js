import { createApp, h } from 'vue'
import Alert from '../_general/Alert.vue'

class AlertService {
  constructor() {
    this.alertContainer = null
    this.init()
  }

  init() {
    // Create a container for alerts if it doesn't exist
    if (!document.getElementById('alert-container')) {
      this.alertContainer = document.createElement('div')
      this.alertContainer.id = 'alert-container'
      document.body.appendChild(this.alertContainer)
    } else {
      this.alertContainer = document.getElementById('alert-container')
    }
  }

  show(options) {
    const {
      type = 'info',
      message,
      duration = 3000,
      dismissible = true
    } = options

    // Create a temporary app for this alert
    const alertApp = createApp({
      render() {
        return h(Alert, {
          type,
          message,
          duration,
          dismissible,
          onDismiss: () => {
            alertApp.unmount()
          }
        })
      }
    })

    // Mount the alert
    const alertElement = document.createElement('div')
    this.alertContainer.appendChild(alertElement)
    alertApp.mount(alertElement)

    // Auto-remove the element after animation
    setTimeout(() => {
      if (alertElement.parentNode) {
        alertElement.parentNode.removeChild(alertElement)
      }
    }, duration + 1000) // Extra time for animation
  }

  success(message, duration = 3000) {
    this.show({ type: 'success', message, duration })
  }

  error(message, duration = 5000) {
    this.show({ type: 'error', message, duration })
  }

  warning(message, duration = 4000) {
    this.show({ type: 'warning', message, duration })
  }

  info(message, duration = 3000) {
    this.show({ type: 'info', message, duration })
  }
}

// Create a singleton instance
const alertService = new AlertService()

export default alertService 