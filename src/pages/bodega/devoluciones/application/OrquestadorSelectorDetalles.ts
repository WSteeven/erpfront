import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { useSelector } from "components/tables/application/selector";
import { endpoints } from "config/api";
import { Ref, ref } from "vue";
import { Devolucion } from "../domain/Devolucion";
import { DetalleProducto } from "pages/bodega/detalles_productos/domain/DetalleProducto";

export function useOrquestadorSelectorDetalles(entidad: Devolucion, endpoint: keyof typeof endpoints) {
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
    const listar = () => selector.listar(criterioBusqueda.value)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (items: DetalleProducto[]) => {
        let ids: any = []
        ids = entidad.listadoProductos.map((entidad: DetalleProducto) => entidad.id)
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