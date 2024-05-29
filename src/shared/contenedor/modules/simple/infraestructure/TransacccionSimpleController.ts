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
import { ListableActivityRepository } from 'shared/controller/infraestructure/ListableActivitiesRepository'
import { GuardableActivityRepository } from 'shared/controller/infraestructure/GuardableActivityRepository'
import { GuardableListadoRepository } from 'shared/controller/infraestructure/GuardableListadoRepository'
import { EditableListadoRepository } from 'shared/controller/infraestructure/EditableListadoRepository'

export abstract class TransaccionSimpleController<T extends EntidadAuditable>
  implements Controller<T> {
  //, Importable<T>
  // Repositorios
  private consultableRepository: ConsultableRepository<T>
  private guardableRepository: GuardableRepository<T>
  private guardableListadoRepository: GuardableListadoRepository<T>
  private guardableFileRepository: GuardableFileRepository<T>
  private guardableActivityRepository: GuardableActivityRepository<T>
  private editableRepository: EditableRepository<T>
  private editableListadoRepository: EditableListadoRepository<T>
  private eliminableRepository: EliminableRepository<T>
  private eliminableFileRepository: EliminableFileRepository<T>
  private listableRepository: ListableRepository<T>
  private listableFileRepository: ListableFileRepository<T>
  private listableActivityRepository: ListableActivityRepository<T>
  private filtrableRepository: FiltrableRepository<T>
  private descargableRepository: DescargableRepository
  // private importableRepository: ImportableRepository<T>

  protected constructor(endpoint: Endpoint) {
    this.consultableRepository = new ConsultableRepository(endpoint)
    this.guardableRepository = new GuardableRepository(endpoint)
    this.guardableListadoRepository = new GuardableListadoRepository(endpoint)
    this.guardableFileRepository = new GuardableFileRepository(endpoint)
    this.guardableActivityRepository = new GuardableActivityRepository(endpoint)
    this.editableRepository = new EditableRepository(endpoint)
    this.editableRepository = new EditableRepository(endpoint)
    this.editableListadoRepository = new EditableListadoRepository(endpoint)
    this.eliminableFileRepository = new EliminableFileRepository(endpoint)
    this.eliminableRepository = new EliminableRepository(endpoint)
    this.listableRepository = new ListableRepository(endpoint)
    this.listableFileRepository = new ListableFileRepository(endpoint)
    this.listableActivityRepository = new ListableActivityRepository(endpoint)
    this.filtrableRepository = new FiltrableRepository(endpoint)
    this.descargableRepository = new DescargableRepository(endpoint)
    // this.importableRepository = new ImportableRepository(endpoint)
  }

  async listarActividades<C = T>(id: number, params?: any) {
    return this.listableActivityRepository.listarActividades<C>(id, params)
  }
  async listarFiles<C = T>(id: number, params?: any) {
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

  async guardarActivities(id: number, entidad: T) {
    return await this.guardableActivityRepository.guardarActividades(id, entidad)
  }
  async guardarFiles(id: number, entidad: T) {
    return await this.guardableFileRepository.guardarArchivos(id, entidad)
  }
  async guardar(entidad: T, params?: ParamsType) {
    return await this.guardableRepository.guardar(entidad, params)
  }

  async guardarListado(listado: T[], params?: ParamsType) {
    return await this.guardableListadoRepository.guardarListado(listado, params)
  }

  // Promise<ResponseItem<T, HttpResponsePut<T>>>
  async editar(entidad: T, params?: any) {
    return await this.editableRepository.editar(entidad.id, entidad, params)
  }

  async editarListado(listado: T[], params?: any) {
    return await this.editableListadoRepository.editarListado(listado, params)
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
