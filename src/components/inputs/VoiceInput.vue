<template>
  <div class="row">
    <div class="col-12">
      <label class="q-mb-sm block">{{ etiqueta }}</label>

      <q-input
        v-model="valorInterno"
        outlined
        :disable="deshabilitado"
        :readonly="grabando"
        dense
        :clearable="!grabando"
        autogrow
        :placeholder="marcador"
        :hint="grabando ? 'Escuchando…' : 'Presione el micrófono para grabar'"
        :error="!!get(v$, claveError + '.$errors', []).length"
        @blur="
          get(v$, claveError, {}).$touch && get(v$, claveError, {}).$touch()
        "
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
            :disable="deshabilitado || operando !== 'idle'"
            dense
            push
            :loading="operando === 'starting' || operando === 'listening'"
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
            :disable="operando !== 'listening'"
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
import { computed, onBeforeUnmount, ref, onMounted } from 'vue'
import get from 'lodash.get'

// Capacitor + plugin nativo
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

const emitir = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: { type: [String, null] as any, default: '' },
  deshabilitado: { type: Boolean, default: false },
  v$: { type: Object as any, default: () => ({}) },
  claveError: { type: String, default: '' },
  etiqueta: { type: String, default: 'Texto por voz' },
  marcador: { type: String, default: '' },
  mascara: { type: String, default: '' }
})

/** ====== ESTADO ====== */
const grabando = ref(false)
const operando = ref<'idle' | 'starting' | 'listening' | 'stopping'>('idle')

let reconocimientoWeb: any = null
let quitarParcial: (() => Promise<void>) | undefined
let quitarEstado: (() => Promise<void>) | undefined

const IDIOMA = 'es-EC'

// Watchdog / tiempos
let watchdog: number | null = null
let ultimoEventoMs = 0
const MAX_SILENCIO_MS = 12000 // 12s sin parciales -> forzar stop
const MAX_SESION_MS = 60000 // 60s de sesión -> forzar stop
let timerSesion: number | null = null

const valorInterno = computed({
  get: () => props.modelValue as string,
  set: (nuevo: string) => emitir('update:modelValue', nuevo)
})

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

/** ====== HELPERS ====== */
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

function tocarActividad() {
  ultimoEventoMs = Date.now()
}

function arrancarWatchdog() {
  pararWatchdog()
  ultimoEventoMs = Date.now()
  watchdog = window.setInterval(() => {
    const ahora = Date.now()
    if (ahora - ultimoEventoMs > MAX_SILENCIO_MS) {
      detener(true) // forzar
    }
  }, 1000)
}

function pararWatchdog() {
  if (watchdog !== null) {
    clearInterval(watchdog)
    watchdog = null
  }
}

function arrancarTemporizadorSesion() {
  detenerTemporizadorSesion()
  timerSesion = window.setTimeout(
    () => detener(true),
    MAX_SESION_MS
  ) as unknown as number
}

function detenerTemporizadorSesion() {
  if (timerSesion !== null) {
    clearTimeout(timerSesion)
    timerSesion = null
  }
}

/** ====== INICIO DE ESCUCHA ====== */
async function escuchar() {
  if (props.deshabilitado) return
  if (operando.value !== 'idle') return // evita doble start
  operando.value = 'starting'
  grabando.value = true

  if (esPlataformaNativa()) {
    try {
      const { available } = await SpeechRecognition.available()
      if (!available) {
        operando.value = 'idle'
        grabando.value = false
        return escucharWebInterno()
      }

      await asegurarPermisos()
      await SpeechRecognition.removeAllListeners().catch(() => {
        // Ignorar error al remover listeners
      })

      const hParcial = await SpeechRecognition.addListener(
        'partialResults',
        datos => {
          if (Array.isArray(datos?.matches) && datos.matches[0]) {
            valorInterno.value = datos.matches[0]
            tocarActividad()
          }
        }
      )
      quitarParcial = hParcial.remove

      const hEstado = await SpeechRecognition.addListener(
        'listeningState',
        ({ status }) => {
          if (status === 'started') {
            grabando.value = true
            operando.value = 'listening'
            tocarActividad()
            arrancarWatchdog()
            arrancarTemporizadorSesion()
          } else if (status === 'stopped') {
            grabando.value = false
            operando.value = 'idle'
            pararWatchdog()
            detenerTemporizadorSesion()
          }
        }
      )
      quitarEstado = hEstado.remove

      await SpeechRecognition.start({
        language: IDIOMA,
        maxResults: 1,
        partialResults: true,
        popup: false
      })
    } catch (err) {
      console.error('[SR start error]', err)
      grabando.value = false
      operando.value = 'idle'
      return escucharWebInterno()
    }
  } else {
    return escucharWebInterno()
  }
}

/** ====== ESCUCHA EN WEB ====== */
function escucharWebInterno() {
  if (
    !('webkitSpeechRecognition' in window) &&
    !('SpeechRecognition' in window)
  ) {
    alert('El reconocimiento de voz no es compatible con este navegador.')
    grabando.value = false
    operando.value = 'idle'
    return
  }

  try {
    reconocimientoWeb = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)()
    reconocimientoWeb.lang = IDIOMA
    reconocimientoWeb.continuous = false
    reconocimientoWeb.interimResults = true

    reconocimientoWeb.onstart = () => {
      operando.value = 'listening'
      grabando.value = true
      tocarActividad()
      arrancarWatchdog()
      arrancarTemporizadorSesion()
    }

    reconocimientoWeb.onresult = (evento: any) => {
      const indice = evento.resultIndex ?? evento.results.length - 1
      const resultado = evento.results[indice]
      const transcripcion = resultado[0]?.transcript ?? ''
      valorInterno.value = transcripcion
      tocarActividad()
      if (resultado.isFinal) detener()
    }

    reconocimientoWeb.onerror = () => {
      detener(true) // freno de emergencia
    }

    reconocimientoWeb.onend = () => {
      finalizarCierreWeb()
    }

    reconocimientoWeb.start()
  } catch (e) {
    console.error('[Web SR start error]', e)
    finalizarCierreWeb()
  }
}

function finalizarCierreWeb() {
  grabando.value = false
  operando.value = 'idle'
  pararWatchdog()
  detenerTemporizadorSesion()
  reconocimientoWeb = null
}

/** ====== DETENER ====== */
async function detener(forzado = false) {
  if (operando.value === 'idle') return
  if (operando.value === 'stopping') return
  operando.value = 'stopping'
  pararWatchdog()
  detenerTemporizadorSesion()

  if (esPlataformaNativa()) {
    try {
      await SpeechRecognition.stop()
    } catch (e) {
      console.error('[SR stop error]', e)
      // seguimos a limpiar igual
    } finally {
      grabando.value = false
      try {
        await quitarParcial?.()
      } catch {}
      try {
        await quitarEstado?.()
      } catch {}
      try {
        await SpeechRecognition.removeAllListeners()
      } catch {}
      operando.value = 'idle'
    }
  } else if (reconocimientoWeb) {
    try {
      if (!forzado) reconocimientoWeb.stop()
      else if (typeof reconocimientoWeb.abort === 'function')
        reconocimientoWeb.abort()
    } catch (e) {
      console.error('[Web SR stop/abort error]', e)
    } finally {
      finalizarCierreWeb()
    }
  } else {
    grabando.value = false
    operando.value = 'idle'
  }
}

/** ====== LIFECYCLE ====== */
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) detener(true)
    })
  }
})

onBeforeUnmount(async () => {
  await detener(true)
})
</script>

<style scoped>
.block {
  display: block;
  font-weight: 600;
}
</style>
