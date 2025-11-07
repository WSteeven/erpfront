import { defineComponent, onMounted, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Grupo } from 'recursosHumanos/grupos/domain/Grupo'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { acciones } from 'config/utils'
import { VehiculoController } from 'vehiculos/vehiculos/infraestructure/VehiculoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useVuelidate } from '@vuelidate/core'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { ordenarLista } from 'shared/utils'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useNotificaciones } from 'shared/notificaciones'
import CalloutComponent from 'components/CalloutComponent.vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    CalloutComponent,
    ButtonSubmits,
    ErrorComponent,
    NoOptionComponent
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Grupo, new GrupoController())
    const {
      entidad: grupo,
      listadosAuxiliares,
      accion,
      disabled
    } = mixin.useReferencias()
    const { cargarVista, setValidador, obtenerListados, reestablecer } =
      mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()
    const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const { vehiculos, filtrarVehiculos, grupos, filtrarGrupos } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const hayRepetidos = ref(false)
    const haySinAsignar = ref(false)

    cargarVista(async () => {
      await obtenerListados({
        grupos: {
          controller: new GrupoController(),
          params: {
            activo: 1,
            nombre_alternativo: 'nombre_alternativo'
          }
        },
        vehiculos: {
          controller: new VehiculoController(),
          params: { estado: 1 }
        }
      })

      vehiculos.value = listadosAuxiliares.vehiculos
      grupos.value = listadosAuxiliares.grupos
      grupos.value.forEach((grupo: Grupo) => {
        grupo.coordinador = grupo.coordinador_id
      })
    })

    const reglas = {}
    const v$ = useVuelidate(reglas, grupo)
    setValidador(v$.value)

    /***********
     * HOOKS
     ***********/
    onMounted(() => {
      accion.value = acciones.consultar
    })
    onReestablecer(() => (accion.value = acciones.consultar))

    /***********
     * FUNCIONES
     ***********/
    async function guardarGruposVehiculos() {
      console.log('esto se va a guardar', grupos.value)
      haySinAsignar.value = grupos.value.some(
        (grupo: Grupo) => grupo.vehiculo === null
      )
      if (haySinAsignar.value)
        notificarAdvertencia(
          'Todos los grupos deben tener un vehículo asignado.'
        )
      chequearVehiculosRepetidos()

      if (!hayRepetidos.value && !haySinAsignar.value) {
        try {
          cargando.activar()
          for (const grupo of grupos.value) {
            await new GrupoController().editar(grupo)
          }
          notificarCorrecto('Grupos actualizados con éxito.')
          accion.value = acciones.consultar
          window.location.reload()
        } catch (error) {
          console.error('Error al guardar las asignaciones:', error)
        } finally {
          cargando.desactivar()
        }
      }
    }

    function chequearVehiculosRepetidos() {
      const idsVehiculos = grupos.value
        .map((grupo: Grupo) => grupo.vehiculo)
        .filter(id => id != null)
      console.log('Hay repetidos', hayRepetidos.value)
      hayRepetidos.value = idsVehiculos.some(
        (id, idx) => idsVehiculos.indexOf(id) !== idx
      )
      if (hayRepetidos.value)
        notificarAdvertencia(
          'No se puede asignar un mismo vehículo a más de un grupo.'
        )
    }

    return {
      v$,
      grupo,
      accion,
      acciones,
      disabled,

      //listados
      vehiculos,
      filtrarVehiculos,
      grupos,
      filtrarGrupos,

      //funciones
      chequearVehiculosRepetidos,
      guardarGruposVehiculos,
      ordenarLista,
      reestablecer
    }
  }
})
