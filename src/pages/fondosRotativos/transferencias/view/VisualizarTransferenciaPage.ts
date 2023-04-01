import { defineComponent, ref } from 'vue'


// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagenModal from 'components/SelectorImagenModal.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {  required,maxLength, requiredIf } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasTransferencia } from '../domain/configuracionColumnasTransferencia'
import { useAuthenticationStore } from 'stores/authentication'
import { useTransferenciaSaldoStore } from 'stores/transferenciaSaldo'
import { AprobarTransferenciaController } from 'pages/fondosRotativos/autorizarTransferencia/infrestructure/AprobarTransferenciaController'
import { useNotificaciones } from 'shared/notificaciones'
import { VisualizarTransferenciaController } from '../infrestructure/VisualizarTransferenciaController'
import { VisualizarTransferencia } from '../domain/VisualizarTransferencia'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'

export default defineComponent({
  components: { TabLayout, SelectorImagenModal },
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const authenticationStore = useAuthenticationStore()
    const usuario = authenticationStore.user
    const transferenciaSaldoStore = useTransferenciaSaldoStore()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(VisualizarTransferencia, new VisualizarTransferenciaController())
    const aprobarController = new AprobarTransferenciaController()
    const {
      entidad: transferencia,
      disabled,
      accion,
    } = mixin.useReferencias()
    const {onConsultado} = mixin.useHooks()
    const { setValidador, consultar } =
      mixin.useComportamiento()
      const {
        confirmar,
        prompt,
        notificarCorrecto,
        notificarAdvertencia,
        notificarError,
      } = useNotificaciones()
      const esDevolucion = ref(true)
      const mostrarListado = ref(true)
      const mostrarAprobacion = ref(false)
    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario_recibe: {
        requiredIf:esDevolucion.value ? true : false,
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
        requiredIf:esDevolucion.value ? true : false,
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
    onConsultado(()=>{
      esDevolucion.value = transferencia.usuario_recibe !== null ? true : false
    })


/**
 * It checks if the value of the checkbox is true, if it is, it sets the value of the user_recibe to
 * null and the value of the reason to DEVOLUCION. If it is not true, it sets the value of the reason
 * to TRANSFERENCIA ENTRE USUARIOS.
 */
    function existeDevolucion(){
      if(esDevolucion.value ==true){
        transferencia.usuario_recibe = null
        transferencia.motivo = 'DEVOLUCION'
      }else{
        transferencia.motivo = 'TRANSFERENCIA ENTRE USUARIOS'
      }
    }
   /**
    * A function that is used to approve or reject a transfer.
    * @param entidad - The entity to be approved or rejected.
    * @param {string} tipo_aprobacion - string
    */
    async function  aprobar_transferencia(entidad, tipo_aprobacion: string) {
      switch (tipo_aprobacion) {
        case 'aprobar':
          try {
            await aprobarController.aprobarTransferencia(entidad)
            notificarCorrecto('Se aprobado Transferencia Exitosamente')
            emit('cerrar-modal');
          } catch (e: any) {
            notificarError(
              'No se pudo aprobar, debes ingresar un motivo para la anulación'
            )
          }
          break;
        case 'rechazar':
          confirmar('¿Está seguro de rechazar la transferencia?', async () => {
                try {
                  await aprobarController.rechazarTransferencia(entidad)
                  notificarAdvertencia('Se rechazado Transferencia Exitosamente')
                  emit('cerrar-modal');
                } catch (e: any) {
                  notificarError(
                    'No se pudo rechazar, debes ingresar un motivo para la anulación'
                  )
                }
          })
          break;
          case 'anular':
            confirmar('¿Está seguro de anular el gasto?', () => {
              const data: CustomActionPrompt = {
                titulo: 'Anular gasto',
                mensaje: 'Ingrese motivo de anulacion',
                accion: async (data) => {
                  try {
                    entidad.detalle_estado = data
                    await aprobarController.anularTransferencia(entidad)
                    notificarAdvertencia('Se anulado Transferencia Exitosamente')
                    emit('cerrar-modal');
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
      esDevolucion,
      disabled, accion, v$,
      usuario,
      existeDevolucion,
      mostrarListado,
      aprobar_transferencia,
      configuracionColumnas: configuracionColumnasTransferencia,
    }
  },
})
