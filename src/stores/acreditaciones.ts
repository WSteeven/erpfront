import { Acreditacion } from 'pages/fondosRotativos/saldos/acreditacion/domain/Acreditacion'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAcreditacionesStore = defineStore('acreditaciones', () => {
  const idAcreditacion = ref()
  const idAcreditacionSeleccionada = ref()
  const posicionAcreditacionSeleccionada = ref()
  const acreditacion_semana:Acreditacion = reactive(new Acreditacion)
  const esta_acreditado = ref()


  return {
    idAcreditacion,
    idAcreditacionSeleccionada,
    esta_acreditado,
    posicionAcreditacionSeleccionada,
    acreditacion_semana,
  }
})
