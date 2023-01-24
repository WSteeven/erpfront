import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { Inventario } from "pages/bodega/inventario/domain/Inventario";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { acciones } from "config/utils";

export const useInventarioStore=defineStore('inventario', ()=>{
    //State
    const inventario = reactive(new Inventario())
    const inventarioReset = new Inventario()

    const accionInventario = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultarItem(id:number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.inventarios)+id
        const response:AxiosResponse=await axios.get(ruta)
        statusLoading.desactivar()

        return response.data.modelo
    }

    async function cargarItem(id:number) {
        const modelo=await consultarItem(id)
        inventario.hydrate(modelo)
    }
    //buscar por ciertos parametros
    async function buscarId(detalle_id:number, sucursal_id:number, cliente_id:number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        // await detalleProductoTransaccionStore.cargarDetalleEspecifico('?transaccion_id='+transaccionStore.transaccion.id+'&detalle_id='+detalleStore.detalle.id)
        // const ruta = 'api/inventarios/buscar/?detalle_id='+detalle_id+'&sucursal_id='+sucursal_id+'&cliente_id='+cliente_id
        const ruta = 'api/buscarDetalleInventario/?detalle_id='+detalle_id+'&sucursal_id='+sucursal_id+'&cliente_id='+cliente_id
        console.log('Ruta a consultar: ', ruta)
        const response:AxiosResponse=await axios.get(ruta)
        statusLoading.desactivar()
        console.log('datos obtenidos:', response.data.results)
        return response.data.results
    }
    /**
     *
     * @param data array de datos compuesto por el listado de detalle_id, el cliente_id y la sucursal_id
     * @returns listado de elementos encontrados en el inventario que coinciden con el listado de detalle_id
     */
    async function buscarTodos(data:any) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = 'api/buscarDetallesEnInventario'
        const response: AxiosResponse = await axios.post(ruta, data)
        statusLoading.desactivar()
        // console.log(response)
        return {
            results :response.data.results,
        }
    }
    async function cargarCoincidencias(data:any) {
        return await buscarTodos(data)
    }

    /**
     *
     * @param detalle_id detalle_id, identificador de detalle para buscar todas las coincidencias
     * @param sucursal_id sucursal_id, sucursal especifica seleccionada en la transaccion
     * @param cliente_id cliente_id, cliente especifico seleccionado en la transaccion
     * @returns Listado de coincidencias encontradas en el inventario
     */
    async function cargarElementosId(detalle_id:number, sucursal_id:number, cliente_id:number) {
        const results = await buscarId(detalle_id, sucursal_id, cliente_id)
        // console.log('Funcion cargar elemento: ', results)
        return results
    }

    function resetearInventario(){
        inventario.hydrate(inventarioReset)
    }

    return {
        //state
        inventario,
        accionInventario,
        cargarItem,
        resetearInventario,
        cargarElementosId,
        cargarCoincidencias,
    }
})
