import { computed, defineComponent, Ref, ref, watchEffect } from 'vue'
import { Gasto } from '../domain/Gasto'

// Componentes

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {
  requiredIf,
  maxLength,
  minLength,
  maxValue,
  required,
} from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoController } from '../infrestructure/GastoController'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { GastoPusherEvent } from '../application/GastoPusherEvent'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { useAuthenticationStore } from 'stores/authentication'
import {
  maskFecha,
  tabAutorizarGasto,
  estadosGastos,
  acciones,
  rolesSistema,
} from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController'
import ImagenComprimidaComponent from 'components/ImagenComprimidaComponent.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { filtarJefeImediato, filtrarEmpleadosPorRoles } from 'shared/utils'
import { format } from '@formkit/tempo'
export default defineComponent({
  components: { TabLayoutFilterTabs2, ImagenComprimidaComponent },
  setup() {
    const authenticationStore = useAuthenticationStore()
    const usuario = authenticationStore.user
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
    const { setValidador, obtenerListados, cargarVista, consultar, listar } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()

    const store = useAuthenticationStore()
    /*******
     * Init
     ******/

    const esFactura = ref(true)
    const mostrarListado = ref(true)

    const visualizarAutorizador = computed(() => {
      return authenticationStore.can('puede.ver.campo.autorizador')
      /*return usuario.roles.findIndex((rol) => rol === 'TECNICO') > -1
        ? true
        : false*/
    })
    const es_consultar = computed(() => {
      return accion.value === acciones.consultar
    })
    onConsultado(() => {
      esFactura.value = !!gasto.factura //gasto.tiene_factura != null ? gasto.tiene_factura : true
    })
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
    const mascara_placa = 'AAA-####'

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
      /*beneficiarios: {
        required: required
      },*/
      aut_especial: {
        required: requiredIf(() => visualizarAutorizador.value),
      },
      num_comprobante: {
        maxLength: maxLength(17),
      },
      detalle: {
        required,
      },
      sub_detalle: {
        required,
      },
      cantidad: {
        maxValue: maxValue(9999),
        required,
      },
      valor_u: {
        maxValue: maxValue(9999),
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
        required: requiredIf(
          () => esCombustibleEmpresa.value && !!gasto.es_vehiculo_alquilado
        ),
      },
      observacion: {
        required,
      },
      placa: {
        required: requiredIf(() => gasto.es_vehiculo_alquilado),
      },
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)

    const cantones = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizaciones_especiales: Ref<Empleado[]> = ref([])
    const tareas = ref([])
    const vehiculos = ref([])
    const beneficiarios = ref([])

    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        proyectos: {
          controller: new ProyectoController(),
          params: {
            campos: 'id,nombre,codigo_proyecto',
            finalizado: 0,
            empleado_id: store.user.id,
          },
        },
        tareas: {
          controller: new TareaController(),
          params: {
            //campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id',
            empleado_id: store.user.id,
            activas_empleado: 1,
            formulario: true,
          },
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            // campos: 'id,nombres,apellidos',
            estado: 1,
          },
        },
        vehiculos: {
          controller: new VehiculoController(),
          params: {
            campos: 'id,placa',
          },
        },
      })
      autorizaciones_especiales.value = await filtrarEmpleadosPorRoles(
        listadosAuxiliares.empleados,
        [rolesSistema.autorizador]
      )
      autorizaciones_especiales.value.unshift(
        await filtarJefeImediato(listadosAuxiliares.empleados)
      )
      listadosAuxiliares.autorizaciones_especiales =
        autorizaciones_especiales.value
      beneficiarios.value = listadosAuxiliares.empleados
      listadosAuxiliares.beneficiarios = beneficiarios.value
      listadosAuxiliares.proyectos.unshift({ id: 0, nombre: 'Sin Proyecto' })
      proyectos.value = listadosAuxiliares.proyectos
      tareas.value = listadosAuxiliares.tareas
      vehiculos.value = listadosAuxiliares.vehiculos
    })
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
        sabadoAnterior = format(
          new Date(today.setDate(today.getDate() - ((today.getDay() + 2) % 7))),
          'YYYY/MM/DD'
        )
      } else {
        sabadoAnterior = format(
          new Date(today.setDate(today.getDate() - (today.getDay() % 7))),
          'YYYY/MM/DD'
        )
      }
      const sabadoSiguiente = format(new Date(siguienteSabado()), 'YYYY/MM/DD')
      const fecha_actual = format(new Date(), 'YYYY/MM/DD')

      return (
        date >= sabadoAnterior &&
        date <= sabadoSiguiente &&
        date <= fecha_actual
      )
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
        sub_detalles.value = listadoSubdetalles.value.filter((v) =>v.descripcion.toLowerCase().indexOf(needle) > -1)
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
    listadosAuxiliares.tareas.unshift({
      id: 0,
      titulo: 'Sin Tarea',
      codigo_tarea: ' ',
    })
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
    function cambiarProyecto() {
      gasto.num_tarea = null
    }
    function cambiarDetalle() {
      gasto.sub_detalle = null
    }

    function tieneFacturaSubDetalle() {
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
    /*********
     * Pusher
     *********/

    const gastoPusherEvent = new GastoPusherEvent()
    gastoPusherEvent.start()

    watchEffect(() => {
      gasto.total = gasto.cantidad! * gasto.valor_u!
    })
    function existeComprobante() {
      gasto.factura = null
      gasto.ruc = null
    }
    async function recargarDetalle(tipo: string) {
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

    const editarGasto: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) => {
        return (
          (entidad.aut_especial === authenticationStore.user.id ||
            entidad.id_usuario == authenticationStore.user.id) &&
          entidad.estado === estadosGastos.PENDIENTE
        )
      },
      accion: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      },
    }
    const tabActualGasto = ref(estadosGastos.PENDIENTE)

    function filtrarGasto(tabSeleccionado: number) {
      listar({ estado: tabSeleccionado }, false)
      tabActualGasto.value = tabSeleccionado
    }
    return {
      mixin,
      gasto,
      authenticationStore,
      cantones,
      detalles,
      esFactura,
      sub_detalles,
      proyectos,
      tareas,
      usuario,
      disabled,
      accion,
      acciones,
      v$,
      tabAutorizarGasto,
      maskFecha,
      configuracionColumnas: configuracionColumnasGasto,
      autorizaciones_especiales,
      visualizarAutorizador,
      esCombustibleEmpresa,
      vehiculos,
      watchEffect,
      filtrarAutorizacionesEspeciales,
      tieneFacturaSubDetalle,
      filtrarCantones,
      filtrarDetalles,
      filtarSubdetalles,
      filtrarBeneficiarios,
      filtrarProyectos,
      existeComprobante,
      filtrarTareas,
      filtrarGasto,
      filtrarVehiculos,
      cambiarDetalle,
      cambiarProyecto,
      optionsFechaGasto,
      recargarDetalle,
      editarGasto,
      mascaraFactura,
      mascara_placa,
      listadosAuxiliares,
      listadoSubdetalles,
      beneficiarios,
      mostrarListado,
      mostarPlaca,
      listadoTareas,
      es_consultar,
      estadosGastos,
    }
  },
})
