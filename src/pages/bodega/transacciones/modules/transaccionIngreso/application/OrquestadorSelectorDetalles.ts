import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
export function useOrquestadorSelectorItemsTransaccion(entidad:Transaccion, endpoint: keyof typeof endpoints) {
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
            console.log('item recibido en el seleccionar del orquestador: ', items)
            entidad.listadoProductosSeleccionados=[...entidad.listadoProductosSeleccionados, ...items]
            
            // items.forEach(item => {
            // });
        }
    }

    const selector = useSelector(singleSelector)
    const listar = () => selector.listar(criterioBusqueda.value)
    const limpiar = () => singleSelector.limpiar()
    
    const seleccionar = (entidades: DetalleProducto[]) => {
        let ids:any=[]
        ids = entidad.listadoProductosSeleccionados.map((entidad:DetalleProducto)=>entidad.id)
        // console.log(ids)
        const datos = entidades.filter((v)=> !ids.includes(v.id))
        // console.log('datos: ',datos)
        singleSelector.seleccionarMultiple(datos)
    }

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,

    }
}