import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Alimentacion } from '../domain/Alimentacion'
import { useAuthenticationStore } from 'stores/authentication'

export const useBotonesTablaAlimentacion = (  mixin: ContenedorSimpleMixin<Alimentacion>
  ) => {
    const {  listar } = mixin.useComportamiento()

  /************
   * Variables
   ************/
  const {  notificarCorrecto } = useNotificaciones()
  const authenticationStore = useAuthenticationStore()
  const btnFinalizar: CustomActionTable = {
    titulo: 'Finalizar Asignacion de Alimentación',
    icono: 'bi-check-circle-fill',
    color: 'warning',
    visible: ({ entidad }) => !entidad.finalizado &&  authenticationStore.can('puede.ver.bnt.finalizar_alimentaciones'),
    accion: async ({ entidad }) => {
      await FinalizarAlimentacion(
        entidad.id
      )
      await listar({ finalizado: '0' })
    },
  }

  async function FinalizarAlimentacion(id: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(
      endpoints.finalizar_asignacion_alimentacion,
      { id }
    )
     await axios.get(ruta)
    return notificarCorrecto(
      'Se a Finalizado la asignacion de Alimentacion.'
    )
  }
  return {
    btnFinalizar,
  }
}
