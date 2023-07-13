import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
export function useOrquestadorSelectorItemsTransaccion(entidad: Transaccion, endpoint: keyof typeof endpoints) {
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
        seleccionarMultiple: (items: DetalleProducto[]) => {
            entidad.listadoProductosTransaccion = [...entidad.listadoProductosTransaccion, ...items]
        }
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (entidades: DetalleProducto[]) => {
        console.log(entidades)
        console.log(entidad.listadoProductosTransaccion)
        let ids: any = []
        ids = entidad.listadoProductosTransaccion.map((entidad) => { entidad.condiciones ?? entidad.id })
        const datos = entidades.filter((v) => !ids.includes(v.id))
        // datos.map((v) =>v.cantidad=null)
        singleSelector.seleccionarMultiple(datos)
    }

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,

    }
}
