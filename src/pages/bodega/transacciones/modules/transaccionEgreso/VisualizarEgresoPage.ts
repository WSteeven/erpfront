//Dependencias
import { configuracionColumnasTransaccionEgreso } from '../../domain/configuracionColumnasTransaccionEgreso'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from './domain/configuracionColumnasProductosSeleccionados'
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
import {  useQuasar } from 'quasar'

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

export default defineComponent({
  components: { TabLayout, EssentialTable, EssentialSelectableTable },
  // emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
    const { entidad: transaccion } = mixin.useReferencias()
    const { notificarError, notificarCorrecto, confirmar, prompt } = useNotificaciones()
    //stores
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const pedidoStore = usePedidoStore()
    const transferenciaStore = useTransferenciaStore()
    const route = useRoute()
    if (transaccionStore.transaccion) {
      transaccion.hydrate(transaccionStore.transaccion)
    }

    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const rolSeleccionado = (store.user.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

    // console.log('rol seleccionado: ', rolSeleccionado)

    let esVisibleAutorizacion = ref(false)

    let esVisibleTarea = ref(false)
    let requiereFecha = ref(false) //para mostrar u ocultar fecha limite


    const opciones_empleados = ref([])
    const opciones_autorizaciones = ref([])
    const opciones_sucursales = ref([])
    const opciones_motivos = ref([])
    const opciones_tareas = ref([])
    const opciones_clientes = ref([])

    const configuracionColumnasProductosSeleccionadosDespachado = [...configuracionColumnasProductosSeleccionados, {
      name: 'cantidad',
      field: 'cantidad',
      label: 'Cantidad',
      align: 'left',
      sortable: false,
    },
    ]

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
            })
          } catch (e) {
            notificarError('No se pudo aprobar ni firmar el documento')
          }
        },
      }
      prompt(data)

    }



    return {
      mixin, transaccion,
      configuracionColumnas: configuracionColumnasTransaccionEgreso,
      acciones,
      //listados
      opciones_empleados,
      opciones_sucursales,
      opciones_motivos,
      opciones_autorizaciones,
      opciones_tareas,
      opciones_clientes,

      //stores
      pedidoStore,
      transferenciaStore,

      //variables auxiliares
      esVisibleAutorizacion,
      esVisibleTarea,
      requiereFecha,

      configuracionColumnasProductosSeleccionadosDespachado,

      //rol
      rolSeleccionado,
      esBodeguero,
      esCoordinador,
      aprobarEgreso,
      tabGestionarEgresos,

      //rutas 
      route

    }
  }
})
