import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransferenciaSaldoStore = defineStore('transferencia_saldo', ()=>{
  const id_transferencia = ref()

  return {
    id_transferencia
  }
})
