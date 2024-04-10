import { FichaAptitudController } from '../../gestionarPacientes/modules/fichaAptitud/infraestructure/FichaAptitudController'
import { FichaAptitud } from 'pages/medico/gestionarPacientes/modules/fichaAptitud/domain/FichaAptitud'
import { configuracionColumnasFichaMedica } from '../domain/configuracionColumnasFichaMedica'
import { useAuthenticationStore } from 'stores/authentication'
import { Ref, defineComponent, ref } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

import { tabOptionsTiposFichasMedicas, tiposFichasMedicas } from 'config/utils/medico'
import { accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesGestionPaciente } from 'pages/medico/gestionarPacientes/application/ComportamientoModalesGestionPaciente'
import { useMedicoStore } from 'stores/medico'

export default defineComponent({
  components: {
    EssentialTableTabs,
    ModalesEntidad,
  },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const medicoStore = useMedicoStore()

    /************
     * Variables
     ************/
    const fichaAptitudController = new FichaAptitudController()
    const fichasAptitud: Ref<FichaAptitud[]> = ref([])
    const fichasGeneral: Ref<FichaAptitud[] | any> = ref([])
    const tabActual = ref(tiposFichasMedicas.APTITUD)
    const modales = new ComportamientoModalesGestionPaciente()

    const consultarFichasAptitudPendientesFirmar = async () => {
      const { result } = await fichaAptitudController.listar({ firmado_paciente: false, paciente_id: authenticationStore.user.id })
      fichasAptitud.value = result
      fichasGeneral.value = result
    }

    /***************
     * Botones tabla
     ***************/
    const botonFirmarPaciente: CustomActionTable = {
      titulo: 'Firmar',
      icono: 'bi-pencil-square',
      accion: async ({ entidad }) => {
        // trabajoAsignadoStore.idSubtareaSeleccionada = entidad.id
        medicoStore.idFichaAptitud = entidad.id
        modales.abrirModalEntidad('FichaAptitudPage')
      },
    }

    /*******
     * Init
     *******/
    consultarFichasAptitudPendientesFirmar()

    return {
      fichasGeneral,
      configuracionColumnasFichaMedica,
      tabOptionsTiposFichasMedicas,
      tabActual,
      accionesTabla,
      consultarFichasAptitudPendientesFirmar,
      botonFirmarPaciente,
      modales,
    }
  }
})
