// Dependencias
import { endpoints } from "config/api"
import { Ref, ref } from "vue"

// Logica y controladores
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado"
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"
import { useSelector } from "components/tables/application/selector"
import { Subtarea } from "../domain/Subtarea"

export function useOrquestadorSelectorTecnicos(entidad: Subtarea, endpoint: keyof typeof endpoints) {
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            criterioBusqueda.value = null
        },
        /* seleccionar: (empleado: Empleado) => {
            criterioBusqueda.value = null//empleado.nombres ?? ' ' + empleado.apellidos ?? ''
            entidad.tecnicos_temporales = [...entidad.tecnicos_temporales, empleado]
            limpiar()
        }, */
        seleccionarMultiple: (items: Empleado[]) => {
            entidad.tecnicos_temporales = [...entidad.tecnicos_temporales, ...items]
        }
    }

    const selector = useSelector(singleSelector)
    const listar = () => selector.listar(criterioBusqueda.value)
    const limpiar = () => singleSelector.limpiar()
    // const seleccionar = (id: number) => selector.seleccionar(id)

    const seleccionar = (entidades: Empleado[]) => {
        console.log(entidades)
        let ids: any = []
        ids = entidad.tecnicos_temporales.map((entidad: Empleado) => entidad.id)
        const datos = entidades.filter((v) => !ids.includes(v.id))
        singleSelector.seleccionarMultiple(datos)
    }

    return {
        refListadoSeleccionable,
        listado,
        listar, limpiar, seleccionar,
        criterioBusqueda,
    }
}