import { endpoints } from "config/api";
import { OrdenCompra } from "../domain/OrdenCompra";
import { Ref, ref } from "vue";
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { DetalleProducto } from "pages/bodega/detalles_productos/domain/DetalleProducto";
import { useSelector } from "components/tables/application/selector";

export function useOrquestadorSelectorDetalles(entidad: OrdenCompra, endpoint: keyof typeof endpoints) {
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            entidad.id = null,
                criterioBusqueda.value = null
        },
        seleccionar: (items: DetalleProducto[]) => {
            entidad.listadoProductos = [...entidad.listadoProductos, ...items]
        }
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (items: DetalleProducto[]) => {
        let ids: any = []
        ids = entidad.listadoProductos.map((entidad: DetalleProducto) => entidad.id)
        items.forEach((item: any) => {
            item.facturable = true
            item.grava_iva = true
        })
        const datos = items.filter((v) => !ids.includes(v.id))

        singleSelector.seleccionar(datos)
    }

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,

    }
}