// Dependencias
import { endpoints } from "config/api"
import { Ref, ref } from "vue"

// Logica y controladores
import { DetalleProducto } from "pages/bodega/detalles_productos/domain/DetalleProducto"
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"
import { useSelector } from "components/tables/application/selector"
import { RegistroTendido } from "../domain/RegistrosTendido"

export function useOrquestadorSelectorDetalles(entidad: RegistroTendido, endpoint: keyof typeof endpoints) {
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            // entidad.producto = null
            criterioBusqueda.value = null
        },
        seleccionar: (detalle: DetalleProducto) => {
            // entidad.producto = detalle.descripcion
            criterioBusqueda.value = detalle.descripcion
            entidad.listadoProductosSeleccionados = [...entidad.listadoProductosSeleccionados, detalle]
            limpiar()
        },
    }

    const selector = useSelector(singleSelector)
    const listar = () => selector.listar(criterioBusqueda.value)
    const limpiar = () => singleSelector.limpiar()
    const seleccionar = (id: number) => selector.seleccionar(id)

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,
    }
}