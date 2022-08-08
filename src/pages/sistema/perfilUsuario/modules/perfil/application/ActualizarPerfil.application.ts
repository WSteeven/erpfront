import { UnwrapRef } from 'vue'
import { Perfil } from '../domain/Perfil.domain'
import { PerfilController } from '../infraestructure/Perfil.controller'
import { Notificaciones } from '@/app/shared/componentes/toastification/application/notificaciones'
import { notificarMensajesError } from '@/app/shared/utils'
import store from '@/store'

export class ActualizarPerfil {
  private entidad: UnwrapRef<Perfil>
  private controller: PerfilController<Perfil>

  constructor(entidad: Perfil, controller: PerfilController<Perfil>) {
    this.entidad = entidad
    this.controller = controller
  }

  public async execute(): Promise<void> {
    const notificaciones = new Notificaciones()

    try {
      this.entidad.id = null
      await this.controller.editar(this.entidad)
      notificaciones.notificarCorrecto(
        'El perfil de usuario se actualizó con éxito!'
      )
      store.dispatch('authentication/getUser')
    } catch (error: any) {
      const mensajes: string[] = error.erroresValidacion
      notificarMensajesError(mensajes)
    }
  }
}
