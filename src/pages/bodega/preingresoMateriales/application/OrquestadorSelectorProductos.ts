import { endpoints } from "config/api";
import { Ref, ref } from "vue";
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { useSelector } from "components/tables/application/selector";
import { Producto } from "pages/bodega/productos/domain/Producto";
import { encontrarUltimoIdListado } from "shared/utils";
import { PreingresoMaterial } from "../domain/PreingresoMaterial";

export function useOrquestadorSelectorProductos(entidad: PreingresoMaterial, endpoint: keyof typeof endpoints) {
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
        seleccionar: (items: Producto[]) => {
            entidad.listadoProductos = [...entidad.listadoProductos, ...items]
            entidad.listadoProductos.forEach((v) => {
                v.id = encontrarUltimoIdListado(entidad.listadoProductos) + 1
            })
        }
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (items: Producto[]) => {
        console.log(items)
        let ids: any = []
        ids = entidad.listadoProductos.map((entidad: Producto) => entidad.id)
        items.forEach((item: any) => {
            item.cantidad = 1
            item.producto = item.producto
            item.descripcion = item.descripcion
            item.condicion = 'NUEVO'
            item.serial = ''
            item.punta_inicial = ''
            item.punta_final = ''
        })

        singleSelector.seleccionar(items)
    }

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,

    }
}