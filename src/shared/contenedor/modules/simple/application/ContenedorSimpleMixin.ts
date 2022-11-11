import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Contenedor } from '../../../application/contenedor.mixin'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { HooksSimples } from '../domain/hooksSimples'
import { acciones } from 'config/utils'
import { isAxiosError, notificarMensajesError } from 'shared/utils'

import { markRaw, watch } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { Referencias } from 'shared/contenedor/domain/Referencias/referencias'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useAuthenticationStore } from 'stores/authentication'
import { useRouter } from 'vue-router'

export class ContenedorSimpleMixin<
  T extends EntidadAuditable
> extends Contenedor<T, Referencias<T>, TransaccionSimpleController<T>> {
  private hooks = new HooksSimples()
  private notificaciones = useNotificaciones()
  private statusEssentialLoading = new StatusEssentialLoading()

  constructor(
    entidad: Instanciable,
    controller: TransaccionSimpleController<T>
  ) {
    super(entidad, controller, markRaw(new Referencias()))
    // this.argsDefault = {}
  }

  private async cargarVista(callback: () => Promise<void>): Promise<void> {
    this.statusEssentialLoading.activar()
    await callback()
    this.statusEssentialLoading.desactivar()
  }

  useReferencias(): any {
    return { entidad: this.entidad as T, ...this.refs }
  }

  useComportamiento(): any {
    return {
      listar: this.listar.bind(this),
      consultar: this.consultar.bind(this),
      guardar: this.guardar.bind(this),
      editar: this.editar.bind(this),
      eliminar: this.eliminar.bind(this),
      reestablecer: this.reestablecer.bind(this),
      obtenerListados: this.obtenerListados.bind(this),
      cargarVista: this.cargarVista.bind(this),
      setValidador: this.setValidador.bind(this),
    }
  }

  useHooks(): any {
    return {
      onBeforeGuardar: (callback: () => void) =>
        this.hooks.bindHook('onBeforeGuardar', callback),
      onGuardado: (callback: () => void) =>
        this.hooks.bindHook('onGuardado', callback),
      onBeforeConsultar: (callback: () => void) =>
        this.hooks.bindHook('onBeforeConsultar', callback),
      onConsultado: (callback: () => void) =>
        this.hooks.bindHook('onConsultado', callback),
      onBeforeModificar: (callback: () => void) =>
        this.hooks.bindHook('onBeforeModificar', callback),
      onModificado: (callback: () => void) =>
        this.hooks.bindHook('onModificado', callback),
      onReestablecer: (callback: () => void) =>
        this.hooks.bindHook('onReestablecer', callback),
    }
  }

  // Consultar
  private async consultar(data: T) {
    //this.verificarAutenticacion()

    this.hooks.onBeforeConsultar()

    this.cargarVista(async () => {
      if (data.id === null) {
        return this.notificaciones.notificarAdvertencia(
          'No se puede consultar el recurso con id null'
        )
      }

      const { result } = await this.controller.consultar(
        data.id,
        this.argsDefault
      )
      this.entidad.hydrate(result)
      this.entidad_copia.hydrate(this.entidad)
      this.refs.tabs.value = 'formulario'
    })

    const stop = watch(this.entidad, () => {
      if (this.entidad.id !== null) {
        this.hooks.onConsultado()
        stop()
      }
    })
  }

  // Listar
  private async listar(params: any, append: boolean) {
    this.cargarVista(async () => {
      try {
        const { result } = await this.controller.listar(params)
        this.refs.currentPageListado.value = result.current_page
        this.refs.nextPageUrl.value = result.next_page_url
        if (append) this.refs.listado.value.push(...result.data)
        else this.refs.listado.value = result
      } catch (error) {
        console.log(error)
        this.notificaciones.notificarError('Error al obtener el listado.')
      }
    })
  }

  private async reestablecer() {
    this.entidad.hydrate(this.entidad_vacia)
    this.refs.accion.value = acciones.nuevo
    this.refs.validador.value?.$reset()
    this.hooks.onReestablecer()
  }

  // Guardar
  private async guardar(data: any, resetOnSaved = true) {
    // this.verificarAutenticacion()

    this.hooks.onBeforeGuardar()

    if (!this.seCambioEntidad(this.entidad_vacia)) {
      return this.notificaciones.notificarAdvertencia(
        'No se ha efectuado ningun cambio'
      )
    }

    if (!(await this.refs.validador.value.$validate())) {
      console.log(this.refs.validador.value.v$)
      return this.notificaciones.notificarAdvertencia('Verifique el formulario')
    }

    this.cargarVista(async () => {
      try {
        const { response } = await this.controller.guardar(
          data,
          this.argsDefault
        )

        this.notificaciones.notificarCorrecto(response.data.mensaje)
        this.agregarElementoListadoActual(response.data.modelo)
        this.entidad.hydrate(response.data.modelo)
        this.hooks.onGuardado()
        if (resetOnSaved) {
          this.reestablecer()
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, this.notificaciones)
        }
      }
    })

    /* const stop = watch(this.entidad, () => {
      if (this.entidad.id !== null) {
        this.hooks.onGuardado()
        stop()
      }
    }) */
  }

  // Editar
  private async editar(data: T, resetOnUpdated = true) {
    //private async editar(resetOnUpdated = true) {
    // this.verificarAutenticacion()

    this.hooks.onBeforeModificar()

    if (this.entidad.id === null) {
      return this.notificaciones.notificarAdvertencia(
        'No se puede editar el recurso con id null'
      )
    }

    if (!this.seCambioEntidad(this.entidad_vacia)) {
      return this.notificaciones.notificarAdvertencia(
        'No se ha efectuado ningun cambio'
      )
    }

    if (!(await this.refs.validador.value.$validate())) {
      return this.notificaciones.notificarAdvertencia('Verifique el formulario')
    }

    this.cargarVista(async () => {
      try {
        const { response, result: modelo } = await this.controller.editar(
          data,
          this.argsDefault
        )
        this.notificaciones.notificarCorrecto(response.data.mensaje)
        this.actualizarElementoListadoActual(modelo)

        if (resetOnUpdated) {
          this.reestablecer()
        }
      } catch (error: any) {
        console.log(error)
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, this.notificaciones)
        } else {
          this.notificaciones.notificarError(error.message)
        }
      }
    })

    this.hooks.onModificado()
  }

  // Eliminar
  private async eliminar(data: T, callback?: () => void) {
    this.verificarAutenticacion()

    this.notificaciones.confirmar('Esta seguro que desea eliminar?', () => {
      if (data.id === null) {
        return this.notificaciones.notificarAdvertencia(
          'No se puede eliminar el recurso con id null'
        )
      }

      this.controller
        .eliminar(data.id, this.argsDefault)
        .then(({ response }) => {
          this.notificaciones.notificarCorrecto(response.data.mensaje)
          this.eliminarElementoListaActual(data)
          this.reestablecer()
          if (callback) callback()
        })
        .catch((error) => {
          this.notificaciones.notificarError(error.message)
        })
    })
  }

  private setValidador(validador) {
    this.refs.validador.value = validador
  }

  private async verificarAutenticacion(): Promise<void> {
    const authentication = useAuthenticationStore()
    const autenticado = await authentication.isUserLoggedIn()
    const router = useRouter()

    if (!autenticado) router.replace({ name: 'Login' })
  }
}