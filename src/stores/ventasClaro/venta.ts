import { AxiosError, AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { endpoints } from "config/api";
import { Venta } from "pages/ventas-claro/ventas/domain/Venta";
import { defineStore } from "pinia";
import { ApiError } from "shared/error/domain/ApiError";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { isAxiosError, notificarErrores, notificarMensajesError } from "shared/utils";
import { reactive, ref } from "vue";

export const useVentaStore = defineStore('venta', () => {
    const venta = reactive(new Venta())
    const ventaReset = new Venta()
    const filaVenta = reactive(new Venta())
    const fechaActualizacion = ref()
    const posicionFilaVenta = ref()

    const idVenta = ref()
    const permitirSubir = ref(true)

    const { notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    async function obtenerComision(idProducto: number, forma_pago: string, idVendedor: number) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.obtener_comision) + '/' + idProducto + '/' + forma_pago + '/' + idVendedor
        const response: AxiosResponse = await axios.get(ruta)
        return response.data.comision_value
    }

    async function suspenderVenta(data?) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.ventas) + '/suspender/' + idVenta.value
        const response: AxiosResponse = await axios.post(ruta, data)
        return {
            response,
            result: response.data.modelo
        }
    }
    async function marcarPrimerMesPagado() {
        try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.ventas) + '/marcar-pagado/' + idVenta.value
            const response: AxiosResponse = await axios.post(ruta)
            if (response.status === 200) notificarCorrecto('Primer mes pagado correctamente')
            return {
                response,
                result: response.data.modelo
            }
        } catch (err) {
            await notificarErrores(err)
        }
        finally {
            cargando.desactivar()
        }
    }
    async function actualizarCalculoComisiones() {
        try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.actualizar_comisiones_ventas)
            // const response: AxiosResponse = await axios.get(ruta)
            const response: AxiosResponse = await axios.get(ruta, { params: { fecha: fechaActualizacion.value } })
            notificarCorrecto(response.data.mensaje)
            // return {
            //     response,
            //     result: response.data.modelo
            // }
        } catch (err) {
            await notificarErrores(err)
            // const axiosError = err as AxiosError
            // const error = new ApiError(axiosError)
            // if (isAxiosError(error)) {
            //     const mensajes: string[] = error.erroresValidacion
            //     await notificarMensajesError(mensajes, useNotificaciones())
            // } else {
            //     console.log(axiosError)
            // }
        } finally {
            cargando.desactivar()
        }
    }



    return {
        filaVenta,
        posicionFilaVenta,
        venta, idVenta,
        permitirSubir,
        fechaActualizacion,

        obtenerComision,
        suspenderVenta,
        marcarPrimerMesPagado,
        actualizarCalculoComisiones
    }
})