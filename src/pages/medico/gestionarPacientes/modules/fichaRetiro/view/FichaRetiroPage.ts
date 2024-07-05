import { AptitudMedica } from '../../seccionesFichas/aptitudMedicaTrabajo/domain/AptitudMedica'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { imprimirArchivo, mapearOptionsSelect } from 'shared/utils'
import { acciones, accionesTabla, maskFecha, selectOptionsSiNo } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { required } from 'shared/i18n-validators'
import { apiConfig, endpoints } from 'config/api'
import { useMedicoStore } from 'stores/medico'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import ExamenFisicoRegionalComponent from 'medico/gestionarPacientes/modules/seccionesFichas/examenFisicoRegional/ExamenFisicoRegionalComponent.vue'
import AptitudMedicaTrabajo from 'medico/gestionarPacientes/modules/seccionesFichas/aptitudMedicaTrabajo/AptitudMedicaTrabajo.vue'
import ContantesVitales from 'medico/gestionarPacientes/modules/seccionesFichas/constantesVitales/ContantesVitales.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { ConstanteVital } from '../../seccionesFichas/domain/ConstanteVital'
import { InformacionDefectoFichaRetiroController } from '../infraestructure/InformacionDefectoFichaRetiroController'
import { FichaRetiro } from '../domain/FichaRetiro'
import { FichaRetiroController } from '../infraestructure/FichaRetiroController'
import { ExamenFisicoRegional } from '../../seccionesFichas/examenFisicoRegional/domain/ExamenFisicoRegional'

export default defineComponent({
  name: 'fichas_retiros',
  components: {
    SimpleLayout,
    EssentialTable,
    ContantesVitales,
    AptitudMedicaTrabajo,
    ExamenFisicoRegionalComponent,
  },
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const authenticationStore = useAuthenticationStore()

    /************
     * Variables
     ************/
    const examenesFisicosRegionalesAuxiliar = ref()

    /****************
     * Controladores
     ****************/
    const informacionDefectoFichaController = new InformacionDefectoFichaRetiroController()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaRetiro, new FichaRetiroController())
    const { entidad: fichaRetiro, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado, onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        // sistemasOrganos: new SistemaOrganoController(),
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 },
        },
      })

      // Consultar ficha
      if (medicoStore.idFichaRetiro) consultar({ id: medicoStore.idFichaRetiro })
      else consultarInformacionDefectoFicha()
    })

    /************
     * Funciones
    ************/
    const { cargos, filtrarCargos } = useFiltrosListadosSelects(listadosAuxiliares)

    const consultarInformacionDefectoFicha = async () => {
      const { response } = await informacionDefectoFichaController.listar({ registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })
      fichaRetiro.motivo_consulta = response.data.modelo.motivo_consulta
      fichaRetiro.cargo = response.data.modelo.cargo
      fichaRetiro.fecha_inicio_labores = response.data.modelo.fecha_inicio_labores
      fichaRetiro.fecha_salida = response.data.modelo.fecha_salida
    }

    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.fichas_retiros_imprimir) + '/' + fichaRetiro.id
      const filename = 'ficha_retiro_' + fichaRetiro.id + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) => fichaRetiro.constante_vital.hydrate(constanteVital)
    const hidratarAptitudMedica = (aptitudMedica: AptitudMedica) => fichaRetiro.aptitud_medica.hydrate(aptitudMedica)
    const hidratarExamenFisicoRegional = (examen: ExamenFisicoRegional[]) => examenesFisicosRegionalesAuxiliar.value = examen// fichaRetiro.examenes_fisicos_regionales = examen

    /********
    * Hooks
    ********/
    onBeforeGuardar(() => {
      fichaRetiro.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen ?? null
      fichaRetiro.examenes_fisicos_regionales = examenesFisicosRegionalesAuxiliar.value
    })

    onReestablecer(() => {
      emit('cerrar-modal')
    })

    onConsultado(() => {
      accion.value = acciones.consultar
    })

    onGuardado((id: number) => medicoStore.idFichaRetiro = id)

    /*********
     * Reglas
     *********/
    const reglas = {
      fecha_inicio_labores: { required },
      fecha_salida: { required },
      cargo: { required },
      constante_vital: {
        presion_arterial: { required },
        temperatura: { required },
        frecuencia_cardiaca: { required },
        saturacion_oxigeno: { required },
        frecuencia_respiratoria: { required },
        peso: { required },
        talla: { required },
        indice_masa_corporal: { required },
        perimetro_abdominal: { required },
      }
    }

    const v$ = useVuelidate(reglas, fichaRetiro)
    setValidador(v$.value)

    /*******
     * Init
     *******/

    return {
      // Mixin
      mixin,
      disabled,
      fichaRetiro,
      listadosAuxiliares,
      // Variables
      v$,
      maskFecha,
      accionesTabla,
      // Listados y filtros
      cargos,
      filtrarCargos,
      // Funciones
      mapearOptionsSelect,
      descargarPdf,
      hidratarConstanteVital,
      hidratarAptitudMedica,
      hidratarExamenFisicoRegional,
      mostrarDescargarPdf: authenticationStore.esMedico,
      selectOptionsSiNo,
    }
  }
})
