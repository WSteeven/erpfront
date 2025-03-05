<template>
  <div class="row">
    <div class="col-12">
      <label class="q-mb-sm block">{{ label }}</label>
      <q-input
        v-model="internalValue"
        outlined
        :disable="disable"
        dense
        clearable
        autogrow
        :placeholder="placeholder"
        :hint="grabando ? 'Escuchando...' : 'Presione el micrófono para grabar'"
        :error="!!v$[keyError]?.$errors.length"
        @blur="v$[keyError]?.$touch"
        :mask="mask"
      >
        <template v-slot:error>
          <div v-for="error of v$[keyError]?.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </template>

        <template #append>
          <q-btn
            :color="grabando ? 'positive' : 'primary'"
            no-wrap
            @click="escuchar()"
            :disable="disable"
            dense
            push
            :loading="grabando"
          >
            <q-icon name="bi-mic" size="xs"></q-icon>
            <template v-slot:loading>
              <q-spinner-bars class="q-mx-xs" />
            </template>
          </q-btn>

          <q-btn
            v-if="grabando"
            color="negative"
            no-wrap
            @click="detener()"
            :disable="!grabando"
            dense
            push
          >
            <q-icon name="bi-stop" size="xs"></q-icon>
          </q-btn>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: ''
  },
  disable: {
    type: Boolean,
    default: false
  },
  v$: {
    type: Object,
    default: () => ({})
  },
  keyError: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Fecha y hora'
  },
  placeholder: {
    type: String,
    default: ''
  },
  mask: {
    type: String,
    default: ''
  }
})

const grabando = ref(false)
let recognition: any = null

const internalValue = computed({
  get: () => props.modelValue,
  set: newValue => {
    emit('update:modelValue', newValue)
  }
})

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

async function escuchar() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('El reconocimiento de voz no es compatible con este navegador.')
    return
  }

  grabando.value = true

  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)()
  recognition.lang = 'es-ES' // Ajustar el idioma si es necesario
  recognition.continuous = false // No continuar grabando una vez que termine
  recognition.interimResults = false // No mostrar resultados intermedios

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    internalValue.value = transcript
    grabando.value = false
  }

  recognition.onerror = () => {
    grabando.value = false
    alert('Hubo un error al intentar reconocer la voz.')
  }

  recognition.start()
}

function detener() {
  if (recognition) {
    recognition.stop() // Detener la grabación manualmente
    grabando.value = false // Cambiar el estado de grabación a falso
  }
}
</script>
