import { defineComponent, ref, watchEffect } from 'vue'
import { Transferencia } from '../domain/Transferencia'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransferenciaController } from '../infrestructure/TransferenciaController'
import { configuracionColumnasTransferencia } from '../domain/configuracionColumnasTransferencia'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { useAuthenticationStore } from 'stores/authentication'
import { useTransferenciaSaldoStore } from 'stores/transferenciaSaldo'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  emits: ['guardado', 'cerrar-modal'],

  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const authenticationStore = useAuthenticationStore()
    const usuario = authenticationStore.user
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
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar } =
      mixin.useComportamiento()
    const usuarios = ref([])
    const esDevolucion = ref(false)
    const tareas = ref([])
    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)
    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario_recibe: {
        requiredIf: esDevolucion.value ? true : false,
      },
      monto: {
        required,
        maxLength: maxLength(50),
      },
      cuenta: {
        required,
        maxLength: maxLength(50),
      },
      tarea: {
        requiredIf: esDevolucion.value ? true : false,
      },
      comprobante: {
        required,
      },
      observacion: {
        maxLength: maxLength(150),
      },
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
      esDevolucion.value = transferencia.usuario_recibe !== null ? true : false
    }

    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id' },
        },
      })
      listadosAuxiliares.tareas.unshift({
        id: 0,
        titulo: 'Sin Tarea',
        codigo_tarea: ' ',
      })
      tareas.value = listadosAuxiliares.tareas
      usuarios.value = listadosAuxiliares.usuarios
    })

    /*********
     * Filtros
     **********/
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
          (v) =>
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
          (v) =>
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
        transferencia.tarea =0
        transferencia.motivo = 'DEVOLUCION'
      } else {
        transferencia.motivo = 'TRANSFERENCIA ENTRE USUARIOS'
      }
      esDevolucion.value = transferencia.es_devolucion
    }

  watchEffect(() => {
      existeDevolucion()
    })
     return {
      mixin,
      transferencia,
      esDevolucion,
      disabled,
      accion,
      v$,
      usuarios,
      usuario,
      tareas,
      filtrarUsuarios,
      filtrarTareas,
      existeDevolucion,
      mostrarListado,
      configuracionColumnas: configuracionColumnasTransferencia,
    }
  },
})
