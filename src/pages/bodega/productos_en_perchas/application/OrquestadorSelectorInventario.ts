import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { useSelector } from "components/tables/application/selector";
import { Inventario } from "pages/bodega/inventario/domain/Inventario";
import { endpoints } from "config/api";
import { Ref, ref } from "vue";
import { ProductoEnPercha } from "../domain/ProductoEnPercha";

export function useOrquestadorSelectorInventario(entidad: ProductoEnPercha, endpoint: keyof typeof endpoints) {
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            entidad.inventario = null
            criterioBusqueda.value = null
        },
        seleccionar: (inventario: Inventario) => {
            entidad.inventario = inventario.id
            criterioBusqueda.value = inventario.producto
            console.log(criterioBusqueda.value)
        },
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()
    const seleccionar = (id: number) => selector.seleccionar(id)

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,
    }
}