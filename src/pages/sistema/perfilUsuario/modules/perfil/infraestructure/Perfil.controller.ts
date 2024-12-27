import { EditableController } from '@/app/shared/infraestructure/domain/EditableController.domain'
import { EliminableController } from '@/app/shared/infraestructure/domain/EliminableController.domain'
import { ResponseItem } from '@/app/shared/infraestructure/domain/ResponseItem'
import { EditableRepository } from '@/app/shared/infraestructure/infraestructure/editable.repository'
import { EliminableRepository } from '@/app/shared/infraestructure/infraestructure/eliminable.repository'
import {
  HttpResponseDelete,
  HttpResponsePut,
} from '@/app/shared/http/domain/HttpResponse'
import { endpoints } from '@/@config/api.config'
import { Perfil } from '../domain/Perfil.domain'

export class PerfilController<T extends Perfil>
  implements EditableController<T>, EliminableController<T>
{
  private editableRepository: EditableRepository<T>
  private eliminableRepository: EliminableRepository<T>

  constructor() {
    this.editableRepository = new EditableRepository(endpoints.perfil_usuario)
    this.eliminableRepository = new EliminableRepository(
      endpoints.perfil_usuario
    )
  }

  async editar(item: T): Promise<ResponseItem<T, HttpResponsePut<T>>> {
    return await this.editableRepository.editar(item.id, item)
  }

  async eliminar(id: number): Promise<ResponseItem<T, HttpResponseDelete<T>>> {
    return await this.eliminableRepository.eliminar(id)
  }
}
