import { configuracionColumnasResultadoExamenPreocupacional } from '../domain/configuracionColumnasResultadoExamenPreocupacional'
import { defineComponent } from 'vue'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FichaPeriodicaPreocupacional } from '../domain/FichaPeriodicaPreocupacional'
import { FichaPeriodicaPreocupacionalController } from '../infraestructure/FichaPeriodicaPreocupacionalController'
import { ReligionController } from '../infraestructure/ReligionController'
import { OrientacionSexualController } from '../infraestructure/OrientacionSexualController'
import { IdentidadGeneroController } from '../infraestructure/IdentidadGeneroController'
import { tipos_sangre } from 'config/utils'
import { TipoAntecedenteController } from '../infraestructure/TipoAntecedenteController'
import { TipoAntecedente } from '../domain/TipoAntecedente'
import { ResultadoExamenPreocupacional } from '../domain/ResultadoExamenPreocupacional'
import { useMedicoStore } from 'stores/medico'

export default defineComponent({
  name: 'fichas_periodicas_preocupacionales',
  components: {
    SimpleLayout,
    EssentialTable,
  },
  setup() {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    console.log(medicoStore.empleado)

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaPeriodicaPreocupacional, new FichaPeriodicaPreocupacionalController())
    const { entidad: fichaPeriodica, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar, editarParcial, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado, onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        religiones: new ReligionController(),
        orientacionesSexuales: new OrientacionSexualController(),
        identidadesGeneros: new IdentidadGeneroController(),
        tiposAntecedentes: {
          controller: new TipoAntecedenteController(),
          params: { genero: medicoStore.empleado?.genero },
        },
      })

      fichaPeriodica.antecedente_gineco_obstetrico.resultados_examenes_preocupacionales = listadosAuxiliares.tiposAntecedentes.map((tipo: TipoAntecedente) => {
        const res = new ResultadoExamenPreocupacional()
        res.tipo_antecedente = tipo.nombre
        return res
      })
    })

    /*******
     * Init
     *******/
    listar()

    return {
      mixin,
      disabled,
      fichaPeriodica,
      listadosAuxiliares,
      tipos_sangre,
      configuracionColumnasResultadoExamenPreocupacional,
      mostrarMasculino: medicoStore.empleado?.genero === 'M',
      mostrarFemenino: medicoStore.empleado?.genero === 'F',
    }
  }
})
