// Dependencias
import { configuracionColumnasMaterialesSolicitados } from '../domain/configuracionColumnasMaterialesSolicitados'
import { configuracionColumnasSolicitudMateriales } from '../domain/configuracionColumnasSolicitudMateriales'
import { defineComponent, reactive, ref, Ref } from 'vue'
import { getIndexOf } from 'src/pages/shared/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import TabLayout from 'layouts/TabLayout.vue'

// Logica y controladores
import { MaterialesSolicitados } from '../domain/MaterialesSolicitados'
import { SolicitudMateriales } from '../domain/SolicitudMateriales'
import { useNotificaciones } from 'src/pages/shared/notificaciones'

export default defineComponent({
  components: { TabLayout, EssentialTable },
  setup() {
    const solicitud = reactive(new SolicitudMateriales())
    solicitud.fecha_solicitud = '15/08/2022'
    solicitud.grupo = 'MACHALA'
    solicitud.estado = 'PENDIENTE'

    const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

    const datos: SolicitudMateriales[] = [
      {
        fecha_solicitud: '15/08/2022',
        grupo: 'MACHALA',
        estado: 'PENDIENTE',
        codigo_tarea_jp: 'JP000001',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
      },
      {
        fecha_solicitud: '15/08/2022',
        grupo: 'MACHALA',
        estado: 'APROBADO',
        codigo_tarea_jp: 'JP000001',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
      },
      {
        fecha_solicitud: '15/08/2022',
        grupo: 'MACHALA',
        estado: 'RECHAZADO',
        codigo_tarea_jp: 'JP000001',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
      },
    ]

    const materialesSolicitados: Ref<MaterialesSolicitados[]> = ref([
      {
        id: 1,
        codigo_producto: 'ASDG125',
        nombre_producto: 'HERRAJE FIBRA OPTICO TIPO A BASE CON DOBLE',
        cantidad_solicitada: 10,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
      {
        id: 2,
        codigo_producto: 'ASDG126',
        nombre_producto: 'HERRAJE B',
        cantidad_solicitada: 9,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
      {
        id: 3,
        codigo_producto: 'ASDG127',
        nombre_producto: 'PREFORMADO AMARILLO',
        cantidad_solicitada: 140,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
      {
        id: 4,
        codigo_producto: 'ASDG128',
        nombre_producto: 'HEBILLA DE ACERO 2/4',
        cantidad_solicitada: 9,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
      {
        id: 5,
        codigo_producto: 'ASDG129',
        nombre_producto: 'GRILLETE PARA CABLE DE 3/6 (10MM)',
        cantidad_solicitada: 72,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
      {
        id: 6,
        codigo_producto: 'ASDG130',
        nombre_producto: 'AMARRAS PLÁSTICAS 30 CM',
        cantidad_solicitada: 200,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
      {
        id: 7,
        codigo_producto: 'ASDG131',
        nombre_producto: 'AMARRAS PLÁSTICAS 15 CM',
        cantidad_solicitada: 200,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
      {
        id: 8,
        codigo_producto: 'ASDG126',
        nombre_producto: 'ETIQUETAS ACRÍLICAS',
        cantidad_solicitada: 166,
        cantidad_despachada: 0,
        cantidad_usada: 0,
      },
    ])

    function editar(entidad) {
      const indice = getIndexOf(materialesSolicitados.value, entidad.id)
      prompt(
        'Ingrese la nueva cantidad',
        (data) => {
          materialesSolicitados.value[indice].cantidad_solicitada = data
        },
        materialesSolicitados.value[indice].cantidad_solicitada
      )
    }

    function eliminar(entidad) {
      const indice = getIndexOf(materialesSolicitados.value, entidad.id)
      confirmar('¿Está seguro de continuar?', () =>
        materialesSolicitados.value.splice(indice, 1)
      )
    }

    const configuracionColumnasMaterialesSolicitadosAccion = [
      ...configuracionColumnasMaterialesSolicitados,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    function aprobar() {
      notificarCorrecto('Solicitud aprobada exitosamente!')
    }

    function rechazar() {
      notificarCorrecto('Solicitud rechazada exitosamente!')
    }

    return {
      configuracionColumnas: configuracionColumnasSolicitudMateriales,
      configuracionColumnasMaterialesSolicitadosAccion,
      datos,
      materialesSolicitados,
      editar,
      eliminar,
      aprobar,
      rechazar,
      solicitud,
    }
  },
})
