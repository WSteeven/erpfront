import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { DetalleProductoTransaccion } from 'pages/bodega/transacciones/modules/detalle_producto_transaccion/domain/DetalleProductoTransaccion';
import { endpoints } from 'config/api';
import { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { acciones } from 'config/utils';
import { useNotificaciones } from 'shared/notificaciones';
import { isAxiosError, notificarMensajesError } from 'shared/utils';

export const useDetalleTransaccionStore = defineStore('detalle_transaccion', () => {
    //State
    const detalle = reactive(new DetalleProductoTransaccion())

    const accionDetalle = acciones.nuevo
    const detalleReset = new DetalleProductoTransaccion()
    const posicion = ref()
    const statusLoading = new StatusEssentialLoading()

    const notificaciones = useNotificaciones()

    async function consultarDetalle(id: number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.detalle_producto_transaccion) + id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()
        return response.data.modelo
    }
    async function consultarIndex(params: any) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.detalle_producto_transaccion) + params
        console.log('ruta a consultar: ', ruta)
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()
        return response.data.results[0]
    }
    async function editarDetalle(id: number, data: any) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.detalle_producto_transaccion) + id
            const response: AxiosResponse = await axios.put(ruta, data)
            statusLoading.desactivar()
            return response.data.modelo
        } catch (e: any) {
            if (isAxiosError(e)) {
                console.log('AXIOS ERROR!!!')
                const mensajes: string[] = e.erroresValidacion
                notificarMensajesError(mensajes, notificaciones.notificarError('[ERROR]' + e))
            }
            notificaciones.notificarError('Ha ocurrido un error, revisa la consola')
        } finally {
            statusLoading.desactivar()
        }
    }


    async function cargarDetalle(id: number) {
        const modelo = await consultarDetalle(id)
        detalle.hydrate(modelo)
    }
    async function cargarDetalleEspecifico(params: any) {
        const modelo = await consultarIndex(params)
        console.log('datos recibidos en cargar detalle especifico:', modelo)
        detalle.hydrate(modelo)
    }
    async function actualizarDetalle(id: number, data: any) {
        console.log('pasó por actualizar')
        const modelo = await editarDetalle(id, data)
        if (modelo) {
            console.log('si se actualizó', modelo)
            detalle.hydrate(modelo)
        }

    }
    function resetearDetalle() {
        detalle.hydrate(detalleReset)
    }

    return {
        detalle,
        cargarDetalleEspecifico,
        cargarDetalle,
        actualizarDetalle,
        resetearDetalle,
        accionDetalle,
        posicion,
    }





})