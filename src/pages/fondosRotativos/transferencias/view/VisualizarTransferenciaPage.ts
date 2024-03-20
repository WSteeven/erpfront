import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasTransferencia } from '../domain/configuracionColumnasTransferencia'
import { useAuthenticationStore } from 'stores/authentication'
import { useTransferenciaSaldoStore } from 'stores/transferenciaSaldo'
import { AprobarTransferenciaController } from 'pages/fondosRotativos/autorizarTransferencia/infrestructure/AprobarTransferenciaController'
import { useNotificaciones } from 'shared/notificaciones'
import { VisualizarTransferenciaController } from '../infrestructure/VisualizarTransferenciaController'
import { VisualizarTransferencia } from '../domain/VisualizarTransferencia'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const authenticationStore = useAuthenticationStore()
    const usuario = authenticationStore.user
    const transferenciaSaldoStore = useTransferenciaSaldoStore()
    const cargando = new StatusEssentialLoading()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      VisualizarTransferencia,
      new VisualizarTransferenciaController()
    )
    const aprobarController = new AprobarTransferenciaController()
    const { entidad: transferencia, disabled, accion } = mixin.useReferencias()
    const { setValidador, consultar } = mixin.useComportamiento()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()
    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)
    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario_recibe: {
        requiredIf: transferencia.es_devolucion ? true : false,
      },
      monto: {
        required,
        maxLength: maxLength(50),
      },
      cuenta: {
        required,
        maxLength: maxLength(50),
      },
      tarea: {
        requiredIf: transferencia.es_devolucion ? true : false,
      },
      comprobante: {
        required,
      },
    }

    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    /* Checking if the id_transferencia is not null, if it is not null, it is going to consult the
   transfer with the id_transferencia, it is going to set the value of mostrarListado to false and
   the value of mostrarAprobacion to true, and it is going to set the value of esDevolucion to true
   if the user_recibe is not null, if it is null, it is going to set the value of esDevolucion to
   false. */
    if (transferenciaSaldoStore.id_transferencia) {
      consultar({ id: transferenciaSaldoStore.id_transferencia })
      mostrarListado.value = false
      mostrarAprobacion.value = true
    }



    async function aprobar_transferencia(entidad, tipo_aprobacion: string) {
      switch (tipo_aprobacion) {
        case 'aprobar':
          try {
            cargando.activar()

           await aprobarController.aprobarTransferencia(entidad)
            notificarCorrecto('Se aprobado Transferencia Exitosamente')
            cargando.desactivar()
            emit('cerrar-modal',false)
            emit('guardado')
          } catch (e: any) {
            notificarError(
              'No se pudo aprobar, debes ingresar un motivo para la anulación'
            )
          }
          break
        case 'rechazar':
          confirmar('¿Está seguro de rechazar la transferencia?', async () => {
            try {
              cargando.activar()
              await aprobarController.rechazarTransferencia(entidad)
              notificarAdvertencia('Se rechazado Transferencia Exitosamente')
              emit('cerrar-modal')
              cargando.desactivar()
              emit('guardado')
            } catch (e: any) {
              notificarError(
                'No se pudo rechazar, debes ingresar un motivo para la anulación'
              )
            }
          })
          break
        case 'anular':
          cargando.activar()
          confirmar('¿Está seguro de anular el gasto?', () => {
            const data: CustomActionPrompt = {
              titulo: 'Anular gasto',
              mensaje: 'Ingrese motivo de anulacion',
              accion: async (data) => {
                try {
                  entidad.detalle_estado = data
                  await aprobarController.anularTransferencia(entidad)
                  notificarAdvertencia('Se anulado Transferencia Exitosamente')
                  emit('cerrar-modal')
                  cargando.desactivar()
                  emit('guardado')
                } catch (e: any) {
                  notificarError(
                    'No se pudo anular, debes ingresar un motivo para la anulación'
                  )
                }
              },
            }
            prompt(data)
          })
          break
        default:
          break
      }
    }

    return {
      mixin,
      transferencia,
      disabled,
      accion,
      v$,
      usuario,
      mostrarListado,
      aprobar_transferencia,
      configuracionColumnas: configuracionColumnasTransferencia,
    }
  },
})
