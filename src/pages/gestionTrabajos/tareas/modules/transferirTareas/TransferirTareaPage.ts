// Dependencias
import { configuracionColumnasTarea } from 'tareas/domain/configuracionColumnasTarea'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useFiltrosListadosTarea } from '../../application/FiltrosListadosTarea'
import { required } from 'shared/i18n-validators'
import { defineComponent, reactive, ref } from 'vue'
import { rolesSistema } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TareaController } from '../../infraestructure/TareaController'
import { Tarea } from '../../domain/Tarea'
import { useRouter } from 'vue-router'
import { useNotificaciones } from 'shared/notificaciones'
import { useTareaStore } from 'stores/tarea'
import { useAuthenticationStore } from 'stores/authentication'
import { Ref } from 'vue'

export default defineComponent({
  components: {
    EssentialTable,
  },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    /*********
    * Stores
    *********/
    const tareaStore = useTareaStore()
    const authenticationStore = useAuthenticationStore()

    /*******
    * Mixin
    ********/
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())
    const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { listado, listadosAuxiliares } = mixin.useReferencias()

    cargarVista(async () => {
      await obtenerListados({
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador, campos: 'id,nombres,apellidos' },
        },
      })

      coordinadores.value = listadosAuxiliares.coordinadores
    })

    /************
     * Variables
    ************/
    const refTareas = ref()
    const router = useRouter()
    const { notificarAdvertencia, notificarCorrecto, confirmar } = useNotificaciones()
    const transferencia = reactive({
      actual_coordinador: null,
      nuevo_coordinador: null,
    })
    const puedeSeleccionarActualCoordinador = authenticationStore.esCoordinadorBackup || authenticationStore.esJefeTecnico
    // const tareasTransferir: Ref<Tarea[]> = ref([])
    /*******
     * Init
     *******/
    if (authenticationStore.esCoordinador && !authenticationStore.esCoordinadorBackup && !authenticationStore.esJefeTecnico) {
      listar({ finalizado: false })
      transferencia.actual_coordinador = authenticationStore.user.id
    }

    /***************
     * Validaciones
     ***************/
    const reglas = {
      actual_coordinador: { required },
      nuevo_coordinador: { required },
    }
    const v$ = useVuelidate(reglas, transferencia)

    /*********
    * Filtros
    **********/
    const { coordinadores, filtrarCoordinadores } =
      useFiltrosListadosTarea(listadosAuxiliares)

    /************
    * Funciones
    ************/
    async function transferir(idsTareas: (number | null)[]) {
      if (!idsTareas.length) return notificarAdvertencia('Debe seleccionar al menos una tarea para transferir')

      if (await v$.value.$validate()) {
        try {
          confirmar('¿Está seguro de realizar la transferencia?', async () => {
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.transferir_mis_tareas_activas)
            const response: AxiosResponse = await axios.post(ruta, {
              // actual_coordinador: transferencia.actual_coordinador,
              nuevo_coordinador: transferencia.nuevo_coordinador,
              ids_tareas: idsTareas,
            })

            notificarCorrecto(response.data.mensaje)
            tareaStore.recargaTareasActivas = true
            emit('cerrar-modal', false)
          })
        } catch (e: any) {
          notificarAdvertencia(e)
        }
      }
    }

    function filtrarTareasPorCoordinador() {
      listar({ coordinador_id: transferencia.actual_coordinador, finalizado: false })
      refTareas.value.clearSelection()
    }

    async function irControlTareas() {
      emit('cerrar-modal', false)
      await router.replace({ name: 'tareas' })
    }

    function cancelar() {
      emit('cerrar-modal', false)
    }

    const seleccionarTareas = () => {
      refTareas.value.seleccionar()
    }

    const tareasSeleccionadas = (tareas: Tarea[]) => {
      console.log(tareas)
      const idsTareas = tareas.map((tarea: Tarea) => tarea.id)

      transferir(idsTareas)
    }

    return {
      v$,
      refTareas,
      transferencia,
      coordinadores,
      filtrarCoordinadores,
      listado,
      irControlTareas,
      configuracionColumnasTarea,
      puedeSeleccionarActualCoordinador,
      // Functions
      transferir,
      cancelar,
      filtrarTareasPorCoordinador,
      seleccionarTareas,
      tareasSeleccionadas,
    }
  }
})
