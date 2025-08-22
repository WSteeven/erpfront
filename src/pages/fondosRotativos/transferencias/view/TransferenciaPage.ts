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

export default defineComponent({
  components: { ErrorComponent, NoOptionComponent, TabLayout, SelectorImagen },
  emits: ['guardado', 'cerrar-modal'],

  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
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
    const usuarios = ref([])
    const tareas = ref([])
    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)
    const empleados_delegadores = ref([])
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
        usuarios: {
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
      usuarios.value = listadosAuxiliares.usuarios

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

    function filtrarUsuarios(val, update) {
      if (val === '') {
        update(() => {
          usuarios.value = listadosAuxiliares.usuarios
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        usuarios.value = listadosAuxiliares.usuarios.filter(
          v =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /**Filtro de Tareas */
    function filtrarTareas(val, update) {
      if (val === '') {
        update(() => {
          tareas.value = listadosAuxiliares.tareas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()

        tareas.value = listadosAuxiliares.tareas.filter(
          v =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.titulo.toLowerCase().indexOf(needle) > -1
        )
      })
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
      usuarios,
      usuario,
      tareas,
      ordenarLista,
      filtrarUsuarios,
      filtrarTareas,
      existeDevolucion,
      mostrarListado,
      configuracionColumnas: configuracionColumnasTransferencia
    }
  }
})
