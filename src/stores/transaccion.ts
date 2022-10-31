import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { Inventario } from 'pages/bodega/inventario/domain/Inventario'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones } from 'config/utils'

export const useTransaccionStore = defineStore('transaccion', () => {
  // State
  const transaccion = reactive(new Transaccion())

  const accionTransaccion = acciones.nuevo
  
  const statusLoading = new StatusEssentialLoading()
  async function consultarTransaccion(id:number) {
    statusLoading.activar()
    const axios = AxiosHttpRepository.getInstance()
    const ruta=axios.getEndpoint(endpoints.transacciones)+id
    const response: AxiosResponse = await axios.get(ruta)
    statusLoading.desactivar()
  }
  
  function resetearTransaccion(){
    //
  }

  return {
    // State
    transaccion,
    accionTransaccion,
    
    consultarTransaccion,
    
    resetearTransaccion,


    
  }
})
