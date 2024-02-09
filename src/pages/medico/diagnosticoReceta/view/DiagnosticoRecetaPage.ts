// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useAuthenticationStore } from 'stores/authentication'
import { Ref, defineComponent, reactive, ref } from 'vue'
import { tiposEnfermedades } from 'config/utils/medico'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import DetallePaciente from 'medico/gestionarPacientes/view/DetallePaciente.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CieController } from 'pages/medico/cie/infraestructure/CieController'
import { ConsultaController } from '../infraestructure/ConsultaController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Cie } from 'pages/medico/cie/domain/Cie'
import { useMedicoStore } from 'stores/medico'
import { Consulta } from '../domain/Consulta'


export default defineComponent({
  components: {
    SimpleLayout,
    DetallePaciente,
    ButtonSubmits,
  },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const medicoStore = useMedicoStore()

    /****************
     * Controladores
     ****************/
    const empleadoController = new EmpleadoController()
    const cieController = new CieController()

    /***********
     * Variable
     ***********/
    const empleado = reactive(new Empleado())
    const enfermedades: Ref<Cie[]> = ref([])
    const cargando = new StatusEssentialLoading()
    const tabsEnfermedades = ref(tiposEnfermedades.PREEXISTENTES)

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Consulta, new ConsultaController())
    const { entidad: consulta } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    /************
     * Funciones
     ************/
    const consultarEmpleado = async (id: number) => {
      cargando.activar()
      try {
        const { result } = await empleadoController.consultar(id)
        empleado.hydrate(result)
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const consultarEnfermedades = async () => {
      cargando.activar()
      try {
        const { result } = await cieController.listar()
        enfermedades.value = result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    /*************
   * Validaciones
   **************/
    const reglas = {
      diagnosticos: { required },
    }

    const v$ = useVuelidate(reglas, consulta)
    setValidador(v$.value)

    /*******
    * Init
    *******/
    if (medicoStore.empleado) {
      empleado.hydrate(medicoStore.empleado)
      consulta.empleado = empleado.id
    } else {
      consultarEmpleado(authenticationStore.user.id)
      consulta.empleado = authenticationStore.user.id
    }
    consultarEnfermedades()

    return {
      v$,
      mixin,
      consulta,
      empleado,
      enfermedades,
      tiposEnfermedades,
      tabsEnfermedades,
    }
  }
})
