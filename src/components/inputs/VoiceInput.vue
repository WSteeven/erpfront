<template>
  <div class="row">
    <div class="col-12">
      <label class="q-mb-sm block">{{ label }}</label>

      <q-input
        v-model="valorInterno"
        outlined
        :disable="deshabilitado"
        :readonly="grabando"
        dense
        :clearable="!grabando"
        autogrow
        :placeholder="placeholder"
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
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  mascara: { type: String, default: '' },
})

/** ====== ESTADO ====== */
const grabando = ref(false)
const operando = ref<'idle' | 'starting' | 'listening' | 'stopping'>('idle')
const componenteMontado = ref(true) // Nuevo: controlar si está montado

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
  set: (nuevo: string) => {
    if (componenteMontado.value) {
      emitir('update:modelValue', nuevo)
    }
  }
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
  if (componenteMontado.value) {
    ultimoEventoMs = Date.now()
  }
}

function arrancarWatchdog() {
  pararWatchdog()
  ultimoEventoMs = Date.now()
  watchdog = window.setInterval(() => {
    if (!componenteMontado.value) {
      pararWatchdog()
      return
    }

    const ahora = Date.now()
    // Verificar estado antes de detener
    if (ahora - ultimoEventoMs > MAX_SILENCIO_MS && operando.value === 'listening') {
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
  timerSesion = window.setTimeout(() => {
    if (componenteMontado.value && operando.value === 'listening') {
      detener(true)
    }
  }, MAX_SESION_MS) as unknown as number
}

function detenerTemporizadorSesion() {
  if (timerSesion !== null) {
    clearTimeout(timerSesion)
    timerSesion = null
  }
}

/** ====== RESET DE ESTADO SEGURO ====== */
function resetearEstadoSeguro() {
  if (!componenteMontado.value) return

  grabando.value = false
  operando.value = 'idle'
  pararWatchdog()
  detenerTemporizadorSesion()
}

/** ====== INICIO DE ESCUCHA ====== */
async function escuchar() {
  if (!componenteMontado.value) return
  if (props.deshabilitado) return
  if (operando.value !== 'idle') return // evita doble start

  operando.value = 'starting'
  grabando.value = true

  if (esPlataformaNativa()) {
    try {
      const { available } = await SpeechRecognition.available()
      if (!available) {
        resetearEstadoSeguro()
        return escucharWebInterno()
      }

      // Verificar que seguimos montados después del await
      if (!componenteMontado.value) return

      await asegurarPermisos()

      if (!componenteMontado.value) return

      await SpeechRecognition.removeAllListeners().catch(() => {
        // Ignorar error al remover listeners
      })

      const hParcial = await SpeechRecognition.addListener(
        'partialResults',
        datos => {
          if (!componenteMontado.value) return
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
          if (!componenteMontado.value) return

          if (status === 'started') {
            grabando.value = true
            operando.value = 'listening'
            tocarActividad()
            arrancarWatchdog()
            arrancarTemporizadorSesion()
          } else if (status === 'stopped') {
            resetearEstadoSeguro()
          }
        }
      )
      quitarEstado = hEstado.remove

      // Verificación final antes de iniciar
      if (!componenteMontado.value) {
        await limpiarListenersNativo()
        return
      }

      await SpeechRecognition.start({
        language: IDIOMA,
        maxResults: 1,
        partialResults: true,
        popup: false
      })
    } catch (err) {
      console.error('[SR start error]', err)
      resetearEstadoSeguro()
      await limpiarListenersNativo()

      // Solo hacer fallback si el componente sigue montado y no está deshabilitado
      if (componenteMontado.value && !props.deshabilitado) {
        return escucharWebInterno()
      }
    }
  } else {
    return escucharWebInterno()
  }
}

/** ====== LIMPIEZA DE LISTENERS NATIVO ====== */
async function limpiarListenersNativo() {
  try {
    await quitarParcial?.()
  } catch {} finally {
    quitarParcial = undefined
  }

  try {
    await quitarEstado?.()
  } catch {} finally {
    quitarEstado = undefined
  }

  try {
    await SpeechRecognition.removeAllListeners()
  } catch {}
}

/** ====== ESCUCHA EN WEB ====== */
function escucharWebInterno() {
  if (!componenteMontado.value) return

  if (
    !('webkitSpeechRecognition' in window) &&
    !('SpeechRecognition' in window)
  ) {
    console.warn('El reconocimiento de voz no es compatible con este navegador.')
    resetearEstadoSeguro()
    // Podrías emitir un evento para mostrar un toast/notificación
    return
  }

  try {
    reconocimientoWeb = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)()
    reconocimientoWeb.lang = IDIOMA
    reconocimientoWeb.continuous = false
    reconocimientoWeb.interimResults = true

    reconocimientoWeb.onstart = () => {
      if (!componenteMontado.value) return
      operando.value = 'listening'
      grabando.value = true
      tocarActividad()
      arrancarWatchdog()
      arrancarTemporizadorSesion()
    }

    reconocimientoWeb.onresult = (evento: any) => {
      if (!componenteMontado.value) return

      const indice = evento.resultIndex ?? evento.results.length - 1
      const resultado = evento.results[indice]
      const transcripcion = resultado[0]?.transcript ?? ''
      valorInterno.value = transcripcion
      tocarActividad()

      if (resultado.isFinal) detener()
    }

    reconocimientoWeb.onerror = (error: any) => {
      console.error('[Web SR error]', error)
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
  resetearEstadoSeguro()
  reconocimientoWeb = null
}

/** ====== DETENER ====== */
async function detener(forzado = false) {
  if (!componenteMontado.value) return
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
    } finally {
      resetearEstadoSeguro()
      await limpiarListenersNativo()
    }
  } else if (reconocimientoWeb) {
    try {
      if (!forzado) {
        reconocimientoWeb.stop()
      } else if (typeof reconocimientoWeb.abort === 'function') {
        reconocimientoWeb.abort()
      }
    } catch (e) {
      console.error('[Web SR stop/abort error]', e)
    } finally {
      finalizarCierreWeb()
    }
  } else {
    resetearEstadoSeguro()
  }
}

/** ====== LIMPIEZA TOTAL ====== */
async function limpiezaTotal() {
  componenteMontado.value = false
  await detener(true)
  pararWatchdog()
  detenerTemporizadorSesion()
}

/** ====== LIFECYCLE ====== */
onMounted(() => {
  componenteMontado.value = true

  if (typeof document !== 'undefined') {
    const manejarVisibilidad = () => {
      if (document.hidden && componenteMontado.value) {
        detener(true)
      }
    }

    document.addEventListener('visibilitychange', manejarVisibilidad)

    // Limpiar listener cuando se desmonte
    onBeforeUnmount(() => {
      document.removeEventListener('visibilitychange', manejarVisibilidad)
    })
  }
})

onBeforeUnmount(async () => {
  await limpiezaTotal()
})
</script>

<style scoped>
.block {
  display: block;
  font-weight: 600;
}
</style>
