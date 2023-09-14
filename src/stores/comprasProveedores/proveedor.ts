import { AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { apiConfig, endpoints } from "config/api";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { Proveedor } from "sistema/proveedores/domain/Proveedor";
import { reactive, ref } from "vue";

export const useProveedorStore = defineStore('proveedor', () => {
    //State
    const proveedor = reactive(new Proveedor())
    const proveedorReset = new Proveedor()
    const idProveedor = ref()
    const idDepartamento = ref()
    const idDetalleDepartamento = ref()
    const idTipoOferta = ref()

    const statusLoading = new StatusEssentialLoading()
    const { notificarError } = useNotificaciones()

    async function consultar(id: number) {
        const axios = AxiosHttpRepository.getInstance()
        // const ruta
    }

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

    return {
        proveedor,
        proveedorReset,
        idProveedor,
        idDepartamento,
        idTipoOferta,
        idDetalleDepartamento,

        anularProveedor,
    }
})