import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { configuracionColumnasAutorizadoresDirectos } from 'pages/fondosRotativos/gasto/modules/autorizadoresDirectos/domain/configuracionColumnasAutorizadoresDirectos'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AutorizadorDirecto } from 'pages/fondosRotativos/gasto/modules/autorizadoresDirectos/domain/AutorizadorDirecto'
import { AutorizadorDirectoController } from 'pages/fondosRotativos/gasto/modules/autorizadoresDirectos/infraestructure/AutorizadorDirectoController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { ordenarLista } from 'shared/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      AutorizadorDirecto,
      new AutorizadorDirectoController()
    )
    const {
      entidad: autorizacion,
      accion,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar, editar } =
      mixin.useComportamiento()

    const tabDefecto = ref('1')
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        }
      })

      empleados.value = listadosAuxiliares.empleados
    })
    const reglas = {
      empleado: { required },
      autorizador: { required }
    }
    const v$ = useVuelidate(reglas, autorizacion)
    setValidador(v$.value)

    /************************
     * FUNCIONES
     ************************/
    async function filtrarAutorizaciones(tab: string) {
      tabDefecto.value = tab
      await listar({ activo: tab })
    }

    /************************
     * BOTONES DE TABLA
     ************************/
    const btnActivar: CustomActionTable<AutorizadorDirecto> = {
      titulo: '',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Activar',
      accion: async ({ entidad }) => {
        autorizacion.id = entidad.id
        autorizacion.empleado = entidad.empleado_id
        autorizacion.autorizador = entidad.autorizador_id
        autorizacion.activo = true

        await editar(autorizacion, true)
        await filtrarAutorizaciones('1')
      },
      visible: () => tabDefecto.value == '0'
    }

    const btnDesactivar: CustomActionTable<AutorizadorDirecto> = {
      titulo: '',
      icono: 'bi-toggle2-off',
      color: 'negative',
      tooltip: 'Desactivar',
      visible: () => tabDefecto.value == '1',
      accion: async ({ entidad }) => {
        autorizacion.id = entidad.id
        autorizacion.empleado = entidad.empleado_id
        autorizacion.autorizador = entidad.autorizador_id
        autorizacion.activo = false

        await editar(autorizacion, true)
        await filtrarAutorizaciones('0')
      }
    }

    return {
      v$,
      mixin,
      autorizacion,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasAutorizadoresDirectos,
      tabDefecto,
      tabOptions: tabOptionsProveedoresInternacionales,
      // listados
      empleados,
      filtrarEmpleados,

      // botones de tabla
      btnActivar,
      btnDesactivar,

      // funciones
      filtrarAutorizaciones,
      ordenarLista
    }
  }
})
