import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { endpoints } from 'config/api'
import { acciones } from 'config/utils'
import { Transferencia } from 'pages/bodega/transferencia/domain/Transferencia'
import { defineStore } from 'pinia'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { reactive, ref } from 'vue'


export const useTransferenciaStore = defineStore('transferencia', () => {
    //State
    const transferencia = reactive(new Transferencia())
    const transferenciaReset = new Transferencia()
    const idTransferencia = ref()

    const { notificarAdvertencia } = useNotificaciones()
    const accionTransferencia = acciones.nuevo
    const statusLoading = new StatusEssentialLoading()

    async function consultar(id: number) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transferencias) +'/'+ id
        const response: AxiosResponse = await axios.get(ruta)
        console.log('Respuesta obtenida en el store de transferencia:', response)
        if (response.data.modelo.autorizacion === 2) {
            return response.data.modelo
        }
    }

    async function cargarTransferencia(id: number) {
      transferencia.hydrate(transferenciaReset)
        try {
            statusLoading.activar()
            const modelo = await consultar(id)
          console.log(modelo)
            if (modelo.recibida) {
              notificarAdvertencia('La transferencia ya ha sido ingresada y completada')
              transferencia.hydrate(transferenciaReset)
            }else if(modelo.estado=='ANULADO') {
              notificarAdvertencia('No puedes cargar esta transferencia, puesto que está anulada.')
            }else{
                transferencia.hydrate(modelo)
            }
        } catch (e) {
            notificarAdvertencia('Transferencia no encontrada o no aprobada')
            // transferencia.hydrate(transferenciaReset)
        } finally {
            statusLoading.desactivar()
        }
    }

    async function showPreview() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transferencias) + '/show-preview/' + idTransferencia.value
        const response: AxiosResponse = await axios.get(ruta)
        transferencia.hydrate(response.data.modelo)
    }

    function resetearTransferencia() {
        transferencia.hydrate(transferenciaReset)
    }

    return {
        transferencia,
        accionTransferencia,
        cargarTransferencia,
        resetearTransferencia,
        idTransferencia,
        showPreview
    }
})
