//Dependencias
import { configuracionColumnasTransaccionEgreso } from '../../domain/configuracionColumnasTransaccionEgreso'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionadosEgreso } from './domain/configuracionColumnasProductosSeleccionadosEgreso'
import { configuracionColumnasProductosSeleccionadosDespachadoParciales } from './domain/configuracionColumnasProductosSeleccionadosDespachadoParciales'
import { acciones, tabGestionarEgresos } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionEgresoController } from '../../infraestructure/TransaccionEgresoController'
import { Transaccion } from '../../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores
import { useNotificaciones } from 'shared/notificaciones'

import { useAuthenticationStore } from 'stores/authentication'
import { useTransaccionStore } from 'stores/transaccion'

import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { usePedidoStore } from 'stores/pedido'

import { useTransferenciaStore } from 'stores/transferencia'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useRoute } from 'vue-router'
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
  components: { TabLayout, EssentialTable, EssentialSelectableTable },
  // emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
    const { entidad: transaccion, listado } = mixin.useReferencias()
    const { notificarError, notificarCorrecto, confirmar, prompt } = useNotificaciones()
    //stores
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const transaccionEgresoStore = useTransaccionEgresoStore()
    const pedidoStore = usePedidoStore()
    const transferenciaStore = useTransferenciaStore()
    const route = useRoute()
    let listadoAux
    if (transaccionStore.transaccion) {
      // console.log(transaccionStore.transaccion)
      // console.log(transaccionEgresoStore.transaccion)
      transaccion.hydrate(transaccionStore.transaccion)
      listadoAux = JSON.parse(JSON.stringify(transaccionEgresoStore.transaccion.listadoProductosTransaccion))
    }
    // if (transaccionEgresoStore.estadoPendiente) {
    //   transaccion.listadoProductosTransaccion.forEach((item) => {
    //     item.recibido = item.cantidad
    //   })
    // }

    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const rolSeleccionado = (store.user.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

    // console.log('rol seleccionado: ', rolSeleccionado)

    let esVisibleAutorizacion = ref(false)

    let esVisibleTarea = ref(false)
    let requiereFecha = ref(false) //para mostrar u ocultar fecha limite



    function aprobarEgreso() {
      const data: CustomActionPrompt = {
        titulo: 'Aprobar y firmar',
        mensaje: 'Ingrese motivo de aprobación',
        accion: async (data) => {
          try {
            confirmar('Esta acción firmará el comprobante de egreso ', async () => {
              //aqui se aprueba y se firma el documento
              const datos = {
                transaccion_id: transaccionStore.idTransaccion,
                firmada: true,
                estado: 'ACEPTADA',
                observacion: data
              }
              const axios = AxiosHttpRepository.getInstance()
              const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.comprobantes) + '/' + transaccion.id
              const response = await axios.put(url, datos)
              // const {response, result} = await comprobanteController.editar(datos)
              console.log(response)
              // transaccionStore.firmarComprobante(transaccionStore.idTransaccion, datos)
              notificarCorrecto('Documento aprobado y firmado correctamente')
              emit('cerrar-modal', false)
              emit('guardado', 'aceptado')
              transaccionStore.resetearTransaccion()
              transaccionEgresoStore.resetearTransaccion()
              transaccionEgresoStore.estadoPendiente = false
            })
          } catch (e) {
            notificarError('No se pudo aprobar ni firmar el documento')
          }
        },
      }
      prompt(data)

    }

    function aprobarEgresoParcial() {
      if (verificarRecibidoMenor()) notificarError('El valor de recibido no puede ser superior a la cantidad despachada')
      else {
        const data: CustomActionPrompt = {
          titulo: 'Aprobar Recepción Parcial',
          mensaje: 'Ingrese motivo de la aprobación parcial',
          accion: async (data) => {
            try {
              confirmar('Esta acción firmará el comprobante de egreso con las cantidades y materiales aceptados ', async () => {
                //aqui se aprueba y se firma el documento
                const datos = {
                  transaccion: transaccion,
                  observacion: data
                }
                const axios = AxiosHttpRepository.getInstance()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.comprobantes) + '/aceptar-parcial/' + transaccion.id
                const response = await axios.put(url, datos)
                console.log(response)
                notificarCorrecto('Documento parcial aprobado y firmado correctamente')
                emit('cerrar-modal', false)
                emit('guardado', 'parcial')
                transaccionStore.resetearTransaccion()
                transaccionEgresoStore.resetearTransaccion()
                transaccionEgresoStore.estadoPendiente = false
              })
            } catch (e) {
              notificarError('Ha ocurrido un error')
            }
          },
        }
        prompt(data)
      }
    }

    function permitirModificarCantidades() {
      transaccion.modificar_recepcion = !transaccion.modificar_recepcion
      if (transaccion.modificar_recepcion && transaccion.estado_comprobante === 'PARCIAL') {
        //primero se quita los completados
        transaccion.listadoProductosTransaccion = transaccion.listadoProductosTransaccion.filter((item) => item.cantidad != item.recibido)

        // se resta del valor inicial la cantidad para que sea igual que la recibida
        transaccion.listadoProductosTransaccion.forEach((item) => {
          item.cantidad = item.cantidad - item.recibido
        })
        // se copia en recibdo el valor de cantidad
        transaccion.listadoProductosTransaccion.forEach((item) => {
          item.recibido = item.cantidad
        })
        // console.log(transaccion.listadoProductosTransaccion)
      } else {
        // console.log('entraste en el else', listadoAux)
        // console.log('entraste en el else', transaccion.listadoProductosTransaccion)

        // transaccion.listadoProductosTransaccion = Object.deepCopy(listadoAux)
        transaccion.listadoProductosTransaccion = JSON.parse(JSON.stringify(listadoAux))
      }
    }

    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () => transaccion.listadoProductosTransaccion.splice(posicion, 1))
    }

    function verificarRecibidoMenor() {
      return transaccion.listadoProductosTransaccion.some((item) => item.recibido > item.cantidad)
    }

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const btnEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: transaccion.listadoProductosTransaccion[posicion].recibido,
          tipo: 'number',
          accion: (data) => {
            transaccion.listadoProductosTransaccion[posicion].recibido = data
          },
        }

        prompt(config)
      },
      visible: () => transaccion.modificar_recepcion
    }
    const btnEliminarFila: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      accion: ({ entidad, posicion }) => {
        //: props.propsTable.rowIndex,
        eliminar({ posicion })
      },
      visible: () => transaccion.modificar_recepcion
    }


    return {
      mixin, transaccion,
      configuracionColumnas: configuracionColumnasTransaccionEgreso,
      acciones,


      //stores
      pedidoStore,
      transferenciaStore,

      //variables auxiliares
      esVisibleAutorizacion,
      esVisibleTarea,
      requiereFecha,

      configuracionColumnasProductosSeleccionadosEgreso,
      configuracionColumnasProductosSeleccionadosDespachadoParciales,

      //rol
      rolSeleccionado,
      esBodeguero,
      esCoordinador,
      permitirModificarCantidades,
      aprobarEgreso,
      aprobarEgresoParcial,
      tabGestionarEgresos,

      //rutas
      route,

      //botones de tabla
      btnEditarCantidad,
      btnEliminarFila,

    }
  }
})
