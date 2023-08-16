<template>
  <q-input v-model="mes" placeholder="Obligatorio"
              :error="mes_data==null"
              :disable="disable"
              :value="mes_data"
               outlined
               dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale"  v-model="is_month">
                    <q-date v-model="mes"  minimal mask="MM-YYYY"  emit-immediately
                     default-view="Years"
                     @update:model-value="checkValue">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <slot name="error"></slot>
              </template>
            </q-input>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps([
  'modelValue',
  'mes',
  'disable',
  'error',
])

const emit = defineEmits(['update:modelValue'])
const mes_data = computed(() => props.mes)
const mes = ref()
const is_month = ref(false)
watch(mes_data, () => {
  if (!mes_data.value) mes.value = null
})
function checkValue (val, reason, details) {
      is_month.value=reason === 'month'? false : true;
    }

function limpiar() {
  emit('update:modelValue', null)
}
</script>

<style lang="scss">
.closeButton {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 9999;
}
</style>
