// Dependencias
import { configuracionColumnasRolPago } from '../domain/configuracionColumnasRolPago'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect } from 'vue'

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
    const tipos = ref([
      { id: 1, nombre: 'Alimentacion', calculable_iess  : true },
      { id: 2, nombre: 'Comisiones', calculable_iess  : false  },
      { id: 3, nombre: 'Horas Extras', calculable_iess  : true  },
    ])
    const es_consultado = ref(false)
    const tipo = ref(1)
    const campo = ref()
    const label_campo = computed(() => {
      const indice = tipos.value.findIndex(
        (tipo_data) => tipo_data.id === tipo.value
      )
      return tipos.value[indice].nombre
    })
    const is_month = ref(false)

    const empleados = ref<Empleado[]>([])
    cargarVista(async () => {
      obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
    })

    //Reglas de validacion
    const reglas = {
      concepto_ingreso: { required },
      mes: { required },
      roles: { required },
    }

    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    rolpago.roles = ref([])
    rolpago.ingresos = ref([])
    rolpago.egresos = ref([])
    function datos_empleado(){
      salario();
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
    function salario (){

      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_salrio =
                apiConfig.URL_BASE +
                '/' +
                axiosHttpRepository.getEndpoint(endpoints.salario_empleado)+ rolpago.empleado;
      axios({
        url: url_salrio,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Authorization': axiosHttpRepository.getOptions().headers.Authorization
        }
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          rolpago.salario = data.empleado.salario
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
      rolpago.ingresos.push({concepto: rolpago.concepto_ingreso, monto: rolpago.ingreso})
      rolpago.ingreso=null
    }
    function verificar_concepto_ingreso(){
      const indice_ingreso = rolpago.ingresos.findIndex(
        (ingreso) => ingreso.concepto === rolpago.concepto_ingreso
      )
      if (indice_ingreso !== -1) {
        rolpago.ingreso = rolpago.ingresos[indice_ingreso].monto
      }
    }
    function verificar_concepto_egreso(){
      const indice_egreso = rolpago.egresos.findIndex(
        (egreso) => egreso.concepto === rolpago.concepto_egreso
      )
      if (indice_egreso !== -1) {
        rolpago.egreso = rolpago.egresos[indice_egreso].monto
      }
    }
    function aniadirEgreso() {
      const indice_egreso = rolpago.egresos.findIndex(
        (egreso) => egreso.concepto === rolpago.concepto_egreso
      )
      //modificar
      if (indice_egreso !== -1) {
        rolpago.egresos[indice_egreso].monto = rolpago.egreso
      }
      rolpago.egresos.push({concepto: rolpago.concepto_egreso, monto: rolpago.egreso})
      rolpago.egreso=null
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
      tipos,
      campo,
      label_campo,
      is_month,
      empleados,
      datos_empleado,
      tipo,
      es_consultado,
      filtrarEmpleado,
      checkValue,
      aniadirIngreso,
      aniadirEgreso,
      verificar_concepto_ingreso,
      verificar_concepto_egreso,
      v$,
      disabled,
      configuracionColumnasRolPagoTabla,
      configuracionColumnas: configuracionColumnasRolPago,
      accionesTabla,
    }
  },
})
