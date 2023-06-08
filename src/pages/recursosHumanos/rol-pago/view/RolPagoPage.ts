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
import { removeAccents } from 'shared/utils'
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

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(RolPago, new RolPagoController())
    const {
      entidad: rolpago,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()
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
    cargarVista(async () => {
      obtenerListados({
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
      concepto_ingresos.value = listadosAuxiliares.concepto_ingresos
      descuentos_generales.value = listadosAuxiliares.descuentos_generales
      descuentos_ley.value = listadosAuxiliares.descuentos_ley
      multas.value = listadosAuxiliares.multas
      horas_extras_tipos.value = listadosAuxiliares.horas_extras_tipos
      horas_extras_subtipos.value = listadosAuxiliares.horas_extras_subtipos
    })
    const listadoHorasExtrasSubTipo = computed(() => {
      return listadosAuxiliares.horas_extras_subtipos.filter(
        (horas_extras_subtipos: HorasExtrasSubTipo) =>
          horas_extras_subtipos.horas_extras === rolpago.horas_extra_tipo
      )
    })
    //Reglas de validacion
    const reglas = {
      empleado: { required },
      mes: { required },
      }
    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    rolpago.roles = ref([])
    rolpago.ingresos = ref([])
    rolpago.egresos = ref([])
    function datos_empleado() {
      obtener_datos_empleado('SALARIO')
    }
    /**Verifica si es un mes */
    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }
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
            rolpago.egreso = data.prestamo
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
            default:
              break
          }
        }
      })
    }
    /**Verificacion de Tipo de Descuento */
    function verificar_concepto_ingreso() {
      const indice_ingreso = rolpago.ingresos.findIndex(
        (ingreso) => ingreso.concepto === rolpago.concepto_ingreso
      )
      if (indice_ingreso !== -1) {
        rolpago.ingreso = rolpago.ingresos[indice_ingreso].monto
      }
    }
    function verificar_descuento_general() {
      es_calculable.value = false
      rolpago.egreso = null
      tipo_descuento.value = 'DESCUENTO_GENERAL'
    }
    function verificar_descuento_ley() {
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
      tipo_descuento.value = 'MULTA'
    }
    /**Calculo de  descuento del IESS */
    function CalculoIESS() {
      rolpago.egreso =
        parseInt(rolpago.salario == null ? '0' : rolpago.salario) * 0.0945
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
    /***Filtros de Listados */
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
    return {
      removeAccents,
      mixin,
      rolpago,
      concepto_ingresos,
      descuentos_generales,
      descuentos_ley,
      horas_extras_tipos,
      horas_extras_subtipos,
      multas,
      campo,
      is_month,
      empleados,
      datos_empleado,
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
      accionesTabla,
    }
  },
})
