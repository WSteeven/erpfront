import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { useNotificaciones } from 'shared/notificaciones';
import { imprimirArchivo } from 'shared/utils';
import { Proveedor } from 'sistema/proveedores/domain/Proveedor';
import { reactive, ref } from 'vue';

export const useProveedorStore = defineStore('proveedor', () => {
    //State
    const proveedor = reactive(new Proveedor())
    const proveedorReset = new Proveedor()
    const idProveedor = ref()
    const idDepartamento = ref()
    const idDetalleDepartamento = ref()
    const idTipoOferta = ref()

    const statusLoading = new StatusEssentialLoading()
    const { notificarError, notificarAdvertencia } = useNotificaciones()

    // async function consultar(id: number) {
    //     const axios = AxiosHttpRepository.getInstance()
    //     // const ruta
    // }

    async function anularProveedor(data: any) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.proveedores) + '/anular/' + idProveedor.value
            const response: AxiosResponse = await axios.post(url, data)
            return response
        } catch (error: any) {
            notificarError(error)
        } finally {
            statusLoading.desactivar()
        }
    }

    async function showPreview() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.proveedores) + '/show-preview/' + idProveedor.value
        const response: AxiosResponse = await axios.get(ruta)
        proveedor.hydrate(response.data.modelo)
    }
    async function buscarReporte(accion: string, data, listado) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            // let url = axios.getEndpoint(endpoints.proveedores) + '/reportes'
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.proveedores) + '/reportes'
            const filename = 'reporte_proveedores'
            switch (accion) {
                case 'excel':
                    data.accion = 'excel'
                    imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, data)
                    return listado
                    break
                case 'pdf':
                    data.accion = 'pdf'
                    imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, data)
                    return listado
                    break
                default:
                    data.accion = ''
                    const response: AxiosResponse = await axios.post(url, data)
                    // console.log(response)
                    if (response.data.results) {
                        if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
                        return response.data.results
                    } else return listado
            }
        } catch (error) {
            console.log(error)
            notificarError('Error al obtener el reporte')
        } finally {
            statusLoading.desactivar()
        }
    }

    async function imprimirReporteCalificacion() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.proveedores) + '/imprimir-calificacion/' + idProveedor.value
        const filename = 'calificacion_proveedor_' + idProveedor.value
        imprimirArchivo(ruta, 'GET', 'blob', 'xlsx', filename)
    }

    return {
        proveedor,
        proveedorReset,
        idProveedor,
        idDepartamento,
        idTipoOferta,
        idDetalleDepartamento,

        anularProveedor,
        showPreview,
        buscarReporte,
        imprimirReporteCalificacion,
    }
})