// Dependencias
import { configuracionColumnasMaterialesSolicitados } from '../domain/configuracionColumnasMaterialesSolicitados'
import { defineComponent, Ref, ref } from 'vue'

// Componentes
import EssentialTable from 'src/components/tables/view/EssentialTable.vue'
import { MaterialesSolicitados } from 'src/pages/tareas/solicitudMateriales/domain/MaterialesSolicitados'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    //
    const listado: Ref<MaterialesSolicitados[]> = ref([
      {
        id: 1,
        codigo_producto: 'ASDG125',
        nombre_producto: 'HERRAJE FIBRA OPTICO TIPO A BASE CON DOBLE',
        cantidad_solicitada: 10,
        cantidad_despachada: 9,
        cantidad_usada: 9,
      },
      {
        id: 2,
        codigo_producto: 'ASDG126',
        nombre_producto: 'HERRAJE B',
        cantidad_solicitada: 9,
        cantidad_despachada: 9,
        cantidad_usada: 9,
      },
      {
        id: 3,
        codigo_producto: 'ASDG127',
        nombre_producto: 'PREFORMADO AMARILLO',
        cantidad_solicitada: 140,
        cantidad_despachada: 140,
        cantidad_usada: 140,
      },
      {
        id: 4,
        codigo_producto: 'ASDG128',
        nombre_producto: 'HEBILLA DE ACERO 2/4',
        cantidad_solicitada: 9,
        cantidad_despachada: 9,
        cantidad_usada: 9,
      },
      {
        id: 5,
        codigo_producto: 'ASDG129',
        nombre_producto: 'GRILLETE PARA CABLE DE 3/6 (10MM)',
        cantidad_solicitada: 72,
        cantidad_despachada: 72,
        cantidad_usada: 72,
      },
      {
        id: 6,
        codigo_producto: 'ASDG130',
        nombre_producto: 'AMARRAS PLÁSTICAS 30 CM',
        cantidad_solicitada: 200,
        cantidad_despachada: 200,
        cantidad_usada: 200,
      },
      {
        id: 7,
        codigo_producto: 'ASDG131',
        nombre_producto: 'AMARRAS PLÁSTICAS 15 CM',
        cantidad_solicitada: 200,
        cantidad_despachada: 200,
        cantidad_usada: 200,
      },
      {
        id: 8,
        codigo_producto: 'ASDG126',
        nombre_producto: 'ETIQUETAS ACRÍLICAS',
        cantidad_solicitada: 166,
        cantidad_despachada: 166,
        cantidad_usada: 166,
      },
    ])

    return {
      configuracionColumnas: configuracionColumnasMaterialesSolicitados,
      listado,
    }
  },
})
