import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { useSelector } from "components/tables/application/selector";
import { Producto } from "pages/bodega/productos/domain/Producto";
import { endpoints } from "config/api";
import {Ref, ref} from 'vue'
import { Transaccion } from "../domain/Transaccion";

export function useOrquestadorSelectorProductos(entidad: Transaccion, endpoint: keyof typeof endpoints){
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: ()=>{
            entidad.producto = null,
            criterioBusqueda.value =null
        },
        seleccionar: (producto: Producto)=>{
            entidad.producto = producto.nombre,
            criterioBusqueda.value=producto.nombre
            entidad.listadoProductosSeleccionados = [...entidad.listadoProductosSeleccionados, producto]
            limpiar()
        },
    }

    const selector = useSelector(singleSelector)
    const listar = ()=>selector.listar(criterioBusqueda.value)
    const limpiar= ()=>singleSelector.limpiar()
    const seleccionar = (id:number)=>selector.seleccionar(id)

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,
    }
}

