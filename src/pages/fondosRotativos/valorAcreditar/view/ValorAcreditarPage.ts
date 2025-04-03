import { computed, defineComponent, onMounted, ref } from 'vue'
import { ValorAcreditar } from '../domain/ValorAcreditar'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValorAcreditarController } from '../infrestructure/ValorAcreditarController'
import { configuracionColumnasValorAcreditar } from '../domain/configuracionColumnasValorAcreditar'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useAcreditacionesStore } from 'stores/acreditaciones'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import { accionesTabla, tabOptionsValoresAcreditar } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { minValue, required, requiredIf } from 'shared/i18n-validators'
import { ValorAcreditarEmpleadoController } from '../infrestructure/ValorAcreditarEmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    TabLayout,
    TabLayoutFilterTabs2,
    EssentialTable,
    ButtonSubmits
  },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const acreditacionesStore = useAcreditacionesStore()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      ValorAcreditar,
      new ValorAcreditarController()
    )
    const { setValidador, guardar, editar, reestablecer, listar } =
      mixin.useComportamiento()
    const { entidad: valorAcreditar, disabled, accion } = mixin.useReferencias()
    const authenticationStore = useAuthenticationStore()
    const { prompt, notificarCorrecto, notificarError } = useNotificaciones()

    const deshabilitar_empleado = ref(true)
    const mostrar_formulario = ref(false)
    const acreditacion_semana = ref(acreditacionesStore.acreditacion_semana)
    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: {
        required
      },
      acreditacion_semana: {
        required
      },
      monto_generado: {
        required
      },
      monto_modificado: {
        minimo: minValue(1)
      },
      motivo: {
        required: requiredIf(() => valorAcreditar.estado)
      }
    }
    const v$ = useVuelidate(reglas, valorAcreditar)
    setValidador(v$.value)
    const { cargarVista, obtenerListados } = mixin.useComportamiento()
    const { listado, listadosAuxiliares } = mixin.useReferencias()
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        }
      })
      empleados.value = listadosAuxiliares.empleados
      listado.value = (
        await new ValorAcreditarController().listar({
          acreditacion_semana_id: acreditacionesStore.acreditacion_semana.id
        })
      ).result
    })

    async function guardarDatos(valoracreditar: ValorAcreditar) {
      try {
        let entidad: ValorAcreditar = new ValorAcreditar()
        if (accion.value == 'NUEVO') {
          if (await v$.value.$validate()) {
            entidad = await guardar(valoracreditar)
            const valorAcreditarAux = new ValorAcreditar()
            valorAcreditarAux.hydrate(entidad)
          }
        } else {
          if (await v$.value.$validate()) {
            await editar(valoracreditar, true)
          }
        }
        mostrar_formulario.value = false
      } catch (e) {
        console.log(e)
      }
    }

    function reestablecerDatos() {
      reestablecer()
      mostrar_formulario.value = false
    }
    const btnEliminarAcreditacionEmpleado: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'secondary',
      visible: ({ entidad }) =>
        authenticationStore.can('puede.eliminar.valor_acreditar') &&
        !acreditacionesStore.esta_acreditado &&
        entidad.estado,
      accion: ({ entidad, posicion }) => {
        accion.value = 'ELIMINAR'
        eliminar_acreditacion({ entidad, posicion })
      }
    }
    const btnActivarAcreditacionEmpleado: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      visible: ({ entidad }) => {
        return (
          authenticationStore.can('puede.eliminar.valor_acreditar') &&
          !acreditacionesStore.esta_acreditado &&
          !entidad.estado
        )
      },

      accion: ({ entidad, posicion }) => {
        accion.value = 'ELIMINAR'
        activar_acreditacion({ entidad, posicion })
      }
    }

    async function activar_acreditacion({ entidad }) {
      try {
        entidad.estado = true
        entidad.motivo = ' '
        valorAcreditar.id = entidad.id
        valorAcreditar.empleado = entidad.empleado
        valorAcreditar.acreditacion_semana = entidad.acreditacion_semana
        valorAcreditar.monto_generado = entidad.monto_generado
        valorAcreditar.monto_modificado = entidad.monto_modificado
        valorAcreditar.estado = false
        valorAcreditar.motivo = ' '
        await editar(entidad, true)
        notificarCorrecto('Se ha activado empleado')
        tabValorAcreditar.value = '1'
        filtrarValoresAcreditar('1')
      } catch (e: any) {
        console.log(e.message)
        notificarError(
          'No se pudo anular, debes ingresar un motivo para la anulacion'
        )
      }
    }
    async function eliminar_acreditacion({ entidad, posicion }) {
      try {
        const data: CustomActionPrompt = {
          titulo: 'Anular Acreditacion',
          mensaje: 'Ingrese motivo de anulacion',
          accion: async data => {
            entidad.estado = false
            entidad.motivo = data
            valorAcreditar.id = entidad.id
            valorAcreditar.empleado = entidad.empleado
            valorAcreditar.acreditacion_semana = entidad.acreditacion_semana
            valorAcreditar.monto_generado = entidad.monto_generado
            valorAcreditar.monto_modificado = entidad.monto_modificado
            valorAcreditar.estado = false
            valorAcreditar.motivo = data
            await editar(entidad, true)
            notificarCorrecto('Se ha anulado Acreditacion')
            listado.value.splice(posicion, 1)
          }
        }
        prompt(data)
      } catch (e: any) {
        notificarError(
          'No se pudo anular, debes ingresar un motivo para la anulacion'
        )
      }
    }

    const btnEditarAcreditacionEmpleado: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      color: 'warning',
      visible: () => {
        return (
          authenticationStore.can('puede.editar.valor_acreditar') &&
          !acreditacionesStore.esta_acreditado
        )
      },
      accion: ({ entidad }) => {
        deshabilitar_empleado.value = true
        accion.value = 'EDITAR'
        valorAcreditar.id = entidad.id
        valorAcreditar.empleado = entidad.empleado
        valorAcreditar.acreditacion_semana = entidad.acreditacion_semana
        valorAcreditar.monto_generado = entidad.monto_generado
        valorAcreditar.monto_modificado = entidad.monto_modificado
        mostrar_formulario.value = true
      }
    }
    const btnVerAcreditacionEmpleado: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'primary',
      visible: () => {
        return authenticationStore.can('puede.ver.valor_acreditar')
      },
      accion: ({ entidad }) => {
        accion.value = 'CONSULTAR'
        valorAcreditar.id = entidad.id
        valorAcreditar.empleado = entidad.empleado
        valorAcreditar.acreditacion_semana = entidad.acreditacion_semana
        valorAcreditar.monto_generado = entidad.monto_generado
        valorAcreditar.monto_modificado = entidad.monto_modificado
        mostrar_formulario.value = true
      }
    }
    const btnNevoEmpleadoAcreditar: CustomActionTable = {
      titulo: 'Agregar',
      icono: 'bi-plus',
      color: 'positive',
      visible: () => {
        return (
          authenticationStore.can('puede.crear.valor_acreditar') &&
          acreditacionesStore.esta_acreditado == false
        )
      },
      accion: () => {
        accion.value = 'NUEVO'
        valorAcreditar.acreditacion_semana =
          acreditacionesStore.acreditacion_semana.id
        mostrar_formulario.value = true
        deshabilitar_empleado.value = false
      }
    }

    const totalAcreditar = computed(() => {
      return listado.value
        .filter(elemento => elemento.estado === true)
        .reduce(
          (acumulador, elemento) =>
            acumulador +
            parseFloat(elemento.monto_modificado.replace(/,/g, '')),
          0
        )
    })
    async function saldo_anterior() {
      if (accion.value == 'NUEVO') {
        const monto_acreditar_empleado = new ValorAcreditarEmpleadoController()
        if (valorAcreditar.empleado) {
          const { response } = await monto_acreditar_empleado.consultar(
            valorAcreditar.empleado
          )
          valorAcreditar.monto_generado = response.data.monto_acreditar
          valorAcreditar.monto_modificado = response.data.monto_acreditar
        }
      }
    }
    onMounted(() => {
      listado.value.forEach(v => {
        console.log(v)
      })
    })
    const tabValorAcreditar = ref('1')
    function filtrarValoresAcreditar(tabSeleccionado: string) {
      listar(
        {
          estado: tabSeleccionado,
          acreditacion_semana_id: acreditacionesStore.acreditacion_semana.id
        },
        false
      )
      tabValorAcreditar.value = tabSeleccionado
    }
    return {
      mixin,
      disabled,
      accion,
      guardarDatos,
      reestablecerDatos,
      v$,
      valorAcreditar,
      filtrarEmpleados,
      filtrarValoresAcreditar,
      saldo_anterior,
      onMounted,
      totalAcreditar,
      empleados,
      deshabilitar_empleado,
      listado,
      configuracionColumnasValorAcreditar,
      btnNevoEmpleadoAcreditar,
      btnEditarAcreditacionEmpleado,
      btnEliminarAcreditacionEmpleado,
      btnVerAcreditacionEmpleado,
      btnActivarAcreditacionEmpleado,
      mostrar_formulario,
      accionesTabla,
      tabOptionsValoresAcreditar,
      configuracionColumnas: configuracionColumnasValorAcreditar,
      tabValorAcreditar,
      acreditacion_semana
    }
  }
})
