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
          <!-- Inputs normales -->
          <div
            v-for="field in fields"
            :key="field.field"
            class="col-12 col-md-3 q-mb-sm"
          >
            <label class="block q-mb-sm">{{ field.label }}</label>
            <q-input
              v-model="field.valor"
              :type="field.input_type !== 'select' ? field.input_type : 'text'"
              :autogrow="field.input_type !== 'number'"
              outlined
              dense
            ></q-input>
          </div>
          <!-- Selects -->
          <div
            v-for="field in fieldsSelect"
            :key="field.field"
            class="col-12 col-md-3 q-mb-sm"
          >
            <label class="block q-mb-sm">{{ field.label }}</label>
            <q-select
              v-model="field.valor"
              :options="field.options"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
import e from 'express'
import { isTemplateNode } from '@vue/compiler-core'

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

// normal
const fields = computed(() =>
  props.configuracionColumnas
    .map((fila: ColumnConfig<any>) => {
      return reactive({
        label: fila.label,
        field: fila.field,
        input_type: fila.input_type ?? 'text',
        editable: fila.editable ?? true,
        valor: props.fila ? props.fila[fila.field] : '',
      })
    })
    .filter(
      (fila) =>
        fila.field !== 'acciones' &&
        fila.input_type !== 'select' &&
        fila.editable
    )
)

// normal
const fieldsSelect = computed(() =>
  props.configuracionColumnas
    .map((fila: ColumnConfig<any>) => {
      return reactive({
        label: fila.label,
        field: fila.field,
        input_type: fila.input_type ?? 'text',
        editable: fila.editable ?? true,
        valor: props.fila ? props.fila[fila.field] : '',
        options: fila.options,
      })
    })
    .filter(
      (fila) =>
        fila.field !== 'acciones' &&
        fila.input_type === 'select' &&
        fila.editable
    )
)
// Todos los campos
const fieldsAll = computed(() =>
  props.configuracionColumnas
    .map((fila: ColumnConfig<any>) => {
      return reactive({
        label: fila.label,
        field: fila.field,
        input_type: fila.input_type ?? 'text',
        editable: fila.editable ?? true,
        valor: props.fila ? props.fila[fila.field] : '',
      })
    })
    .filter((fila) => fila.field !== 'acciones')
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
  var mapped =              fields.value.map((item) => ({ [item.field]: item.valor }))
  var mappedSelect =  fieldsSelect.value.map((item) => ({[item.field]: item.valor}))
  var mappedAll =         fieldsAll.value.map((item)=>({[item.field]:item.valor}))
  var mappedLleno = [...mappedAll, ...mapped, ...mappedSelect]
  var newObj = Object.assign({}, ...mapped)
  var newObj2 = Object.assign(newObj, ...mappedSelect)
  var newObjAll = Object.assign(newObj2, ...mappedAll)
  var newObjLleno = Object.assign(newObjAll, ...mappedLleno)
  var filaRecibida = props.fila
  console.log(mapped)
  console.log(mappedSelect)
  console.log(mappedAll)
  console.log(mappedLleno)
  
  console.log(newObj)
  console.log(newObj2)
  console.log(newObjAll)
  console.log(newObjLleno)
  console.log(filaRecibida)
  // filaRecibida?.hydrate(newObj2)
  // var newObj3 = Object.assign(filaRecibida!, ...newObj2)
  // console.log(newObj3)

  emit('guardar', newObj)

  /* console.log(props.configuracionColumnas)
  props.configuracionColumnas.forEach((item) => console.log(item.field))
  console.log(fields.value)

  let mappedFields = props.configuracionColumnas.map((item: any) => ( {
    [item.field]: (fields.value[item.field]!==undefined && item.field===fields.value[item.field].field)??fields.value[item.field].valor
  }))

  let mappedFieldsSelect = props.configuracionColumnas.map((item: any) => ({
    [item.field]: (fieldsSelect.value[item.field]!==undefined && item.field===fieldsSelect.value[item.field].field)??fieldsSelect.value[item.field].valor
  })) */

  // console.log(mapped)
  // console.log(mappedFields)
  // console.log(mappedFieldsSelect)
}
function recorrer(arreglo: any[], propiedad: string): any {
  return arreglo.forEach((element: any) => {
    return element.hasProperty(propiedad) ? element[propiedad] : null
  })
}
function guardar2() {
  var mapped = fields.value.map((item) => ({ [item.field]: item.valor }))
  var mappedSelect = fieldsSelect.value.map((item) => ({
    [item.field]: item.valor,
  }))
  var newObj = Object.assign({}, ...mapped)
  var newObjAll = Object.assign({}, ...[mapped, mappedSelect])

  console.log('fila recibida', props.fila)
  console.log(mapped)
  console.log(mappedSelect)
  console.log(newObj)
  console.log(newObjAll)

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
