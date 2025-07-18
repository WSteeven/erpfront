import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { PrendaZona } from '../domain/PrendaZona'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

export function useOrquestadorSelectorDetalles(entidad: PrendaZona, endpoint: keyof typeof endpoints) {
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()
    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            entidad.id = null
            criterioBusqueda.value = null
        },
        seleccionar: (items: DetalleProducto[]) => {
            entidad.detalles_productos = [...entidad.detalles_productos, ...items]
        }
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (items: DetalleProducto[]) => {
        let ids: any = []
        ids = entidad.detalles_productos.map((entidad: DetalleProducto) => entidad.id)
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
