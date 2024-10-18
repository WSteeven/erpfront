// Dependencias
import { configuracionColumnasRolPago } from '../domain/configuracionColumnasRolPago'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, Ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolPagoController } from '../infraestructure/RolPagoController'
import { RolPago } from '../domain/RolPago'
import { imprimirArchivo, removeAccents } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import { apiConfig, endpoints } from 'config/api'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasRolPagoTabla } from '../domain/configuracionColumnasRolPagoTabla'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import axios from 'axios'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { ConceptoIngresoController } from 'pages/recursosHumanos/concepto_ingreso/infraestructure/ConceptoIngresoController'
import { DescuentosGenralesController } from 'pages/recursosHumanos/descuentos_generales/infraestructure/DescuentosGenralesController'
import { DescuentosLeyController } from 'pages/recursosHumanos/descuentos_ley/infraestructure/DescuentosLeyController'
import { MultaController } from 'pages/recursosHumanos/multas/infraestructure/MultaController'
import { HorasExtrasSubTipo } from 'pages/recursosHumanos/horas_extras_subtipo/domain/HorasExtrasSubTipo'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useCargandoStore } from 'stores/cargando'
import { LocalStorage, useQuasar } from 'quasar'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useRolPagoStore } from 'stores/rolPago'
import { useNotificacionStore } from 'stores/notificacion'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { ArchivoRolPagoController } from '../infraestructure/ArchivoRolPagoController'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { configuracionColumnasEgresoRolPago } from '../domain/configuracionColumnasEgresoRolPago'
import { EgresoRolPago } from '../domain/EgresoRolPago'
import { EgresoRolPagoController } from '../infraestructure/EgresoRolPagoController'
import { IngresoRolPago } from '../domain/IngresoRolPago'
import { IngresoRolPagoController } from '../infraestructure/IngresoRolPagoController'
import { configuracionColumnasIngresoRolPago } from '../domain/configuracionColumnasIngresoRolPago'
import { useEmpleadoStore } from 'stores/empleado'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    EssentialTable,
    ButtonSubmits,
    GestorDocumentos
  },

  setup(props, { emit }) {
    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(RolPago, new RolPagoController())
    const mixinRolPago = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoRolPagoController()
    )

    const mixinEgresoRolPago = new ContenedorSimpleMixin(
      EgresoRolPago,
      new EgresoRolPagoController()
    )
    const mixinIngresoRolPago = new ContenedorSimpleMixin(
      IngresoRolPago,
      new IngresoRolPagoController()
    )
    const { eliminar, guardar: guardarEgreso } =
      mixinEgresoRolPago.useComportamiento()
    const { eliminar: eliminarIngreso, guardar: guardarIngreso } =
      mixinIngresoRolPago.useComportamiento()

    /*********
     * Stores
     *********/
    const rolPagoStore = useRolPagoStore()
    const recursosHumanosStore = useRecursosHumanosStore()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const empleadoStore = useEmpleadoStore()

    const {
      entidad: rolpago,
      listadosAuxiliares,
      accion,
      disabled
    } = mixin.useReferencias()

    const { entidad: egresoRolPago } = mixinEgresoRolPago.useReferencias()

    const { entidad: ingresoRolPago } = mixinIngresoRolPago.useReferencias()
    const {
      obtenerListados,
      cargarVista,
      consultar,
      guardar,
      editar,
      reestablecer,
      setValidador
    } = mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()
    const refArchivoRolPago = ref()
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        descuentos_generales: {
          controller: new DescuentosGenralesController(),
          params: {}
        },
        multas: {
          controller: new MultaController(),
          params: {}
        },
        concepto_ingresos: {
          controller: new ConceptoIngresoController(),
          params: {}
        }
      })
      empleados.value = listadosAuxiliares.empleados
      concepto_ingresos.value = listadosAuxiliares.concepto_ingresos
      descuentos_generales.value = listadosAuxiliares.descuentos_generales
      descuentos_ley.value = (
        await new DescuentosLeyController().listar()
      ).result
      multas.value = listadosAuxiliares.multas
      horas_extras_tipos.value =
        LocalStorage.getItem('horas_extras_tipos') == null
          ? []
          : JSON.parse(LocalStorage.getItem('horas_extras_tipos')!.toString())
      horas_extras_subtipos.value =
        LocalStorage.getItem('horas_extras_subtipos') == null
          ? []
          : JSON.parse(
              LocalStorage.getItem('horas_extras_subtipos')!.toString()
            )
    })
    /*******
     * Init
     *******/
    if (rolPagoStore.idRolPagoSeleccionada) {
      consultar({ id: rolPagoStore.idRolPagoSeleccionada })
    } else rolpago.hydrate(new RolPago())
    if (rolPagoStore.idRolPagoMes) {
      rolpago.rol_pago_id = rolPagoStore.idRolPagoMes
      rolpago.mes = rolPagoStore.mes
      rolpago.es_quincena = rolPagoStore.es_quincena
    }

    // console.log(rolPagoStore.recalcularSueldo)

    accion.value = rolPagoStore.accion

    /************
     * Variables
     ************/
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
    const indice_ingreso = ref()
    const indice_egreso = ref()
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const carga_archivo = ref(false)
    recursosHumanosStore.obtener_porcentaje_anticipo()

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
      obtener_datos_empleado('DEPARTAMENTO')
    }

    /*********
     * Filtros
     **********/
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
          v => v.nombre.toLowerCase().indexOf(needle) > -1
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
          v => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /********
     * Hooks
     *********/
    onConsultado(async () => {
      es_consultado.value = true
      console.log('consultado')

      empleadoStore.idEmpleado = rolPagoStore.idEmpleado
      await empleadoStore.cargarEmpleado()
      // console.log(empleadoStore.empleado)
      rolPagoStore.departamento = empleadoStore.empleado.departamento

      if (rolpago.estado == 'FINALIZADO') {
        setTimeout(() => {
          refArchivoRolPago.value.listarArchivos({
            rol_pago_id: rolpago.id
          })
          refArchivoRolPago.value.esConsultado = true
          carga_archivo.value = true
        }, 2000)
      }
    })

    // onBeforeModificar(()=>{
    //   rolpago.sueldo = sueldoCalculado
    // })

    async function guardarDatos(rolpago: RolPago) {
      try {
        let entidad: RolPago = new RolPago()
        if (accion.value == 'NUEVO') {
          entidad = await guardar(rolpago)
        } else {
          console.log('rol', rolpago)
          await editar(rolpago, false)
          entidad = rolpago
        }
        // rolPagoStore.recalcularSueldo = true
        emit('cerrar-modal', false)
        emit('guardado', { key: 'RolPagoMesPage', model: rolpago })
      } catch (e) {
        rolPagoStore.recalcularSueldo = false
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
      mes: { required }
    }
    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    /**Verifica si es un mes */
    function checkValue(reason) {
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
        mes: rolpago.mes
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
              axiosHttpRepository.getOptions().headers.Authorization
          }
        })
        .then(response => {
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
        mes: rolpago.mes
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
              axiosHttpRepository.getOptions().headers.Authorization
          }
        })
        .then(response => {
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
        mes: rolpago.mes
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
              axiosHttpRepository.getOptions().headers.Authorization
          }
        })
        .then(response => {
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
        mes: rolpago.mes
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
              axiosHttpRepository.getOptions().headers.Authorization
          }
        })
        .then(response => {
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
        mes: rolpago.mes
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
              axiosHttpRepository.getOptions().headers.Authorization
          }
        })
        .then(response => {
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
          Authorization: axiosHttpRepository.getOptions().headers.Authorization
        }
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
          Authorization: axiosHttpRepository.getOptions().headers.Authorization
        },
        params: {
          empleado: rolpago.empleado,
          mes: rolpago.mes
        }
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          rolpago.dias_permiso_sin_recuperar =
            data.totalDiasPermiso != null ? data.totalDiasPermiso : 0
          rolpago.dias = rolpago.es_quincena ? 15 : 30
        }
      })
    }
    /**Verificacion de Tipo de Descuento */
    function verificar_concepto_ingreso() {
      rolpago.ingreso = null
      const indice_ingreso_busqueda = rolpago.ingresos.findIndex(
        ingreso => ingreso.concepto === rolpago.concepto_ingreso
      )
      if (indice_ingreso_busqueda !== -1) {
        rolpago.ingreso = rolpago.ingresos[indice_ingreso_busqueda].monto
        indice_ingreso.value = indice_ingreso_busqueda
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
          buscar_egreso(
            'DESCUENTO_GENERAL',
            rolpago.descuento_general != null ? rolpago.descuento_general : 0
          )
          break
      }
    }
    function buscar_egreso(tipo: string, id: number) {
      const indice_egreso_busqueda = rolpago.egresos.findIndex(
        egreso => egreso.id_descuento === id && egreso.tipo === tipo
      )
      if (indice_egreso_busqueda !== -1) {
        rolpago.egreso = rolpago.egresos[indice_egreso_busqueda].monto
        indice_egreso.value = indice_egreso_busqueda
      }
    }
    function obtener_egreso(tipo: string, id: number) {
      let egreso
      switch (tipo) {
        case 'DESCUENTO_GENERAL':
          egreso = listadosAuxiliares.descuentos_generales.filter(
            v => v.id == id
          )[0]
          break
        case 'MULTA':
          egreso = listadosAuxiliares.multas.filter(v => v.id == id)[0]
          break
        default:
          break
      }
      return egreso
    }
    function obtener_ingreso(id: number) {
      const ingreso = listadosAuxiliares.concepto_ingresos.filter(
        v => v.id == id
      )[0]
      return ingreso
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
      buscar_egreso('MULTA', rolpago.multa != null ? rolpago.multa : 0)
    }
    /**Calculo de  descuento del IESS */
    function CalculoIESS() {
      if (rolpago.iess == null) {
        consultarIESS()
      }
      rolpago.egreso =
        rolpago.iess == null ? 0 : parseFloat(rolpago.iess.toString())
    }
    function consultarIESS() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const params = {
        empleado: rolpago.empleado,
        mes: rolpago.mes
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
              axiosHttpRepository.getOptions().headers.Authorization
          }
        })
        .then(response => {
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
      //modificar
      if (indice_ingreso.value >= 0) {
        rolpago.ingresos[indice_ingreso.value].monto = rolpago.ingreso
      } else {
        ingresoRolPago.concepto = rolpago.concepto_ingreso
        ingresoRolPago.id_empleado = rolpago.empleado
        ingresoRolPago.monto = rolpago.ingreso
        ingresoRolPago.id_rol_pago = rolpago.id
        guardarIngreso(ingresoRolPago)
        const id_ingreso =
          rolpago.concepto_ingreso != null ? rolpago.concepto_ingreso : 0
        rolpago.ingresos.push({
          concepto: rolpago.concepto_ingreso,
          concepto_info: obtener_ingreso(id_ingreso).nombre,
          id_empleado: rolpago.empleado,
          monto: rolpago.ingreso
        })
      }
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
      if (indice_egreso.value >= 0) {
        rolpago.egresos[indice_egreso.value].monto = rolpago.egreso
      } else {
        egresoRolPago.descuento = obtener_egreso(
          tipo_descuento.value,
          id_descuento
        ).nombre
        egresoRolPago.monto = rolpago.egreso
        egresoRolPago.id_descuento = id_descuento
        egresoRolPago.tipo = tipo_descuento.value
        egresoRolPago.empleado = rolpago.empleado
        egresoRolPago.id_rol_pago = rolpago.id
        guardarEgreso(egresoRolPago)
        rolpago.egresos.push({
          tipo: tipo_descuento.value,
          id_descuento: id_descuento,
          descuento: obtener_egreso(tipo_descuento.value, id_descuento).nombre,
          id_empleado: rolpago.empleado,
          mes: rolpago.mes,
          monto: rolpago.egreso
        })
      }
      rolpago.egreso = null
    }

    const imprimir: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-printer',
      color: 'primary',
      visible: () => esRecursosHumanos,
      accion: ({ entidad }) => {
        generar_reporte(entidad)
      }
    }

    const btnEditarEgreso: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      color: 'warning',
      visible: () => true,
      accion: ({ entidad }) => {
        switch (entidad.tipo) {
          case 'DESCUENTO_GENERAL':
            rolpago.descuento_general = entidad.id_descuento
            rolpago.multa = null
            break
          case 'MULTA':
            rolpago.multa = entidad.id_descuento
            rolpago.descuento_general = null
            break
          default:
            break
        }
        es_calculable.value = false
        buscar_egreso(
          entidad.tipo,
          rolpago.descuento_general != null ? rolpago.descuento_general : 0
        )
      }
    }
    const btnEditarIngreso: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      color: 'warning',
      visible: () => true,
      accion: ({ entidad }) => {
        rolpago.concepto_ingreso = entidad.concepto
        verificar_concepto_ingreso()
      }
    }
    const btnEliminarEgreso: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      visible: () => true,
      accion: ({ entidad, posicion }) => {
        if (entidad.id == undefined) {
          rolpago.egresos.splice(posicion, 1)
        } else {
          eliminar(entidad, () => rolpago.egresos.splice(posicion, 1))
        }
      }
    }

    const btnEliminarIngreso: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      visible: () => true,
      accion: async ({ entidad, posicion }) => {
        if (entidad.id == undefined) {
          rolpago.ingresos.splice(posicion, 1)
        } else {
          await eliminarIngreso(entidad, () =>
            rolpago.ingresos.splice(posicion, 1)
          )
          // rolpago.ingresos.splice(posicion, 1)
        }
      }
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
    function calcularSalario(tipo_contrato) {
      // let dias_quincena = rolpago.es_quincena ? 15 : 0
      // if (rolpago.medio_tiempo || rolpago.tipo_contrato == 3) {
      // dias_quincena = 0
      // }
      const dias = parseInt(rolpago.dias ? rolpago.dias.toString() : '0')
      const salario = parseFloat(rolpago.salario ?? '0') //salario es el definido en el registro del empleado
      console.log(dias, salario)
      const porcentajeAnticipo = recursosHumanosStore.porcentajeAnticipo / 100
      const sueldo = rolpago.es_quincena
        ? (salario / 30) *
          dias *
          (porcentajeAnticipo + (rolpago.es_quincena ? porcentajeAnticipo : 0))
        : (salario / 30) * dias
      // console.log(sueldo)
      // const sueldo = (salario / 30) * dias_totales
      //
      let total_sueldo = 0
      console.log(porcentajeAnticipo, tipo_contrato)
      // switch (tipo_contrato) {
      // case 3:
      //   if (dias == 15) {
      //     total_sueldo = salario * porcentajeAnticipo
      //   } else {
      //     const quincena = (salario / 30)
      //     total_sueldo = quincena * dias
      //     console.log(quincena)
      //     console.log(total_sueldo)
      //   }
      //   break
      // default:
      if (rolpago.es_vendedor_medio_tiempo) {
        const porcentaje = rolpago.porcentaje_quincena
          ? rolpago.porcentaje_quincena / 100
          : 1
        total_sueldo =
          rolpago.es_quincena == true ? salario * 0.5 * porcentaje : sueldo
        console.log('if', total_sueldo, porcentaje)
      } else {
        if (rolpago.es_quincena) {
          if (dias == 15) total_sueldo = sueldo
          else {
            if (empleadoStore.empleado.departamento == 'CUADRILLA') {
              total_sueldo = ((salario * porcentajeAnticipo) / 15) * dias
            } else total_sueldo = ((salario * porcentajeAnticipo) / 30) * dias //* porcentajeAnticipo
          }
        } else total_sueldo = sueldo
        console.log(total_sueldo)
      }

      //     break
      // }
      rolpago.sueldo = parseFloat(total_sueldo.toFixed(2))
    }

    const sueldoCalculado = computed(() => {
      let dias_quincena = rolpago.es_quincena == true ? 15 : 0
      const dias = parseFloat(
        rolpago.dias != null ? rolpago.dias.toString() : '0'
      )
      if (rolpago.medio_tiempo || rolpago.tipo_contrato == 3) {
        dias_quincena = 0
      }
      const salario = parseFloat(rolpago.salario ?? '0')
      const dias_totales = dias + dias_quincena
      const sueldo = (salario / 30) * dias_totales
      let total_sueldo = 0
      const porcentajeAnticipo = recursosHumanosStore.porcentajeAnticipo / 100
      switch (rolpago.tipo_contrato) {
        case 3:
          const quincena = salario * porcentajeAnticipo
          total_sueldo = (quincena / 15) * dias
          break
        default:
          if (rolpago.es_vendedor_medio_tiempo) {
            const porcentaje =
              rolpago.porcentaje_quincena != null
                ? rolpago.porcentaje_quincena / 100
                : 1
            total_sueldo =
              rolpago.es_quincena == true ? sueldo * 0.5 * porcentaje : sueldo
          } else {
            total_sueldo =
              rolpago.es_quincena == true ? sueldo * porcentajeAnticipo : sueldo
          }

          break
      }
      return parseFloat(total_sueldo.toFixed(2))
    }).value

    watchEffect(() => {
      // if (rolPagoStore.recalcularSueldo)
      if (!rolpago.sueldo_quincena_modificado)
        calcularSalario(rolpago.tipo_contrato)
    })
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
      mixinRolPago,
      mixinEgresoRolPago,
      refArchivoRolPago,
      guardarDatos,
      reestablecerDatos,
      datos_empleado,
      guardar,
      editar,
      reestablecer,
      tipo,
      es_consultado,
      tipo_descuento,
      filtrarEmpleados,
      filtrarHorasExtrasTipo,
      filtrarHorasExtrasSubTipo,
      checkValue,
      es_calculable,
      carga_archivo,
      aniadirIngreso,
      aniadirEgreso,
      verificar_concepto_ingreso,
      verificar_descuento_general,
      verificar_descuento_ley,
      verificar_multa,
      btnEditarEgreso,
      btnEliminarEgreso,
      btnEditarIngreso,
      btnEliminarIngreso,
      es_seleccionable_descuento_general,
      es_seleccionable_descuento_ley,
      es_seleccionable_multa,
      v$,
      disabled,
      configuracionColumnasRolPagoTabla,
      configuracionColumnasEgresoRolPago,
      configuracionColumnasIngresoRolPago,
      configuracionColumnas: configuracionColumnasRolPago,
      endpoint: endpoints.archivo_rol_pago,
      accion,
      acciones,
      accionesTabla
    }
  }
})
