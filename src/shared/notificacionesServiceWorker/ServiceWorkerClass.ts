export class ServiceWorkerClass {
    action?: string
    titulo: string
    mensaje: string
    link: string
    icono?: string
    badge?: string

    constructor() {
        this.action = "notificacionPush"
        this.titulo = ""
        this.mensaje = ""
        this.link = ""
        this.icono = ""
        this.badge = ""
    }
}