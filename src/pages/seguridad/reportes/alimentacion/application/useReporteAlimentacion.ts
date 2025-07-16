import { ref } from 'vue'

export function useReporteAlimentacion() {
  const fechaInicio = ref('')
  const fechaFin = ref('')

  return {
    fechaInicio,
    fechaFin,
  }
}
