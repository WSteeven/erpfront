import { defineComponent, computed, ref, onMounted } from 'vue'
import { ValorAcreditar } from '../domain/ValorAcreditar'
import { apiConfig, endpoints } from 'config/api'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
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
import { acciones, accionesTabla } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import axios from 'axios'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { TabLayout, EssentialTable, ButtonSubmits },
  setup(props, { emit }) {
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
    const { setValidador, guardar, editar, reestablecer } =
      mixin.useComportamiento()
    const { entidad: valorAcreditar, disabled, accion } = mixin.useReferencias()
    const authenticationStore = useAuthenticationStore()
    const { confirmar, prompt,
      notificarCorrecto, notificarError } = useNotificaciones()

    const deshabilitar_empleado = ref(true)
    const mostrar_formulario = ref(false)
    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: {
        required: true,
      },
      acreditacion_semana: {
        required: true,
      },
      monto_generado: {
        required: true,
      },
      monto_modificado: {
        required: true,
      },
      motivo:{
        required: true,
      }
    }
    const v$ = useVuelidate(reglas, valorAcreditar)
    setValidador(v$.value)
    const { consultar, cargarVista, obtenerListados,eliminar } =
      mixin.useComportamiento()
    const { listado, listadosAuxiliares } = mixin.useReferencias()
    const empleados = ref([])
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
      listado.value = (
        await new ValorAcreditarController().listar({
          acreditacion_semana_id: acreditacionesStore.idAcreditacionSeleccionada,
        })
      ).result
    })

    async function guardarDatos(valoracreditar: ValorAcreditar) {
      try {
        let entidad: ValorAcreditar = new ValorAcreditar()
        if (accion.value == 'NUEVO') {
          entidad = await guardar(valoracreditar)
          const valorAcreditarAux = new ValorAcreditar()
          valorAcreditarAux.hydrate(entidad)
        } else {
          await editar(valoracreditar, true)
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
      titulo: '',
      icono: 'bi-trash',
      color: 'secondary',
      visible: () =>
        authenticationStore.can('puede.eliminar.valor_acreditar') && !acreditacionesStore.esta_acreditado,
      accion: ({ entidad, posicion }) => {
        accion.value = 'ELIMINAR'
       // eliminar(entidad);
       eliminar_acreditacion({entidad,posicion})
      },
    }
   async  function eliminar_acreditacion({ entidad, posicion }) {
      try {

        const data: CustomActionPrompt = {
          titulo: 'Anular Acreditacion',
          mensaje: 'Ingrese motivo de anulacion',
          accion: async (data) => {
            console.log('Eliminar',entidad);
            entidad.estado = false
            entidad.motivo = data
              valorAcreditar.id= entidad.id
              valorAcreditar.estado = false
              valorAcreditar.motivo = data
              await editar(entidad, true)
              notificarCorrecto('Se ha anulado Acreditacion')
              listado.value.splice(posicion, 1)
          },
        }
        prompt(data)
    } catch (e: any) {
      notificarError(
        'No se pudo anular, debes ingresar un motivo para la anulacion'
      )
    }
  }
  function filtrarEmpleados(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    const btnEditarAcreditacionEmpleado: CustomActionTable = {
      titulo: '',
      icono: 'bi-pencil',
      color: 'warning',
      visible: () => {
        return authenticationStore.can('puede.editar.valor_acreditar') && !acreditacionesStore.esta_acreditado
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
      },
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
      },
    }
    const btnNevoEmpleadoAcreditar: CustomActionTable = {
      titulo: 'Agregar',
      icono: 'bi-plus',
      color: 'positive',
      visible: () => {
        return authenticationStore.can('puede.crear.valor_acreditar')&& acreditacionesStore.esta_acreditado==false
      },
      accion: () => {
        accion.value = 'NUEVO'
        valorAcreditar.acreditacion_semana = acreditacionesStore.idAcreditacionSeleccionada
        mostrar_formulario.value = true
        deshabilitar_empleado.value = false
      },
    }

    const totalAcreditar = computed(() => {
      const suma = listado.value.reduce(
        (acumulador, elemento) =>

          acumulador + parseFloat(elemento.monto_modificado.replace(/,/g, '')),
        0
      )
      return suma
    })
    function saldo_anterior() {
      if (accion.value == 'NUEVO') {
        const axiosHttpRepository = AxiosHttpRepository.getInstance()
        const url_acreditacion =
          apiConfig.URL_BASE +
          '/' +
          axiosHttpRepository.getEndpoint(endpoints.monto_acreditar_usuario) +
          valorAcreditar.empleado
        axios({
          url: url_acreditacion,
          method: 'GET',
          responseType: 'json',
          headers: {
            Authorization:
              axiosHttpRepository.getOptions().headers.Authorization,
          },
        }).then((response: HttpResponseGet) => {
          const { data } = response
          if (data) {
            valorAcreditar.monto_generado = data.monto_acreditar
            valorAcreditar.monto_modificado = data.monto_acreditar
          }
        })
      }
    }
    onMounted(()=>{
      console.log('monted',listado.value);

      listado.value.forEach((v)=>{
        console.log(v)
      })
    })

    return {
      mixin,
      disabled,
      accion,
      guardarDatos,
      reestablecerDatos,
      v$,
      valorAcreditar,
      filtrarEmpleados,
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
      mostrar_formulario,
      accionesTabla,
    }
  },
})
