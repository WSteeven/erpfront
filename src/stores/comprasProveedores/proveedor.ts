import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { Proveedor } from "sistema/proveedores/domain/Proveedor";
import { reactive, ref } from "vue";

export const useProveedorStore = defineStore('proveedor', ()=>{
    //State
    const proveedor = reactive(new Proveedor())
    const proveedorReset = new Proveedor()
    const idProveedor = ref()
    const idDepartamento = ref()
    const idTipoOferta = ref()

    const statusLoading = new StatusEssentialLoading()

    async function consultar(id:number){
        const axios = AxiosHttpRepository.getInstance()
        // const ruta
    }

    return {
        proveedor,
        proveedorReset,
        idProveedor,
        idDepartamento,
        idTipoOferta,
    }
})