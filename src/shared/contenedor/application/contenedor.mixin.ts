// import {Validador} from '@shared/validadores/domain/validador.domain'
import { ListableController } from 'shared/controller/domain/ListableController.domain'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Controller } from 'shared/controller/domain/Controller.domain'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { Referencias } from '../domain/Referencias/referencias'
import { listadoAuxiliar } from '../domain/listable'
import { compararObjetos } from 'shared/utils'
import { reactive, UnwrapRef } from 'vue'
import { Validador } from 'shared/validadores/domain/Validador'
import { useNotificaciones } from 'shared/notificaciones'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
// Componentes

export abstract class Contenedor<
  T extends EntidadAuditable,
  R extends Referencias<T>,
  C extends Controller<T>,
  CF extends ArchivoController
> {
  protected refs: R
  // referencias internas de la entidad a la que pertenece la transaccion
  protected readonly entidad: UnwrapRef<T>
  protected readonly entidad_vacia: UnwrapRef<T>
  protected readonly entidad_copia: UnwrapRef<T>
  protected readonly notificaciones = useNotificaciones()
  // protected readonly utils = new Utils()
  // protected readonly modal = useBvModal()
  protected argsDefault: any
  protected readonly controller: C
  protected readonly controllerFiles: CF | undefined
  private validaciones: Validador[] = []

  constructor(entidad: Instanciable, controller: C, refs: R, controllerFiles?: CF) {
    this.controller = controller
    this.controllerFiles = controllerFiles
    this.refs = refs

    // crear instancias de la entidad
    this.entidad = reactive(new entidad())
    this.entidad_vacia = reactive(new entidad())
    this.entidad_copia = reactive(new entidad())
  }

  /**
   * Veririfica que todas las validaciones devuelvan true.
   * @returns true, cuando todas las validaciones esten correctas
   */
  async ejecutarValidaciones() {
    try {
      for (const validacion of this.validaciones) {
        if (!(await validacion.validar())) return
        //return await validacion.validar()
      }
    } catch (error) {
      if (error instanceof Error) {
        this.notificaciones.notificarAdvertencia(error.message)
      }
      return false
    }
    return true
  }


  /**
   *Agrega un elemento validador, que se ejecutará cuando se requiera guardar o editar
   * @param {Validador} validadores una, o varias instancias que implemente la interfaz.
   */
  agregarValidaciones(...validadores: Validador[]) {
    this.validaciones.push(...validadores)
  }

  limpiarValidaciones() {
    this.validaciones.splice(1, this.validaciones.length - 1)
  }

  /**
   * Operaciones de la lista
   */
  // buscar elemento en el listado
  protected indexElementoEnLista(id: number | null): number {
    return this.refs.listado.value.findIndex(
      (elemento: T) => elemento.id === id
    )
  }
  // buscar el elemento en la lista de archivos
  protected indexElementoEnListaArchivos(id: number | null): number {
    return this.refs.listadoArchivos.value.findIndex(
      (elemento: T) => elemento.id === id
    )
  }

  /**
   * Agregar elementos en los listados
   */
  protected agregarElementoListadoActual(modelo: T): void {
    this.refs.listado.value = [modelo, ...this.refs.listado.value]
  }
  protected agregarElementoListadoArchivosActual(modelo: T): void {
    this.refs.listadoArchivos.value = [modelo, ...this.refs.listadoArchivos.value]
  }

  /**
   * Eliminar el elemento del listado y del listado de archivos
   */
  protected eliminarElementoListaActual(modelo: T): void {
    const indexElemento = this.indexElementoEnLista(modelo.id)
    if (indexElemento >= 0) {
      this.refs.listado.value.splice(indexElemento, 1)
      this.refs.listado.value = [...this.refs.listado.value]
    }
  }
  //eliminar elemento del listado de archivos actual
  protected eliminarElementoListaArchivosActual(modelo: T): void {
    const indexElemento = this.indexElementoEnListaArchivos(modelo.id)
    if (indexElemento >= 0) {
      this.refs.listadoArchivos.value.splice(indexElemento, 1)
      this.refs.listado.value = [...this.refs.listado.value]
    }
  }

  protected actualizarElementoListadoActual(modelo: T): void {
    const indexElemento = this.indexElementoEnLista(modelo.id)
    if (indexElemento >= 0) {
      this.refs.listado.value.splice(indexElemento, 1, modelo)
      this.refs.listado.value = [...this.refs.listado.value]
    }
  }

  protected async obtenerListados<T = any>(
    listadosObtener: listadoAuxiliar<T>
  ): Promise<void> {
    const requests: Promise<any>[] = [] //listado de peticiones
    const hashValues: { [key: number]: keyof T } = {} // hash relacional key/indice
    let indice = 0 //indice de peticion (necesario para colocar en el orden que ejecutan)
    let controlador: ListableController<T> | null
    let args: Record<string, any>

    // mapea los listados disponibles
    for (const key in listadosObtener) {
      hashValues[indice++] = key

      const configListado = listadosObtener[key] as {
        controller: ListableController<T>
        params: Record<string, any>
      }
      // si viene con parametros
      if (configListado.controller && configListado.params) {
        controlador = configListado.controller
        args = configListado.params
        // si viene un array vacio
      } else if (Array.isArray(configListado)) {
        controlador = null
        args = {}
        // si viene solo el controlador
      } else {
        controlador = listadosObtener[key] as ListableController<T>
        args = {}
      }

      // obtiene las peticiones de listado de cada controlador
      if (controlador) {
        requests.push(controlador.listar({ ...this.argsDefault, ...args }))
        // requests.push(controlador.listar()) //{ ...this.argsDefault, ...args }))
      } else {
        requests.push(
          new Promise<any[]>((resolve) => resolve(configListado as any))
        )
      }

      // this.refs.listadosAuxiliares[key] = new Set([])
      // asigna por defecto listado vacio para evitar errores de template
      this.refs.listadosAuxiliares[key] = []
      // window.set(this.refs.listadosAuxiliares, key, [])
    }

    // Ejecuta la lista de peticiones
    return Promise.allSettled(requests).then((results) => {
      results.forEach((elem, index) => {
        // Asigna los valores a la referencia si se completo la peticion
        if (elem.status === 'fulfilled') {
          const key = hashValues[index]
          if (Array.isArray(elem.value)) {
            this.refs.listadosAuxiliares[key].push(...elem.value)
          }
          if (Array.isArray(elem.value.result)) {
            this.refs.listadosAuxiliares[key].push(...elem.value.result)
          }
        }
      })
    })
  }

  /**
   * Verifica que una entidad haya cambiado sus propiedades.
   * @param entidad entidad a comparar con la copia de un objeto nuevo
   * @returns true, cuando se haya cambiado algun parametro de la entidad.
   */
  protected seCambioEntidad(entidad_vacia: UnwrapRef<T>): boolean {
    return compararObjetos(entidad_vacia, this.entidad)
  }

  /**
   * Establece un valor a un atributo de la entidad vacia, la copia y la actual
   * @param key clave de acceso al atributo
   * @param value valor del atributo
   */
  /* protected configurarDefecto(key: keyof UnwrapRef<T>, value: any) {
    this.entidad[key] = value
    this.entidad_copia[key] = value
    this.entidad_vacia[key] = value
  } */
}
