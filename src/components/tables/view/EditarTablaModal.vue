<template>
  <q-dialog
    v-model="abierto"
    :maximized="modalMaximized"
    :full-width="true"
    top
  >
    <q-card>
      <q-toolbar>
        <q-avatar square>
          <img src="~assets/logo.svg" />
        </q-avatar>

        <q-toolbar-title>Editar fila</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
          @click="cerrarModalEntidad()"
        />
      </q-toolbar>

      <q-card-section>
        <div class="row q-col-gutter-xs q-mb-md">
          <div
            v-for="field in fields"
            :key="field.field"
            class="col-12 col-md-3 q-mb-sm"
          >
            <label class="block q-mb-sm">{{ field.label }}</label>
            <q-input
              v-model="field.valor"
              :type="field.input_type"
              :autogrow="field.input_type !== 'number'"
              outlined
              dense
            ></q-input>
          </div>
        </div>

        <!-- Botones formulario -->
        <div class="row q-gutter-md justify-end">
          <q-btn color="primary" no-caps @click="guardar()" push>
            <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>
            <div>Guardar</div>
          </q-btn>

          <q-btn color="negative" no-caps @click="cerrarModalEntidad()" push>
            <q-icon name="bi-x" size="xs" class="q-mr-sm"></q-icon>
            <div>Cancelar</div>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ColumnConfig } from '../domain/ColumnConfig'
import { computed, reactive } from 'vue'

const props = defineProps({
  configuracionColumnas: {
    type: Object as () => ColumnConfig<EntidadAuditable>[],
    required: true,
  },
  fila: {
    type: Object as () => EntidadAuditable,
    required: false,
  },
  modalMaximized: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['limpiar', 'guardar'])

const fields = computed(
  () =>
    props.configuracionColumnas
      .map((fila: ColumnConfig<any>) => {
        return reactive({
          label: fila.label,
          field: fila.field,
          input_type: fila.input_type ?? 'text',
          // editable: fila.editable ?? true,
          valor: props.fila ? props.fila[fila.field] : '',
        })
      })
      .filter((fila) => fila.field !== 'acciones') // && fila.editable)
)

/* const fields = ref()
const fila = computed()
watch(props.fila, () => {
  props.configuracionColumnas
    .map((fila: ColumnConfig<any>) => {
      return reactive({
        label: fila.label,
        field: fila.field,
        input_type: fila.input_type ?? 'text',
        valor: props.fila ? props.fila[fila.field] : '',
      })
    })
    .filter((fila) => fila.field !== 'acciones')
}) */

// const abierto = computed(() => !!props.fila)
// const abierto = ref(false)
// const abiertoC = computed(() => props.abierto)
const abierto = computed(() => !!props.fila)

function guardar() {
  var mapped = fields.value.map((item) => ({ [item.field]: item.valor }))
  var newObj = Object.assign({}, ...mapped)
  emit('guardar', newObj)
}

/* function abrirModalEntidad() {
  abierto.value = true
} */

function cerrarModalEntidad() {
  emit('limpiar')
  // abierto.value = false
}
</script>
