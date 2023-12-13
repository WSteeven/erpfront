import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { apiConfig, endpoints } from "config/api"
import { acciones } from "config/utils"
import { PreingresoMaterial } from "pages/bodega/preingresoMateriales/domain/PreingresoMaterial"
import {defineStore} from "pinia"
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"
import { useNotificaciones } from "shared/notificaciones"
import { imprimirArchivo } from "shared/utils"

import { reactive, ref } from 'vue'

export const usePreingresoStore = defineStore('preingreso',()=>{
  //State
  const preingreso =  reactive(new PreingresoMaterial())
  const preingresoReset = new PreingresoMaterial()
  const idPreingreso = ref()
  const { notificarAdvertencia, notificarError } = useNotificaciones()

  const cargando = new StatusEssentialLoading()

  async function imprimirPdf() {
    try {
      cargando.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.preingresos) + '/imprimir/' + idPreingreso.value
      const filename = 'preingreso_' + idPreingreso.value + '_' + Date.now()
      await imprimirArchivo(url, 'GET', 'blob'||'json', 'pdf', filename)
    } catch (error) {
      notificarError(error+'')
    }finally{
      cargando.desactivar()
    }
  }

  return{
    preingreso, preingresoReset, idPreingreso,

    imprimirPdf,

  }

})
