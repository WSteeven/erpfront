// Dependencias
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

// Logica y controladores
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'

export function useOrquestadorSelectorTecnicos(tecnicosOtrosGrupos: Ref<Empleado[]>, endpoint: keyof typeof endpoints) {
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
      tecnicosOtrosGrupos.value = [...tecnicosOtrosGrupos.value, ...items]
    }
  }

  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (entidades: Empleado[]) => {
    console.log(entidades)
    let ids: any = []
    ids = tecnicosOtrosGrupos.value.map((entidad: Empleado) => entidad.id)
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
