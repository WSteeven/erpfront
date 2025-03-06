<template>
  <q-dialog
    v-model="abierto"
    :full-width="true"
    maximizedd
    class="bg-desenfoque"
  >
    <q-card flat class="bg-body rounded-card no-border">
      <q-toolbar>
        <q-avatar square>
          <img src="~assets/logo.png" />
        </q-avatar>

        <q-toolbar-title>Editar fila seleccionada {{ accion }}</q-toolbar-title>

        <q-btn
          round
          glossy
          push
          dense
          color="negative"
          icon="bi-x"
          v-close-popup
          @click="cerrarModalEntidad()"
        />
      </q-toolbar>

      <q-card-section>
        <div class="row q-col-gutter-xs q-mb-md">
          <template v-for="field in camposFiltrados" :key="field.field">
            <!-- Select -->
            <div
              v-if="field.type === 'select' && field.visibleModal"
              :class="[field.columnClass || 'col-12 col-md-3 q-mb-md']"
            >
              <label class="block q-mb-sm">{{ field.label }}</label>
              <q-select
                v-model="field.valor"
                :options="field.options"
                transition-show="scale"
                transition-hide="scale"
                :hint="field.hint"
                :disable="field.disableModal"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                emit-value
                map-options
                :option-label="item => item.label"
                :option-value="item => item.label"
                @filter="(val, update) => filterOptions(field, val, update)"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"
                      >No hay resultados</q-item-section
                    >
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Toggle -->
            <div
              v-else-if="field.type === 'toggle' && field.visibleModal"
              :class="[field.columnClass || 'col-12 col-md-3 q-mb-md']"
            >
              <label class="block q-mb-sm">{{ field.label }}</label>
              <q-toggle
                keep-color
                v-model="field.valor"
                :label="field.valor ? 'Si' : 'No'"
                :disable="field.disableModal"
              />
            </div>

            <!-- Checkbox -->
            <div
              v-else-if="field.type === 'checkbox' && field.visibleModal"
              :class="[field.columnClass || 'col-12 col-md-3 q-mb-md']"
            >
              <label class="block q-mb-sm">{{ field.label }}</label>
              <q-checkbox
                keep-color
                v-model="field.valor"
                :label="field.valor ? 'Si' : 'No'"
                :disable="field.disableModal"
              />
            </div>

            <!-- Imagen -->
            <div
              v-else-if="field.type === 'imagen' && field.visibleModal"
              :class="[field.columnClass || 'col-12 col-md-3 q-mb-md']"
            >
              <label class="q-mb-sm block">{{ field.label }}</label>
              <selector-imagen
                :imagen="field.valor"
                file_extensiones=".jpg, image/*"
                @update:modelValue="data => (field.valor = data)"
                :hint="field.hint"
                :disable="field.disableModal"
              />
            </div>

            <!-- Voz -->
            <div
              v-else-if="field.type === 'voice' && field.visibleModal"
              :class="[field.columnClass || 'col-12 col-md-3 q-mb-md']"
            >
              <voice-input
                v-model="field.valor"
                :label="field.label"
                :disable="field.disableModal"
              ></voice-input>
            </div>

            <!-- Otros Inputs -->
            <div
              v-else-if="field.visibleModal"
              :class="[field.columnClass || 'col-12 col-md-3 q-mb-md']"
            >
              <label class="block q-mb-sm">{{ field.label }}</label>
              <q-input
                v-model="field.valor"
                :type="field.type || 'text'"
                :hint="field.hint"
                :disable="field.disableModal"
                outlined
                dense
              />
            </div>
          </template>
        </div>

        <!-- Botones -->
        <div class="row q-gutter-md justify-end">
          <q-btn
            v-if="!disable"
            color="primary"
            no-caps
            @click="guardar()"
            push
          >
            <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>
            <div>{{ labelGuardar }}</div>
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

<script lang="ts">
// Dependencias
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import {
  watchEffect,
  ref,
  defineComponent,
  reactive,
  UnwrapRef,
  computed
} from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { ColumnConfig } from '../domain/ColumnConfig'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'
import VoiceInput from 'components/inputs/VoiceInput.vue'
import { acciones } from 'config/utils'

export default defineComponent({
  components: {
    SelectorImagen,
    VoiceInput
  },
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true
    },
    fila: {
      type: Object as () => EntidadAuditable,
      required: false
    },
    modalMaximized: {
      type: Boolean,
      default: true
    },
    accion: {
      type: String,
      default: acciones.editar
    }
  },
  emits: ['limpiar', 'guardar', 'editar'],

  setup(props, { emit }) {
    /************
     * Variables
     ************/
    const { notificarAdvertencia } = useNotificaciones()
    const disable = ref(false)

    // Estado reactivo de los campos para mantener sus valores
    const camposFiltrados = reactive<{ [key: string]: any }[]>([])

    const tableIndex = {
      name: 'table_index',
      field: 'table_index',
      label: 'Indice',
      align: 'left',
      visibleModal: false
    }

    // Estado del modal
    const abierto = ref(false)

    /*************
     * Observers
     *************/
    // Sincroniza `camposFiltrados` cuando cambian `configuracionColumnas` o `fila`
    watchEffect(() => {
      camposFiltrados.splice(
        0,
        camposFiltrados.length,
        ...[...props.configuracionColumnas, tableIndex]
          .map((fila: ColumnConfig<EntidadAuditable>) => ({
            label: fila.label,
            field: fila.field,
            type: fila.type ?? 'text',
            editable: fila.editable ?? true,
            valor: props.fila ? props.fila[fila.field] : '',
            options: fila.options || [],
            options_all: fila.options || [],
            hint: fila.hint,
            disableModal: fila.disableModal || disable.value,
            columnClass: fila.columnClass,
            // visible:  ?? true,
            visibleModal: fila.visibleModal ?? true
          }))
          .filter((fila: any) => fila.field !== 'acciones' && fila.editable)
      )
    })

    /************
     * Funciones
     ************/
    const abrir = (params?: { accion: string }) => {
      abierto.value = true
      disable.value = params?.accion === acciones.consultar ?? false
      console.log(disable.value)
    }

    function guardar() {
      console.log(props.accion)
      const newObj = camposFiltrados.reduce((acc, item) => {
        acc[item.field] = item.valor
        return acc
      }, {})
      if (validarRequeridos(newObj)) {
        if (props.accion === acciones.nuevo) emit('guardar', newObj)
        if (props.accion === acciones.editar) emit('editar', newObj)
        console.log(newObj)
        abierto.value = false
      }
    }

    function cerrarModalEntidad() {
      abierto.value = false
      emit('limpiar')
    }

    function filterOptions(field: UnwrapRef<any>, val, update) {
      if (val === '') {
        update(() => {
          field.options = field.options_all
        })
        return
      }
      update(() => {
        field.options = field.options_all!.filter(
          item => item.label.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    }

    function validarRequeridos(fila) {
      const faltantes = props.configuracionColumnas
        .filter(col => col.requerido && !fila[col.field])
        .map(col => col.label)

      if (faltantes.length > 0) {
        notificarAdvertencia(
          `Los siguientes campos son obligatorios: ${faltantes.join(', ')}`
        )
        return false
      }
      return true
    }

    return {
      abierto,
      camposFiltrados,
      abrir,
      guardar,
      cerrarModalEntidad,
      filterOptions,
      disable,
      labelGuardar: computed(() =>
        props.accion === acciones.nuevo ? 'Guardar' : 'Guardar cambios'
      )
    }
  }
})
</script>
