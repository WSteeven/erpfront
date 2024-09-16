// Dependencias
import { configuracionColumnasAnticipo } from '../domain/configuracionColumnasAnticipo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AnticipoController } from '../infraestructure/AnticipoController'
import { Anticipo } from '../domain/Anticipo'
import { removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha } from 'config/utils'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'


export default defineComponent({
  components: { TabLayout, SelectorImagen},
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Anticipo,
      new AnticipoController()
    )
    const {
      entidad: anticipo,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const key_enter = ref(0)
    const motivos = ref([])
    const tipos = ref([
      { id: 1, nombre: 'Prestamo Descuento' },
      { id: 2, nombre: 'Anticipo' },
    ])
    const formas_pago = ref([
      { id: 1, nombre: 'Efectivo' },
      { id: 2, nombre: 'Cheque' },
      { id: 3, nombre: 'Nota Debito' },
    ])
    const tipos_prestamo = ref([
      { id: 1, nombre: 'Prestamo Empresa', tipo: 1 },
      { id: 2, nombre: 'Anticipo de Sueldo de empleado', tipo: 2 },
      { id: 2, nombre: 'Anticipo de Prestamo quirorafario', tipo: 2 },
    ])
    const empleados = ref([])
    cargarVista(async () => {
      obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos',estado: 1 },
        }
      })
    })
    motivos.value = listadosAuxiliares.motivos

    //Reglas de validacion
    const reglas = {
      empleado: {required},
      fecha: { required },
      valor: { required },
      forma_pago: { required },
    }



    const v$ = useVuelidate(reglas, anticipo)
    setValidador(v$.value)
    function filtrarEmpleado(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase();
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }


    return {
      removeAccents,
      mixin,
      anticipo,
      tipos_prestamo,
      motivos,
      tipos,
      formas_pago,
      maskFecha,
      empleados,
      filtrarEmpleado,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasAnticipo,
      accionesTabla
    }
  },
})
