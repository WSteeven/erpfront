import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { acciones } from 'config/utils'
import { endpoints } from 'config/api'
import { MaterialOcupado } from 'pages/gestionTrabajos/formulariosTrabajos/tendidos/controlTendidos/modules/registrosTendidos/domain/MaterialOcupado'
import { MaterialEmpleadoTarea } from 'pages/gestionTrabajos/miBodega/domain/MaterialEmpleadoTarea'
import {defineStore} from 'pinia'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import {reactive, ref} from 'vue'


export const useListadoMaterialesDevolucionStore = defineStore('listadoMaterialesDevolucion', ()=>{
   
    //listados
    const listadoMaterialTarea = ref([])
    const listadoMaterialStock = ref([])
    const listadoMateriales = ref([])
    const tareaId = ref()
    const devolverAlStock = ref(false)

   

    return {
        listadoMateriales,
        tareaId,
        devolverAlStock,

    }
})
