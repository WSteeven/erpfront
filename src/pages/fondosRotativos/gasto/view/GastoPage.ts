import { computed, defineComponent, Ref, ref, watchEffect } from 'vue'
import { Gasto } from '../domain/Gasto'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {
  maxLength,
  maxValue,
  minLength,
  required,
  requiredIf
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
  acciones,
  accionesTabla,
  estadosGastos,
  maskFecha,
  rolesSistema,
  tabAutorizarGasto
} from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import {
  btnEliminarDefault,
  encontrarUltimoIdListado,
  filtarJefeImediato,
  filtrarEmpleadosPorRoles,
  optionsFecha,
  ordenarLista
} from 'shared/utils'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { empresas } from 'config/utils/sistema'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { EmpleadoPermisoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoPermisosController'
import { NodoController } from 'gestionTrabajos/nodos/infraestructure/NodoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import { upperCase } from 'lodash'
import { configuracionColumnasValijas } from 'pages/fondosRotativos/gasto/domain/configuracionColumnasValijas'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { Valija } from 'pages/fondosRotativos/gasto/domain/Valija'
import { DepartamentoController } from 'recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { Departamento } from 'recursosHumanos/departamentos/domain/Departamento'

export default defineComponent({
  components: {
    EssentialTable,
    GestorArchivos,
    ErrorComponent,
    NoOptionComponent,
    TabLayoutFilterTabs2,
    SelectorImagen
  },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Gasto, new GastoController())
    const {
      entidad: gasto,
      disabled,
      accion,
      listadosAuxiliares,
      filtros
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar, listar } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()

    /*******
     * Init
     ******/
    const mostrarComponenteValija = computed(() => Number(gasto.detalle) == 10)
    const esFactura = ref(true)
    const mostrarListado = ref(true)
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizaciones_especiales: Ref<Empleado[]> = ref([])
    const tareas = ref([])
    const beneficiarios = ref([])
    const empleados_delegadores = ref([])
    const {
      cantones,
      filtrarCantones,
      vehiculos,
      filtrarVehiculos,
      nodos,
      filtrarNodos,
      departamentos,
      filtrarDepartamentos
    } = useFiltrosListadosSelects(listadosAuxiliares)

    const visualizarAutorizador = computed(() => {
      return store.can('puede.ver.campo.autorizador')
      /*return usuario.roles.findIndex((rol) => rol === 'TECNICO') > -1
                                                              ? true
                                                              : false*/
    })

    onConsultado(async () => {
      if (Number(gasto.detalle) == 6) await obtenerListadoNodos()
      esFactura.value = !!gasto.factura //gasto.tiene_factura != null ? gasto.tiene_factura : true
    })
    const esCombustibleEmpresa = computed(() => {
      if (gasto.detalle == null) {
        return false
      }
      if (gasto.sub_detalle == null) {
        return false
      }
      if (parseInt(gasto.detalle) === 24) {
        return true
      }
      if (parseInt(gasto.detalle) === 6) {
        return (
          gasto.sub_detalle!.findIndex(subdetalle => subdetalle === 96) > -1 ||
          gasto.sub_detalle!.findIndex(subdetalle => subdetalle === 97) > -1 ||
          gasto.sub_detalle!.findIndex(subdetalle => subdetalle === 24) > -1
        )
      } else {
        return false
      }
    })
    const numFacturaObjeto = [
      {
        detalle: 16,
        cantidad: 22,
        mascara: '###-###-##############'
      },
      {
        detalle: 10,
        cantidad: 17,
        mascara: '###-###-#########'
      }
    ]
    const mascara_placa = 'AAA-####'

    const cantidadPermitidaFactura = computed(() => {
      switch (process.env.VUE_APP_ID) {
        case empresas.PERU:
          return 13
        default:
          let cantidad = 17

          if (esFactura.value === false) {
            cantidad = 0
          }
          const index = numFacturaObjeto
            .map(object => object.detalle)
            .indexOf(parseInt(gasto.detalle !== null ? gasto.detalle : ''))
          cantidad =
            numFacturaObjeto[index] !== undefined
              ? numFacturaObjeto[index].cantidad
              : 15
          return cantidad
      }
    })

    const mostarPlaca = computed(() => {
      return Number(gasto.detalle) == 16 || Number(gasto.detalle) == 24
    })
    const mascaraFactura = computed(() => {
      switch (process.env.VUE_APP_ID) {
        case empresas.PERU:
          return 'NNNN-########'
        default:
          let mascara = '###-###-#############'
          const index = numFacturaObjeto
            .map(object => object.detalle)
            .indexOf(parseInt(gasto.detalle !== null ? gasto.detalle : ''))
          mascara =
            numFacturaObjeto[index] !== undefined
              ? numFacturaObjeto[index].mascara
              : '###-###-#########'
          return mascara
      }
    })

    /*************
     * Validaciones
     **************/
    const VEHICULO = 'VEHICULO'
    const VEHICULO_PROPIO = 'VEHICULO PROPIO'

    const requiere4Imagenes = computed(() => {
      const subdetalles_vehiculos = sub_detalles.value
        .filter(
          (v: SubDetalleFondo) =>
            upperCase(v.descripcion!) === VEHICULO ||
            upperCase(v.descripcion!) === VEHICULO_PROPIO
        )
        .map((v: SubDetalleFondo) => v.id)
      return gasto.sub_detalle.some((val: number) =>
        subdetalles_vehiculos.includes(val)
      )
    })
    const reglas = {
      id_usuario: {
        required: requiredIf(() => store.can('puede.registrar.fondos_terceros'))
      },
      fecha_viat: { required },
      lugar: { required },
      num_tarea: { required },
      proyecto: { required },
      nodo: {
        required: requiredIf(
          () =>
            Number(gasto.detalle) == 6 &&
            [21, 22, 23, 24, 25].some(num => gasto.sub_detalle?.includes(num))
        )
      },
      ruc: {
        minLength: minLength(11),
        maxLength: maxLength(13),
        required: requiredIf(() => esFactura.value)
      },
      factura: {
        minLength: minLength(cantidadPermitidaFactura),
        required: requiredIf(() => esFactura.value)
      },
      /*beneficiarios: {
                                                              required: required
                                                            },*/
      aut_especial: { required: requiredIf(() => visualizarAutorizador.value) },
      num_comprobante: { maxLength: maxLength(17) },
      detalle: { required },
      sub_detalle: { required },
      cantidad: {
        maxValue: maxValue(9999),
        required
      },
      valor_u: {
        maxValue: maxValue(9999),
        required
      },
      total: { required },
      comprobante1: { required },
      comprobante2: { required },
      comprobante3: { required: requiredIf(() => requiere4Imagenes.value) },
      comprobante4: { required: requiredIf(() => requiere4Imagenes.value) },
      kilometraje: { required: requiredIf(() => esCombustibleEmpresa.value) },
      vehiculo: {
        required: requiredIf(
          () => esCombustibleEmpresa.value && !gasto.es_vehiculo_alquilado
        )
      },
      observacion: { required },
      placa: { required: requiredIf(() => gasto.es_vehiculo_alquilado) }
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)

    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        proyectos: {
          controller: new ProyectoController(),
          params: {
            campos: 'id,nombre,codigo_proyecto',
            finalizado: 0,
            empleado_id: store.user.id
          }
        },
        tareas: {
          controller: new TareaController(),
          params: {
            //campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id',
            empleado_id: store.user.id,
            activas_empleado: 1,
            formulario: true
          }
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            // campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
        vehiculos: {
          controller: new VehiculoController(),
          params: {
            campos: 'id,placa'
          }
        },
        nodos: []
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
      nodos.value = listadosAuxiliares.nodos

      gasto.empleado_info = store.nombreUsuario

      if (store.can('puede.registrar.fondos_terceros')) {
        await obtenerEmpleadosDelegadores()
      }
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
    async function obtenerEmpleadosDelegadores() {
      const response = await new EmpleadoPermisoController().listar({
        permisos: ['puede.delegar.registro_fondos']
      })
      empleados_delegadores.value = response.result
    }

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
            v =>
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
          v =>
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
          v => v.descripcion.toLowerCase().indexOf(needle) > -1
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
        sub_detalles.value = listadoSubdetalles.value.filter(
          v => v.descripcion.toLowerCase().indexOf(needle) > -1
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
          v =>
            v.codigo_proyecto.toLowerCase().indexOf(needle) > -1 ||
            v.nombre.toLowerCase().indexOf(needle) > -1
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
          v =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.titulo.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    listadosAuxiliares.tareas.unshift({
      id: 0,
      titulo: 'Sin Tarea',
      codigo_tarea: ' '
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

    const cargando = new StatusEssentialLoading()

    async function obtenerListadoNodos() {
      cargando.activar()
      const { result } = await new NodoController().listar({ activo: 1 })
      listadosAuxiliares.nodos = result
      nodos.value = listadosAuxiliares.nodos
      cargando.desactivar()
    }

    function cambiarDetalle() {
      // COMBUSTIBLE es id =6
      console.log(gasto.detalle)
      if (Number(gasto.detalle) == 6) {
        obtenerListadoNodos()
      }
      gasto.sub_detalle = []
    }

    function tieneFacturaSubDetalle() {
      let tieneFactura = true
      for (let index = 0; index < gasto.sub_detalle!.length; index++) {
        const id_subdetalle = gasto.sub_detalle![index]
        const subdetalleEncontrado = listadoSubdetalles.value.find(
          v => v.id === id_subdetalle
        )
        gasto.num_comprobante = null
        if (!subdetalleEncontrado.tiene_factura) {
          tieneFactura = false
          gasto.factura = null
          break
        }
      }
      esFactura.value = tieneFactura
      if (!requiere4Imagenes.value) {
        gasto.vehiculo = null
        gasto.kilometraje = null
      }
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

    async function recargar(tipo: string) {
      switch (tipo) {
        case 'detalle':
          const detalles = (
            await new DetalleFondoController().listar({
              campos: 'id,descripcion'
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
              campos: 'id,descripcion'
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
        case 'canton':
          const cantones = (
            await new CantonController().listar({
              campos: 'id,canton'
            })
          ).result
          LocalStorage.set('cantones', JSON.stringify(cantones))
          setTimeout(
            () =>
              setInterval(() => {
                cantones.value =
                  LocalStorage.getItem('cantones') == null
                    ? []
                    : JSON.parse(LocalStorage.getItem('cantones')!.toString())
                listadosAuxiliares.cantones = cantones.value
              }, 100),
            250
          )
          break
      }
    }

    const btnAgregarRegistroValija: CustomActionTable<Valija> = {
      titulo: 'Agregar Registro',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar registro de valija',
      accion: () => {
        const fila = new Valija()
        fila.empleado_id = store.user.id
        fila.empleado = store.nombreUsuario
        fila.id = gasto.registros_valijas.length
          ? encontrarUltimoIdListado(gasto.registros_valijas) + 1
          : 1
        gasto.registros_valijas.push(fila)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }

    const editarGasto: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) => {
        return (
          (entidad.aut_especial === store.user.id ||
            entidad.id_usuario == store.user.id) &&
          entidad.estado === estadosGastos.PENDIENTE
        )
      },
      accion: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      }
    }
    const tabActualGasto = ref(estadosGastos.PENDIENTE)

    function filtrarGasto(tabSeleccionado: number) {
      listar({ estado: tabSeleccionado, paginate: true }, false)
      tabActualGasto.value = tabSeleccionado

      filtros.fields = { estado: tabSeleccionado }
    }

    function filtrarListadoDepartamentos(val, update) {
      filtrarDepartamentos(val, update)
      configuracionColumnasValijas.find(
        item => item.field === 'departamento'
      )!.options = departamentos.value.map((v: Departamento) => {
        return { value: v.id, label: v.nombre }
      })
    }

    async function consultarDepartamentos() {
      try {
        cargando.activar()
        const { result } = await new DepartamentoController().listar({
          activo: 1
        })
        departamentos.value = result
      } catch (e) {
        console.error(e)
      } finally {
        cargando.desactivar()
      }
    }

    const checkSeEnviaValija = async val => {
      if (val) {
        // consultar los departamentos para que puedan ser seleccionados
        await consultarDepartamentos().then(() => {
          configuracionColumnasValijas.find(
            item => item.field === 'departamento'
          )!.options = departamentos.value.map((v: Departamento) => {
            return { value: v.id, label: v.nombre }
          })
          configuracionColumnasValijas.find(
            item => item.field === 'departamento'
          )!.filtro = filtrarListadoDepartamentos
        })
      }
    }

    return {
      store,
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
      //listados
      nodos,
      accionesTabla,
      filtrarNodos,
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
      optionsFechaGasto: optionsFecha,
      recargar,
      editarGasto,
      mascaraFactura,
      mascara_placa,
      listadosAuxiliares,
      beneficiarios,
      empleados_delegadores,
      ordenarLista,
      mostrarListado,
      mostarPlaca,
      listadoTareas,
      estadosGastos,
      requiere4Imagenes,
      mostrarComponenteValija,
      configuracionColumnasValijas,
      btnAgregarRegistroValija,
      btnEliminarDefault,
      checkSeEnviaValija
    }
  }
})
