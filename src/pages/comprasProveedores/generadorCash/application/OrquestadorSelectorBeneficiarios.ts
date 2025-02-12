import { Beneficiario } from '../modules/Beneficiario/domain/Beneficiario'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { GeneradorCash } from '../domain/GeneradorCash'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

export function useOrquestadorSelectorBeneficiarios(
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
    seleccionar: (items: Beneficiario[]) => {
      entidad.pagos[rowIndex.value].beneficiario_id = items[0].id
      entidad.pagos[rowIndex.value].identificacion_beneficiario = items[0].identificacion_beneficiario
      entidad.pagos[rowIndex.value].codigo_beneficiario = items[0].codigo_beneficiario
      entidad.pagos[rowIndex.value].nombre_beneficiario = items[0].nombre_beneficiario
      entidad.pagos[rowIndex.value].tipo_documento = items[0].tipo_documento
      entidad.pagos[rowIndex.value].referencia_adicional = items[0].correo
      // Resetear cuenta bancaria
      entidad.pagos[rowIndex.value].cuenta_banco_id = null
      entidad.pagos[rowIndex.value].tipo_cuenta = null
      entidad.pagos[rowIndex.value].numero_cuenta = null
      entidad.pagos[rowIndex.value].codigo_banco = null
    },
  }

  const selector = useSelector(singleSelector)
  const listar = () => selector.listar(criterioBusqueda.value)
  const limpiar = () => singleSelector.limpiar()
  const seleccionar = (items: Beneficiario[]) => singleSelector.seleccionar(items)

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
