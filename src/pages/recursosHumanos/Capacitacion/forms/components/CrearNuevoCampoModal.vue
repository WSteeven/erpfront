<template>
  <!-- Modal para agregar un nuevo campo -->
  <q-dialog v-model="abierto">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Añadir Nueva Pregunta</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12">
            <!-- Seleccionar tipo de campo -->
            <label class="q-mb-sm block">Tipo de campo</label>
            <q-select
              v-model="newField.type"
              :options="tiposCampos"
              options-dense
              dense
              outlined
              emit-value
            />
          </div>
          <!--{{newField}}-->

          <!-- Configurar etiqueta -->
          <div class="col-12">
            <label class="q-mb-sm block">Etiqueta</label>
            <q-input
              v-model="newField.label"
              dense
              autogrow
              outlined
              class="q-mt-md"
              :error="!!v$.label.$errors.length"
              @blur="v$.label.$touch"
              @update:model-value="(val)=>newField.label = val.toUpperCase()"
            >
              <template v-slot:error>
                <div v-for="error of v$.label.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Opciones para radio, checkbox o select -->
          <div class="col-12">
            <q-input v-if="['radio', 'checkbox', 'select', 'select_multiple'].includes(newField.type)"
              v-model="newField.options"
              label="Opciones (separadas por comas)"
              dense
              outlined
                     :error="!!v$.options.$errors.length"
                     @blur="v$.options.$touch"
              class="q-mt-md"
                     @update:model-value="(val)=>newField.options = val.toUpperCase()"
            >
              <template v-slot:error>
                <div v-for="error of v$.options.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Campo requerido -->
          <div class="col-12">
            <q-toggle
              v-model="newField.required"
              label="¿Esta pregunta es requerida?"
              dense
              class="q-mt-md"
            />
          </div>

          <!-- Orientacion -->
          <div class="col-12" v-if="['radio', 'checkbox'].includes(newField.type)">
            <q-toggle
              v-model="newField.orientacion"
              :label="newField.orientacion?'Visualización horizontal de las opciones ':'Visualización vertical de las opciones ' "
              dense
              class="q-mt-md"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" @click="cancel" />
        <q-btn flat label="Añadir" color="primary" @click="addField" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { tiposCampos } from 'config/capacitacion.utils'
import { useVuelidate } from '@vuelidate/core'
import { required, requiredIf } from 'shared/i18n-validators'
import { EmptyField } from 'capacitacion/forms/domain/EmptyField'
import { acciones } from 'config/utils'

export default defineComponent({
  props: {
    mostrar: Boolean,
    campo: {
      type: EmptyField,
      required:true
    },
    accion:{
      type:String,
      default: acciones.nuevo
    },
    guardar: {
      type: Function,
      required: true
    }
  },
  emits: ['cerrar', 'agregar'],
  setup(props, { emit }) {
    const abierto = computed(() => props.mostrar)
    const newField = reactive(props.campo)
    const cancel = () => {
      emit('cerrar')
    }
    const reglas = {
      type : { required },
      label : { required },
      options: {
        required: requiredIf(()=>['radio', 'checkbox', 'select', 'select_multiple'].includes(newField.type))
      }
    }
    const v$ = useVuelidate(reglas, newField)


    const addField =async () => {
      if (await v$.value.$validate()) {
        props.guardar({field: newField,accion:props.accion})
        cancel()
      }
    }

    return {
      v$,
      abierto,
      newField,
      tiposCampos,
      cancel,
      addField
    }
  }
})
</script>
