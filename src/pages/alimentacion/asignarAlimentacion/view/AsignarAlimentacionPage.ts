import { defineComponent, ref } from 'vue'
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

export default defineComponent({
  components: { TabLayout, ModalesEntidad },
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
    const { setValidador, obtenerListados, cargarVista,listar } =
      mixin.useComportamiento()
    const { confirmar, prompt, notificarCorrecto, notificarError } =
      useNotificaciones()

    const empleados = ref([])
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
                      asignacionAlimentacionStore.valor_asignar=data
                      await asignacionAlimentacionStore.listarempleados()
                      modales.abrirModalEntidad('SeleccionEmpleadoPage')
                    } catch (e: any) {
                      notificarError(
                        'No se pudo asignar alimentacion'
                      )
                    }
                  },
                }
                prompt(data)
              }
            )
          }
        )
      },
      visible: () => true,
    }
    async function guardado(data) {
      console.log(data)
      await listar()
    }
    return {
      mixin,
      asignar_alimentacion,
      guardado,
      filtrarEmpleados,
      btnSeleccionarEmpleado,
      maskFecha,
      empleados,
      modales,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasAsignarAlimentacion,
    }
  },
})
