/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EntidadAuditable } from '@/app/shared/entidad/domain/entidadAuditable'
import { Controller } from '@/app/shared/controller/domain/Controller.domain'
import { Endpoint } from '@/app/shared/http/domain/Endpoint'
// CRUD
import { ListableRepository } from '@/app/shared/controller/infraestructure/listable.repository'
import { GuardableRepository } from '@/app/shared/controller/infraestructure/guardable.repository'
import { EditableRepository } from '@/app/shared/controller/infraestructure/editable.repository'
import { EliminableRepository } from '@/app/shared/controller/infraestructure/eliminable.repository'
import { ObtenibleRepository } from '@/app/shared/controller/infraestructure/obtenible.repository'
// Exportar e importar
import { DescargableRepository } from '@/app/shared/controller/infraestructure/listado/descargable.repository'
import { ImportableRepository } from '@/app/shared/controller/infraestructure/listado/importable.repository'
import {
  columnaImportable,
  Importable,
} from '@/app/shared/importable/domain/importable'
import { HttpResponsePut } from '@/app/shared/http/domain/HttpResponse'
import { ResponseItem } from '@/app/shared/controller/domain/ResponseItem'

export abstract class TransaccionSimpleController<T extends EntidadAuditable>
  implements Controller<T>, Importable<T>
{
  // Repositorios
  private obtenibleRepository: ObtenibleRepository<T> // GET
  private guardableRepository: GuardableRepository<T> // POST
  private editableRepository: EditableRepository<T> // PUT
  private eliminableRepository: EliminableRepository<T> // DEL
  private listableRepository: ListableRepository<T> // GET - LISTA
  private descargableRepository: DescargableRepository
  private importableRepository: ImportableRepository<T>

  protected constructor(endpoint: Endpoint) {
    this.obtenibleRepository = new ObtenibleRepository(endpoint)
    this.guardableRepository = new GuardableRepository(endpoint)
    this.editableRepository = new EditableRepository(endpoint)
    this.eliminableRepository = new EliminableRepository(endpoint)
    this.listableRepository = new ListableRepository(endpoint)
    this.descargableRepository = new DescargableRepository(endpoint)
    this.importableRepository = new ImportableRepository(endpoint)
  }

  async listar<C = T>(params?: any) {
    return this.listableRepository.listar<C>(params)
  }

  async obtener<C = T>(id: number | null, params?: any) {
    if (id === null) {
      throw new Error('No se puede obtener el recurso con id null')
    }
    return this.obtenibleRepository
      .obtenerID<C>(id, params)
      .then((response: any) => {
        return {
          response,
          result: response.data,
        }
      })
  }

  async guardar(item: T, params?: any) {
    return this.guardableRepository
      .guardar(item, params)
      .then((response: any) => {
        return {
          response,
          result: response.data.modelo,
        }
      })
  }

  async editar(
    item: T,
    params?: any
  ): Promise<ResponseItem<T, HttpResponsePut<T>>> {
    if (item.id === null) {
      throw new Error('No se puede editar el recurso con id null')
    }
    return await this.editableRepository.editar(item.id, item, params)
  }

  async eliminar(id: number | null, params?: any) {
    if (id === null) {
      throw new Error('No se puede editar el recurso con id null')
    }

    return this.eliminableRepository
      .eliminar(id, params)
      .then((response: any) => {
        return {
          response,
          result: response.data.modelo,
        }
      })
  }

  /* async editarParcial(
    id: number | null,
    clave: string,
    valor: any,
    params?: any
  ) {
    if (id === null) {
      throw new Error("No se puede editar el recurso con id null.")
    }

    return this.editableRepository
      .editarParcial(id, clave, valor, params)
      .then((response: any) => {
        return {
          response,
          result: response.data.modelo,
        }
      })
  } */

  async descargarListado(params?: any) {
    return this.descargableRepository
      .descargarListado(params)
      .then((response: any) => {
        return {
          response,
          result: response.data.modelo,
        }
      })
  }

  async importarListado(listado: T[], params?: any) {
    if (listado.length === 0) {
      throw new Error('No se puede importar un listado vacio.')
    }
    return this.importableRepository
      .importarListado(listado, params)
      .then((response: any) => {
        return {
          response,
          result: response.data.modelo,
        }
      })
  }

  abstract obtenerPlantillaImportable(): columnaImportable<T>[]
}
