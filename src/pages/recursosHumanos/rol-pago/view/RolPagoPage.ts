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
import { log } from 'console'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import axios from 'axios'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { ConceptoIngresoController } from 'pages/recursosHumanos/concepto_ingreso/infraestructure/ConceptoIngresoController'
import { DescuentosGenralesController } from 'pages/recursosHumanos/descuentos_generales/infraestructure/DescuentosGenralesController'
import { DescuentosLeyController } from 'pages/recursosHumanos/descuentos_ley/infraestructure/DescuentosLeyController'
import { MultaController } from 'pages/recursosHumanos/multas/infraestructure/MultaController'
import { integer } from 'vuelidate/lib/validators'

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
    const descuentos_ley = ref([])
    const multas = ref([])
    const tipo_descuento = ref()
    const es_consultado = ref(false)
    const es_seleccionable_descuento_general = ref(true)
    const es_seleccionable_descuento_ley = ref(true)
    const es_seleccionable_multa = ref(false)
    const tipo = ref(1)
    const es_calculable = ref(true);
    const campo = ref()


    const label_campo = computed(() => {
      const indice = concepto_ingresos.value.findIndex(
        (tipo_data) => tipo_data.id === tipo.value
      )
      return concepto_ingresos.value[indice].nombre
    })
    const is_month = ref(false)

    const empleados = ref<Empleado[]>([])
    const total_egresos = computed(()=>{
      return rolpago.egresos.reduce((accumulator, current) => parseInt( accumulator) +  parseInt(current.monto), 0);
    })
    const total_ingresos = computed(()=>{
      return rolpago.egresos.reduce((accumulator, current) => parseInt( accumulator) +  parseInt(current.monto), 0);
    })
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
      })
      concepto_ingresos.value = listadosAuxiliares.concepto_ingresos
      descuentos_generales.value = listadosAuxiliares.descuentos_generales
      descuentos_ley.value = listadosAuxiliares.descuentos_ley
      multas.value = listadosAuxiliares.multas
    })
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
    function CalculoIESS() {
      rolpago.egreso =
        parseInt(rolpago.salario == null ? '0' : rolpago.salario) * 0.0945
    }

    function aniadir_egreso() {
      let id_descuento = 0
      if (rolpago.egreso == null){
        rolpago.egreso=0;
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
        monto: rolpago.egreso,
      })
      rolpago.egreso = null
    }

    //Reglas de validacion
    const reglas = {
      concepto_ingreso: { required },
      descuento_general: { required },
      descuento_ley: { required },
      multa: { required },
      mes: { required },
      roles: { required },
    }

    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    rolpago.roles = ref([])
    rolpago.ingresos = ref([])
    rolpago.egresos = ref([])
    function datos_empleado() {
      obtener_datos_empleado('SALARIO')
    }
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
    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }
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
        monto: rolpago.ingreso,
      })
      rolpago.ingreso = null
    }
    function verificar_concepto_ingreso() {
      const indice_ingreso = rolpago.ingresos.findIndex(
        (ingreso) => ingreso.concepto === rolpago.concepto_ingreso
      )
      if (indice_ingreso !== -1) {
        rolpago.ingreso = rolpago.ingresos[indice_ingreso].monto
      }
    }

    function aniadirArregloRoles() {
      const indice_rol = rolpago.roles.findIndex(
        (rol_data) => rol_data.empleado === rolpago.empleado
      )
      if (indice_rol === -1) {
        const indice = empleados.value.findIndex(
          (empleado_data) => empleado_data.id === rolpago.empleado
        )
        rolpago.roles.push({
          empleado: rolpago.empleado,
          empleado_info:
            empleados.value[indice].nombres +
            ' ' +
            empleados.value[indice].apellidos,
          dias: rolpago.dias,
        })
      }

      tipo.value = 1
      campo.value = null
    }
    return {
      removeAccents,
      mixin,
      rolpago,
      concepto_ingresos,
      descuentos_generales,
      descuentos_ley,
      multas,
      campo,
      label_campo,
      is_month,
      empleados,
      datos_empleado,
      tipo,
      es_consultado,
      tipo_descuento,
      filtrarEmpleado,
      checkValue,
      es_calculable,
      aniadirIngreso,
      aniadir_egreso,
      verificar_concepto_ingreso,
      verificar_descuento_general,
      verificar_descuento_ley,
      verificar_multa,
      total_egresos,
      total_ingresos,
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
