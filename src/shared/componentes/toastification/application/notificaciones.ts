import ToastificationContent from "@shared/componentes/toastification/view/toastificationContent.vue"
import {createToastInterface} from "vue-toastification"

export class Notificaciones {
  private toast = createToastInterface({
    hideProgressBar: true,
    closeOnClick: false,
    closeButton: false,
    icon: false,
    timeout: 3000,
    transition: "Vue-Toastification__fade",
  })

  obtenerMensaje(mensaje: string | string[]): string {
    if (Array.isArray(mensaje)) return mensaje.join("<br/>")
    return mensaje
  }

  notificarAdvertencia(mensaje: string | string[]): void {
    this.toast(
      {
        component: ToastificationContent,
        props: {
          title: "Advertencia",
          icon: "bi bi-exclamation-triangle",
          variant: "warning",
          text: this.obtenerMensaje(mensaje),
        },
      },
      {
        toastClassName: "whiteBackground",
      }
    )
  }

  notificarError(mensaje: string | string[]): void {
    this.toast(
      {
        component: ToastificationContent,
        props: {
          title: "Error",
          icon: "bi bi-exclamation-octagon",
          variant: "danger",
          text: this.obtenerMensaje(mensaje),
        },
      },
      {
        toastClassName: "whiteBackground",
      }
    )
  }

  notificarCorrecto(mensaje: string | string[]): void {
    this.toast(
      {
        component: ToastificationContent,
        props: {
          title: "Correcto",
          icon: "bi bi-check",
          variant: "success",
          text: this.obtenerMensaje(mensaje),
        },
      },
      {
        toastClassName: "whiteBackground",
      }
    )
  }

  notificarPersistente(
    mensaje: string | string[],
    variant = "success",
    icon = "bi bi-exclamation-octagon"
  ): void {
    this.toast(
      {
        component: ToastificationContent,
        props: {
          title: "Correcto",
          text: this.obtenerMensaje(mensaje),
          icon,
          variant,
        },
      },
      {
        toastClassName: "whiteBackground",
      }
    )
  }
}
