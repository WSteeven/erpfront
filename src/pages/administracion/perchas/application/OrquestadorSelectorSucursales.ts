import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { useSelector } from "components/tables/application/selector";
import { Sucursal } from "pages/administracion/sucursales/domain/Sucursal";
import { Percha } from "../domain/Percha";
import { endpoints } from "config/api";
import { Ref, ref } from "vue";

export function useOrquestadorSelectorSucursales(
    entidad: Percha,
    endpoint: keyof typeof endpoints
){
    const refListadoSeleccionable = ref()// referencia para llamar a los metodos del listado
    const listado: Ref<EntidadAuditable[]>=ref([]) //listado con resultados de busqueda
    const criterioBusqueda = ref()

    const singleSelector={
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: ()=>{
            entidad.sucursal = null
            criterioBusqueda.value = null
        },
        seleccionar: (sucursal: Sucursal)=>{
            entidad.sucursal = sucursal.id
            criterioBusqueda.value = sucursal.lugar
        },
    }    

    const selector = useSelector(singleSelector)
    const listar = ()=>selector.listar(criterioBusqueda.value)
    const limpiar = ()=>singleSelector.limpiar()
    const seleccionar = (id:number)=>selector.seleccionar(id)

    return {
        refListadoSeleccionable,
        listado,
        listar,
        limpiar,
        seleccionar,
        criterioBusqueda
    }
}