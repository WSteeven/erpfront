// Dependencias
import { configuracionColumnasControlAsistencia } from '../domain/configuracionColumnasReporte'
import { tiposJornadas, logoBN, logoColor } from 'config/utils'
import { required } from '@vuelidate/validators'
import { defineComponent, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteControlMaterialController } from '../infraestructure/ReporteControlMaterialController'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { ReporteControlMaterial } from '../domain/ReporteControlMaterial'
import { FiltroReporteMaterial } from '../domain/FiltroReporteMaterial'

//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { buildTableBody } from 'shared/utils'
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      ReporteControlMaterial,
      new ReporteControlMaterialController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar, setValidador } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
        },
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        }
      })
    })

    const filtroReporteMaterial = reactive(new FiltroReporteMaterial())

    // Reglas de validacion
    const reglas = {
      tarea: { required },
      grupo: { required },
      fecha: { required },
    }

    const v$ = useVuelidate(reglas, filtroReporteMaterial)

    async function consultarReporte() {
      if (await v$.value.$validate())
        listar(filtroReporteMaterial)
    }

    return {
      v$,
      mixin,
      listar,
      listado,
      filtroReporteMaterial,
      listadosAuxiliares,
      configuracionColumnasControlAsistencia,
      tiposJornadas,
      consultarReporte,
    }
  },
})
