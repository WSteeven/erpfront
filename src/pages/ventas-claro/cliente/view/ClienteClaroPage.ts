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
import { useQuasar } from 'quasar'
import { VendedorController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorController'
import { ClienteClaro } from '../domain/ClienteClaro'
import { ClienteClaroController } from '../infrestucture/ClienteClaroController'
import { maxLength, minLength, required } from 'shared/i18n-validators'
import { tabOptionsProductos } from 'config/ventas.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useAuthenticationStore } from 'stores/authentication'
import { CambiarEstadoCliente } from '../application/CambiarEstadoCliente'


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
    const { onGuardado } = mixin.useHooks()
    const { confirmar, notificarCorrecto, prompt, notificarError } = useNotificaciones()

    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    const is_month = ref(false)
    const vendedores = ref([])
    const tabDefecto = ref('1')

    cargarVista(async () => {
      await obtenerListados({
        vendedores: {
          controller: new VendedorController(),
          params: {
            // tipo_vendedor: 'SUPERVISOR_VENTAS'
          },
        },
      })
      vendedores.value = listadosAuxiliares.vendedores
    })
    const reglas = {
      identificacion: {
        required,
        maxLength: maxLength(10),
        minLenght: minLength(10)
      },
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
    }
    const v$ = useVuelidate(reglas, cliente)
    setValidador(v$.value)

    onGuardado((id, response) => {
      emit('cerrar-modal', false)
      emit('guardado', { formulario: 'ClienteClaroPage', id: id, modelo: response.modelo })
    })

    /***********************
    * Funciones
    ***********************/
    function filtrarClientes(tab: string) {
      tabDefecto.value = tab
      listar({ activo: tab })
    }
    /**Verifica si es un mes */
    function checkValue(val, reason) {
      is_month.value = reason === 'month' ? false : true
    }
    function filtrarVendedores(val, update) {
      if (val === '') {
        update(() => {
          vendedores.value = listadosAuxiliares.vendedores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        vendedores.value = listadosAuxiliares.vendedores.filter(
          (v) =>
            v.codigo_vendedor.toLowerCase().indexOf(needle) > -1 ||
            v.empleado_info.toLowerCase().indexOf(needle) > -1
        )
      })
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
      vendedores,
      cliente,
      maskFecha,

      //funciones
      checkValue,
      removeAccents,
      filtrarVendedores,
      filtrarClientes,

      //botones de tabla
      btnActivar,
      btnDesactivar,

    }
  },
})
