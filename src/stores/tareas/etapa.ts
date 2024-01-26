import { Etapa } from "pages/gestionTrabajos/proyectos/modules/etapas/domain/Etapa"
import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useEtapaStore = defineStore('etapa', ()=>{
  //State
  const idEtapa = ref()
  const etapa = reactive(new Etapa())
  const etapaReset = new Etapa()


  return {
    idEtapa,
    etapa
  }
})
