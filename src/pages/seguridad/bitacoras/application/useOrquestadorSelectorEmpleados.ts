import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { Bitacora } from '../doman/Bitacora'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Visitante } from '../visitantes/domain/Visitante'

export function useOrquestadorSelectorEmpleados(
  entidad: Bitacora | Visitante,
  endpoint: keyof typeof endpoints,
  clave: keyof Bitacora | keyof Visitante
) {
  const refListadoSeleccionable = ref()
  const listado: Ref<EntidadAuditable[]> = ref([])
  const criterioBusqueda = ref()

  const singleSelector = {
    refListadoSeleccionable: refListadoSeleccionable,
    listadoSeleccionable: listado,
    endpoint: endpoint,
    limpiar: () => criterioBusqueda.value = null,
    seleccionar: (items: Empleado[]) => {
      // Forzamos la asignación con una conversión de tipo segura
      (entidad as Record<string, any>)[clave] = items[0].id
      criterioBusqueda.value = items[0].apellidos + ' ' + items[0].nombres
    },
  }

  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()
  const seleccionar = (items: Empleado[]) => singleSelector.seleccionar(items)

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
