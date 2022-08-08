import { EntidadAuditable } from '@/app/shared/entidad/domain/entidadAuditable'
import { Instanciable } from '@/app/shared/entidad/domain/instanciable'
import { ReferenciasSimples } from '@/app/shared/contenedor/modules/simple/domain/referenciasSimples'
import { TransaccionSimpleController } from '@/app/shared/contenedor/modules/simple/infraestructure/transacccionSimple.controller'
import { HooksSimples } from '../domain/hooksSimples'
import { Contenedor } from '../../../application/contenedor.mixin'
import { acciones } from '@config/utils.config'
import { Catalogos } from '@/app/sistema/permisos/permisos'
import {
  descargarArchivo,
  isAxiosError,
  notificarMensajesError,
} from '@/app/shared/utils'

import { markRaw, watch } from 'vue'
import { useForm } from 'vee-validate'
import { columnaImportable } from '@/app/shared/importable/domain/importable'

export class ContenedorSimpleMixin<
  T extends EntidadAuditable
> extends Contenedor<T, ReferenciasSimples<T>, TransaccionSimpleController<T>> {
  private hooks = new HooksSimples()
  private myForm = useForm()
  private readonly validateForm = () => this.myForm.validate()
  private readonly resetForm = () => this.myForm.resetForm
  private readonly refreshForm = (entidad: any) =>
    this.myForm.setValues(entidad)

  constructor(
    entidad: Instanciable,
    controller: TransaccionSimpleController<T>,
    catalogo: keyof Catalogos
  ) {
    super(entidad, controller, markRaw(new ReferenciasSimples(catalogo)))
    this.argsDefault = {}
    this.refs.errors = this.myForm.errors
    // this.argsDefault = {empresa: this.refs.empresaID.value}

    // validaciones para el formulario
    // this.agregarValidaciones(new ValidarFormulario(this.refs.validador))
  }

  private async cargarVista(callback: () => Promise<void>): Promise<void> {
    this.cargando.activar()
    await callback()
    this.cargando.desactivar()
  }

  /**
   * metodo publico que expone las funciones genericas de comportamiento
   * para una transaccion simple
   * @returns listar, consultar, guardar, editar, eliminar, cambiarEstado, descargarListado, imprimirListado, importarListado, reestablecer, obtenerPlantilla
   */
  useComportamiento(): any {
    const listar = this.listarTransacccionSimple.bind(this)
    const consultar = this.consultarTransaccionSimple.bind(this)
    const guardar = this.guardarTransaccionSimple.bind(this)
    const editar = this.editarTransaccionSimple.bind(this)
    const eliminar = this.eliminarTransaccionSimple.bind(this)
    // const cambiarEstado = this.cambiarEstadoTransaccionSimple.bind(this)
    // const imprimirListado = this.imprimirListadoActual.bind(this)
    const descargarListado = this.descargarListadoActual.bind(this)
    const importarListado = this.importarListado.bind(this)
    // const configurarDefecto = this.configurarDefecto.bind(this)
    const obtenerListados = this.obtenerListados.bind(this)
    const reestablecer = this.reestablecerTransaccionSimple.bind(this)
    const cargarVista = this.cargarVista.bind(this)
    const obtenerPlantilla = this.obtenerPlantilla.bind(this)
    const notificaciones = this.notificaciones

    return {
      listar,
      consultar,
      guardar,
      editar,
      eliminar,
      // cambiarEstado,
      descargarListado,
      // imprimirListado,
      importarListado,
      reestablecer,
      obtenerPlantilla,
      obtenerListados,
      // configurarDefecto,
      cargarVista,
      notificaciones,
    }
  }

  useReferencias(): any {
    return { entidad: this.entidad as T, ...this.refs }
  }

  useHooks(): any {
    const onBeforeGuardar = (callback: () => void) =>
      this.hooks.bindHook('onBeforeGuardar', callback)
    const onGuardado = (callback: () => void) =>
      this.hooks.bindHook('onGuardado', callback)
    const onBeforeConsultar = (callback: () => void) =>
      this.hooks.bindHook('onBeforeConsultar', callback)
    const onConsultado = (callback: () => void) =>
      this.hooks.bindHook('onConsultado', callback)
    const onBeforeModificar = (callback: () => void) =>
      this.hooks.bindHook('onBeforeModificar', callback)
    const onModificado = (callback: () => void) =>
      this.hooks.bindHook('onModificado', callback)
    const onReestablecer = (callback: () => void) =>
      this.hooks.bindHook('onReestablecer', callback)

    return {
      onBeforeGuardar,
      onGuardado,
      onBeforeConsultar,
      onConsultado,
      onBeforeModificar,
      onModificado,
      onReestablecer,
    }
  }

  protected async importarListado(listado: T[]): Promise<void> {
    try {
      const { response } = await this.controller.importarListado(
        listado,
        this.argsDefault
      )
      this.notificaciones.notificarCorrecto([
        response.data.mensaje,
        'Actualice la página, por favor.',
      ])
    } catch (error: any) {
      if (isAxiosError(error)) {
        const mensajes: string[] = error.erroresValidacion
        notificarMensajesError(mensajes)
      }
    }
  }

  protected obtenerPlantilla(): columnaImportable<T>[] {
    return this.controller.obtenerPlantillaImportable()
  }

  private async consultarTransaccionSimple(data: T) {
    this.hooks.onBeforeConsultar()
    this.cargarVista(async () => {
      const { result } = await this.controller.obtener(
        data.id,
        this.argsDefault
      )
      this.entidad.hydrate(result)
      this.entidad_copia.hydrate(this.entidad)
      this.refs.tabs.value?.mostrarFormulario()
      this.refreshForm(this.entidad)
    })
    this.resetForm()
    const stop = watch(this.entidad, () => {
      if (this.entidad.id !== null) {
        this.hooks.onConsultado()
        stop()
      }
    })
  }

  private async listarTransacccionSimple(params: any, append: boolean) {
    this.cargarVista(async () => {
      try {
        const { result } = await this.controller.listar({
          ...this.argsDefault,
          ...params,
        })
        if (append) this.refs.listado.value.push(...result)
        else this.refs.listado.value = result
      } catch (error) {
        this.notificaciones.notificarError('Error al obtener el listado.')
      }
    })
  }

  private async reestablecerTransaccionSimple() {
    //preguntar = false) {
    /* let reestablecer = false
    if (preguntar) {
      if (this.seCambioEntidad(this.entidad_copia)) {
        reestablecer = await this.confirmaciones.confirmarAccion(
          "Hay cambios sin guardar, Desea continuar?"
        )
      }
    } */
    // if (reestablecer) {
    // this.entidad_copia.hydrate(this.entidad_vacia)
    this.entidad.hydrate(this.entidad_vacia)
    this.refs.accion.value = acciones.nuevo
    this.hooks.onReestablecer()
    // nextTick(() => this.refs.validador.value.reset())
    // }
  }

  private async guardarTransaccionSimple(data: T) {
    this.hooks.onBeforeGuardar()
    if (this.seCambioEntidad(this.entidad_vacia)) {
      if ((await this.validateForm()).valid) {
        try {
          const { response } = await this.controller.guardar(
            data,
            this.argsDefault
          )

          this.notificaciones.notificarCorrecto(response.data.mensaje)
          this.agregarElementoListadoActual(response.data.modelo)
          this.reestablecerTransaccionSimple()
          this.resetForm()
          this.hooks.onGuardado()
        } catch (error: any) {
          if (isAxiosError(error)) {
            const mensajes: string[] = error.erroresValidacion
            await notificarMensajesError(mensajes)
          }
        }
      } else {
        this.notificaciones.notificarAdvertencia('Verifique el formulario')
      }
    } else {
      this.notificaciones.notificarAdvertencia(
        'No se ha efectuado ningun cambio'
      )
      await this.reestablecerTransaccionSimple()
    }
  }

  private async editarTransaccionSimple(data: T, resetFormulario = true) {
    this.hooks.onBeforeModificar()

    if (!this.seCambioEntidad(this.entidad_copia)) {
      return this.notificaciones.notificarAdvertencia(
        'No se ha efectuado ningun cambio'
      )
    }

    if (!(await this.validateForm()).valid) {
      return this.notificaciones.notificarAdvertencia('Verifique el formulario')
    }

    try {
      const { response, result: modelo } = await this.controller.editar(
        data,
        this.argsDefault
      )
      this.notificaciones.notificarCorrecto(response.data.mensaje)
      this.actualizarElementoListadoActual(modelo)
      if (resetFormulario) await this.reestablecerTransaccionSimple()
      this.hooks.onModificado()
    } catch (error: any) {
      if (isAxiosError(error)) {
        const mensajes: string[] = error.erroresValidacion
        notificarMensajesError(mensajes)
      } else {
        this.notificaciones.notificarError(error.message)
      }
    }
  }

  private async eliminarTransaccionSimple(data: T, callback?: () => void) {
    this.confirmaciones.confirmarAccion(
      'Esta seguro que desea eliminar?',
      'Si, aceptar',
      'No, cancelar',
      () => {
        this.controller
          .eliminar(data.id, this.argsDefault)
          .then(({ response }) => {
            this.notificaciones.notificarCorrecto(response.data.mensaje)
            this.eliminarElementoListaActual(data)
            this.reestablecerTransaccionSimple()
            if (callback) callback()
          })
          .catch((error) => {
            this.notificaciones.notificarError(error.message)
          })
      }
    )
  }

  /* private cambiarEstadoTransaccionSimple(data: T, meta: any) {
    this.controller
      .editarParcial(data.id, "estado", meta.estado, this.argsDefault)
      .then(({response}) => {
        this.notificaciones.notificarCorrecto(response.data.mensaje)
        this.actualizarElementoListadoActual(response.data.modelo)
      })
      .catch((error) => {
        if (error.response.data?.mensaje) {
          this.notificaciones.notificarError(error.response.data?.mensaje)
        }
      })
  } */

  private descargarListadoActual(formato: string) {
    if (this.refs.listado.value.length !== 0) {
      const paramsListado: { [key: string]: any } = { opcion: 'print' }

      if (formato !== 'pdf') {
        paramsListado.opcion = 'export'
        paramsListado.formato = formato
      }

      this.controller
        .descargarListado(paramsListado)
        .then((response: any) => {
          descargarArchivo(response.response.data, this.refs.catalogo, formato)
        })
        .catch(() =>
          this.notificaciones.notificarError(
            'No se consiguio obtener el archivo del servidor.'
          )
        )
    } else {
      this.notificaciones.notificarAdvertencia('No hay datos para exportar')
    }
  }

  // importaciones

  /* private imprimirListadoActual() {
    if (this.refs.listado.value.length !== 0) {
      this.controller
        .descargarListado({...this.argsDefault, ...{opcion: "print"}})
        .then((data: any) => this.utils.imprimirArchivo(data, "pdf"))
        .catch(() =>
          this.notificaciones.notificarError(
            "No se consiguio imprimir el archivo."
          )
        )
    }
  } */
}
