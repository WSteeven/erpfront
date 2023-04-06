import {  defineComponent,  ref, watchEffect } from 'vue'


// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagenModal from 'components/SelectorImagenModal.vue'
import SelectorImagenTexto from 'components/SelectorImagenTexto.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { requiredIf, maxLength, minLength, required } from 'shared/i18n-validators'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { GastoPusherEvent } from '../application/GastoPusherEvent'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { useNotificaciones } from 'shared/notificaciones'
import { AprobarGastoController } from 'pages/fondosRotativos/autorizarGasto/infrestructure/AprobarGastoController'
import { useAuthenticationStore } from 'stores/authentication'

import { maskFecha } from 'config/utils'
import { VisualizarGasto } from '../domain/VisualizarGasto'
import { VisualizarGastoController } from '../infrestructure/VisualizarGastoController'
import { AutorizarGastoModales } from 'pages/fondosRotativos/autorizarGasto/domain/AutorizarGastoModales'


export default defineComponent({
  components: { TabLayout, SelectorImagenModal,SelectorImagenTexto },
  emits: ['guardado','cerrar-modal'],
  setup(props, { emit }) {
    const authenticationStore = useAuthenticationStore()
    const usuario = authenticationStore.user
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(VisualizarGasto, new VisualizarGastoController())
    const {
      entidad: gasto,
      disabled,
      accion,
    } = mixin.useReferencias()
    const { setValidador,   consultar } =
      mixin.useComportamiento()
      const {onConsultado} = mixin.useHooks()

    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()

    /*******
     * Init
     ******/
    const fondoRotativoStore = useFondoRotativoStore()
    const aprobarController = new AprobarGastoController()

    const esFactura = ref(true)

    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)
    onConsultado(()=>{
      esFactura.value = gasto.factura ==null  || gasto.factura==' '? false:true
    })
    if (fondoRotativoStore.id_gasto) {
      consultar({ id: fondoRotativoStore.id_gasto })
      mostrarListado.value = false
      mostrarAprobacion.value = true
      esFactura.value = fondoRotativoStore.existeFactura

    }


    /*************
     * Validaciones
     **************/
    const reglas = {
      fecha_viat: {
        required,
      },
      lugar: {
        required,
      },
      num_tarea: {
        required,
      },
      subTarea: {
        required,
      },
      proyecto: {
        required,
      },
      ruc: {
        minLength: minLength(13),
        maxLength: maxLength(13),
        requiredIfFactura: requiredIf(()=>esFactura.value)
      },
      factura: {
        maxLength: maxLength(17),
      },
      num_comprobante: {
        minLength: minLength(10),
        maxLength: maxLength(15),
      },
      aut_especial: {
        required,
      },
      empleado_info: {
        required,
      },
      detalle: {
        required,
      },
      sub_detalle: {
        required,
      },
      cantidad: {
        required,
      },
      valor_u: {
        required,
      },
      total: {
        required,
      },
      comprobante1: {
        required,
      },
      comprobante2: {
        required,
      },
      observacion: {
        required,
      }

    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)



    /*********
     * Pusher
     *********/

    const gastoPusherEvent = new GastoPusherEvent()
    gastoPusherEvent.start()

    watchEffect(() => {
      gasto.total = gasto.cantidad! * gasto.valor_u!
    })
    function existeComprobante() {
      gasto.factura = null
    }
    function aprobar_gasto(entidad, tipo_aprobacion: string) {
      switch (tipo_aprobacion) {
        case 'aprobar':
          const data: CustomActionPrompt = {
            titulo: 'Aprobar gasto',
            mensaje: 'Ingrese motivo de aprobación',
            accion: async (data) => {
              try {
                entidad.detalle_estado = data
                await aprobarController.aprobarGasto(entidad)
                notificarCorrecto('Se aprobado Gasto Exitosamente')
                emit('cerrar-modal');
                emit('guardado');
              } catch (e: any) {
                notificarError(
                  'No se pudo aprobar, debes ingresar un motivo para la anulación'
                )
              }
            },
          }
          prompt(data)
          break
        case 'rechazar':
          confirmar('¿Está seguro de rechazar el gasto?', () => {
            const data: CustomActionPrompt = {
              titulo: 'Rechazar gasto',
              mensaje: 'Ingrese motivo de aprobación',
              accion: async (data) => {
                try {
                  entidad.detalle_estado = data
                  await aprobarController.rechazarGasto(entidad)
                  notificarAdvertencia('Se rechazado Gasto Exitosamente')
                  emit('cerrar-modal');
                  emit('guardado');
                } catch (e: any) {
                  notificarError(
                    'No se pudo rechazar, debes ingresar un motivo para la anulación'
                  )
                }
              },
            }
            prompt(data)
          })
          break
          case 'anular':
            confirmar('¿Está seguro de anular el gasto?', () => {
              const data: CustomActionPrompt = {
                titulo: 'Anular gasto',
                mensaje: 'Ingrese motivo de anulacion',
                accion: async (data) => {
                  try {
                    entidad.detalle_estado = data
                    await aprobarController.anularGasto(entidad)
                    notificarAdvertencia('Se anulado Gasto Exitosamente')
                    emit('cerrar-modal');
                    emit('guardado');
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
      gasto,
      esFactura,
      usuario,
      disabled,
      maskFecha,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasGasto,
      watchEffect,
      existeComprobante,
      aprobar_gasto
    }
  },
})
