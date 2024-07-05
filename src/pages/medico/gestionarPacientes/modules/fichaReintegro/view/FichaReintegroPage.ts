import { AptitudMedica } from '../../seccionesFichas/aptitudMedicaTrabajo/domain/AptitudMedica'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { imprimirArchivo, mapearOptionsSelect } from 'shared/utils'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
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
import { ExamenFisicoRegional } from '../domain/ExamenFisicoRegional'
import { FichaReintegro } from '../domain/FichaReintegro'
import { InformacionDefectoFichaReintegroController } from '../infraestructure/InformacionDefectoFichaReintegroController'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { FichaReintegroController } from '../infraestructure/FichaReintegroController'
import { ConstanteVital } from '../../seccionesFichas/domain/ConstanteVital'

export default defineComponent({
  name: 'fichas_periodicas',
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
    const informacionDefectoFichaController = new InformacionDefectoFichaReintegroController()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaReintegro, new FichaReintegroController())
    const { entidad: fichaReintegro, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
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
      if (medicoStore.idFichaReintegro) consultar({ id: medicoStore.idFichaReintegro })
      else consultarInformacionDefectoFicha()
    })

    /************
     * Funciones
    ************/
    const { cargos, filtrarCargos } = useFiltrosListadosSelects(listadosAuxiliares)

    const consultarInformacionDefectoFicha = async () => {
      const { response } = await informacionDefectoFichaController.listar({ registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })
      fichaReintegro.motivo_consulta = response.data.modelo.motivo_consulta
      fichaReintegro.cargo = response.data.modelo.cargo
      fichaReintegro.fecha_reingreso = response.data.modelo.fecha_reingreso
      fichaReintegro.fecha_ultimo_dia_laboral = response.data.modelo.fecha_ultimo_dia_laboral
    }

    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.fichas_reintegro_imprimir) + '/' + fichaReintegro.id
      const filename = 'ficha_reintegro_' + fichaReintegro.id + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) => fichaReintegro.constante_vital.hydrate(constanteVital)
    const hidratarAptitudMedica = (aptitudMedica: AptitudMedica) => fichaReintegro.aptitud_medica.hydrate(aptitudMedica)
    const hidratarExamenFisicoRegional = (examen: ExamenFisicoRegional[]) => examenesFisicosRegionalesAuxiliar.value = examen// fichaReintegro.examenes_fisicos_regionales = examen

    /********
    * Hooks
    ********/
    onBeforeGuardar(() => {
      fichaReintegro.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen ?? null
      fichaReintegro.examenes_fisicos_regionales = examenesFisicosRegionalesAuxiliar.value
    })

    onReestablecer(() => {
      emit('cerrar-modal')
    })

    onConsultado(() => {
      accion.value = acciones.consultar
    })

    onGuardado((id: number) => medicoStore.idFichaReintegro = id)

    /*********
     * Reglas
     *********/
    const reglas = {
      causa_salida: { required },
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

    const v$ = useVuelidate(reglas, fichaReintegro)
    setValidador(v$.value)

    /*******
     * Init
     *******/

    return {
      // Mixin
      mixin,
      disabled,
      fichaReintegro,
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
    }
  }
})
