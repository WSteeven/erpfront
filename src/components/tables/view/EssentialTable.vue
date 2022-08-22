<template>
  <!-- :grid="$q.screen.xs" -->
  <q-table
    :hide-header="grid"
    :grid="grid"
    :columns="(configuracionColumnas as any)"
    :rows="datos"
    :filter="filter"
    row-key="id"
    :visible-columns="visibleColumns"
    flat
    bordered
    :selection="tipoSeleccion"
    v-model:selected="selected"
    :pagination="{ rowsPerPage: 10 }"
    class="bg-white"
  >
    <!-- Header table -->
    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row justify-between items-center q-mb-md">
          <div :class="{ 'q-mb-md': $q.screen.xs }">
            <div class="text-h6">{{ 'Listado de ' + titulo }}</div>
            <small>JPCONSTRUCRED</small>
          </div>
          <!-- <q-space></q-space> -->

          <div class="row q-gutter-sm justify-center">
            <q-input
              outlined
              dense
              debounce="300"
              color="primary"
              v-model="filter"
              :class="{ 'full-width': $q.screen.xs }"
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
              :class="{ 'full-width': $q.screen.xs }"
              style="min-width: 150px"
            />

            <q-btn
              flat
              round
              dense
              :icon="
                props.inFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'
              "
              @click="props.toggleFullscreen"
              class="q-ml-md"
            >
              <q-tooltip class="bg-dark">{{
                props.inFullscreen
                  ? 'Salir de pantalla completa'
                  : 'Abrir en pantalla completa'
              }}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              :icon="grid ? 'bi-list' : 'bi-grid-3x3'"
              @click="grid = !grid"
            >
              <q-tooltip class="bg-dark" :disable="$q.platform.is.mobile">{{
                grid ? 'Formato de lista' : 'Formato de cuadrícula'
              }}</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Botones exportar -->
        <div v-if="mostrarBotones" class="row q-gutter-sm justify-end">
          <q-btn color="positive" push rounded @click="exportTable()" no-caps>
            <q-icon name="bi-printer" class="q-pr-sm" size="xs"></q-icon>
            <div>Imprimir</div>
          </q-btn>

          <q-btn color="positive" no-caps push rounded @click="exportTable()">
            <q-icon
              name="bi-file-spreadsheet"
              class="q-pr-sm"
              size="xs"
            ></q-icon>
            <div>Exportar Excel</div>
          </q-btn>

          <q-btn color="positive" push rounded @click="exportTable()" no-caps>
            <q-icon name="bi-eye" class="q-pr-sm" size="xs"></q-icon>
            <div>Mostrar filtros</div>
          </q-btn>
        </div>
      </div>
    </template>

    <!-- Botones de acciones Desktop -->
    <template #body-cell-acciones="props">
      <q-td :props="props" class="q-gutter-sm">
        <!-- Consultar -->
        <q-btn
          v-if="permitirConsultar"
          color="indigo-1"
          round
          unelevated
          dense
          @click="consultar(props.row)"
        >
          <q-icon name="bi-eye" color="primary" size="xs"></q-icon>
          <q-tooltip class="bg-dark"> Consultar </q-tooltip>
        </q-btn>

        <!-- Editar -->
        <q-btn
          v-if="permitirEditar"
          color="indigo-1"
          round
          unelevated
          dense
          @click="editar(props.row)"
        >
          <q-icon name="bi-pencil" color="primary" size="xs"></q-icon>
          <q-tooltip class="bg-dark"> Editar </q-tooltip>
        </q-btn>

        <!-- Eliminar -->
        <q-btn
          v-if="permitirEliminar"
          color="indigo-1"
          round
          unelevated
          dense
          @click="eliminar(props.row)"
        >
          <q-icon name="bi-trash" color="primary" size="xs"></q-icon>
          <q-tooltip class="bg-dark"> Eliminar </q-tooltip>
        </q-btn>

        <!-- Accion personalizada 1 -->
        <q-btn
          v-if="accion1"
          color="primary"
          rounded
          unelevated
          dense
          outline
          no-caps
          :label="accion1.titulo"
          class="q-px-sm"
          @click="accion1?.accion(props.row)"
        >
          <q-tooltip class="bg-dark"> {{ accion1.titulo }} </q-tooltip>
        </q-btn>
      </q-td>
    </template>

    <!-- Botones de acciones Mobile (Grid)  -->
    <template v-slot:item="props">
      <q-card
        :class="props.selected ? 'bg-grey-2' : ''"
        bordered
        flat
        class="q-pa-sm q-mb-md full-width"
      >
        <q-list dense>
          <q-item v-for="col in props.cols" :key="col.name">
            <!-- Clave -->
            <q-item-section>
              <q-item-label>{{ col.label }}</q-item-label>
            </q-item-section>

            <!-- Valor -->
            <q-item-section side>
              <div
                v-if="col.name === 'acciones'"
                :props="props"
                class="q-gutter-sm"
              >
                <!-- Consultar -->
                <q-btn
                  v-if="permitirConsultar"
                  color="indigo-1"
                  round
                  unelevated
                  dense
                  @click="consultar(props.row)"
                >
                  <q-icon name="bi-eye" color="primary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Consultar </q-tooltip>
                </q-btn>

                <!-- Editar -->
                <q-btn
                  v-if="permitirEditar"
                  color="indigo-1"
                  round
                  unelevated
                  dense
                  @click="editar(props.row)"
                >
                  <q-icon name="bi-pencil" color="primary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Editar </q-tooltip>
                </q-btn>

                <!-- Eliminar -->
                <q-btn
                  v-if="permitirEliminar"
                  color="indigo-1"
                  round
                  unelevated
                  dense
                  @click="eliminar(props.row)"
                >
                  <q-icon name="bi-trash" color="primary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Eliminar </q-tooltip>
                </q-btn>

                <!-- Accion personalizada 1 -->
                <q-btn
                  v-if="accion1"
                  color="primary"
                  rounded
                  unelevated
                  dense
                  outline
                  no-caps
                  :label="accion1.titulo"
                  class="q-px-sm"
                  @click="accion1?.accion(props.row)"
                >
                  <q-tooltip class="bg-dark">{{ accion1.titulo }} </q-tooltip>
                </q-btn>
              </div>

              <q-item-label v-else caption>{{ col.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </template>

    <!-- <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="cantidad_solicitada" :props="props">
          {{ props.row.cantidad_solicitada }}
          <q-popup-edit v-model="props.row.cantidad_solicitada" v-slot="scope">
            <q-input v-model="scope.value" dense autofocus counter />
          </q-popup-edit>
        </q-td>

        <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
      </q-tr>
    </template> -->
  </q-table>
</template>

<script lang="ts" setup>
import { Hidratable } from 'src/pages/shared/entidad/domain/Hidratable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { getVisibleColumns } from 'src/pages/shared/utils'
import { ColumnConfig } from '../domain/ColumnConfig'
import { TipoSeleccion } from 'src/config/utils'
import { exportFile, useQuasar } from 'quasar'
import { ref } from 'vue'

// Props
const props = defineProps({
  titulo: {
    type: String,
    default: 'Listado',
  },
  configuracionColumnas: {
    type: Object as () => ColumnConfig<Hidratable>[],
    required: true,
  },
  datos: {
    type: Array,
    required: true,
  },
  permitirConsultar: {
    type: Boolean,
    default: true,
  },
  permitirEditar: {
    type: Boolean,
    default: true,
  },
  permitirEliminar: {
    type: Boolean,
    default: true,
  },
  tipoSeleccion: {
    type: String as () => TipoSeleccion,
    default: 'none',
  },
  accion1: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  mostrarBotones: {
    type: Boolean,
    default: true,
  },
})

// Emits
const emit = defineEmits([
  'consultar',
  'editar',
  'eliminar',
  'accion1',
  'accion2',
])

const grid = ref(false)

// Acciones tabla
const consultar = (data: object) => emit('consultar', data)
const editar = (data: object) => emit('editar', data)
const eliminar = (data: object) => emit('eliminar', data)
//const accion1 = (data: object) => emit('accion1', data)

// Variables
const filter = ref(null)
const selected = ref([])
const visibleColumns = ref(getVisibleColumns(props.configuracionColumnas))

// Observers
// watch(selected, () => emit('selected', JSON.stringify(selected.value)))

const $q = useQuasar()

function wrapCsvValue(val, formatFn?, row?) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

function exportTable() {
  // naive encoding to csv format
  const content = [
    props.configuracionColumnas.map((col) => wrapCsvValue(col.label)),
  ]
    .concat(
      props.datos.map((row: any) =>
        props.configuracionColumnas
          .map((col: any) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n')

  const status = exportFile('table-export.csv', '\ufeff' + content, 'text/csv')

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    })
  }
}
</script>
