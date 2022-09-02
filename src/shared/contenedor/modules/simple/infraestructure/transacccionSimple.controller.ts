/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Controller } from 'shared/controller/domain/Controller.domain'
import { Endpoint } from 'shared/http/domain/Endpoint'
// CRUD
import { ListableRepository } from 'shared/controller/infraestructure/listable.repository'
import { GuardableRepository } from 'shared/controller/infraestructure/GuardableRepository'
import { EditableRepository } from 'shared/controller/infraestructure/editable.repository'
import { EliminableRepository } from 'shared/controller/infraestructure/eliminable.repository'
import { ConsultableRepository } from 'shared/controller/infraestructure/ConsultableRepository'
// Exportar e importar
// import { DescargableRepository } from 'shared/controller/infraestructure/listado/descargable.repository'
// import { ImportableRepository } from 'shared/controller/infraestructure/listado/importable.repository'
/* import {
  columnaImportable,
  Importable,
} from 'shared/importable/domain/importable' */
// import { HttpResponsePut } from 'shared/http/domain/HttpResponse'
// import { ResponseItem } from 'shared/controller/domain/ResponseItem'

export abstract class TransaccionSimpleController<T extends EntidadAuditable>
  implements Controller<T>
{
  //, Importable<T>
  // Repositorios
  private consultableRepository: ConsultableRepository<T> // GET
  private guardableRepository: GuardableRepository<T> // POST
  private editableRepository: EditableRepository<T> // PUT
  private eliminableRepository: EliminableRepository<T> // DEL
  private listableRepository: ListableRepository<T> // GET - LISTA
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

  /* async obtener<C = T>(id: number | null, params?: any) {
    if (id === null) {
      throw new Error('No se puede obtener el recurso con id null')
    }
    return this.consultableRepository
      .obtenerID<C>(id, params)
      .then((response: any) => {
        return {
          response,
          result: response.data,
        }
      })
  } */

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
