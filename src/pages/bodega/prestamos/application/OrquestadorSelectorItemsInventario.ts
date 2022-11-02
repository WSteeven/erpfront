import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { Inventario } from 'pages/bodega/inventario/domain/Inventario'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { Prestamo } from '../domain/Prestamo'

export function useOrquestadorSelectorItemsInventario(entidad: Prestamo, endpoint: keyof typeof endpoints) {
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
        seleccionar: (item: Inventario) => {
            entidad.producto = item.detalle_id
                criterioBusqueda.value = item.detalle_id
            entidad.listadoProductos = [...entidad.listadoProductos, item]
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