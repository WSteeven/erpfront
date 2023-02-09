import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { Inventario } from 'pages/bodega/inventario/domain/Inventario'

export function useOrquestadorSelectorItemsEgreso(entidad: Transaccion, endpoint: keyof typeof endpoints) {
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
    seleccionar: (items: Inventario[]) => {
      entidad.listadoProductosTransaccion = [...entidad.listadoProductosTransaccion, ...items]
    }

  }
  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (items: Inventario[]) => {
    console.log(items)
    let ids: any = []
    ids = entidad.listadoProductosTransaccion.map((entidad: Inventario) => entidad.id)
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
