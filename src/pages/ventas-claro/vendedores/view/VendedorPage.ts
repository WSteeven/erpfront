import { computed, defineComponent, ref } from 'vue'
import { Vendedor } from '../domain/Vendedor'
import { configuracionColumnasVendedores } from '../domain/configuracionColumnasVendedores'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'


import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VendedorController } from '../infrestructure/VendedorController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ModalidadController } from 'pages/ventas-claro/modalidad/infrestructure/ModalidadController'
import { acciones, tipos_vendedores } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CambiarEstadoVendedor } from '../application/CambiarEstadoVendedor'
import { useAuthenticationStore } from 'stores/authentication'
import { tabOptionsProductos } from 'config/ventas.utils'

export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Vendedor, new VendedorController())
    const { entidad: vendedor, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { confirmar, notificarCorrecto, prompt, notificarError } = useNotificaciones()
    const { onGuardado, onModificado, onReestablecer } = mixin.useHooks()

    /*************
     * Hooks
     **************/
    onReestablecer(() => vendedor.jefe_inmediato = store.user.id)
    onGuardado(() => vendedor.jefe_inmediato = store.user.id)
    onModificado(() => vendedor.jefe_inmediato = store.user.id)


    const tabDefecto = ref('1')
        


    const { empleados, filtrarEmpleados, modalidades, filtrarModalidades } = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
            'departamento_id': 9,
            '&or[departamento_id]': 13,
          },
        },
        modalidades: {
          controller: new ModalidadController(),
          params: { campos: 'id,nombre' },
        },
      })
      //Datos por defecto
      vendedor.jefe_inmediato = store.user.id

      empleados.value = listadosAuxiliares.empleados
      modalidades.value = listadosAuxiliares.modalidades

    })
    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: { required },
      modalidad: { required },
      tipo_vendedor: { required },
      jefe_inmediato: { required },
    }
    const v$ = useVuelidate(reglas, vendedor)
    setValidador(v$.value)

    /***********************
    * Funciones
    ***********************/
    function filtrarVendedores(tab: string) {
      tabDefecto.value = tab
      listar({ activo: tab })
    }

    /***********************
     * Botones de tabla
     ***********************/
    const btnDesactivar: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-toggle2-off',
      color: 'negative',
      tooltip: 'Desactivar Vendedor',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar el vendedor?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de desactivación',
            mensaje: 'Ingresa el motivo por el que quieres desactivar este vendedor?',
            accion: async (data) => {
              try {
                cargando.activar()
                await new CambiarEstadoVendedor().anular(entidad.id, { causa_desactivacion: data })
                listado.value.splice(posicion, 1)
                notificarCorrecto('Desactivado correctamente')
              } catch (error: any) {
                notificarError('No se pudo desactivar el vendedor!')
              } finally {
                cargando.desactivar()
              }
            }
          }
          prompt(data)
        })
      }, visible: ({ entidad }) => entidad.activo && store.can('puede.desactivar.vendedores_claro')
    }
    const btnActivar: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Activar Vendedor',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de activar el proveedor?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de activación',
            mensaje: 'Ingresa el motivo por el que quieres desactivar este proveedor?',
            accion: async (data) => {
              try {
                cargando.activar()
                await new CambiarEstadoVendedor().anular(entidad.id, { causa_desactivacion: data })
                listado.value.splice(posicion, 1)
                notificarCorrecto('Activado correctamente')
              } catch (error: any) {
                notificarError('No se pudo activar el vendedor!')
              } finally {
                cargando.desactivar()
              }
            }
          }
          prompt(data)
        })
      }, visible: ({ entidad }) => !entidad.activo && store.can('puede.activar.vendedores_claro')
    }

    return {
      mixin,
      vendedor,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasVendedores,
      tabOptionsVendedores: tabOptionsProductos,
      tabDefecto,


      empleados,
      modalidades,
      tipos_vendedores,
      filtrarEmpleados,
      filtrarModalidades,
      filtrarVendedores,

      //botones de tabla
      btnActivar,
      btnDesactivar,
    }
  },
})
