import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { Cliente } from 'pages/sistema/clientes/domain/Cliente'
import { TipoTarea } from '../domain/TipoTrabajo'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

export function useOrquestadorSelectorClientes(
  entidad: TipoTarea,
  endpoint: keyof typeof endpoints
) {
  const refListadoSeleccionable = ref() // referencia para llamar a los metodos del listado
  const listado: Ref<EntidadAuditable[]> = ref([]) // listado con resultados de búsqueda
  const criterioBusqueda = ref()

  const singleSelector = {
    refListadoSeleccionable: refListadoSeleccionable,
    listadoSeleccionable: listado,
    endpoint: endpoint,
    limpiar: () => {
      entidad.cliente = null
      criterioBusqueda.value = null
    },
    seleccionar: (cliente: Cliente) => {
      entidad.cliente = cliente.id
      criterioBusqueda.value = cliente.razon_social
    },
  }

  const selector = useSelector(singleSelector)

  const listar = () => selector.listar(criterioBusqueda.value)

  const limpiar = () => singleSelector.limpiar()

  const seleccionar = (id: number) => selector.seleccionar(id)

  return {
    refListadoSeleccionable,
    listado,
    listar,
    limpiar,
    seleccionar,
    criterioBusqueda,
  }
}
