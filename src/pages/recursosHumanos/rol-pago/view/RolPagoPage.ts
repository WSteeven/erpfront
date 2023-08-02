// Dependencias
import { configuracionColumnasRolPago } from '../domain/configuracionColumnasRolPago'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect, Ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolPagoController } from '../infraestructure/RolPagoController'
import { RolPago } from '../domain/RolPago'
import { imprimirArchivo, removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha } from 'config/utils'
import { apiConfig, endpoints } from 'config/api'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { configuracionColumnasRolPagoTabla } from '../domain/configuracionColumnasRolPagoTabla'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import axios from 'axios'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { ConceptoIngresoController } from 'pages/recursosHumanos/concepto_ingreso/infraestructure/ConceptoIngresoController'
import { DescuentosGenralesController } from 'pages/recursosHumanos/descuentos_generales/infraestructure/DescuentosGenralesController'
import { DescuentosLeyController } from 'pages/recursosHumanos/descuentos_ley/infraestructure/DescuentosLeyController'
import { MultaController } from 'pages/recursosHumanos/multas/infraestructure/MultaController'
import { HorasExtrasTipoController } from 'pages/recursosHumanos/horas_extras_tipo/infraestructure/HorasExtrasTipoController'
import { HorasExtrasSubTipoController } from 'pages/recursosHumanos/horas_extras_subtipo/infraestructure/HorasExtrasSubTipoController'
import { HorasExtrasSubTipo } from 'pages/recursosHumanos/horas_extras_subtipo/domain/HorasExtrasSubTipo'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useRolPagoStore } from 'stores/rolPago'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { ComportamientoModalesRolPago } from '../aplication/ComportamientoModalesRolPago'

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable, ButtonSubmits },
  emit: ['cerrar-modal', 'guardado'],

  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(RolPago, new RolPagoController())
    /*********
     * Stores
     *********/
    const rolPagoStore = useRolPagoStore()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()

    /********
     * Mixin
     *********/
    const {
      entidad: rolpago,
      listadosAuxiliares,
      accion,
      listado,
      disabled,
    } = mixin.useReferencias()
    const {
      obtenerListados,
      cargarVista,
      consultar,
      guardar,
      editar,
      reestablecer,
      setValidador,
    } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        concepto_ingresos: new ConceptoIngresoController(),
        descuentos_generales: new DescuentosGenralesController(),
        descuentos_ley: new DescuentosLeyController(),
        multas: new MultaController(),
        horas_extras_tipos: new HorasExtrasTipoController(),
        horas_extras_subtipos: new HorasExtrasSubTipoController(),
      })
      empleados.value = listadosAuxiliares.empleados
      concepto_ingresos.value = listadosAuxiliares.concepto_ingresos
      descuentos_generales.value = listadosAuxiliares.descuentos_generales
      descuentos_ley.value = listadosAuxiliares.descuentos_ley
      multas.value = listadosAuxiliares.multas
      horas_extras_tipos.value = listadosAuxiliares.horas_extras_tipos
      horas_extras_subtipos.value = listadosAuxiliares.horas_extras_subtipos
    })
    /*******
     * Init
     *******/
    if (rolPagoStore.idRolPagoSeleccionada) {
      consultar({ id: rolPagoStore.idRolPagoSeleccionada })
    } else rolpago.hydrate(new RolPago())

    // rolpago.dias = rolPagoStore.dias
    accion.value = rolPagoStore.accion

    /************
     * Variables
     ************/
    const { notificarError, notificarCorrecto, notificarAdvertencia } =
      useNotificaciones()
    const concepto_ingresos: Ref<ConceptoIngreso[]> = ref([])
    const descuentos_generales = ref([])
    const horas_extras_tipos = ref([])
    const horas_extras_subtipos = ref([])
    const descuentos_ley = ref([])
    const multas = ref([])
    const tipo_descuento = ref()
    const es_consultado = ref(false)
    const es_seleccionable_descuento_general = ref(true)
    const es_seleccionable_descuento_ley = ref(true)
    const es_seleccionable_multa = ref(false)
    const tipo = ref(1)
    const es_calculable = ref(true)
    const campo = ref()
    const is_month = ref(false)
    const empleados = ref<Empleado[]>([])
    onConsultado(() => {
      es_consultado.value = true
    })

    const listadoHorasExtrasSubTipo = computed(() => {
      return listadosAuxiliares.horas_extras_subtipos.filter(
        (horas_extras_subtipos: HorasExtrasSubTipo) =>
          horas_extras_subtipos.horas_extras === rolpago.horas_extra_tipo
      )
    })
    const sueldo = computed(() => {
      const num_dias = rolpago.dias != null ? rolpago.dias : 0
      const dias_sin_recuperar =
        rolpago.dias_permiso_sin_recuperar != null
          ? rolpago.dias_permiso_sin_recuperar
          : 0
      const salario = rolpago.salario != null ? rolpago.salario : '0'
      const sueldo = (parseInt(salario) / 30) * (num_dias - dias_sin_recuperar)
      return sueldo.toFixed(2)
    })

    rolpago.roles = ref([])
    rolpago.ingresos = ref([])
    rolpago.egresos = ref([])

    const esRecursosHumanos = store.esRecursosHumanos

    function datos_empleado() {
      obtener_datos_empleado('SALARIO')
      obtener_datos_empleado('PERMISOS_SIN_RECUPERAR')
    }

    /**********
     * Modales
     **********/
    const modales = new ComportamientoModalesRolPago()

    /*********
     * Filtros
     **********/
    /****Filtro de Empleados */
    function filtrarEmpleado(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    /**Filtro de HorasExtrasSubTipo */
    function filtrarHorasExtrasSubTipo(val, update) {
      if (val === '') {
        update(() => {
          horas_extras_subtipos.value = listadoHorasExtrasSubTipo.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        horas_extras_subtipos.value = listadoHorasExtrasSubTipo.value.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    /**Filtro de Tipo de Horas Extras */
    function filtrarHorasExtrasTipo(val, update) {
      if (val === '') {
        update(() => {
          horas_extras_tipos.value = listadosAuxiliares.horas_extras_tipos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        horas_extras_tipos.value = listadosAuxiliares.horas_extras_tipos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /********
     * Hooks
     *********/
    onBeforeGuardar(() => {
      // rolpago.roles = rolpagoStore.roles
      /*rolpago.empleados_designados = rolpago.empleados_designados.map((empleado: EmpleadoGrupo) => {
        const empleadoGrupo = new EmpleadoGrupo()
        empleadoGrupo.hydrate(empleado)
        empleadoGrupo.es_responsable = empleado.es_responsable ? 1 : 0
        return empleadoGrupo
      })*/
    })
    let idSubtarea: any

    //onConsultado(() => rolpago.tarea = rolpagoStore.codigoTarea)
    async function guardarDatos(rolpago: RolPago) {
      try {
        // const entidad: RolPago =
        await editar(rolpago, false)
        const entidad = rolpago
        const rolpagoAux = new RolPago()
        rolpagoAux.hydrate(entidad)

        if (rolpagoAux.id) {
          // Por el momento se asigna automaticamente pero a futuro quienes lo harán serán los trabajadores de la torre de control
          // hacia los coordinadores

          listado.value = [rolpagoAux, ...listado.value]

          // Subir archivos
          idSubtarea = rolpagoAux.id
        }

        emit('cerrar-modal', false)
      } catch (e) {
        console.log(e)
      }
    }
    function reestablecerDatos() {
      reestablecer()
      emit('cerrar-modal')
    }

    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: { required },
      mes: { required },
    }
    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    /**Verifica si es un mes */
    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }

    /************
     * Funciones
     *************/
    /**Obtyención de descuentos de Ley */
    function prestamoQuirorafario() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const params = {
        empleado: rolpago.empleado,
        mes: rolpago.mes,
      }

      const url_salario =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(
          endpoints.prestamos_quirorafario_empleado
        )

      axios
        .get(url_salario, {
          params: params,
          responseType: 'json',
          headers: {
            Authorization:
              axiosHttpRepository.getOptions().headers.Authorization,
          },
        })
        .then((response) => {
          const { data } = response
          if (data) {
            rolpago.egreso = data.prestamo
          }
        })
    }
    function prestamoHipotecario() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const params = {
        empleado: rolpago.empleado,
        mes: rolpago.mes,
      }

      const url_salario =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(
          endpoints.prestamos_hipotecario_empleado
        )

      axios
        .get(url_salario, {
          params: params,
          responseType: 'json',
          headers: {
            Authorization:
              axiosHttpRepository.getOptions().headers.Authorization,
          },
        })
        .then((response) => {
          const { data } = response
          if (data) {
            rolpago.egreso = data.prestamo
          }
        })
    }
    function prestamoEmpresarial() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const params = {
        empleado: rolpago.empleado,
        mes: rolpago.mes,
      }

      const url_salario =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.obtener_prestamo_empleado)

      axios
        .get(url_salario, {
          params: params,
          responseType: 'json',
          headers: {
            Authorization:
              axiosHttpRepository.getOptions().headers.Authorization,
          },
        })
        .then((response) => {
          const { data } = response
          if (data) {
            rolpago.egreso = data.results
          }
        })
    }
    function fondosRotativos() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const params = {
        empleado: rolpago.empleado,
        mes: rolpago.mes,
      }
      const url_salario =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.otener_saldo_empleado_mes)

      axios
        .get(url_salario, {
          params: params,
          responseType: 'json',
          headers: {
            Authorization:
              axiosHttpRepository.getOptions().headers.Authorization,
          },
        })
        .then((response) => {
          const { data } = response
          if (data) {
            rolpago.egreso = data.saldoUsuarioEnMes.saldo_actual
          }
        })
    }
    function extensionCoverturaSalud() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const params = {
        empleado: rolpago.empleado,
        mes: rolpago.mes,
      }

      const url_salario =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(
          endpoints.extension_covertura_salud_empleado
        )

      axios
        .get(url_salario, {
          params: params,
          responseType: 'json',
          headers: {
            Authorization:
              axiosHttpRepository.getOptions().headers.Authorization,
          },
        })
        .then((response) => {
          const { data } = response
          if (data) {
            rolpago.egreso = data.valor != null ? data.valor : 0
          }
        })
    }
    function obtener_datos_empleado(campo) {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_salrio =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.datos_empleado) +
        rolpago.empleado
      axios({
        url: url_salrio,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axiosHttpRepository.getOptions().headers.Authorization,
        },
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          switch (campo) {
            case 'SALARIO':
              rolpago.salario = data.empleado.salario
              break
            case 'SUPA':
              rolpago.egreso = data.empleado.supa
              break
            case 'PERMISOS_SIN_RECUPERAR':
              obtener_dias_permiso()
              break
            default:
              break
          }
        }
      })
    }
    function obtener_dias_permiso() {
      rolpago.dias_permiso_sin_recuperar = null
      rolpago.dias = null
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_salrio =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.permisos_sin_recuperar)
      axios({
        url: url_salrio,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axiosHttpRepository.getOptions().headers.Authorization,
        },
        params: {
          empleado: rolpago.empleado,
          mes: rolpago.mes,
        },
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          rolpago.dias_permiso_sin_recuperar =
            data.totalDiasPermiso != null ? data.totalDiasPermiso : 0
          rolpago.dias = 30
        }
      })
    }
    /**Verificacion de Tipo de Descuento */
    function verificar_concepto_ingreso() {
      rolpago.ingreso = null
      const indice_ingreso = rolpago.ingresos.findIndex(
        (ingreso) => ingreso.concepto === rolpago.concepto_ingreso
      )
      if (indice_ingreso !== -1) {
        rolpago.ingreso = rolpago.ingresos[indice_ingreso].monto
      }
    }
    function verificar_descuento_general() {
      rolpago.egreso = null
      rolpago.descuento_ley = null
      rolpago.multa = null
      tipo_descuento.value = 'DESCUENTO_GENERAL'
      es_calculable.value = false
      switch (rolpago.descuento_general) {
        case 4:
          prestamoEmpresarial()
          es_calculable.value = true
          break
        case 5:
          fondosRotativos()
          es_calculable.value = true
          break
        default:
          buscar_egreso('DESCUENTO_GENERAL',rolpago.descuento_general !=null ?rolpago.descuento_general:0)
          break
      }
    }
    function buscar_egreso(tipo: string, id: number) {
      const indice_egreso = rolpago.egresos.findIndex(
        (egreso) => egreso.id_descuento === id && egreso.tipo === tipo
      )
      if (indice_egreso !== -1) {
        rolpago.egreso = rolpago.egresos[indice_egreso].monto
      }
    }
    function verificar_descuento_ley() {
      rolpago.egreso = null
      rolpago.descuento_general = null
      rolpago.multa = null
      tipo_descuento.value = 'DESCUENTO_LEY'
      switch (rolpago.descuento_ley) {
        case 1:
          es_calculable.value = true
          CalculoIESS()
          break
        case 2:
          es_calculable.value = true
          obtener_datos_empleado('SUPA')
          break
        case 3:
          extensionCoverturaSalud()
          break
        case 4:
          es_calculable.value = true
          prestamoHipotecario()
          break
        case 5:
          es_calculable.value = true
          prestamoQuirorafario()
          break
        default:
          rolpago.egreso = null
          break
      }
    }
    function verificar_multa() {
      es_calculable.value = false
      rolpago.egreso = null
      rolpago.descuento_general = null
      rolpago.descuento_ley = null
      tipo_descuento.value = 'MULTA'
      buscar_egreso('MULTA',rolpago.multa !=null ?rolpago.multa:0)

    }
    /**Calculo de  descuento del IESS */
    function CalculoIESS() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const params = {
        empleado: rolpago.empleado,
        mes: rolpago.mes,
      }

      const url_salario =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.porcentaje_iess)

      axios
        .get(url_salario, {
          params: params,
          responseType: 'json',
          headers: {
            Authorization:
              axiosHttpRepository.getOptions().headers.Authorization,
          },
        })
        .then((response) => {
          const { data } = response
          if (data) {
            rolpago.egreso = redondearDecimales(
              parseInt(rolpago.salario == null ? '0' : rolpago.salario) *
                data.porcentaje_iess,
              2
            )
          }
        })
    }
    function redondearDecimales(numero, decimales) {
      const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}') // Expresion regular para numeros con un cierto numero de decimales o mas
      if (numeroRegexp.test(numero)) {
        // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
        return Number(numero.toFixed(decimales))
      } else {
        return Number(numero.toFixed(decimales)) === 0 ? 0 : numero // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
      }
    }
    /**Añadir Ingreso */
    function aniadirIngreso() {
      const indice_ingreso = rolpago.ingresos.findIndex(
        (ingreso) => ingreso.concepto === rolpago.concepto_ingreso
      )
      //modificar
      if (indice_ingreso !== -1) {
        rolpago.ingresos[indice_ingreso].monto = rolpago.ingreso
      }
      rolpago.ingresos.push({
        concepto: rolpago.concepto_ingreso,
        id_empleado: rolpago.empleado,
        mes: rolpago.mes,
        monto: rolpago.ingreso,
      })
      if (rolpago.concepto_ingreso == 2) {
        rolpago.horas_extra_tipo = null
        rolpago.horas_extra_subtipo = null
      }
      rolpago.concepto_ingreso = null
      rolpago.ingreso = null
    }
    /**Añadir Egreso */
    function aniadirEgreso() {
      let id_descuento = 0
      if (rolpago.egreso == null) {
        rolpago.egreso = 0
      }
      switch (tipo_descuento.value) {
        case 'DESCUENTO_GENERAL':
          id_descuento =
            rolpago.descuento_general == null ? 0 : rolpago.descuento_general
          es_seleccionable_descuento_general.value = false
          es_seleccionable_descuento_ley.value = true
          es_seleccionable_multa.value = true
          rolpago.descuento_general = null
          break
        case 'DESCUENTO_LEY':
          es_seleccionable_descuento_general.value = true
          es_seleccionable_descuento_ley.value = true
          es_seleccionable_multa.value = false
          rolpago.descuento_ley = null
          break
        case 'MULTA':
          id_descuento = rolpago.multa == null ? 0 : rolpago.multa
          es_seleccionable_descuento_general.value = true
          es_seleccionable_descuento_ley.value = true
          es_seleccionable_multa.value = false
          rolpago.multa = null
          break
        default:
          break
      }
      rolpago.egresos.push({
        tipo: tipo_descuento.value,
        id_descuento: id_descuento,
        id_empleado: rolpago.empleado,
        mes: rolpago.mes,
        monto: rolpago.egreso,
      })
      rolpago.egreso = null
    }

    const imprimir: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-printer',
      color: 'primary',
      visible: ({ entidad }) => esRecursosHumanos,
      accion: ({ entidad }) => {
        generar_reporte(entidad)
      },
    }
    async function generar_reporte(valor: RolPago): Promise<void> {
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'rol_pago'
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.imprimir_rol_pago) +
        valor.id
      imprimirArchivo(url_pdf, 'GET', 'blob', 'pdf', filename, valor)
    }

    return {
      removeAccents,
      rolpago,
      concepto_ingresos,
      descuentos_generales,
      descuentos_ley,
      horas_extras_tipos,
      horas_extras_subtipos,
      sueldo,
      multas,
      campo,
      is_month,
      empleados,
      imprimir,
      guardarDatos,
      reestablecerDatos,
      datos_empleado,
      guardar,
      editar,
      reestablecer,
      tipo,
      es_consultado,
      tipo_descuento,
      filtrarEmpleado,
      filtrarHorasExtrasTipo,
      filtrarHorasExtrasSubTipo,
      checkValue,
      es_calculable,
      aniadirIngreso,
      aniadirEgreso,
      verificar_concepto_ingreso,
      verificar_descuento_general,
      verificar_descuento_ley,
      verificar_multa,
      es_seleccionable_descuento_general,
      es_seleccionable_descuento_ley,
      es_seleccionable_multa,
      v$,
      disabled,
      configuracionColumnasRolPagoTabla,
      configuracionColumnas: configuracionColumnasRolPago,
      accion,
      accionesTabla,
    }
  },
})
