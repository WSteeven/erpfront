import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { useSelector } from "components/tables/application/selector";
import { Piso } from "pages/administracion/pisos/domain/Piso";
import { Ubicacion } from "../domain/Ubicacion";
import { endpoints } from "config/api";
import { Ref, ref } from "vue";

export function useOrquestadorSelectorPisos(
    entidad: Ubicacion,
    endpoint: keyof typeof endpoints 
){
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]>=ref([])
    const criterioBusqueda = ref()

    const singleSelector={
        refListadoSeleccionable:refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar:()=>{
            entidad.piso=null
            criterioBusqueda.value=null
        },
        seleccionar: (piso: Piso)=>{
            entidad.piso = piso.id
            criterioBusqueda.value=piso.fila
        },
    }

    const selector = useSelector(singleSelector)
    const listar=()=>selector.listar(criterioBusqueda.value)
    const limpiar=()=>singleSelector.limpiar()
    const seleccionar=(id:number)=>selector.seleccionar(id)

    return {
        refListadoSeleccionable,
        listado,
        listar,
        limpiar,
        seleccionar,
        criterioBusqueda
    }
}