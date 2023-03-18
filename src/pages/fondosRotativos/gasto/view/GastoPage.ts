import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { Gasto } from '../domain/Gasto'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from 'shared/i18n-validators'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoController } from '../infrestructure/GastoController'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { UsuarioAutorizadoresController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioAutorizadoresController'
import { validarIdentificacion } from 'shared/validadores/validaciones'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { GastoPusherEvent } from '../application/GastoPusherEvent'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { useNotificaciones } from 'shared/notificaciones'
import { AprobarGastoController } from 'pages/fondosRotativos/autorizarGasto/infrestructure/AprobarGastoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Gasto, new GastoController())
    const {
      entidad: gasto,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar } =
      mixin.useComportamiento()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()

    /*******
     * Init
     ******/
    const fondoRotativoStore = useFondoRotativoStore()
    const aprobarController = new AprobarGastoController()

    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)
    if (fondoRotativoStore.id_gasto) {
      consultar({ id: fondoRotativoStore.id_gasto })
      mostrarListado.value = false
      mostrarAprobacion.value = true
    }

    /*************
     * Validaciones
     **************/
    const reglas = {
      fecha_viat: {
        required,
      },
      lugar: {
        required,
      },
      num_tarea: {
        required,
      },
      subTarea: {
        required,
      },
      proyecto: {
        required,
      },
      ruc: {
        minLength: minLength(13),
        maxLength: maxLength(13),
        helper: helpers.withMessage(
          'El RUC ingresado es Invalido',
          validarIdentificacion
        ),
      },
      factura: {
        minLength: minLength(3),
        maxLength: maxLength(15),
      },
      numComprobante: {
        minLength: minLength(3),
        maxLength: maxLength(15),
      },
      aut_especial: {
        required,
      },
      detalle: {
        required,
      },
      sub_detalle: {
        required,
      },
      cantidad: {
        required,
      },
      valor_u: {
        required,
      },
      total: {
        required,
      },
      comprobante1: {
        required,
      },
      comprobante2: {
        required,
      },
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)

    const cantones = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizacionesEspeciales = ref([])
    const tareas = ref([])
    const subTareas = ref([])
    const esFactura = ref(true)
    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        cantones: {
          controller: new CantonController(),
          params: { campos: 'id,canton' },
        },
        detalles: {
          controller: new DetalleFondoController(),
          params: { campos: 'id,descripcion' },
        },
        autorizacionesEspeciales: {
          controller: new UsuarioAutorizadoresController(),
          params: { campos: 'id,name' },
        },
        sub_detalles: {
          controller: new SubDetalleFondoController(),
          params: { campos: 'id,descripcion' },
        },
        proyectos: {
          controller: new ProyectoController(),
          params: { campos: 'id,nombre,codigo_proyecto' },
        },
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id' },
        },
        subTareas: {
          controller: new SubtareaController(),
          params: { campos: 'id,codigo_sub_tarea,titulo,tarea_id' },
        },
      })
      cantones.value = listadosAuxiliares.cantones
      detalles.value = listadosAuxiliares.detalles
      autorizacionesEspeciales.value =
        listadosAuxiliares.autorizacionesEspeciales
      sub_detalles.value = listadosAuxiliares.sub_detalles
      listadosAuxiliares.proyectos.unshift({ id: 0, nombre: 'Sin Proyecto' })
      proyectos.value = listadosAuxiliares.proyectos
      tareas.value = listadosAuxiliares.tareas
      subTareas.value = listadosAuxiliares.subTareas
    })

    /*********
     * Filtros
     **********/
    // - Filtro AUTORIZACIONES ESPECIALES

    function filtrarAutorizacionesEspeciales(val, update) {
      if (val === '') {
        update(() => {
          autorizacionesEspeciales.value =
            listadosAuxiliares.autorizacionesEspeciales
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        autorizacionesEspeciales.value =
          listadosAuxiliares.autorizacionesEspeciales.filter(
            (v) => v.usuario.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    // - Filtro Detalles

    function filtrarDetalles(val, update) {
      if (val === '') {
        update(() => {
          detalles.value = listadosAuxiliares.detalles
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        detalles.value = listadosAuxiliares.detalles.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro Lugares

    function filtrarCantones(val, update) {
      if (val === '') {
        update(() => {
          cantones.value = listadosAuxiliares.cantones
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.canton.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    /**Filtro de Sub detalles */
    function filtarSubdetalles(val, update) {
      if (val === '') {
        update(() => {
          sub_detalles.value = listadosAuxiliares.sub_detalles.filter(
            (v) => v.id_detalle_viatico == gasto.detalle
          )
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        sub_detalles.value = listadosAuxiliares.sub_detalles.filter(
          (v) => v.detalle.indexOf(needle) > -1
        )
      })
    }
    /**Filtro de proyectos */
    function filtrarProyectos(val, update) {
      if (val === '') {
        update(() => {
          proyectos.value = listadosAuxiliares.proyectos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        proyectos.value = listadosAuxiliares.proyectos.filter(
          (v) =>
            v.codigo_proyecto.toLowerCase().indexOf(needle) > -1 ||
            v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    /**Filtro de Tareas */
    function filtrarTareas(val, update) {
      if (gasto.proyecto == 0) {
        update(() => {
          tareas.value = listadosAuxiliares.tareas.filter(
            (v) => v.proyecto_id == null
          )
        })
        return
      }
      if (val === '') {
        update(() => {
          tareas.value = listadosAuxiliares.tareas.filter(
            (v) => v.proyecto_id == gasto.proyecto
          )
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadosAuxiliares.tareas.filter(
          (v) =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.detalle.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    listadosAuxiliares.tareas.unshift({ id: 0, titulo: 'Sin Tarea' })
    listadosAuxiliares.subTareas.unshift({ id: 0, titulo: 'Sin Subtarea' })
    const listadoTareas = computed(() =>
      listadosAuxiliares.tareas.filter(
        (tarea: Tarea) => tarea.proyecto_id === gasto.proyecto || tarea.id == 0
      )
    )
    const listadoSubTareas = computed(() =>
      listadosAuxiliares.subTareas.filter(
        (subtarea: Subtarea) =>
          subtarea.tarea_id === gasto.num_tarea || subtarea.id == 0
      )
    )
    const listadoSubdetalles = computed(() =>
      listadosAuxiliares.sub_detalles.filter(
        (subdetalle: SubDetalleFondo) =>
          subdetalle.id_detalle_viatico === gasto.detalle
      )
    )

    /*********
     * Pusher
     *********/

    const gastoPusherEvent = new GastoPusherEvent()
    gastoPusherEvent.start()

    watchEffect(() => (gasto.total = gasto.cantidad! * gasto.valor_u!))
    function existeComprobante() {
      gasto.factura = null
      if (esFactura.value == false) {
        gasto.ruc = '9999999999999'
      } else {
        gasto.ruc = null
      }
    }
    function aprobar_gasto(entidad, tipo_aprobacion: string) {
      switch (tipo_aprobacion) {
        case 'Aprobado':
          const data: CustomActionPrompt = {
            titulo: 'Aprobar gasto',
            mensaje: 'Ingrese motivo de aprobación',
            accion: async (data) => {
              try {
                entidad.detalle_estado = data
                await aprobarController.aprobarGasto(entidad)
                notificarCorrecto('Se aprobado Gasto Exitosamente')
              } catch (e: any) {
                notificarError(
                  'No se pudo aprobar, debes ingresar un motivo para la anulación'
                )
              }
            },
          }
          prompt(data)
          break
        case 'Rechazado':
          confirmar('¿Está seguro de rechazar el gasto?', () => {
            const data: CustomActionPrompt = {
              titulo: 'Rechazar gasto',
              mensaje: 'Ingrese motivo de aprobación',
              accion: async (data) => {
                try {
                  entidad.detalle_estado = data
                  await aprobarController.rechazarGasto(entidad)
                  notificarAdvertencia('Se rechazado Gasto Exitosamente')
                } catch (e: any) {
                  notificarError(
                    'No se pudo rechazar, debes ingresar un motivo para la anulación'
                  )
                }
              },
            }
            prompt(data)
          })
        default:
          break
      }
    }
    return {
      mixin,
      gasto,
      cantones,
      detalles,
      esFactura,
      sub_detalles,
      proyectos,
      tareas,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasGasto,
      autorizacionesEspeciales,
      watchEffect,
      filtrarAutorizacionesEspeciales,
      filtrarCantones,
      filtrarDetalles,
      filtarSubdetalles,
      filtrarProyectos,
      existeComprobante,
      filtrarTareas,
      aprobar_gasto,
      listadosAuxiliares,
      listadoSubdetalles,
      listadoSubTareas,
      mostrarListado,
      listadoTareas,
    }
  },
})
