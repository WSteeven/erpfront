import { EditableController } from '@/app/shared/controller/domain/EditableController.domain'
import { ResponseItem } from '@/app/shared/controller/domain/ResponseItem'
import { EditableRepository } from '@/app/shared/controller/infraestructure/editable.repository'
import { HttpResponsePut } from '@/app/shared/http/domain/HttpResponse'
import { endpoints } from '@/@config/api.config'
import { CambiarContrasena } from '../domain/CambiarContrasena.domain'

export class CambiarContrasenaController<T extends CambiarContrasena>
  implements EditableController<T>
{
  private editableRepository: EditableRepository<T>

  constructor() {
    this.editableRepository = new EditableRepository(
      endpoints.cambiar_contrasena
    )
  }

  async editar(item: T): Promise<ResponseItem<T, HttpResponsePut<T>>> {
    return await this.editableRepository.editar(null, item)
  }
}
