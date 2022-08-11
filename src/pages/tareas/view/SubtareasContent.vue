<template>
  <essential-table
    titulo="subtareas"
    :configuracionColumnas="configuracionColumnasSubtareas"
    :datos="listado"
  ></essential-table>

  <div class="row justify-end q-gutter-sm q-pt-md">
    <q-btn color="positive" no-caps rounded push>
      <q-icon name="bi-plus" class="q-pr-sm"></q-icon>
      <div>Agregar nueva subtarea</div>
    </q-btn>
  </div>
</template>

<script lang="ts">
// Dependencias
import { defineComponent } from 'vue'
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'

// Componentes
import EssentialTable from 'src/components/tables/view/EssentialTable.vue'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    //
    const listado = [
      {
        id: 1,
        coordinador: 'MARILÚ JARAMILLO',
        codigo_subtarea_jp: 'JP000001_1',
        tipo_tarea: 'INSTALACION',
        fecha_asignado: '11/08/2022',
        estado: 'REALIZADO',
      },
      {
        id: 2,
        coordinador: 'MARILÚ JARAMILLO',
        codigo_subtarea_jp: 'JP000001_2',
        tipo_tarea: 'INSTALACION',
        fecha_asignado: '20/08/2022',
        estado: 'CREADO',
      },
    ]
    return { configuracionColumnasSubtareas, listado }
  },
})
</script>
