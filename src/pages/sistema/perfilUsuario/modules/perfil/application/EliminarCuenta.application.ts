import { UnwrapRef } from 'vue'
import { Perfil } from '../domain/Perfil.domain'
import { PerfilController } from '../infraestructure/Perfil.controller'
import { Notificaciones } from '@/app/shared/componentes/toastification/application/notificaciones'

export class EliminarCuenta {
  private entidad: UnwrapRef<Perfil>
  private controller: PerfilController<Perfil>

  constructor(entidad: Perfil, controller: PerfilController<Perfil>) {
    this.entidad = entidad
    this.controller = controller
  }

  public async execute(): Promise<void> {
    const notificaciones = new Notificaciones()

    try {
      if (this.entidad.id !== null) {
        await this.controller.eliminar(this.entidad.id)
        notificaciones.notificarCorrecto(
          'La cuenta ha sido eliminada con éxito!'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
}
