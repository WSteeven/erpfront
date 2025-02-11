import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { CuentaBancaria } from '../domain/CuentaBancaria'
import { GeneradorCash } from '../domain/GeneradorCash'
import { ParamsType } from 'config/types'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

export function useOrquestadorSelectorCuentasBancariasBeneficiario(
  entidad: GeneradorCash,
  endpoint: keyof typeof endpoints,
  rowIndex: Ref<number>
) {
  const refListadoSeleccionable = ref()
  const listado: Ref<EntidadAuditable[]> = ref([])
  const criterioBusqueda = ref()

  const singleSelector = {
    refListadoSeleccionable: refListadoSeleccionable,
    listadoSeleccionable: listado,
    endpoint: endpoint,
    limpiar: () => criterioBusqueda.value = null,
    seleccionar: (items: CuentaBancaria[]) => {
      entidad.pagos[rowIndex.value].cuenta_banco_id = items[0].id
      entidad.pagos[rowIndex.value].tipo_cuenta = items[0].tipo_cuenta
      entidad.pagos[rowIndex.value].numero_cuenta = items[0].numero_cuenta
      entidad.pagos[rowIndex.value].codigo_banco = items[0].codigo_banco
    },
  }

  const selector = useSelector(singleSelector)
  const listar = (params: ParamsType) => selector.listar(criterioBusqueda.value, params)
  const limpiar = () => singleSelector.limpiar()
  const seleccionar = (items: CuentaBancaria[]) => singleSelector.seleccionar(items)

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
