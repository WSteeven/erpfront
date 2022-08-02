// import {Validador} from "@shared/validadores/domain/validador.domain"
import {reactive, UnwrapRef} from "vue"
import {Controller} from "@shared/controller/domain/Controller.domain"
import {ListableController} from "@shared/controller/domain/ListableController.domain"
import {EntidadAuditable} from "@shared/entidad/domain/entidadAuditable"
import {Instanciable} from "@shared/entidad/domain/instanciable"
import {listadoAuxiliar} from "../domain/listable"
import {Referencias} from "../domain/Referencias/referencias"
import {useConfirmaciones} from "../../componentes/toastification/application/confirmaciones"
import {compararObjetos} from "../../utils"
// Componentes
import {Notificaciones} from "@shared/componentes/toastification/application/notificaciones"
import {Cargando} from "@componentes/cargando/application/cargando.application"

export abstract class Contenedor<
  T extends EntidadAuditable,
  R extends Referencias<T>,
  C extends Controller<T>
> {
  protected refs: R
  // referencias internas de la entidad a la que pertenece la transaccion
  protected readonly entidad: UnwrapRef<T>
  protected readonly entidad_vacia: UnwrapRef<T>
  protected readonly entidad_copia: UnwrapRef<T>
  // protected readonly utils = new Utils()
  // protected readonly modal = useBvModal()
  protected readonly notificaciones = new Notificaciones()
  protected readonly confirmaciones = useConfirmaciones()
  protected readonly cargando = new Cargando()
  protected argsDefault: any
  protected readonly controller: C
  // private validaciones: Validador[] = []

  constructor(entidad: Instanciable, controller: C, refs: R) {
    this.controller = controller
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
  /* async ejecutarValidaciones() {
    try {
      for (const validacion of this.validaciones) {
        if (!(await validacion.validar())) return false
      }
    } catch (error) {
      if (error instanceof Error) {
        this.notificaciones.notificarAdvertencia(error.message)
      }
      return false
    }
    return true
  } */

  // operaciones de la lista

  /**
   *Agrega un elemento validador, que se ejecutará cuando se requiera guardar o editar
   * @param {Validador} validadores una, o varias instancias que implemente la interfaz.
   */
  /* agregarValidaciones(...validadores: Validador[]) {
    this.validaciones.push(...validadores)
  }

  limpiarValidaciones() {
    this.validaciones.splice(1, this.validaciones.length - 1)
  } */

  protected indexElementoEnLista(id: number | null): number {
    return this.refs.listado.value.findIndex(
      (elemento: T) => elemento.id === id
    )
  }

  protected agregarElementoListadoActual(modelo: T): void {
    this.refs.listado.value = [...this.refs.listado.value, modelo]
  }

  protected eliminarElementoListaActual(modelo: T): void {
    const indexElemento = this.indexElementoEnLista(modelo.id)
    if (indexElemento >= 0) {
      this.refs.listado.value.splice(indexElemento, 1)
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
    const hashValues: {[key: number]: keyof T} = {} // hash relacional key/indice
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
        requests.push(controlador.listar({...this.argsDefault, ...args}))
      } else {
        requests.push(
          new Promise<any[]>((resolve) => resolve(configListado as any))
        )
      }

      // asigna por defecto listado vacio para evitar errores de template
      this.refs.listadosAuxiliares[key] = []
    }

    // Ejecuta la lista de peticiones
    return Promise.allSettled(requests).then((results) => {
      results.forEach((elem, index) => {
        // Asigna los valores a la referencia si se completo la peticion
        if (elem.status === "fulfilled") {
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

  /* protected async preguntarSiguienteAccion(mensaje: string) {
    return await this.modal
      .msgBoxConfirm(mensaje, {
        title: "Confirmar la acción",
        size: "md",
        okVariant: "primary",
        okTitle: "Continuar",
        cancelTitle: "Cancelar",
        cancelVariant: "outline-secondary",
        hideHeaderClose: false,
        centered: true,
      })
      .then((rersult: boolean) => rersult)
  } */

  /**
   * Verifica que una entidad haya cambiado sus propiedades.
   * @param entidad entidad a comparar con la copia de un objeto nuevo
   * @returns true, cuando se haya cambiado algun parametro de la entidad.
   */
  protected seCambioEntidad(transaccion: UnwrapRef<T>): boolean {
    return compararObjetos(transaccion, this.entidad)
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
