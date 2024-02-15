import { defineComponent, ref, reactive } from 'vue'
import { AsignarAlimentacion } from '../domain/AsignarAlimentacion'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { AsignarAlimentacionController } from '../infrestructure/AsignarAlimentacionController'
import { configuracionColumnasAsignarAlimentacion } from '../domain/configuracionColumnasAsignarAlimentacion'
import { maskFecha } from 'config/utils'
import { ComportamientoModalesSeleccionEmpleado } from '../application/ComportamientoModalesSeleccionEmpleado'
import { useAsignacionAlimentacionStore } from 'stores/recursosHumanos/asignacionAlimentacion'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: { TabLayout, ModalesEntidad, SolicitarFecha },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      AsignarAlimentacion,
      new AsignarAlimentacionController()
    )
    const {
      entidad: asignar_alimentacion,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { confirmar, prompt, notificarError, promptItems } =
      useNotificaciones()
      const authenticationStore = useAuthenticationStore()

    const empleados = ref([])
    const visualizar_corte = ref(false)
    const modales = new ComportamientoModalesSeleccionEmpleado()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
    })
    const mostrarSolicitarFecha = ref(false)

    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: {
        required: true,
      },
      valor_minimo: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, asignar_alimentacion)
    setValidador(v$.value)
    const asignacionAlimentacionStore = useAsignacionAlimentacionStore()

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

    const btnSeleccionarEmpleado: CustomActionTable = {
      titulo: 'Seleccionar',
      tooltip: 'Seleccionar Empleado',
      icono: 'bi-box-arrow-in-down',
      accion: async () => {
        confirmar(
          '¿Está seguro de realizar la asignacion de alimentacion?',
          async () => {
            confirmar(
              'Esto asignara alimentacion a los empleado. ¿Desea continuar?',
              async () => {
                const data: CustomActionPrompt = {
                  titulo: 'Valor de Alimentacion',
                  mensaje: 'Ingrese  valor a acreditar de alimentacion',
                  accion: async (data) => {
                    try {
                      asignacionAlimentacionStore.valor_asignar = data
                      await asignacionAlimentacionStore.listarempleados()
                      modales.abrirModalEntidad('SeleccionEmpleadoPage')
                    } catch (e: any) {
                      notificarError('No se pudo asignar alimentacion')
                    }
                  },
                }
                prompt(data)
              }
            )
          }
        )
      },
      visible: () => authenticationStore.can('puede.ver.bnt.seleccionar_empleados'),
    }
    const lista_periodo_corte = [
      { id: true, name: 'Quincena' },
      { id: false, name: 'Fin de Mes' },
    ]
    const btnRealizarCorte: CustomActionTable = {
      titulo: 'Realizar Corte',
      tooltip: 'Seleccionar Periodo de Corte',
      icono: 'fa-solid fa-utensils',
      color: 'warning',
      accion: async () => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'De que periodo desea  realizar el corte',
          accion: (tipo) => {
            asignacionAlimentacionStore.alimentacion.es_quincena = tipo
            mostrarSolicitarFecha.value = true
          },
          requerido: false,
          defecto: 'false',
          tipo: 'radio',
          items: lista_periodo_corte.map((tipo) => {
            return {
              label: tipo.name,
              value: tipo.id,
            }
          }),
        })
        promptItems(config)
      },
      visible: () => authenticationStore.can('puede.ver.bnt.corte_asignacion_alimentaciones'),
    }
    const btnVisualizarCorte: CustomActionTable = {
      titulo: 'Visualizar Corte',
      tooltip: 'Visualizar Corte de alimentacion',
      icono: 'bi-eye-fill',
      color: 'primary',
      accion: async () => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'De que periodo desea visualizar el corte',
          accion: (tipo) => {
            asignacionAlimentacionStore.alimentacion.es_quincena = tipo
            visualizar_corte.value = true
            mostrarSolicitarFecha.value = true
          },
          requerido: false,
          defecto: 'false',
          tipo: 'radio',
          items: lista_periodo_corte.map((tipo) => {
            return {
              label: tipo.name,
              value: tipo.id,
            }
          }),
        })
        promptItems(config)
      },
      visible: () => authenticationStore.can('puede.ver.detalle_alimentaciones'),
    }
    async function guardado(data) {
      await listar()
    }
    function fechaSubida(fecha?) {
      asignacionAlimentacionStore.alimentacion.mes = fecha
      if (!visualizar_corte.value) {
        confirmar(
          'Esto realizara los cortes de valores de alimentacion de los empleados. ¿Desea continuar?',
          async () => {
            asignacionAlimentacionStore.realizarCorte()
            modales.abrirModalEntidad('DetalleAlimentacionPage')
          }
        )
      } else {
        asignacionAlimentacionStore.obtenerAlimentacion()
        modales.abrirModalEntidad('DetalleAlimentacionPage')
      }
    }

    return {
      mixin,
      asignar_alimentacion,
      guardado,
      mostrarSolicitarFecha,
      filtrarEmpleados,
      btnSeleccionarEmpleado,
      btnRealizarCorte,
      btnVisualizarCorte,
      maskFecha,
      empleados,
      modales,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasAsignarAlimentacion,
      fechaSubida,
    }
  },
})
