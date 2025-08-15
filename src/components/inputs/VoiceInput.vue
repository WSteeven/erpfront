<template>
  <div class="row">
    <div class="col-12">
      <label class="q-mb-sm block">{{ etiqueta }}</label>

      <q-input
        v-model="valorInterno"
        outlined
        :disable="deshabilitado"
        dense
        clearable
        autogrow
        :placeholder="marcador"
        :hint="grabando ? 'Escuchando…' : 'Presione el micrófono para grabar'"
        :error="!!get(v$, claveError + '.$errors', []).length"
        @blur="get(v$, claveError, {}).$touch"
        :mask="mascara"
      >
        <template #error>
          <div
            v-for="error of get(v$, claveError + '.$errors', [])"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </template>

        <template #append>
          <q-btn
            :color="grabando ? 'positive' : 'primary'"
            no-wrap
            @click="escuchar()"
            :disable="deshabilitado"
            dense
            push
            :loading="grabando"
          >
            <q-icon name="bi-mic" size="xs" />
            <template #loading>
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
            <q-icon name="bi-stop" size="xs" />
          </q-btn>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import get from 'lodash.get'

// Capacitor + plugin nativo
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

const emitir = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: { type: [String, null], default: '' },
  deshabilitado: { type: Boolean, default: false },
  v$: { type: Object, default: () => ({}) },
  claveError: { type: String, default: '' },
  etiqueta: { type: String, default: 'Texto por voz' },
  marcador: { type: String, default: '' },
  mascara: { type: String, default: '' }
})

const grabando = ref(false)
let reconocimientoWeb: any = null

// Funciones para quitar listeners nativos (si existen)
let quitarParcial: (() => Promise<void>) | undefined
let quitarEstado: (() => Promise<void>) | undefined

// Idioma fijo en español (ajusta si quieres es-419 o es-ES)
const IDIOMA = 'es-EC'

const valorInterno = computed({
  get: () => props.modelValue,
  set: (nuevo) => emitir('update:modelValue', nuevo)
})

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

function esPlataformaNativa() {
  return Capacitor.isNativePlatform()
}

async function asegurarPermisos() {
  const estado = await SpeechRecognition.checkPermissions()
  if (estado.speechRecognition !== 'granted') {
    const req = await SpeechRecognition.requestPermissions()
    if (req.speechRecognition !== 'granted') {
      throw new Error('Permiso de micrófono/reconocimiento no concedido')
    }
  }
}

async function escuchar() {
  if (props.deshabilitado || grabando.value) return

  if (esPlataformaNativa()) {
    try {
      const { available } = await SpeechRecognition.available()
      if (!available) {
        return escucharWeb()
      }

      await asegurarPermisos()
      // Limpia posibles listeners anteriores
      await SpeechRecognition.removeAllListeners().catch(console.error)

      const hParcial = await SpeechRecognition.addListener('partialResults', (datos) => {
        if (Array.isArray(datos?.matches) && datos.matches[0]) {
          valorInterno.value = datos.matches[0]
        }
      })
      quitarParcial = hParcial.remove

      const hEstado = await SpeechRecognition.addListener('listeningState', ({ status }) => {
        grabando.value = status === 'started'
      })
      quitarEstado = hEstado.remove

      grabando.value = true
      await SpeechRecognition.start({
        language: IDIOMA,
        maxResults: 1,
        partialResults: true,
        popup: false
      })
    } catch (err) {
      grabando.value = false
      console.error(err)
      return escucharWeb()
    }
  } else {
    return escucharWeb()
  }
}

function escucharWeb() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('El reconocimiento de voz no es compatible con este navegador.')
    return
  }

  grabando.value = true
  reconocimientoWeb = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  reconocimientoWeb.lang = IDIOMA
  reconocimientoWeb.continuous = false
  reconocimientoWeb.interimResults = true

  reconocimientoWeb.onresult = (evento: any) => {
    const indice = evento.resultIndex ?? evento.results.length - 1
    const resultado = evento.results[indice]
    const transcripcion = resultado[0]?.transcript ?? ''
    valorInterno.value = transcripcion
    if (resultado.isFinal) {
      grabando.value = false
    }
  }

  reconocimientoWeb.onerror = () => {
    grabando.value = false
    alert('Hubo un error al intentar reconocer la voz.')
  }

  reconocimientoWeb.onend = () => {
    grabando.value = false
  }

  reconocimientoWeb.start()
}

async function detener() {
  if (esPlataformaNativa()) {
    try {
      await SpeechRecognition.stop()
    } catch (e) {
      console.error(e)
    }
    grabando.value = false
    // Quita listeners si existen (sin callbacks vacíos)
    await quitarParcial?.().catch(console.error)
    await quitarEstado?.().catch(console.error)
    await SpeechRecognition.removeAllListeners().catch(console.error)
  } else if (reconocimientoWeb) {
    try {
      reconocimientoWeb.stop()
    } catch (e) {
      console.error(e)
    }
    grabando.value = false
  }
}

onBeforeUnmount(async () => {
  await detener()
})

</script>
