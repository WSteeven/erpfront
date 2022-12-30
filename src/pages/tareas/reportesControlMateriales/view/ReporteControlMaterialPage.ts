// Dependencias
import { configuracionColumnasControlAsistencia } from '../domain/configuracionColumnasReporte'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { tiposJornadas } from 'config/utils'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ReporteControlMaterialController } from '../infraestructure/ReporteControlMaterialController'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { FiltroReporteMaterial } from '../domain/FiltroReporteMaterial'
import { useNotificaciones } from 'shared/notificaciones'
import { ReporteControlMaterial } from '../domain/ReporteControlMaterial'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      ReporteControlMaterial,
      new ReporteControlMaterialController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

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

    const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

    function editar({ entidad }) {
      const config: CustomActionPrompt = {
        mensaje: 'Ingrese la nueva cantidad',
        defecto: entidad.asiste,
        accion: (data) => entidad.asiste = data
      }

      prompt(config)
    }

    function eliminar({ posicion }) {

      confirmar('¿Está seguro de continuar?', () =>
        listadosAuxiliares.empleados.splice(posicion, 1)
      )
    }

    const botonAgregarObservacion: CustomActionTable = {
      titulo: 'Agregar observación',
      icono: 'bi-pencil',
      accion: ({ entidad }) => {
        const config: CustomActionPrompt = {
          mensaje: 'Ingrese la observación',
          defecto: entidad.observacion,
          accion: (data) => entidad.observacion = data
        }

        prompt(config)
      },
    }

    // Reglas de validacion
    const reglas = {
      tarea: { required },
      grupo: { required },
      fecha: { required },
    }

    const v$ = useVuelidate(reglas, filtroReporteMaterial)

    return {
      v$,
      mixin,
      listar,
      listado,
      filtroReporteMaterial,
      listadosAuxiliares,
      configuracionColumnasControlAsistencia,
      editar,
      eliminar,
      botonAgregarObservacion,
      tiposJornadas,
    }
  },
})
