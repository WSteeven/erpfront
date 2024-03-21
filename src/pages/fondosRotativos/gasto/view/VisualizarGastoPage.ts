import { Ref, computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { GastoPusherEvent } from '../application/GastoPusherEvent'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { useNotificaciones } from 'shared/notificaciones'
import { AprobarGastoController } from 'pages/fondosRotativos/autorizarGasto/infrestructure/AprobarGastoController'
import { useAuthenticationStore } from 'stores/authentication'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import {
  acciones,
  convertir_fecha,
  estadosGastos,
  maskFecha,
  rolesSistema,
} from 'config/utils'
import { VisualizarGasto } from '../domain/VisualizarGasto'
import { VisualizarGastoController } from '../infrestructure/VisualizarGastoController'
import { useCargandoStore } from 'stores/cargando'
import ImagenComprimidaComponent from 'components/ImagenComprimidaComponent.vue'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { Gasto } from '../domain/Gasto'
import { GastoController } from '../infrestructure/GastoController'
import {
  filtrarEmpleadosPorRoles,
  isAxiosError,
  notificarMensajesError,
} from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: { TabLayout, ImagenComprimidaComponent, ButtonSubmits },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    const authenticationStore = useAuthenticationStore()
    const usuario = authenticationStore.user
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      VisualizarGasto,
      new VisualizarGastoController()
    )
    const mixin_gastos = new ContenedorSimpleMixin(Gasto, new GastoController())
    const {
      entidad: visualizar_gasto,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()
    const { entidad: gasto } = mixin_gastos.useReferencias()
    const issubmit = ref(true)
    const { confirmar, notificarCorrecto, notificarAdvertencia } =
      useNotificaciones()

    /*******
     * Init
     ******/
    const fondoRotativoStore = useFondoRotativoStore()
    const notificaciones = useNotificaciones()
    const aprobarController = new AprobarGastoController()
    const esFactura = ref(true)
    const permitirAnular = ref()
    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)
    const isConsultar = ref(false)
    const cantones = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizaciones_especiales: Ref<Empleado[]> = ref([])
    const tareas = ref([])
    const vehiculos = ref([])
    const beneficiarios = ref([])
    const cargando = new StatusEssentialLoading()

    const esCombustibleEmpresa = computed(() => {
      if (gasto.detalle == null) {
        return false
      }
      if (gasto.sub_detalle == null) {
        return false
      }
      if (parseInt(gasto.detalle !== null ? gasto.detalle : '') === 24) {
        return true
      }
      if (parseInt(gasto.detalle !== null ? gasto.detalle : '') === 6) {
        return (
          gasto.sub_detalle!.findIndex((subdetalle) => subdetalle === 96) >
            -1 ||
          gasto.sub_detalle!.findIndex((subdetalle) => subdetalle === 97) >
            -1 ||
          gasto.sub_detalle!.findIndex((subdetalle) => subdetalle === 24) > -1
        )
      } else {
        return false
      }
    })
    const numFacturaObjeto = [
      {
        detalle: 16,
        cantidad: 22,
        mascara: '###-###-##############',
      },
      {
        detalle: 10,
        cantidad: 17,
        mascara: '###-###-#########',
      },
    ]
    const cantidadPermitidaFactura = computed(() => {
      let cantidad = 17

      if (esFactura.value === false) {
        cantidad = 0
      }
      const index = numFacturaObjeto
        .map((object) => object.detalle)
        .indexOf(parseInt(gasto.detalle !== null ? gasto.detalle : ''))
      cantidad =
        numFacturaObjeto[index] !== undefined
          ? numFacturaObjeto[index].cantidad
          : 15
      return cantidad
    })
    const mostarPlaca = computed(() => {
      return parseInt(gasto.detalle !== null ? gasto.detalle : '') == 16 ||
        parseInt(gasto.detalle !== null ? gasto.detalle : '') == 24
        ? true
        : false
    })
    const mascaraFactura = computed(() => {
      let mascara = '###-###-#############'
      const index = numFacturaObjeto
        .map((object) => object.detalle)
        .indexOf(parseInt(gasto.detalle !== null ? gasto.detalle : ''))
      mascara =
        numFacturaObjeto[index] !== undefined
          ? numFacturaObjeto[index].mascara
          : '###-###-#########'
      return mascara
    })
    onConsultado(() => {
      esFactura.value = !!gasto.factura
    })
    //Obtener el listado de las cantones
    cargarVista(async () => {
      autorizaciones_especiales.value = await filtrarEmpleadosPorRoles(
        fondoRotativoStore.empleados,
        [rolesSistema.autorizador]
      )
      listadosAuxiliares.autorizaciones_especiales =
        autorizaciones_especiales.value
      beneficiarios.value = fondoRotativoStore.empleados
      listadosAuxiliares.beneficiarios = beneficiarios.value
       proyectos.value = fondoRotativoStore.proyectos
      listadosAuxiliares.proyectos = proyectos.value
      listadosAuxiliares.proyectos.unshift({ id: 0, nombre: 'Sin Proyecto' })
      tareas.value = fondoRotativoStore.tareas
      listadosAuxiliares.tareas = tareas.value
      listadosAuxiliares.tareas.unshift({
        id: 0,
        titulo: 'Sin Tarea',
        codigo_tarea: ' ',
      })
      vehiculos.value = fondoRotativoStore.vehiculos
      listadosAuxiliares.vehiculos = vehiculos.value
      cantones.value =
        LocalStorage.getItem('cantones') == null
          ? []
          : JSON.parse(LocalStorage.getItem('cantones')!.toString())
      detalles.value =
        LocalStorage.getItem('detalles') == null
          ? []
          : JSON.parse(LocalStorage.getItem('detalles')!.toString())
      sub_detalles.value =
        LocalStorage.getItem('sub_detalles') == null
          ? []
          : JSON.parse(LocalStorage.getItem('sub_detalles')!.toString())
      listadosAuxiliares.cantones = cantones.value
      listadosAuxiliares.detalles = detalles.value
      listadosAuxiliares.sub_detalles = sub_detalles.value
      if (fondoRotativoStore.gasto !== null) {
        await gasto.hydrate(fondoRotativoStore.gasto)
        mostrarListado.value = false
        mostrarAprobacion.value = true
        esFactura.value = !!gasto.factura
        permitirAnular.value =
          fondoRotativoStore.habilitar_observacion_autorizador
        accion.value = fondoRotativoStore.accion_form
        isConsultar.value = fondoRotativoStore.accion_form === acciones.consultar
      }
    })

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
        required: requiredIf(() => esFactura.value),
      },
      factura: {
        minLength: minLength(cantidadPermitidaFactura),
        required: requiredIf(() => esFactura.value),
      },
      num_comprobante: {
        maxLength: maxLength(15),
      },
      aut_especial: {
        required,
      },
      empleado_info: {
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
        required: requiredIf(() => gasto.comprobante1 !== gasto.comprobante2),
      },
      comprobante2: {
        required: requiredIf(() => gasto.comprobante2 !== gasto.comprobante1),
      },
      kilometraje: {
        required: requiredIf(() => esCombustibleEmpresa.value),
      },
      vehiculo: {
        required: requiredIf(() => esCombustibleEmpresa.value),
      },
      observacion: {
        required,
      },
      detalle_estado: {
        required,
      },
      placa: {
        required: requiredIf(() => gasto.es_vehiculo_alquilado),
      },
      observacion_anulacion:{
        required: requiredIf(() => gasto.estado === estadosGastos.APROBADO),
      }
    }
    const v$ = useVuelidate(reglas, gasto)
    const mascara_placa = 'AAA-####'

    setValidador(v$.value)
    /*********
     * Filtros
     **********/
    // - Filtro AUTORIZACIONES ESPECIALES

    function filtrarAutorizacionesEspeciales(val, update) {
      if (val === '') {
        update(() => {
          autorizaciones_especiales.value =
            listadosAuxiliares.autorizaciones_especiales
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        console.log(
          listadosAuxiliares.autorizaciones_especiales.filter((v) => {
            v.nombres.toLowerCase().indexOf(needle) > -1
          })
        )

        autorizaciones_especiales.value =
          listadosAuxiliares.autorizaciones_especiales.filter(
            (v) =>
              v.nombres.toLowerCase().indexOf(needle) > -1 ||
              v.apellidos.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    //filtro beneficiarios
    function filtrarBeneficiarios(val, update) {
      if (val === '') {
        update(() => {
          beneficiarios.value = listadosAuxiliares.beneficiarios
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        beneficiarios.value = listadosAuxiliares.beneficiarios.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
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
    function optionsFechaGasto(date) {
      const today = new Date()

      const diaSemana = today.getDay()
      // Verificar si el día actual es sábado
      let sabadoAnterior = ''
      if (diaSemana === 6) {
        sabadoAnterior = convertir_fecha(
          new Date(today.setDate(today.getDate() - ((today.getDay() + 2) % 7)))
        )
      } else {
        sabadoAnterior = convertir_fecha(
          //new Date(today.setDate(today.getDate() - ((today.getDay()+1) % 7)))
          new Date(today.setDate(today.getDate() - (today.getDay() % 7)))
        )
      }
      const sabadoSiguiente = convertir_fecha(new Date(siguienteSabado()))
      console.log(sabadoAnterior + ' al ' + sabadoSiguiente)
      return date >= sabadoAnterior && date <= sabadoSiguiente
    }
    function siguienteSabado() {
      const fecha = new Date() // Obtenemos la fecha actual
      const diaSemana = fecha.getDay() // Obtenemos el día de la semana (0-6, siendo 0 domingo)
      // Calculamos los días que faltan hasta el próximo sábado
      const diasFaltantes = 6 - diaSemana
      // Sumamos los días faltantes a la fecha actual para obtener el próximo sábado
      fecha.setDate(fecha.getDate() + diasFaltantes)
      // Retornamos la fecha formateada como una cadena de texto
      return fecha
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
          sub_detalles.value = listadoSubdetalles.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        sub_detalles.value = listadoSubdetalles.value.filter((v) => {
          v.descripcion.toLowerCase().indexOf(needle) > -1
        })
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
    /**Filtrar Vehiculos */
    function filtrarVehiculos(val, update) {
      if (val === '') {
        update(() => {
          vehiculos.value = listadosAuxiliares.vehiculos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        vehiculos.value = listadosAuxiliares.vehiculos.filter(
          (v) => v.placa.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    /**Filtro de Tareas */
    function filtrarTareas(val, update) {
      if (val === '') {
        update(() => {
          tareas.value = listadoTareas.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadoTareas.value.filter(
          (v) =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.titulo.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const listadoTareas = computed(() => {
      if (gasto.proyecto == 0) {
        return listadosAuxiliares.tareas.filter(
          (tarea: Tarea) => tarea.proyecto_id === null || tarea.id == 0
        )
      }
      return listadosAuxiliares.tareas.filter(
        (tarea: Tarea) => tarea.proyecto_id === gasto.proyecto || tarea.id == 0
      )
    })

    const listadoSubdetalles = computed(() => {
      if (gasto.detalle == '0') {
        return listadosAuxiliares.sub_detalles
      }
      return listadosAuxiliares.sub_detalles.filter(
        (subdetalle: SubDetalleFondo) =>
          subdetalle.id_detalle_viatico === gasto.detalle
      )
    })
    function cambiar_proyecto() {
      gasto.num_tarea = null
    }
    function cambiar_detalle() {
      gasto.sub_detalle = null
    }

    function tiene_factura_subdetalle() {
      let tieneFactura = true
      for (let index = 0; index < gasto.sub_detalle!.length; index++) {
        const id_subdetalle = gasto.sub_detalle![index]
        const subdetalleEncontrado = listadoSubdetalles.value.find(
          (v) => v.id === id_subdetalle
        )
        gasto.num_comprobante = null
        if (!subdetalleEncontrado.tiene_factura) {
          tieneFactura = false
          gasto.factura = null
          break
        }
      }
      esFactura.value = tieneFactura
    }
    async function recargar_detalle(tipo: string) {
      switch (tipo) {
        case 'detalle':
          const detalles = (
            await new DetalleFondoController().listar({
              campos: 'id,descripcion',
            })
          ).result
          LocalStorage.set('detalles', JSON.stringify(detalles))
          setTimeout(
            () =>
              setInterval(() => {
                detalles.value =
                  LocalStorage.getItem('detalles') == null
                    ? []
                    : JSON.parse(LocalStorage.getItem('detalles')!.toString())
                listadosAuxiliares.detalles = detalles.value
              }, 100),
            250
          )

          break
        case 'sub_detalle':
          const sub_detalles = (
            await new SubDetalleFondoController().listar({
              campos: 'id,descripcion',
            })
          ).result
          LocalStorage.set('sub_detalles', JSON.stringify(sub_detalles))
          setTimeout(
            () =>
              setInterval(() => {
                sub_detalles.value =
                  LocalStorage.getItem('sub_detalles') == null
                    ? []
                    : JSON.parse(
                        LocalStorage.getItem('sub_detalles')!.toString()
                      )
                listadosAuxiliares.sub_detalles = sub_detalles.value
              }, 100),
            250
          )

          break
      }
    }
    function existeComprobante() {
      gasto.factura = null
    }
    async function aprobar_gasto(entidad, tipo_aprobacion: string) {
      switch (tipo_aprobacion) {
        case 'aprobar':
          try {
            if (await v$.value.$validate()) {
              cargando.activar()
              await aprobarController.aprobarGasto(gasto)
              issubmit.value = false
              notificarCorrecto('Se aprobado Gasto Exitosamente')
              emit('cerrar-modal', false)
              cargando.desactivar()
              emit('guardado')
            }
          } catch (error: any) {
            if (isAxiosError(error)) {
              const mensajes: string[] = error.erroresValidacion
              await notificarMensajesError(mensajes, notificaciones)
              cargando.desactivar()
            }
          }
          break
        case 'rechazar':
          confirmar('¿Está seguro de rechazar el gasto?', async () => {
            try {
              if (await v$.value.$validate()) {
                cargando.activar()
                await aprobarController.rechazarGasto(entidad)
                issubmit.value = false
                notificarAdvertencia('Se rechazado Gasto Exitosamente')
                emit('cerrar-modal', false)
                cargando.desactivar()
                emit('guardado')
              }
            } catch (error: any) {
              if (isAxiosError(error)) {
                const mensajes: string[] = error.erroresValidacion
                await notificarMensajesError(mensajes, notificaciones)
                cargando.desactivar()
              }
            }
          })
          break
        case 'anular':
          confirmar('¿Está seguro de anular el gasto?', async () => {
            if (await v$.value.$validate()) {
              cargando.activar()
              try {
                await aprobarController.anularGasto(entidad)
                issubmit.value = false
                notificarAdvertencia('Se anulado Gasto Exitosamente')
                emit('cerrar-modal', false)
                cargando.desactivar()
                emit('guardado')
              } catch (error: any) {
                if (isAxiosError(error)) {
                  const mensajes: string[] = error.erroresValidacion
                  await notificarMensajesError(mensajes, notificaciones)
                  cargando.desactivar()
                }
              }
            }
          })
          break
        default:
          break
      }
    }
    watchEffect(() => {
      gasto.total = gasto.cantidad! * gasto.valor_u!
    })
    /*********
     * Pusher
     *********/
    const gastoPusherEvent = new GastoPusherEvent()
    gastoPusherEvent.start()
    return {
      mixin,
      gasto,
      esFactura,
      usuario,
      disabled,
      issubmit,
      maskFecha,
      accion,
      acciones,
      v$,
      permitirAnular,
      configuracionColumnas: configuracionColumnasGasto,
      authenticationStore,
      esCombustibleEmpresa,
      cantones,
      detalles,
      sub_detalles,
      proyectos,
      tareas,
      beneficiarios,
      mostarPlaca,
      mascara_placa,
      mascaraFactura,
      vehiculos,
      watchEffect,
      existeComprobante,
      aprobar_gasto,
      filtrarAutorizacionesEspeciales,
      tiene_factura_subdetalle,
      filtrarCantones,
      filtrarDetalles,
      filtarSubdetalles,
      filtrarBeneficiarios,
      filtrarProyectos,
      filtrarTareas,
      filtrarVehiculos,
      cambiar_detalle,
      cambiar_proyecto,
      optionsFechaGasto,
      recargar_detalle,
      isConsultar,
      estadosGastos,
    }
  },
})
