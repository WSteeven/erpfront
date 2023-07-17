import { defineStore } from "pinia";
import { ref } from "vue";

export const useFondoRotativoStore = defineStore('fondo_rotativo', ()=>{
  const id_gasto = ref()
  const empleados = ref()
  const existeFactura =ref(false)
const estaSemanAC = ref(false)

  return {
    id_gasto,
    existeFactura,
    empleados,
    estaSemanAC
  }
})
