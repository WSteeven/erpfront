// Dependencias
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

// Logica y controladores
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { Subtarea } from '../domain/Trabajo'
import { EmpleadoSeleccionado } from '../domain/EmpleadoSeleccionado'

export function useOrquestadorSelectorTecnicos(subtarea: Subtarea, endpoint: keyof typeof endpoints) {
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
    seleccionarMultiple: (items: EmpleadoSeleccionado[]) => {
      subtarea.empleados_seleccionados = [...subtarea.empleados_seleccionados, ...items]
      // console.log('Seleccionado 48564')
      //console.log(tecnicosOtrosGrupos)
    }
  }

  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (entidades: EmpleadoSeleccionado[]) => {
    const ids: number[] = subtarea.empleados_seleccionados.map((entidad: Empleado) => entidad.id ?? -1)
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
