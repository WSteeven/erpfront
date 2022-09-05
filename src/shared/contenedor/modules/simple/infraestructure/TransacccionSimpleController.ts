import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Controller } from 'shared/controller/domain/Controller.domain'
import { Endpoint } from 'shared/http/domain/Endpoint'
// CRUD
import { ListableRepository } from 'shared/controller/infraestructure/ListableRepository'
import { GuardableRepository } from 'shared/controller/infraestructure/GuardableRepository'
import { EditableRepository } from 'shared/controller/infraestructure/EditableRepository'
import { EliminableRepository } from 'shared/controller/infraestructure/EliminableRepository'
import { ConsultableRepository } from 'shared/controller/infraestructure/ConsultableRepository'

export abstract class TransaccionSimpleController<T extends EntidadAuditable>
  implements Controller<T>
{
  //, Importable<T>
  // Repositorios
  private consultableRepository: ConsultableRepository<T>
  private guardableRepository: GuardableRepository<T>
  private editableRepository: EditableRepository<T>
  private eliminableRepository: EliminableRepository<T>
  private listableRepository: ListableRepository<T>
  // private descargableRepository: DescargableRepository
  // private importableRepository: ImportableRepository<T>

  protected constructor(endpoint: Endpoint) {
    this.consultableRepository = new ConsultableRepository(endpoint)
    this.guardableRepository = new GuardableRepository(endpoint)
    this.editableRepository = new EditableRepository(endpoint)
    this.eliminableRepository = new EliminableRepository(endpoint)
    this.listableRepository = new ListableRepository(endpoint)
    // this.descargableRepository = new DescargableRepository(endpoint)
    // this.importableRepository = new ImportableRepository(endpoint)
  }

  async listar<C = T>(params?: any) {
    return this.listableRepository.listar<C>(params)
  }

  async consultar(id: number, params?: any) {
    return await this.consultableRepository.consultar(id, params)
  }

  async guardar(entidad: T, params?: any) {
    return await this.guardableRepository.guardar(entidad, params)
  }

  // Promise<ResponseItem<T, HttpResponsePut<T>>>
  async editar(entidad: T, params?: any) {
    return await this.editableRepository.editar(entidad.id, entidad, params)
  }

  async eliminar(id: number, params?: any) {
    return await this.eliminableRepository.eliminar(id, params)
  }
}
