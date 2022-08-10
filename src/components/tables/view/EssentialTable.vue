<template>
  <q-table
    :columns="configuracionColumnas"
    :rows="datos"
    :filter="filter"
    row-key="id"
    :visible-columns="visibleColumns"
    flat
    bordered
    selection="single"
    v-model:selected="selected"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row justify-between items-center q-mb-md">
          <div>
            <div class="text-h6">{{ titulo }}</div>
            <small>JPCONSTRUCRED</small>
          </div>
          <!-- <q-space></q-space> -->

          <div class="row q-gutter-sm">
            <q-input
              outlined
              dense
              debounce="300"
              color="primary"
              v-model="filter"
            >
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
        </div>

        <div class="row q-gutter-md justify-start">
          <q-btn color="primary" no-caps rounded unelevated push>
            <q-icon name="bi-eye" size="xs" class="q-pr-sm"></q-icon>
            <div>Consultar</div>
          </q-btn>

          <q-btn color="primary" no-caps rounded unelevated push>
            <q-icon name="bi-pencil-square" size="xs" class="q-pr-sm"></q-icon>
            <div>Editar</div>
          </q-btn>

          <q-btn color="primary" no-caps rounded unelevated push>
            <q-icon name="bi-trash" size="xs" class="q-pr-sm"></q-icon>
            <div>Eliminar</div>
          </q-btn>

          <q-btn color="secondary" no-caps rounded unelevated push>
            <q-icon name="bi-tools" size="xs" class="q-pr-sm"></q-icon>
            <div>Gestionar</div>
          </q-btn>
        </div>
      </div>
    </template>

    <!-- Header -->
    <!-- <template v-slot:header="props">
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
    </template> -->
  </q-table>

  <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div> -->
</template>

<script lang="ts">
import { getVisibleColumns } from 'src/pages/shared/utils'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    titulo: {
      type: String,
      default: 'Listado',
    },
    configuracionColumnas: {
      type: Object as () => any[],
      required: true,
    },
    datos: {
      type: Object as () => any[],
      required: true,
    },
  },
  setup(props) {
    return {
      filter: ref(null),
      selected: ref([]),
      visibleColumns: ref(getVisibleColumns(props.configuracionColumnas)),
    }
  },
})
</script>
