import { CausaIntervencion } from 'pages/gestionTrabajos/causasIntervenciones/domain/CausaIntervencion'
import { ObtenerPlantilla } from 'pages/gestionTrabajos/trabajoAsignado/application/ObtenerPlantilla'
import { MotivoSuspendido } from 'pages/gestionTrabajos/motivosSuspendidos/domain/MotivoSuspendido'
import { imprimirArchivo, isAxiosError, notificarMensajesError, obtenerUbicacion } from 'shared/utils'
import { MotivoPausa } from 'pages/gestionTrabajos/motivosPausas/domain/MotivoPausa'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { estadosTrabajos } from 'config/utils'
import { RolPago } from 'pages/recursosHumanos/rol-pago/domain/RolPago'
import { Ref, reactive } from 'vue'
import { clientes } from 'config/clientes'
import { RolPagoController } from 'pages/recursosHumanos/rol-pago/infraestructure/RolPagoController'
import { useRolPagoStore } from 'stores/rolPago'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'

export const useBotonesTablaRolPago = (listado: Ref<RolPago[]>, modales: any, listadosAuxiliares?: any) => {
  /***********
  * Stores
  ***********/
  const authenticationStore = useAuthenticationStore()
  const rolPagoStore = useRolPagoStore()
  const store = useAuthenticationStore()


  const esRecursosHumanos = store.esRecursosHumanos


  /************
   * Variables
   ************/
  const { notificarAdvertencia, confirmar, notificarCorrecto, prompt, promptItems } = useNotificaciones()
  const notificaciones = useNotificaciones()


  const movilizacion = reactive({
    empleado_responsable_subtarea: null,
    coordinador_registrante_llegada: null,
  })

  const btnIniciar: CustomActionTable = {
    titulo: 'Ejecutar',
    icono: 'bi-play-fill',
    color: 'positive',
    visible: ({ entidad }) => [estadosTrabajos.CREADO].includes(entidad.estado) && (authenticationStore.esRecursosHumanos || authenticationStore.esAdministrador),
    accion: ({ entidad }) => {


      confirmar('¿Está seguro de iniciar el trabajo?', async () => {
        if (entidad.es_dependiente) {
          const { result: subtareaDependiente } = await new RolPagoController().consultar(entidad.subtarea_dependiente_id)
          if (![estadosTrabajos.REALIZADO, estadosTrabajos.FINALIZADO].includes(subtareaDependiente.estado ?? '')) {
            return notificarAdvertencia('No puedes proceder. Primero debes realizar la subtarea ' + subtareaDependiente.mes)
          }
        }

        const data = {
          estado_subtarea_llegada: estadosTrabajos.EJECUTANDO,
          ...movilizacion
        }

        entidad.estado = estadosTrabajos.EJECUTANDO
        notificarCorrecto('Trabajo iniciado exitosamente!')
      })
    }
  }



  const btnRealizar: CustomActionTable = {
    titulo: 'Realizado',
    icono: 'bi-check-circle',
    color: 'positive',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && (authenticationStore.esJefeTecnico || authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad, posicion }) => {
      const config: CustomActionPrompt = reactive({
        mensaje: 'Seleccione la causa de intervención',
        accion: async (causa_intervencion_id) => {
          confirmarRealizar({ entidad, posicion, causa_intervencion_id })
        },
        tipo: 'radio',
        requerido: false,
        items: listadosAuxiliares.causasIntervenciones.filter((causa: CausaIntervencion) => causa.tipo_trabajo === entidad.tipo_trabajo).map((causa: CausaIntervencion) => {
          return {
            label: causa.nombre,
            value: causa.id
          }
        })
      })


    }
  }

  function confirmarRealizar(data: any) {
    const { entidad, posicion, causa_intervencion_id } = data

    confirmar('¿Está seguro de que completó el trabajo?', async () => {
      try {

        const data = {
          estado_subtarea_llegada: estadosTrabajos.REALIZADO,
          causa_intervencion_id: causa_intervencion_id,
          ...movilizacion,
        }

         eliminarElemento(posicion) //if (authenticationStore.esTecnico) eliminarElemento(posicion)

        notificarCorrecto('El trabajo ha sido marcado como realizado exitosamente!')
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, notificaciones)
        }
      }
    })
  }



  const btnFinalizar: CustomActionTable = {
    titulo: 'Finalizar',
    color: 'positive',
    icono: 'bi-check',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.REALIZADO,
    accion: ({ entidad }) => {
      const config: CustomActionPrompt = reactive({
        mensaje: 'Confirme la causa de intervención',
        accion: (causa_intervencion_id) => {
          confirmarFinalizar({ entidad, causa_intervencion_id })
        },
        requerido: false,
        defecto: entidad.causa_intervencion_id,
        tipo: 'radio',
        items: listadosAuxiliares.causasIntervenciones.filter((causa: CausaIntervencion) => causa.tipo_trabajo === entidad.tipo_trabajo).map((causa: CausaIntervencion) => {
          return {
            label: causa.nombre,
            value: causa.id
          }
        })
      })

      if (entidad.cliente_id === clientes.NEDETEL) {
        promptItems(config)
      } else {
        confirmarFinalizar({ entidad })
      }
    }
  }

  function confirmarFinalizar(data: any) {
    const { entidad, causa_intervencion_id } = data

    confirmar('¿Está seguro de marcar como finalizada la subtarea?', async () => {
      try {

        notificarCorrecto('Trabajo finalizada exitosamente!')
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, notificaciones)
        }
      }
    })
  }



  const btnCancelar: CustomActionTable = {
    titulo: 'Cancelar',
    color: 'negative',
    icono: 'bi-x-circle',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.SUSPENDIDO,
    accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de cancelar definitivamente la subtarea?'], async () => {
      const config: CustomActionPrompt = {
        mensaje: 'Seleccione el motivo de la cancelación',
        accion: async (data) => {
          entidad.estado = estadosTrabajos.CANCELADO

          notificarCorrecto('Trabajo cancelado exitosamente!')
          actualizarElemento(posicion, entidad)
        },
        tipo: 'radio',
        items: listadosAuxiliares.motivosSuspendidos.map((motivo: MotivoSuspendido) => {
          return {
            label: motivo.motivo,
            value: motivo.id
          }
        })
      }

      promptItems(config)
    }),
  }

  const btnImprimir: CustomActionTable = {
    titulo: ' ',
    icono: 'bi-printer',
    color: 'primary',
    visible: ({ entidad }) => esRecursosHumanos,
    accion: ({ entidad }) => {
      generar_reporte(entidad)
    },
  }
  async function generar_reporte(valor: RolPago): Promise<void> {
    const axios = AxiosHttpRepository.getInstance()
    const filename = 'rol_pago'
    const url_pdf =
      apiConfig.URL_BASE +
      '/' +
      axios.getEndpoint(endpoints.imprimir_rol_pago) +
      valor.id
    imprimirArchivo(url_pdf, 'GET', 'blob', 'pdf', filename, valor)
  }

  /************
   * Funciones
   ************/

  function actualizarElemento(posicion: number, entidad: RolPago): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1, entidad)
      listado.value = [...listado.value]
    }
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1)
    }
  }

  return {
    // movilizacion,
    btnIniciar,
    btnRealizar,
    // btnFormulario,
    btnCancelar,
    btnFinalizar,
    btnImprimir
  }
}
