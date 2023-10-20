import { defineComponent, ref } from 'vue'
import { ValorAcreditar } from '../domain/ValorAcreditar'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValorAcreditarController } from '../infrestructure/ValorAcreditarController'
import { configuracionColumnasValorAcreditar } from '../domain/configuracionColumnasValorAcreditar'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useAcreditacionesStore } from 'stores/acreditaciones'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export default defineComponent({
  components: { TabLayout, EssentialTable,ButtonSubmits },
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
    const { setValidador, guardar, editar, reestablecer } =
      mixin.useComportamiento()
    const { entidad: valorAcreditar, disabled, accion } = mixin.useReferencias()

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
    }
    const v$ = useVuelidate(reglas, valorAcreditar)
    setValidador(v$.value)
    const { consultar, cargarVista, obtenerListados } =
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
          id: acreditacionesStore.idAcreditacionSeleccionada,
        })
      ).result
    })
    const botonModificarAcreditacion: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'indigo',
      accion: ({ entidad }) => {
        //acreditacionesStore.idAcreditacion = entidad.id
      },
    }
    async function guardarDatos(valoracreditar: ValorAcreditar) {
      try {
        let entidad: ValorAcreditar = new ValorAcreditar()
        if (accion.value == 'NUEVO') {
          entidad = await guardar(valoracreditar)
        } else {
          await editar(valoracreditar, false)
          entidad = valoracreditar
        }
        const valorAcreditarAux = new ValorAcreditar()
        valorAcreditarAux.hydrate(entidad)

        if (valorAcreditarAux.id) {
          listado.value = [valorAcreditarAux, ...listado.value]
        }
      } catch (e) {
        console.log(e)
      }
    }
    function reestablecerDatos() {
      reestablecer()
    }

    return {
      mixin,
      disabled,
      accion,
      guardarDatos,
      reestablecerDatos,
      v$,
      valorAcreditar,
      empleados,
      listado,
      configuracionColumnasValorAcreditar,
      botonModificarAcreditacion,
    }
  },
})
