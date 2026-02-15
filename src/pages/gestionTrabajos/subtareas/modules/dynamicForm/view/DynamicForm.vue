<template>
  <div v-if="config">
    <!-- Secciones -->
    <div v-for="(section, index) in config.sections" :key="'section-' + index" class="q-mb-md">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2 text-subtitle1 text-weight-bold">
          {{ section.title }}
        </q-card-section>
        
        <q-separator />
        
        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Campos -->
            <div v-for="(field) in section.fields" :key="field.name" class="col-12" :class="getFieldClass(field)">
              
              <!-- Texto / Numero / Fecha -->
              <q-input
                v-if="['text', 'number', 'email', 'date', 'time', 'datetime-local'].includes(field.type)"
                v-model="formData[field.name]"
                :label="field.label"
                :type="field.type"
                outlined
                dense
                :required="field.required"
                :readonly="field.readonly"
              />

              <!-- Textarea -->
              <q-input
                v-else-if="field.type === 'textarea'"
                v-model="formData[field.name]"
                :label="field.label"
                type="textarea"
                outlined
                dense
                autogrow
                :required="field.required"
                :readonly="field.readonly"
              />

              <!-- Select -->
              <q-select
                v-else-if="field.type === 'select'"
                v-model="formData[field.name]"
                :label="field.label"
                :options="field.options"
                outlined
                dense
                emit-value
                map-options
                :required="field.required"
                :readonly="field.readonly"
              />

               <!-- Checkbox -->
               <q-checkbox
                v-else-if="field.type === 'checkbox'"
                v-model="formData[field.name]"
                :label="field.label"
                dense
                :disable="field.readonly"
              />
              
              <!-- Imagen / Firma (Pendiente de implementar componente especifico) -->
              <div v-else-if="['image', 'signature'].includes(field.type)" class="text-grey-7 q-pa-sm border-dashed">
                <q-icon name="image" /> {{ field.label }} (Implementación pendiente)
              </div>

            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Tablas Dinámicas -->
    <div v-if="config.dynamic_tables && config.dynamic_tables.length > 0">
      <div v-for="(table, index) in config.dynamic_tables" :key="'table-' + index" class="q-mb-md">
         <q-card flat bordered>
            <q-card-section class="bg-grey-2 text-subtitle1 text-weight-bold row justify-between items-center">
              {{ table.title }}
              <q-btn v-if="!readonly" icon="add" round color="primary" size="sm" @click="addRow(table.name)" />
            </q-card-section>
            <q-separator />
            <q-card-section>
              
              <!-- Renderizado basico de tabla (se mejorará) -->
              <div v-if="formData[table.name] && formData[table.name].length > 0">
                <div v-for="(row, rIndex) in formData[table.name]" :key="table.name + '-row-' + rIndex" class="row q-col-gutter-sm q-mb-sm border-bottom-dashed q-pb-sm">
                   <div v-for="col in table.columns" :key="col.name" class="col">
                      <q-input
                        v-model="row[col.name]"
                        :label="col.label"
                        dense
                        outlined
                      />
                   </div>
                   <div class="col-auto flex flex-center">
                      <q-btn icon="delete" flat color="negative" round size="sm" @click="removeRow(table.name, rIndex)" />
                   </div>
                </div>
              </div>
              <div v-else class="text-center text-grey q-pa-md">
                No hay registros
              </div>

            </q-card-section>
         </q-card>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted } from 'vue'

export default defineComponent({
  name: 'DynamicForm',
  props: {
    config: {
      type: Object,
      required: true
    },
    modelValue: {
      type: Object,
      required: true,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formData = props.modelValue

    // Inicializar arrays para tablas dinámicas
    onMounted(() => {
       if (props.config && props.config.dynamic_tables) {
          props.config.dynamic_tables.forEach((table: any) => {
             if (!formData[table.name]) {
                formData[table.name] = []
             }
          })
       }
    })

    const getFieldClass = (field: any) => {
      // Simple logica de grid, se puede mejorar
      if (['textarea', 'dynamic_table'].includes(field.type)) return 'col-12'
      return 'col-12 col-md-6'
    }

    const addRow = (tableName: string) => {
      if (!formData[tableName]) formData[tableName] = []
      formData[tableName].push({})
    }

    const removeRow = (tableName: string, index: number) => {
      if (formData[tableName]) {
        formData[tableName].splice(index, 1)
      }
    }

    return {
      formData,
      getFieldClass,
      addRow,
      removeRow
    }
  }
})
</script>

<style scoped>
.border-dashed {
  border: 1px dashed #ccc;
  border-radius: 4px;
}
.border-bottom-dashed {
  border-bottom: 1px dashed #eee;
}
</style>
