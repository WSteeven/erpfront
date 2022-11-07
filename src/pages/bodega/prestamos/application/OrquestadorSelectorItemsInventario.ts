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
        /* seleccionar: (item: Inventario) => {
            console.log('item recibido en el seleccionar del orquestador: ', item)
            entidad.producto = item.detalle_id
            criterioBusqueda.value = item.detalle_id
            entidad.listadoProductos = [...entidad.listadoProductos, item]
            limpiar()
        }, */
        seleccionarMultiple: (items: Inventario[]) => {
            console.log('item recibido en el seleccionar del orquestador: ', items)
            entidad.listadoProductos=[...entidad.listadoProductos, ...items]
            
            // items.forEach(item => {
            // });
        }
    }

    const selector = useSelector(singleSelector)
    const listar = () => selector.listar(criterioBusqueda.value)
    const limpiar = () => singleSelector.limpiar()
    
    const seleccionar = (entidades: Inventario[]) => {
        // console.log('seleccionar del selector, recibe un id cuando pudiera recibir todo el objeto... ', entidades)
        // singleSelector.seleccionar(id)
        let ids:any=[]
        ids = entidad.listadoProductos.map((entidad:Inventario)=>entidad.id)
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