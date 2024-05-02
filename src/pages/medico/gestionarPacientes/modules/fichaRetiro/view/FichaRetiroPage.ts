import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { defineComponent } from 'vue'
import { required } from 'shared/i18n-validators'


// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import ContantesVitales from 'medico/gestionarPacientes/modules/seccionesFichas/constantesVitales/ContantesVitales.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import AntecedenteTrabajo from 'medico/gestionarPacientes/modules/seccionesFichas/antecedenteTrabajo/AntecedenteTrabajo.vue'

// Logica y controladores
import { DescripcionAntecedenteTrabajo } from '../../fichaPeriodicaPreocupacional/domain/DescripcionAntecedenteTrabajo'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ConstanteVital } from '../../fichaPeriodicaPreocupacional/domain/ConstanteVital'
import { FichaRetiroController } from '../infraestructure/FichaRetiroController'
import { FichaRetiro } from '../domain/FichaRetiro'
import { selectOptionsSiNo } from 'config/utils'
import { useMedicoStore } from 'stores/medico'
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  name: 'fichas_retiro',
  components: {
    SimpleLayout,
    ContantesVitales,
    EssentialTable,
    AntecedenteTrabajo,
  },
  setup() {
    /**********
     * Stores
     **********/
    const medicoStore = useMedicoStore()



    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaRetiro, new FichaRetiroController())
    const { entidad: fichaRetiro, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar, editarParcial, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado, onGuardado } = mixin.useHooks()

    /*cargarVista(async () => {
      await obtenerListados({
        // categoriasExamenesFisicos: new CategoriaExamenFisicoController(),
        // regionesCuerpo: new RegionCuerpoController(),
      })

      // Columnas
      // configuracionColumnasFrPuestoTrabajoActualReactive.value = [...configuracionColumnasFrPuestoTrabajoActual]



    })*/

    /************
     * Funciones
     ************/
    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.fichas_retiros_imprimir, { registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })
      const filename = 'ficha_retiro_' + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) => {
      console.log(constanteVital)
      fichaRetiro.constante_vital.hydrate(constanteVital)
    }

    const hidratarEnfermedadProfesional = (antecedente: DescripcionAntecedenteTrabajo) => fichaRetiro.enfermedad_profesional.hydrate(antecedente)
    const hidratarAccidenteTrabajo = (antecedente: DescripcionAntecedenteTrabajo) => fichaRetiro.accidente_trabajo.hydrate(antecedente)

    /*********
     * Reglas
     *********/
    const reglas = {
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

    return {
      v$,
      mixin,
      fichaRetiro,
      accion,
      disabled,
      descargarPdf,
      hidratarConstanteVital,
      hidratarEnfermedadProfesional,
      hidratarAccidenteTrabajo,
      selectOptionsSiNo,
    }
  }
})
