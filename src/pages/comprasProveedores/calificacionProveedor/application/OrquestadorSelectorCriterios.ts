import { useSelector } from "components/tables/application/selector";
import { endpoints } from "config/api";
import { CriterioCalificacion } from "pages/comprasProveedores/criteriosCalificaciones/domain/CriterioCalificacion";
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { Ref, ref } from "vue";
import { CalificacionProveedor } from "../domain/CalificacionProveedor";

export function useOrquestadorSelectorCriterios(entidad: CalificacionProveedor, endpoint: keyof typeof endpoints){
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
        seleccionar: (items: CriterioCalificacion[]) => {
            entidad.listadoCriterios = [...entidad.listadoCriterios, ...items]
        }
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (items: CriterioCalificacion[]) => {
        let ids: any = []
        ids = entidad.listadoCriterios.map((entidad: CriterioCalificacion) => entidad.id)
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