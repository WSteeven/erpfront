import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { RolPagoMes } from '../domain/RolPagoMes'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export const useBotonesTablaRolPagoMes = (
  mixin: ContenedorSimpleMixin<RolPagoMes>
) => {
  const { confirmar, prompt, notificarAdvertencia, notificarCorrecto } = useNotificaciones()
  const { listado } = mixin.useReferencias()
  const { editarParcial } = mixin.useComportamiento()
  const authenticationStore = useAuthenticationStore()
  const filaFinalizar = {
    id: null,
    novedad: null,
    codigo_tarea_cliente: null,
    finalizado: true,
    posicion: 0,
    imagen_informe: null,
  }

  const btnFinalizarRolPago: CustomActionTable = {
    titulo: 'Finalizar Rol de Pago',
    icono: 'bi-check-circle-fill',
    color: 'positive',
    visible: ({ entidad }) => !entidad.finalizado,
    accion: async ({ entidad, posicion }) => {
      if (listado.value[posicion].cantidad_subtareas == 0)
        return notificarAdvertencia(
          'La tarea debe tener al menos un rol de pago de empleado para poder finalizar el rol de pago del mes.'
        )
      const estanFinalizadas = await verificarTodasRolPagoFinalizadas(
        entidad.id
      )
      if (!estanFinalizadas.estan_finalizadas)
        return notificarAdvertencia(
          'El rol de pago aún tiene roles de empleados pendientes de FINALIZAR, REALIZAR o EJECUTAR.'
        )
        await FinalizarRolPago(
          entidad.id
        )


      filaFinalizar.id = entidad.id
      filaFinalizar.posicion = posicion


    },
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) listado.value.splice(posicion, 1)
  }
async function FinalizarRolPago(idRolPago: number)  {
  const axios = AxiosHttpRepository.getInstance()
  const ruta = axios.getEndpoint(
    endpoints.finalizar_rol_pago,
    { rol_pago_id: idRolPago }
  )
  const response: AxiosResponse = await axios.get(ruta)
  return notificarCorrecto(
    'El rol de pago ha sido Finalizado.'
  )
}
  async function verificarTodasRolPagoFinalizadas(idRolPago: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(
      endpoints.verificar_todos_roles_finalizadas,
      { rol_pago_id: idRolPago }
    )
    const response: AxiosResponse = await axios.get(ruta)

    return response.data
  }

  return {
    btnFinalizarRolPago,
  }
}


