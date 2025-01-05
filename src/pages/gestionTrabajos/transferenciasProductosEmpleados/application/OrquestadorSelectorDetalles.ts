import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { TransferenciaProductoEmpleado } from '../domain/TransferenciaProductoEmpleado'

export function useOrquestadorSelectorDetalles(entidad: TransferenciaProductoEmpleado|any, endpoint: keyof typeof endpoints) {
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
            entidad.listado_productos = [...entidad.listado_productos, ...items]
        }
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (items: DetalleProducto[]) => {
        let ids: any = []
        ids = entidad.listado_productos.map((entidad: DetalleProducto) => entidad.id)
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