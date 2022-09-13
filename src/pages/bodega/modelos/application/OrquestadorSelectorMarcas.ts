import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { useSelector } from "components/tables/application/selector";
import { Marca } from "pages/bodega/marcas/domain/Marca";
import { Modelo } from "../domain/Modelo";
import { endpoints } from "config/api";
import { Ref, ref } from "vue";

export function useOrquestadorSelectorMarcas(
    entidad: Modelo,
    endpoint: keyof typeof endpoints
){
    const refListadoSeleccionable = ref() //referencia para llamar a los metodos del listado
    const listado: Ref<EntidadAuditable[]>=ref([]) //listado con resultados de busqueda
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar:()=>{
            entidad.marca=null
            criterioBusqueda.value=null
        },
        seleccionar: (marca:Marca)=>{
            entidad.marca = marca.id
            criterioBusqueda.value=marca.nombre
        },
    }

    const selector = useSelector(singleSelector)
    const listar = ()=>selector.listar(criterioBusqueda.value)
    const limpiar = ()=>singleSelector.limpiar()
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