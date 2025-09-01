import { computed, defineComponent, Ref, ref, watchEffect } from 'vue'
import { Gasto } from '../domain/Gasto'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {
  helpers,
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
import { configuracionColumnasValijas } from 'pages/fondosRotativos/valijas/domain/configuracionColumnasValijas'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { Valija } from 'pages/fondosRotativos/valijas/domain/Valija'
import { DepartamentoController } from 'recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { Departamento } from 'recursosHumanos/departamentos/domain/Departamento'
import { Proyecto } from 'proyectos/domain/Proyecto'
import { cargarDesdeLocalStorage } from '../../../../utils/storage'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { useNotificaciones } from 'shared/notificaciones'

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
    const { notificarAdvertencia } = useNotificaciones()
    /*******
     * Init
     ******/
    const mostrarComponenteValija = computed(() => Number(gasto.detalle) == 10)
    const esFactura = ref(true)
    const mostrarListado = ref(true)
    const sub_detalles = ref<SubDetalleFondo[]>([])
    const proyectos = ref([])
    const autorizaciones_especiales: Ref<Empleado[]> = ref([])
    const beneficiarios = ref([])
    const empleados_delegadores = ref([])
    const {
      cantones,
      filtrarCantones,
      vehiculos,
      filtrarVehiculos,
      nodos,
      filtrarNodos,
      tareas,
      filtrarTareasTitulo: filtrarTareas,
      detalles,
      filtrarDetalles,
      departamentos,
      filtrarDepartamentos,
      clientes,
      filtrarClientes
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

      if (gasto.se_envia_valija) await consultarDepartamentos()
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
      registros_valijas: {
        $each: helpers.forEach({
          empleado: { required },
          descripcion: { required },
          departamento: { required },
          imagen_evidencia: { required }
        })
      },
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
      cliente: { required },
      ruc: {
        minLength: minLength(11),
        maxLength: maxLength(13),
        required: requiredIf(() => esFactura.value)
      },
      factura: {
        minLength: minLength(cantidadPermitidaFactura),
        required: requiredIf(() => esFactura.value)
      },
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
      placa: { required: requiredIf(() => gasto.es_vehiculo_alquilado) },
      envio_valija: {
        courier: { required: requiredIf(() => gasto.se_envia_valija) },
        fotografia_guia: { required: requiredIf(() => gasto.se_envia_valija) }
      }
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)

    const colDepartamentos = computed(() =>
      configuracionColumnasValijas.value.find(
        item => item.field === 'departamento'
      )
    )

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
            empleado_id: store.user.id,
            activas_empleado: 1,
            formulario: true
          }
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            estado: 1
          }
        },
        vehiculos: {
          controller: new VehiculoController(),
          params: {
            campos: 'id,placa'
          }
        },
        clientes: {
          controller: new ClienteController(),
          params: { estado: 1, requiere_fr: 1 }
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
      clientes.value = listadosAuxiliares.clientes
      gasto.empleado_info = store.nombreUsuario

      if (store.can('puede.registrar.fondos_terceros')) {
        await obtenerEmpleadosDelegadores()
      }
    })
    cantones.value = cargarDesdeLocalStorage('cantones')
    detalles.value = cargarDesdeLocalStorage('detalles')
    sub_detalles.value = cargarDesdeLocalStorage('sub_detalles')
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
    function filtrarAutorizacionesEspeciales(
      val: string,
      update: (callbackFn: () => void, afterFn: void) => void
    ) {
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
            (v: Empleado) =>
              v.nombres!.toLowerCase().indexOf(needle) > -1 ||
              v.apellidos!.toLowerCase().indexOf(needle) > -1
          )
      })
    }

    //filtro beneficiarios
    function filtrarBeneficiarios(
      val: string,
      update: (callbackFn: () => void) => void
    ) {
      if (val === '') {
        update(() => {
          beneficiarios.value = listadosAuxiliares.beneficiarios
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        beneficiarios.value = listadosAuxiliares.beneficiarios.filter(
          (v: Empleado) =>
            v.nombres!.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos!.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro Detalles

    /**Filtro de Sub detalles */
    function filtarSubdetalles(
      val: string,
      update: (callbackFn: () => void) => void
    ) {
      if (val === '') {
        update(() => {
          sub_detalles.value = listadoSubdetalles.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        sub_detalles.value = listadoSubdetalles.value.filter(
          (v: SubDetalleFondo) =>
            v.descripcion!.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /**Filtro de proyectos */
    function filtrarProyectos(
      val: string,
      update: (callbackFn: () => void) => void
    ) {
      if (val === '') {
        update(() => {
          proyectos.value = listadosAuxiliares.proyectos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        proyectos.value = listadosAuxiliares.proyectos.filter(
          (v: Proyecto) =>
            v.codigo_proyecto!.toLowerCase().indexOf(needle) > -1 ||
            v.nombre!.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    listadosAuxiliares.tareas.unshift({
      id: 0,
      titulo: 'Sin Tarea',
      codigo_tarea: ' '
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
      // console.log(gasto.detalle)
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
          (v: SubDetalleFondo) => v.id === id_subdetalle
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

    const comprobarDatosEnvioValija = () => {
      if (
        gasto.envio_valija.courier == null ||
        gasto.envio_valija.fotografia_guia == null
      ) {
        notificarAdvertencia(
          'Primero debes llenar los datos de courier y fotografía de la guía'
        )
        return false
      }
      return true
    }
    const btnAgregarRegistroValija: CustomActionTable<Valija> = {
      titulo: 'Agregar Registro',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar registro de valija',
      accion: () => {
        if(!comprobarDatosEnvioValija()) return
        const fila = new Valija()
        fila.empleado_id = store.user.id
        fila.empleado = store.nombreUsuario
        fila.id = gasto.registros_valijas.length
          ? encontrarUltimoIdListado(gasto.registros_valijas) + 1
          : 1
        gasto.registros_valijas.push(fila)
      },
      visible: () =>
        [acciones.nuevo, acciones.editar].includes(accion.value as any)
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

    function filtrarListadoDepartamentos(
      val: string,
      update: (callbackFn: () => void) => void
    ) {
      filtrarDepartamentos(val, update)
      colDepartamentos.value!.options = departamentos.value.map(
        (v: Departamento) => {
          return { value: v.id, label: v.nombre }
        }
      )
    }

    async function consultarDepartamentos() {
      try {
        cargando.activar()
        const { result } = await new DepartamentoController().listar({
          activo: 1
        })
        listadosAuxiliares.departamentos = result
        departamentos.value = result
      } catch (e) {
        console.error(e)
      } finally {
        cargando.desactivar()
      }
    }

    const checkSeEnviaValija = async (val: boolean) => {
      if (val) {
        await consultarDepartamentos().then(() => {
          colDepartamentos.value!.options = departamentos.value.map(
            (v: Departamento) => {
              return { value: v.id, label: v.nombre }
            }
          )
          colDepartamentos.value!.filtro = filtrarListadoDepartamentos
        })
      } else gasto.registros_valijas = []
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
      clientes,
      filtrarClientes,
      optionsFechaGasto: optionsFecha,
      recargar,
      editarGasto,
      mascaraFactura,
      mascara_placa,
      beneficiarios,
      empleados_delegadores,
      ordenarLista,
      mostrarListado,
      mostarPlaca,
      estadosGastos,
      requiere4Imagenes,
      mostrarComponenteValija,
      configuracionColumnasValijas,
      btnAgregarRegistroValija,
      btnEliminarDefault,
      checkSeEnviaValija,
      departamentos
    }
  }
})
