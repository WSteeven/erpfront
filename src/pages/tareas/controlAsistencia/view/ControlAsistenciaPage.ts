// Dependencias
import { configuracionColumnasAsistenciaTecnicos } from '../domain/configuracionColumnasAsistenciaTecnicos'
import { configuracionColumnasControlAsistencia } from '../domain/configuracionColumnasControlAsistencia'
import { obtenerFechaHoraActual } from 'shared/utils'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { tiposJornadas } from 'config/utils'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ControlAsistenciaController } from '../infraestructure/ControlAsistenciaController'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ControlAsistencia } from '../domain/ControlAsistencia'
import { useNotificaciones } from 'shared/notificaciones'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      ControlAsistencia,
      new ControlAsistenciaController()
    )

    const { entidad: control, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos,grupo',
            estado: 1,
          }
        },
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

    const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

    control.fecha_hora = obtenerFechaHoraActual()

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

    const configuracionColumnasMaterialesSolicitadosAccion = [
      ...configuracionColumnasAsistenciaTecnicos,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

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

    //reglas de validacion
    const reglas = {
      tarea: { required },
      jornada: { required },
      grupo: { required },
    }

    const v$ = useVuelidate(reglas, control)
    setValidador(v$.value)

    return {
      v$,
      mixin,
      listadosAuxiliares,
      configuracionColumnas: configuracionColumnasControlAsistencia,
      configuracionColumnasMaterialesSolicitadosAccion,
      editar,
      eliminar,
      botonAgregarObservacion,
      control,
      disabled,
      accion,
      tiposJornadas,
    }
  },
})
