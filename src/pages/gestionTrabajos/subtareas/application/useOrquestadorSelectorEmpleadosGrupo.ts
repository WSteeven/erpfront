import { useSelector } from "components/tables/application/selector"
import { endpoints } from "config/api"
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado"
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"
import { Ref, ref } from "vue"

export function useOrquestadorSelectorEmpleadosGrupo(empleados: Ref<Empleado[]>, endpoint: keyof typeof endpoints) {
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
    seleccionarMultiple: (items: Empleado[]) => {
      empleados.value = [...empleados.value, ...items]
    }
  }

  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (entidades: Empleado[]) => {
    const ids: number[] = empleados.value.map((entidad: Empleado) => entidad.id ?? -1)
    const datos = entidades.filter((v) => {
      if (v.id) return !ids.includes(v.id)
    })

    singleSelector.seleccionarMultiple(datos)
  }

  return {
    refListadoSeleccionable,
    listado,
    listar, limpiar, seleccionar,
    criterioBusqueda,
  }
}
