import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Zona } from '../domain/Zona'
import { Ref, ref } from 'vue'

export function useOrquestadorSelectorEmpleadosZona(
  entidad: Zona,
  endpoint: keyof typeof endpoints,
) {
  const refListadoSeleccionable = ref()
  const listado: Ref<EntidadAuditable[]> = ref([])
  const criterioBusqueda = ref()

  const singleSelector = {
    refListadoSeleccionable: refListadoSeleccionable,
    listadoSeleccionable: listado,
    endpoint: endpoint,
    limpiar: () => criterioBusqueda.value = null,
    seleccionar: (items: Empleado[]) => entidad.empleados_asignados = [...entidad.empleados_asignados, ...items],
  }

  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()
  const seleccionar = (items: Empleado[]) => {
    let ids: any = []
    ids = entidad.empleados_asignados.map((entidad: Empleado) => entidad.id)
    const datos = items.filter((v) => !ids.includes(v.id))
    singleSelector.seleccionar(datos)
  }

  return {
    refListadoSeleccionable,
    listado,
    listar,
    limpiar,
    seleccionar,
    criterioBusqueda,
    existenCoincidencias: selector.existenCoincidencias,
  }
}
