import { defineComponent, ref } from 'vue'
import { Transferencia } from '../domain/Transferencia'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {
  maxLength,
  maxValue,
  required,
  requiredIf
} from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransferenciaController } from '../infrestructure/TransferenciaController'
import { configuracionColumnasTransferencia } from '../domain/configuracionColumnasTransferencia'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { useAuthenticationStore } from 'stores/authentication'
import { useTransferenciaSaldoStore } from 'stores/transferenciaSaldo'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { EmpleadoPermisoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoPermisosController'
import { optionsFecha, ordenarLista } from 'shared/utils'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { maskFecha } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { AprobarTransferenciaController } from 'pages/fondosRotativos/autorizarTransferencia/infrestructure/AprobarTransferenciaController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import {useFiltrosListadosSelects} from 'shared/filtrosListadosGenerales';

export default defineComponent({
  components: { ErrorComponent, NoOptionComponent, TabLayout, SelectorImagen },
  emits: ['guardado', 'cerrar-modal'],

  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const { prompt, notificarCorrecto, notificarAdvertencia, confirmar } =
      useNotificaciones()
    const usuario = store.user
    const transferenciaSaldoStore = useTransferenciaSaldoStore()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Transferencia,
      new TransferenciaController()
    )
    const {
      entidad: transferencia,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar } =
      mixin.useComportamiento()
    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)
    const empleados_delegadores = ref([])
    const {empleados, filtrarEmpleados, tareas, filtrarTareas} = useFiltrosListadosSelects(listadosAuxiliares)
    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario_envia: {
        required: requiredIf(() => store.can('puede.registrar.fondos_terceros'))
      },
      usuario_recibe: {
        requiredIf: requiredIf(() => !transferencia.es_devolucion)
      },
      monto: {
        required,
        maxValue: maxValue(9999),
        maxLength: maxLength(50)
      },
      cuenta: {
        required,
        maxLength: maxLength(50)
      },
      tarea: {
        requiredIf: requiredIf(() => !transferencia.es_devolucion)
      },
      fecha: { required },
      comprobante: {
        required
      },
      observacion: {
        required,
        maxLength: maxLength(150)
      }
    }

    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    /* Checking if the id_transferencia is not null, if it is not null, it is going to consult the
                   transfer with the id_transferencia, it is going to set the value of mostrarListado to false and
                   the value of mostrarAprobacion to true, and it is going to set the value of esDevolucion to true
                   if the user_recibe is not null, if it is null, it is going to set the value of esDevolucion to
                   false. */
    if (transferenciaSaldoStore.id_transferencia) {
      consultar({ id: transferenciaSaldoStore.id_transferencia })
      mostrarListado.value = false
      mostrarAprobacion.value = true
      // esDevolucion.value = transferencia.usuario_recibe !== null ? true : false
    }

    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        tareas: {
          controller: new TareaController(),
          params: {
            campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id',
            'f_params[orderBy][field]': 'id',
            'f_params[orderBy][type]': 'DESC',
            'f_params[limit]': 100
          }
        }
      })
      listadosAuxiliares.tareas.unshift({
        id: 0,
        titulo: 'Sin Tarea',
        codigo_tarea: ' '
      })
      tareas.value = listadosAuxiliares.tareas
      empleados.value = listadosAuxiliares.empleados

      if (store.can('puede.registrar.fondos_terceros')) {
        await obtenerEmpleadosDelegadores()
      }
    })

    /*********
     * Filtros
     **********/
    async function obtenerEmpleadosDelegadores() {
      const response = await new EmpleadoPermisoController().listar({
        permisos: ['puede.delegar.registro_fondos']
      })
      empleados_delegadores.value = response.result
    }




    /**
     * It checks if the value of the checkbox is true, if it is, it sets the value of the user_recibe to
     * null and the value of the reason to DEVOLUCION. If it is not true, it sets the value of the reason
     * to TRANSFERENCIA ENTRE USUARIOS.
     */
    function existeDevolucion() {
      if (transferencia.es_devolucion) {
        transferencia.usuario_recibe = null
        transferencia.tarea = 0
        transferencia.motivo = 'DEVOLUCION'
      } else {
        transferencia.motivo = 'TRANSFERENCIA ENTRE USUARIOS'
        transferencia.tarea = null
      }
    }

    async function aprobarTransferenciaForzado(data:any) {
      try {
        const aprobarTransferenciaController =
          new AprobarTransferenciaController()
        await aprobarTransferenciaController.aprobarTransferencia(data)
        notificarCorrecto('Transferencia aprobada con éxito')
      } catch (error) {
        notificarAdvertencia(
          'Ha ocurrido un error al intentar aprobar la transferencia'
        )
      }
    }

    /**********************
     * BOTONES DE TABLA
     *********************/
    const btnAprobarTransferenciaForzado: CustomActionTable<Transferencia> = {
      titulo: 'Aprobar Fzd',
      tooltip: 'Aprobar transferencia forzada',
      icono: 'bi-check-square',
      color: 'warning',
      accion: ({ entidad }) => {
        confirmar(
          '¿Está seguro que desea aprobar la transferencia de este empleado?',
          () => {
            const data: CustomActionPrompt = {
              titulo: 'Motivo de la interferencia',
              mensaje:
                'Ingrese el motivo por el que desea aprobar la transferencia de alguien más',
              requerido: true,
              validacion: val => !!val,
              accion: async motivo => {
                entidad.motivo_aprobacion_tercero = motivo
                await aprobarTransferenciaForzado(entidad)
              }
            }
            prompt(data)
          }
        )
      },
      visible: ({ entidad }) => store.esContabilidad && entidad.estado == 3
    }
    return {
      mixin,
      transferencia,
      disabled,
      accion,
      maskFecha,
      v$,
      store,
      empleados_delegadores,
      optionsFecha,
      usuario,
      ordenarLista,
      existeDevolucion,
      mostrarListado,
      btnAprobarTransferenciaForzado,
      configuracionColumnas: configuracionColumnasTransferencia,
      empleados, filtrarEmpleados, tareas, filtrarTareas,
    }
  }
})
