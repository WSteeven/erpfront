import { AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { endpoints } from "config/api";
import { acciones } from "config/utils";
import { Pedido } from "pages/bodega/pedidos/domain/Pedido";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { reactive, ref } from "vue";

export const usePedidoStore = defineStore('pedido', ()=>{
    //State
    const pedido = reactive(new Pedido())
    const pedidoReset = new Pedido()
    const idPedido = ref()

    const {notificarError} = useNotificaciones()
    const accionPedido = acciones.nuevo
    const statusLoading = new StatusEssentialLoading()

    async function consultar(id:number) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.pedidos)+id
        const response: AxiosResponse = await axios.get(ruta)
        console.log('Respuesta obtenida en store de pedido: ', response)
        if(response.data.modelo.autorizacion===2){
            return response.data.modelo
        }
    }

    async function cargarPedido(id:number) {
        try{
            statusLoading.activar()
            const modelo = await consultar(id)
            pedido.hydrate(modelo)
        }catch(e){
            notificarError('Pedido no encontrado')
            pedido.hydrate(pedidoReset)
        }finally{
            statusLoading.desactivar()
        }
    }

    async function showPreview() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.pedidos)+'show-preview/'+idPedido.value
        const response: AxiosResponse = await axios.get(ruta)
        pedido.hydrate(response.data.modelo)
    }

    function resetearPedido(){
        pedido.hydrate(pedidoReset)
    }

    return { 
        pedido,
        accionPedido,
        cargarPedido,
        resetearPedido,
        idPedido,
        showPreview
    }

})