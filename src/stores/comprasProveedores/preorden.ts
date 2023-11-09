import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';
import { acciones, autorizacionesTransacciones, estadosTransacciones } from 'config/utils';
import { PreordenCompra } from 'pages/comprasProveedores/preordenCompra/domain/PreordenCompra';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { useNotificaciones } from 'shared/notificaciones';
import { reactive, ref } from 'vue';

export const usePreordenStore = defineStore('preorden', () => {
    //State
    const preorden = reactive(new PreordenCompra())
    const preordenReset = new PreordenCompra()
    const idPreorden = ref()
    const listadoItems = ref([])

    const { notificarAdvertencia, notificarError } = useNotificaciones()
    const accionPreorden = acciones.nuevo
    const statusLoading = new StatusEssentialLoading()

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/

    /**
     * La función 'consultar' recupera una vista previa de una orden de compra con una identificación
     * dada y devuelve el modelo si su autorizacion ha sido aprobada.
     * @param {number} id - El parámetro `id` es un número que representa el identificador de una
     * preorden de compra ya registrada en la base de datos.
     * @returns el  `modelo` obtenido del backend si el estado de autorizacion es aprobado.
     */
    async function consultar(id: number) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.preordenes_compras) + '/show-preview/' + id
        const response: AxiosResponse = await axios.get(ruta)
        if (response.data.modelo.autorizacion === autorizacionesTransacciones.aprobado)
            return response.data.modelo

    }

    /**
     * La función 'cargarPreorden' carga una preorden anticipada en función de su ID, muestra un estado de
     * carga, obtiene los datos de la preorden anticipada e hidrata el modelo de la preorden anticipada con los
     * datos obtenidos.
     * @param {number} id - El parámetro `id` es un número que representa el identificador de una preorden
     * anticipada.
     */
    async function cargarPreorden(id: number) {
        try {
            statusLoading.activar()
            const modelo = await consultar(id)
            console.log('El modelo es: ', modelo)
            if (modelo.estado === estadosTransacciones.completa) {
                notificarAdvertencia('La preorden ya ha sido generada en otra orden de compra')
                preorden.hydrate(preordenReset)
            }
            else
                preorden.hydrate(modelo)
        } catch (e) {
            notificarAdvertencia('Preorden no encontrada')
            preorden.hydrate(preordenReset)
        } finally {
            statusLoading.desactivar()
        }
    }

    async function anularPreorden(data: any) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.preordenes_compras) + '/anular/' + idPreorden.value
            const response: AxiosResponse = await axios.post(url, data)
            return response
        } catch (e: any) {
            notificarError(e)
        } finally {
            statusLoading.desactivar()
        }
    }

    async function consolidarPreordenes() {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.preordenes_compras_consolidadas)
            const response: AxiosResponse = await axios.get(url)
            listadoItems.value = response.data.results
        } catch (e: any) {
            notificarError(e)
        } finally {
            statusLoading.desactivar()
        }
    }

    return {
        preorden,
        accionPreorden,
        idPreorden,

        //funciones
        cargarPreorden,
        anularPreorden,
        consolidarPreordenes,
        listadoItems,
    }
})