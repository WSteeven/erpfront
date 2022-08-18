<template>
  Devolucion de materiales
  <essential-table
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
import { configuracionColumnasSubtareas } from '../controlTareas/modules/subtareasContent/domain/configuracionColumnasSubtareas'

// Componentes
import EssentialTable from 'src/components/tables/view/EssentialTable.vue'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    //
    const listado = [
      {
        numero_subtarea: 'JP000003_001',
        tipo_tarea: 'INSTALACION',
        fecha_asignado: '20/04/1996',
        estado: 'REALIZADO',
      },
    ]
    return { configuracionColumnasSubtareas, listado }
  },
})
</script>
