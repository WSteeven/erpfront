import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { RolPagoMes } from '../domain/RolPagoMes'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export const useBotonesTablaRolPagoMes = (
  mixin: ContenedorSimpleMixin<RolPagoMes>
) => {
  const { notificarAdvertencia, notificarCorrecto, confirmar } =
    useNotificaciones()
  const { listado } = mixin.useReferencias()
  const { listar } = mixin.useComportamiento()
  const cargando = new StatusEssentialLoading()
  const filaFinalizar = {
    id: null,
    novedad: null,
    codigo_tarea_cliente: null,
    finalizado: true,
    posicion: 0,
    imagen_informe: null
  }
  const store = useAuthenticationStore()

  const btnActivarRolPago: CustomActionTable<RolPagoMes> = {
    titulo: 'Activar Rol de Pago',
    icono: 'bi-check-circle-fill',
    color: 'positive',
    visible: ({ entidad }) => entidad.finalizado,
    accion: async ({ entidad }) => {
      confirmar('¿Está seguro de reactivar el Rol de Pago?', async () => {
        await activarRolPago(entidad.id)
        await listar({ finalizado: '1' })
      })
    }
  }

  const btnFinalizarRolPago: CustomActionTable = {
    titulo: 'Finalizar Rol de Pago',
    icono: 'bi-check-circle-fill',
    color: 'positive',
    visible: ({ entidad }) =>
      !entidad.finalizado && store.can('puede.ver.btn.finalizar_rol_pago'),
    accion: async ({ entidad, posicion }) => {
      if (listado.value[posicion].cantidad_subtareas == 0)
        return notificarAdvertencia(
          'El rol de pago debe tener al menos un registro para poder finalizar.'
        )
      const estanFinalizadas = await verificarTodasRolPagoFinalizadas(
        entidad.id
      )
      if (!estanFinalizadas.estan_finalizadas)
        return notificarAdvertencia(
          'El rol de pago aún tiene roles de empleados pendientes de FINALIZAR, REALIZAR o EJECUTAR.'
        )
      await finalizarRolPago(entidad.id)

      filaFinalizar.id = entidad.id
      filaFinalizar.posicion = posicion
      await listar({ finalizado: '0' })
    }
  }
  const btnRefrescar: CustomActionTable = {
    titulo: '',
    icono: 'bi-arrow-clockwise',
    color: 'positive',
    accion: async ({ entidad }) => {
      await actualizarRolPago(entidad.id)
    }
  }

  // function eliminarElemento(posicion: number): void {
  //   if (posicion >= 0) listado.value.splice(posicion, 1)
  // }
  async function actualizarRolPago(idRolPago: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.actualizar_rol_pago, {
      rol_pago_id: idRolPago
    })
    await axios.get(ruta)
    return notificarCorrecto('El rol de pago ha sido Actualizado.')
  }

  async function activarRolPago(idRolPago: number) {
    try {
      cargando.activar()
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.activar_rol_pago) + idRolPago
      const response: AxiosResponse = await axios.post(ruta)
      if (response.status === 200) notificarCorrecto(response.data.mensaje)
    } catch (e) {
      console.error(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function finalizarRolPago(idRolPago: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.finalizar_rol_pago, {
      rol_pago_id: idRolPago
    })
    await axios.get(ruta)
    return notificarCorrecto('El rol de pago ha sido Finalizado.')
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
    btnActivarRolPago,
    btnRefrescar
  }
}
