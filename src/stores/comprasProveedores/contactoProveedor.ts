import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { endpoints } from 'config/api';
import { ContactoProveedor } from 'pages/comprasProveedores/contactosProveedor/domain/ContactoProveedor';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { reactive, ref } from 'vue';

export const useContactoProveedorStore = defineStore('contacto', () => {
    //State
    const contactoProveedor = reactive(new ContactoProveedor());
    const idcontacto = ref()
    const statusLoading = new StatusEssentialLoading()

    async function consultarAuditoria(id: number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        let ruta
        if (id === null || id === undefined) {
            ruta = axios.getEndpoint(endpoints.log_contactos_proveedores)
        } else {
            ruta = axios.getEndpoint(endpoints.log_contactos_proveedores) + '?id=' + id
        }
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()
        return response.data.results
    }

    return {
        //State
        contactoProveedor,
        idcontacto,
        consultarAuditoria,
    }
})