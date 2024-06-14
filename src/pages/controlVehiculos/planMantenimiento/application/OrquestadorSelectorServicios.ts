import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { PlanMantenimiento } from '../domain/PlanMantenimiento'
import { Servicio } from 'pages/controlVehiculos/servicios/domain/Servicio'

export function useOrquestadorSelectorServicios(entidad: PlanMantenimiento, endpoint: keyof typeof endpoints) {
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()
    const store = useAuthenticationStore()
    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            entidad.id = null,
                criterioBusqueda.value = null
        },
        seleccionar: (items: Servicio[]) => {
            entidad.listadoServicios = [...entidad.listadoServicios, ...items]
        }
    }

    const selector = useSelector(singleSelector)
    const listar = (params) => selector.listar(criterioBusqueda.value, params)
    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (items: Servicio[]) => {
        let ids: any = []
        ids = entidad.listadoServicios.map((entidad: Servicio) => entidad.id)
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
