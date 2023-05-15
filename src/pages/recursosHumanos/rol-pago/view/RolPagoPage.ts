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
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { configuracionColumnasRolPagoTabla } from '../domain/configuracionColumnasRolPagoTabla'

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
      { id: 1, nombre: 'Días' },
      { id: 2, nombre: 'Alimentacion' },
      { id: 3, nombre: 'Comisiones' },
      { id: 4, nombre: 'Horas Extras' },
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
      mes: { required },
      roles: { required },
    }

    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    rolpago.roles = ref([])
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
    function aniadirRol() {
      if (tipo.value > 0) {
        switch (tipo.value) {
          case 1:
            rolpago.dias = campo.value
            campo.value = null
            break
          case 2:
            rolpago.alimentacion = campo.value
            campo.value = null
            break
          case 3:
            rolpago.comisiones = campo.value
            campo.value = null
            break
          case 4:
            rolpago.horas_extras = campo.value
            campo.value = null
            break
          default:
            break
        }
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
          comision: rolpago.comisiones,
          alimentacion: rolpago.alimentacion,
          horas_extras: rolpago.horas_extras,
        })
        rolpago.comisiones = null
        rolpago.alimentacion = null
        rolpago.horas_extras = null
      }

      tipo.value = 1
      campo.value = null
    }
    watchEffect(() => {
      if (
        rolpago.dias !== null &&
        rolpago.alimentacion !== null &&
        rolpago.comisiones !== null &&
        rolpago.horas_extras !== null
      ) {
        aniadirArregloRoles()
      }
    })
    return {
      removeAccents,
      mixin,
      rolpago,
      tipos,
      campo,
      label_campo,
      is_month,
      empleados,
      tipo,
      es_consultado,
      filtrarEmpleado,
      checkValue,
      aniadirRol,
      v$,
      disabled,
      configuracionColumnasRolPagoTabla,
      configuracionColumnas: configuracionColumnasRolPago,
      accionesTabla,
    }
  },
})
