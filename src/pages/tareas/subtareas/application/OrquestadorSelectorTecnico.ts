// Dependencias
import { endpoints } from "config/api"
import { Ref, ref } from "vue"

// Logica y controladores
import { DetalleProducto } from "pages/bodega/detalles_productos/domain/DetalleProducto"
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"
import { useSelector } from "components/tables/application/selector"
import { Subtarea } from "../domain/Subtarea"
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado"

export function useOrquestadorSelectorTecnicos(entidad: Subtarea, endpoint: keyof typeof endpoints) {
    const refListadoSeleccionable = ref()
    const listado: Ref<EntidadAuditable[]> = ref([])
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            // entidad.producto = null
            criterioBusqueda.value = null
        },
        seleccionar: (empleado: Empleado) => {
            criterioBusqueda.value = empleado.nombres ?? ' ' + empleado.apellidos ?? ''
            entidad.tecnicos_temporales = [...entidad.tecnicos_temporales, empleado]
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