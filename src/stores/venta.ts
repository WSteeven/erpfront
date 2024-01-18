import { Ventas } from 'pages/ventas-claro/ventas/domain/Ventas'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useVentaStore = defineStore('ticket', () => {
  const filaVenta = reactive(new Ventas())
  const posicionFilaVenta = ref()

  return {
    filaVenta,
    posicionFilaVenta,
  }
})
