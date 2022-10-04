// Dependencias
import { configuracionColumnasAsistenciaTecnicos } from '../domain/configuracionColumnasAsistenciaTecnicos'
import { configuracionColumnasControlAsistencia } from '../domain/configuracionColumnasControlAsistencia'
import { defineComponent, reactive, ref, Ref } from 'vue'
import { obtenerFechaActual } from 'shared/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { AsistenciaTecnico } from '../domain/AsistenciaTecnico'
import { ControlAsistencia } from '../domain/ControlAsistencia'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ControlAsistenciaController } from '../infraestructure/ControlAsistenciaController'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen },
  setup() {
    // const control = reactive(new ControlAsistencia())
    const mixin = new ContenedorSimpleMixin(
      ControlAsistencia,
      new ControlAsistenciaController()
    )

    const { entidad: control, disabled, accion } = mixin.useReferencias()

    // control.grupo = 'MACHALA'
    // control.fecha = obtenerFechaActual()

    const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

    const datos: any[] = [
      {
        id: 1,
        grupo: 'MACHALA',
        codigo_tarea_jp: 'JP000001',
        codigo_subtarea: 'JP000001_001',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        detalle_subtarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        fecha: '20-08-2022',
        imagen: null,
        hora: null,
      },
      {
        id: 2,
        grupo: 'MACHALA',
        codigo_tarea_jp: 'JP000001',
        codigo_subtarea: 'JP000001_001',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        detalle_subtarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        fecha: '21-08-2022',
        imagen: null,
        hora: null,
      },
      {
        id: 3,
        grupo: 'MACHALA',
        codigo_tarea_jp: 'JP000001',
        codigo_subtarea: 'JP000001_001',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        detalle_subtarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        fecha: '22-08-2022',
        imagen: null,
        hora: null,
      },
    ]

    const asistenciaTecnicos: Ref<AsistenciaTecnico[]> = ref([
      {
        id: 1,
        nombres: 'JOSE',
        apellidos: 'ARMIJOS',
        grupo: 'MACHALA',
        asiste: false,
        observacion: null,
      },
      {
        id: 2,
        nombres: 'CARLOS',
        apellidos: 'BAREN',
        grupo: 'MACHALA',
        asiste: false,
        observacion: null,
      },
      {
        id: 3,
        nombres: 'ALEXANDER',
        apellidos: 'JIMENEZ',
        grupo: 'MACHALA',
        asiste: false,
        observacion: null,
      },
    ])

    function editar({ posicion }) {

      prompt(
        'Ingrese la nueva cantidad',
        (data) => {
          asistenciaTecnicos.value[posicion].asiste = data
        },
        asistenciaTecnicos.value[posicion].asiste
      )
    }

    function eliminar({ posicion }) {

      confirmar('¿Está seguro de continuar?', () =>
        asistenciaTecnicos.value.splice(posicion, 1)
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
      accion: ({ posicion }) => {

        prompt(
          'Ingrese la observación',
          (data) => {
            asistenciaTecnicos.value[posicion].observacion = data
          },
          asistenciaTecnicos.value[posicion].observacion
        )
      },
    }

    return {
      configuracionColumnas: configuracionColumnasControlAsistencia,
      configuracionColumnasMaterialesSolicitadosAccion,
      datos,
      asistenciaTecnicos,
      editar,
      eliminar,
      botonAgregarObservacion,
      control,
      disabled,
      accion,
      mixin,
    }
  },
})
