import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones } from 'config/utils'
import { imprimirArchivo } from 'shared/utils'

export const useTransaccionStore = defineStore('transaccion', () => {
    //State
    const transaccion = reactive(new Transaccion()) //la transaccion
    const transaccionReset = new Transaccion()
    const idTransaccion = ref()


    const accionTransaccion = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultarTransaccion(id: number) {
        // console.log('Pasó por aquí')
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) + id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()

        return response.data.modelo
    }

    async function cargarTransaccion(id: number) {
        const modelo = await consultarTransaccion(id)
        // console.log('modelo obtenido: ',modelo)
        transaccion.hydrate(modelo)
    }

    async function imprimirIngreso() {
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE+'/'+axios.getEndpoint(endpoints.transacciones_ingresos) + 'imprimir/' + idTransaccion.value
        const filename = 'ingreso_'+idTransaccion.value+Date.now()
        imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
        console.log('Ingreso impreso con éxito.')
        // const response: AxiosResponse = await axios.get(ruta, responseType:'blob')
    }
    async function imprimirEgreso() {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE+'/'+axios.getEndpoint(endpoints.transacciones_egresos)+'/imprimir/'+idTransaccion.value
      const filename = 'egreso_'+idTransaccion.value+Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
      console.log('Egreso impreso con éxito.')
    }
    async function showPreview() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) + '/show-preview/' + idTransaccion.value
        const response: AxiosResponse = await axios.get(ruta)
        transaccion.hydrate(response.data.modelo)
    }


    function resetearTransaccion() {
        transaccion.hydrate(transaccionReset)
    }

    return {
        // State
        transaccion,
        accionTransaccion,
        cargarTransaccion,
        resetearTransaccion,
        imprimirIngreso,
        imprimirEgreso,
        idTransaccion,
        showPreview,

    }
})
