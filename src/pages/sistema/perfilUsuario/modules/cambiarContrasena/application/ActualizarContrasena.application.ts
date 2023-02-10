import { UnwrapRef } from 'vue'
import { Notificaciones } from '@/app/shared/componentes/toastification/application/notificaciones'
import { notificarMensajesError } from '@/app/shared/utils'
import { CambiarContrasena } from '../domain/CambiarContrasena.domain'
import { CambiarContrasenaController } from '../infraestructure/CambiarContrasena.controller'

export class ActualizarContrasena {
  private entidad: UnwrapRef<CambiarContrasena>
  private controller: CambiarContrasenaController<CambiarContrasena>

  constructor(
    entidad: CambiarContrasena,
    controller: CambiarContrasenaController<CambiarContrasena>
  ) {
    this.entidad = entidad
    this.controller = controller
  }

  public async execute(): Promise<void> {
    const notificaciones = new Notificaciones()

    try {
      await this.controller.editar(this.entidad)
      notificaciones.notificarCorrecto('La contraseña se actualizó con éxito!')
    } catch (error: any) {
      const mensajes: string[] = error.erroresValidacion
      notificarMensajesError(mensajes)
    }
  }
}
