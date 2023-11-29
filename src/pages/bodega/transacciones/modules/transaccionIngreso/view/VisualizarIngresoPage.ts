//Dependencias
import { configuracionColumnasTransaccionIngreso } from 'pages/bodega/transacciones/domain/configuracionColumnasTransaccionIngreso'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { acciones } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import {  useQuasar } from 'quasar'

//Controladores
import { useNotificaciones } from 'shared/notificaciones'

import { useAuthenticationStore } from 'stores/authentication'
import { useTransaccionStore } from 'stores/transaccion'

import { useTransferenciaStore } from 'stores/transferencia'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'

export default defineComponent({
  components: { TabLayout, EssentialTable, EssentialSelectableTable },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
    const { entidad: transaccion } = mixin.useReferencias()
    const { notificarError, notificarCorrecto, confirmar, prompt } = useNotificaciones()
    //stores
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const transaccionStore = useTransaccionStore()
    const transferenciaStore = useTransferenciaStore()
    if (transaccionStore.transaccion) {
      transaccion.hydrate(transaccionStore.transaccion)
    }

    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const rolSeleccionado = (store.user.roles.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

    // console.log('rol seleccionado: ', rolSeleccionado)


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



    return {
      mixin, transaccion,
      configuracionColumnas: configuracionColumnasTransaccionIngreso,
      acciones,
      //listados
      opciones_empleados,
      opciones_sucursales,
      opciones_motivos,
      opciones_autorizaciones,
      opciones_tareas,
      opciones_clientes,

      //stores
      transferenciaStore,


      configuracionColumnasProductosSeleccionadosDespachado,

      //rol
      rolSeleccionado,
      esBodeguero,
      esCoordinador,

    }
  }
})
