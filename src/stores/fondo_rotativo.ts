import { defineStore } from "pinia";
import { ref } from "vue";

export const useFondoRotativoStore = defineStore('fondo_rotativo', ()=>{
  const id_gasto = ref()

  return {
    id_gasto
  }
})
