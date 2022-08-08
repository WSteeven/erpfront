<template>
  <q-table
    :columns="configuracionColumnas"
    :rows="datos"
    :filter="filter"
    :visible-columns="visibleColumns"
    flat
    bordered
  >
    <template v-slot:top="props">
      <div>
        <div class="text-h6">Listado de tareas</div>
        <small>JPCONSTRUCRED</small>
      </div>
      <q-space></q-space>

      <div class="row q-gutter-sm">
        <q-input outlined dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>

        <q-select
          v-model="visibleColumns"
          multiple
          outlined
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="configuracionColumnas"
          option-value="name"
          options-cover
          style="min-width: 150px"
        />

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </div>
    </template>

    <!-- Header -->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-bold bg-grey-2"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    configuracionColumnas: {
      type: Object as () => any[],
      required: true,
    },
    datos: {
      type: Object as () => any[],
      required: true,
    },
  },
  setup() {
    return {
      filter: ref(null),
      visibleColumns: ref(['coordinador', 'cliente', 'estado']),
    }
  },
})
</script>
