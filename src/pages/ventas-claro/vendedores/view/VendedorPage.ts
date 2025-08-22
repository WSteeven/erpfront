import { defineComponent, ref } from 'vue'
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
import { tipos_vendedores } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CambiarEstadoVendedor } from '../application/CambiarEstadoVendedor'
import { useAuthenticationStore } from 'stores/authentication'
import { tabOptionsProductos } from 'config/ventas.utils'
import { ordenarLista } from 'shared/utils'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import {Empleado} from 'recursosHumanos/empleados/domain/Empleado';

export default defineComponent({
  components: { ErrorComponent, NoOptionComponent, TabLayoutFilterTabs2 },
  setup(props, { emit }) {
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
    const {
      entidad: vendedor,
      disabled,
      accion,
      listadosAuxiliares,
      listado
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onGuardado, onModificado, onReestablecer } = mixin.useHooks()
    const { confirmar, notificarCorrecto, prompt, notificarError } =
      useNotificaciones()

    /*************
     * Hooks
     **************/
    onReestablecer(() => {
      establecerJefeInmediato()
    })
    onGuardado((id, response) => {
      emit('cerrar-modal', false)
      emit('guardado', {
        formulario: 'VendedorPage',
        id: id,
        modelo: response.modelo
      })
    })
    onModificado(() => establecerJefeInmediato())

    const tabDefecto = ref('1')

    const { empleados, filtrarEmpleados, modalidades, filtrarModalidades } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            // campos: 'id,nombres,apellidos',
            comercial: 1,
            estado: 1
          }
        },
        modalidades: {
          controller: new ModalidadController(),
          params: { campos: 'id,nombre' }
        }
      })

      empleados.value = listadosAuxiliares.empleados
      modalidades.value = listadosAuxiliares.modalidades

      //Datos por defecto
      establecerJefeInmediato()
    })
    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: { required },
      modalidad: { required },
      tipo_vendedor: { required },
      jefe_inmediato: { required }
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

    /**
     * Establece el jefe de ventas por defecto como Jefe Inmediato
     * y en caso de no encontrarlo, coloca el usuario con la sesión actual
     */
    function establecerJefeInmediato (){
      vendedor.jefe_inmediato = empleados.value.filter((empleado:Empleado)=>empleado.nombre_cargo=='JEFE DE VENTAS')[0]?.id || store.user.id
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
            mensaje:
              'Ingresa el motivo por el que quieres desactivar este vendedor?',
            accion: async data => {
              try {
                cargando.activar()
                await new CambiarEstadoVendedor().anular(entidad.id, {
                  causa_desactivacion: data
                })
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
      },
      visible: ({ entidad }) =>
        entidad.activo && store.can('puede.desactivar.vendedores_claro')
    }
    const btnDesactivarMasivo: CustomActionTable = {
      titulo: 'Actualizar vendedores',
      icono: 'bi-arrow-clockwise',
      color: 'positive',
      accion: async () => {
        try {
          const { response, message } =
            await new CambiarEstadoVendedor().desactivarMasivo()
          if (response.status == 200) notificarCorrecto(message)
          filtrarVendedores(tabDefecto.value)
        } catch (e) {
          console.error(e)
          notificarError('Error: '+e)
        }
      }, visible:()=> store.esAdministrador
    }
    const btnActivar: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Activar Vendedor',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de activar el vendedor?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de activación',
            mensaje:
              'Ingresa el motivo por el que quieres activar este proveedor?',
            accion: async data => {
              try {
                cargando.activar()
                await new CambiarEstadoVendedor().anular(entidad.id, {
                  causa_desactivacion: data
                })
                listado.value.splice(posicion, 1)
                notificarCorrecto('Activado correctamente')
              } catch (error: any) {
                notificarError(error?.response.data.message)
              } finally {
                cargando.desactivar()
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad }) =>
        !entidad.activo && store.can('puede.activar.vendedores_claro')
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
      ordenarLista,
      filtrarEmpleados,
      filtrarModalidades,
      filtrarVendedores,

      //botones de tabla
      btnDesactivarMasivo,
      btnActivar,
      btnDesactivar
    }
  }
})
