import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Controller } from 'shared/controller/domain/Controller.domain'
import { Endpoint } from 'shared/http/domain/Endpoint'
// CRUD
import { ListableRepository } from 'shared/controller/infraestructure/ListableRepository'
import { GuardableRepository } from 'shared/controller/infraestructure/GuardableRepository'
import { EditableRepository } from 'shared/controller/infraestructure/EditableRepository'
import { EliminableRepository } from 'shared/controller/infraestructure/EliminableRepository'
import { ConsultableRepository } from 'shared/controller/infraestructure/ConsultableRepository'
import { ParamsType } from 'config/types'
import { DescargableRepository } from 'shared/controller/infraestructure/listado/DescargableRepository'
import { FiltrableRepository } from 'shared/controller/infraestructure/FiltrableRepository'
import { ListableFileRepository } from 'shared/controller/infraestructure/ListableFilesRepository'
import { GuardableFileRepository } from 'shared/controller/infraestructure/GuardableFileRepository'
import { EliminableFileRepository } from 'shared/controller/infraestructure/EliminableFileRepository'

export abstract class TransaccionSimpleController<T extends EntidadAuditable>
  implements Controller<T>
{
  //, Importable<T>
  // Repositorios
  private consultableRepository: ConsultableRepository<T>
  private guardableRepository: GuardableRepository<T>
  private guardableFileRepository: GuardableFileRepository<T>
  private editableRepository: EditableRepository<T>
  private eliminableRepository: EliminableRepository<T>
  private eliminableFileRepository: EliminableFileRepository<T>
  private listableRepository: ListableRepository<T>
  private listableFileRepository: ListableFileRepository<T>
  private filtrableRepository: FiltrableRepository<T>
  private descargableRepository: DescargableRepository
  // private importableRepository: ImportableRepository<T>

  protected constructor(endpoint: Endpoint) {
    this.consultableRepository = new ConsultableRepository(endpoint)
    this.guardableRepository = new GuardableRepository(endpoint)
    this.guardableFileRepository = new GuardableFileRepository(endpoint)
    this.editableRepository = new EditableRepository(endpoint)
    this.eliminableFileRepository = new EliminableFileRepository(endpoint)
    this.eliminableRepository = new EliminableRepository(endpoint)
    this.listableRepository = new ListableRepository(endpoint)
    this.listableFileRepository = new ListableFileRepository(endpoint)
    this.filtrableRepository = new FiltrableRepository(endpoint)
    this.descargableRepository = new DescargableRepository(endpoint)
    // this.importableRepository = new ImportableRepository(endpoint)
  }

  async listarFiles<C = T>(id:number, params?: any) {
    return this.listableFileRepository.listarArchivos<C>(id, params)
  }

  async listar<C = T>(params?: any) {
    return this.listableRepository.listar<C>(params)
  }

  async filtrar<C = T>(uri?: any) {
    return this.filtrableRepository.filtrar<C>(uri)
  }

  async consultar(id: number, params?: any) {
    return await this.consultableRepository.consultar(id, params)
  }

  async guardarFiles(id:number, entidad: T) {
    return await this.guardableFileRepository.guardarArchivos(id, entidad)
  }
  async guardar(entidad: T, params?: ParamsType) {
    return await this.guardableRepository.guardar(entidad, params)
  }

  // Promise<ResponseItem<T, HttpResponsePut<T>>>
  async editar(entidad: T, params?: any) {
    return await this.editableRepository.editar(entidad.id, entidad, params)
  }

  async editarParcial(id: number, data: { [key: string]: any }, params?: any) {
    return await this.editableRepository.editarParcial(id, data, params)
  }

  async eliminarFile(id: number, params?: any) {
    return await this.eliminableFileRepository.eliminarFile(id)
  }
  async eliminar(id: number, params?: any) {
    return await this.eliminableRepository.eliminar(id) //, params)
  }

  async descargarListado(params?: any) {
    return await this.descargableRepository.descargarListado(params)
  }
}
