import { AcreditacionSemana } from 'pages/fondosRotativos/acreditacionSemana/domain/AcreditacionSemana'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAcreditacionesStore = defineStore('acreditaciones', () => {
  const acreditacion_semana:AcreditacionSemana = reactive(new AcreditacionSemana)
  const esta_acreditado = ref()


  return {
    esta_acreditado,
    acreditacion_semana,
  }
})
