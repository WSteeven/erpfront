import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { Ref, defineComponent } from 'vue'
import { ref } from 'vue'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import ContantesVitales from 'medico/gestionarPacientes/modules/seccionesFichas/constantesVitales/ContantesVitales.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import AntecedenteTrabajo from 'medico/gestionarPacientes/modules/seccionesFichas/antecedenteTrabajo/AntecedenteTrabajo.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FichaRetiro } from '../domain/FichaRetiro'
import { FichaRetiroController } from '../infraestructure/FichaRetiroController'
import { ConstanteVital } from '../../fichaPeriodicaPreocupacional/domain/ConstanteVital'
import { selectOptionsSiNo } from 'config/utils'
import { RegionCuerpoController } from '../../fichaPeriodicaPreocupacional/infraestructure/RegionCuerpoController'
import { RegionCuerpo } from '../../fichaPeriodicaPreocupacional/domain/RegionCuerpo'
import { CategoriaExamenFisicoController } from '../../fichaPeriodicaPreocupacional/infraestructure/CategoriaExamenFisicoController'
import { CategoriaExamenFisico } from '../../fichaPeriodicaPreocupacional/domain/CategoriaExamenFisico'
import { DescripcionAntecedenteTrabajo } from '../../fichaPeriodicaPreocupacional/domain/DescripcionAntecedenteTrabajo'

export default defineComponent({
  name: 'fichas_retiros',
  components: {
    SimpleLayout,
    ContantesVitales,
    EssentialTable,
    AntecedenteTrabajo,
  },
  setup() {
    /************
     * Variables
     ************/
    const configuracionColumnasExamenFisicoRegional: Ref<any> = ref([])

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaRetiro, new FichaRetiroController())
    const { entidad: fichaRetiro, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar, editarParcial, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado, onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        // sistemasOrganos: new SistemaOrganoController(),
        categoriasExamenesFisicos: new CategoriaExamenFisicoController(),
        regionesCuerpo: new RegionCuerpoController(),
      })

      // Columnas
      // configuracionColumnasFrPuestoTrabajoActualReactive.value = [...configuracionColumnasFrPuestoTrabajoActual]
      await listadosAuxiliares.regionesCuerpo.forEach((region: RegionCuerpo) => {
        configuracionColumnasExamenFisicoRegional.value.push({
          name: region.nombre ?? '',
          field: region.nombre ?? '',
          label: region.nombre ?? '',
          align: 'left',
          sortable: true,
          type: 'select_multiple',
          editable: true,
          options: listadosAuxiliares.categoriasExamenesFisicos.filter((categoria: CategoriaExamenFisico) => categoria.region_cuerpo === region.id).map((categoria: CategoriaExamenFisico) => {
            return {
              label: categoria.nombre,
              value: categoria.id,
            }
          })
        })
      })

      let fila = {}
      listadosAuxiliares.regionesCuerpo.forEach((region: RegionCuerpo) => {
        fila[region.nombre ?? ''] = null
      })

      console.log(fila)
      fichaRetiro.examenes_fisicos_regionales.push(JSON.parse(JSON.stringify(fila)))
    })

    /************
     * Funciones
     ************/
    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.fichas_retiros_imprimir)
      const filename = 'ficha_retiro_' + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) => {
      console.log(constanteVital)
      fichaRetiro.constante_vital.hydrate(constanteVital)
    }

    const hidratarEnfermedadProfesional = (antecedente: DescripcionAntecedenteTrabajo) => fichaRetiro.enfermedad_profesional.hydrate(antecedente)
    const hidratarAccidenteTrabajo = (antecedente: DescripcionAntecedenteTrabajo) => fichaRetiro.accidente_trabajo.hydrate(antecedente)

    return {
      mixin,
      fichaRetiro,
      disabled,
      descargarPdf,
      hidratarConstanteVital,
      hidratarEnfermedadProfesional,
      hidratarAccidenteTrabajo,
      selectOptionsSiNo,
      configuracionColumnasExamenFisicoRegional,
    }
  }
})
