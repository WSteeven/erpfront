<template>
  <div class="row">
    <div class="col-12">
      <label class="q-mb-sm block">{{ label }}</label>
      <q-input
        v-model="internalValue"
        placeholder="Obligatorio"
        :disable="disable"
        readonly
        outlined
        dense
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <div class="q-gutter-md row items-start">
                <q-date
                  v-model="internalValue"
                  :mask="maskFechaHora"
                  :options="options"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
                <q-time
                  v-model="internalValue"
                  :minute-options="minuteOptions"
                  :mask="maskFechaHora"
                  color="primary"
                />
              </div>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { maskFechaHora } from 'src/config/utils'
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  options: {
    type: Object as () =>
      | readonly any[]
      | ((date: string) => boolean)
      | undefined,
    required: false
  },
  minuteOptions: {
    type: Object as () => readonly any[] | undefined,
    required: false
  },
  modelValue: {
    type: String,
    default: ''
  },
  disable: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  }
})

const internalValue = computed({
  get: () => props.modelValue,
  set: newValue => {
    emit('update:modelValue', newValue)
  }
})
</script>
