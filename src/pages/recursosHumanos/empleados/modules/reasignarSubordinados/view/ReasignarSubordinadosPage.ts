import { defineComponent, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useEmpleadoStore } from 'stores/empleado'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { ordenarLista } from 'shared/utils'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { acciones } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: { ButtonSubmits, NoOptionComponent, ErrorComponent },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Empleado>,
      required: true
    },
    accion: { type: String, default: 'NUEVO' },
    mostrarListado: { type: Boolean, default: false },
    datos: { type: Object, required:false }
  },
  emits: ['cerrar-modal', 'guardado', 'modificado'],
  setup: (props, { emit }) => {
    const { listadosAuxiliares } = props.mixinModal.useReferencias()
    const { notificarError, notificarCorrecto } = useNotificaciones()
    const empleadoStore = useEmpleadoStore()
    const empleados_subordinados = ref(empleadoStore.empleadosSubordinados)
    const jefeComun = ref<number | null>(null)

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    async function guardar() {
      // aquí se guarda la reasignación de subordinados
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.reasignar_empleados_subordinados)
      const response: AxiosResponse = await axios.post(ruta, {
        subordinados: empleados_subordinados.value
      })
      if (response.status === 200) {
        notificarCorrecto(response.data.mensaje)
        emit('guardado', 'ReasignarSubordinadosPage')
        emit('cerrar-modal', false)
      } else {
        notificarError('Error al reasignar los subordinados')
      }
    }

    function cancelar() {
      emit('cerrar-modal', false)
    }

    function aplicarJefeComun() {
      if (!jefeComun.value) return

      empleados_subordinados.value.forEach((subordinado: any) => {
        subordinado.nuevo_jefe_id = jefeComun.value
      })
    }

    return {
      empleados_subordinados,
      acciones,
      jefeComun,
      empleados,
      filtrarEmpleados,
      aplicarJefeComun,
      ordenarLista,
      guardar,
      cancelar
    }
  }
})
