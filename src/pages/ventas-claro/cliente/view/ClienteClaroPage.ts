// Dependencias
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasClienteClaro } from '../domain/configuracionColumnasClienteClaro'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { acciones, maskFecha } from 'config/utils'
import { useCargandoStore } from 'stores/cargando'
import { LocalStorage, useQuasar } from 'quasar'
import { VendedorController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorController'
import { ClienteClaro } from '../domain/ClienteClaro'
import { ClienteClaroController } from '../infrestucture/ClienteClaroController'
import { maxLength, minLength, required, requiredIf } from 'shared/i18n-validators'
import { tabOptionsProductos } from 'config/ventas.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useAuthenticationStore } from 'stores/authentication'
import { CambiarEstadoCliente } from '../application/CambiarEstadoCliente'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'


export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
  },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      ClienteClaro,
      new ClienteClaroController()
    )
    const { entidad: cliente, accion, disabled, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, listar, obtenerListados, cargarVista } = mixin.useComportamiento()
    const { onGuardado, onReestablecer } = mixin.useHooks()
    const { confirmar, notificarCorrecto, prompt, notificarError } = useNotificaciones()

    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    const is_month = ref(false)
    const tabDefecto = ref('1')

    const { vendedores_claro: vendedores,
      filtrarVendedoresClaro: filtrarVendedores,
      cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        vendedores: {
          controller: new VendedorController(),
          params: store.esJefeVentasClaro ? {
            'tipo_vendedor[]': 'SUPERVISOR_VENTAS',
            '&tipo_vendedor[]': 'JEFE_VENTAS',
            activo: 1
          } : {
            tipo_vendedor: 'SUPERVISOR_VENTAS',
            activo: 1
          },
        },
      })
      listadosAuxiliares.cantones = cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      cantones.value = listadosAuxiliares.cantones
      vendedores.value = listadosAuxiliares.vendedores
      if (store.esSupervisorVentasClaro) cliente.supervisor = store.user.id
    })
    const reglas = {
      identificacion: {
        required,
        maxLength: maxLength(13),
        minLenght: minLength(10)
      },
      supervisor: { requiredIf: requiredIf(() => store.esJefeVentasClaro) },
      nombres: { required },
      apellidos: { required },
      direccion: { required },
      telefono1: {
        required,
        maxLength: maxLength(10),
        minLenght: minLength(7),
      },
      telefono2: {
        maxLength: maxLength(10),
        minLenght: minLength(7),
      },
      canton: { required },
    }
    const v$ = useVuelidate(reglas, cliente)
    setValidador(v$.value)

    onGuardado((id, response) => {
      emit('cerrar-modal', false)
      emit('guardado', { formulario: 'ClienteClaroPage', id: id, modelo: response.modelo })
    })
    onReestablecer(() => {
      if (store.esSupervisorVentasClaro) cliente.supervisor = store.user.id
    })

    /***********************
    * Funciones
    ***********************/
    function filtrarClientes(tab: string) {
      tabDefecto.value = tab
      listar({ activo: tab })
    }

    async function recargarVendedores() {
      cargando.activar()
      listadosAuxiliares.vendedores = await (await new VendedorController().listar({ activo: 1, tipo_vendedor: 'SUPERVISOR_VENTAS' })).result
      vendedores.value = listadosAuxiliares.vendedores
      cargando.desactivar()
    }


    /***********************
     * Botones de tabla
     ***********************/
    const btnDesactivar: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-toggle2-off',
      color: 'negative',
      tooltip: 'Desactivar Cliente',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar el cliente?', async () => {
          try {
            cargando.activar()
            await new CambiarEstadoCliente().anular(entidad.id)
            listado.value.splice(posicion, 1)
            notificarCorrecto('Desactivado correctamente')
          } catch (error: any) {
            notificarError('No se pudo desactivar el cliente!')
          } finally {
            cargando.desactivar()
          }
        })
      }, visible: ({ entidad }) => entidad.activo && store.can('puede.desactivar.clientes_claro')
    }
    const btnActivar: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Activar Cliente',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de activar el cliente?', async () => {
          try {
            cargando.activar()
            await new CambiarEstadoCliente().anular(entidad.id)
            listado.value.splice(posicion, 1)
            notificarCorrecto('Activado correctamente')
          } catch (error: any) {
            notificarError('No se pudo desactivar el cliente!')
          } finally {
            cargando.desactivar()
          }
        })
      }, visible: ({ entidad }) => !entidad.activo && store.can('puede.activar.clientes_claro')
    }

    return {
      mixin,
      v$,
      disabled,
      accion, acciones,
      configuracionColumnas: configuracionColumnasClienteClaro,
      is_month,
      tabDefecto,
      tabOptionsClienteClaro: tabOptionsProductos,

      store,
      cliente,
      maskFecha,

      //funciones
      removeAccents,
      vendedores, filtrarVendedores, recargarVendedores,
      cantones, filtrarCantones,
      filtrarClientes,

      //botones de tabla
      btnActivar,
      btnDesactivar,

    }
  },
})
