import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { configuracionColumnasFichaSocioeconomica } from 'trabajoSocial/fichaSocioeconomica/domain/configuracionColumnasFichaSocioeconomica'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FichaSocioeconomica } from 'trabajoSocial/fichaSocioeconomica/domain/FichaSocioeconomica'
import { FichaSocioeconomicaController } from 'trabajoSocial/fichaSocioeconomica/infraestructure/FichaSocioeconomicaController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { ordenarLista } from 'shared/utils'
import { useEmpleadoStore } from 'stores/empleado'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      FichaSocioeconomica,
      new FichaSocioeconomicaController()
    )
    const {
      entidad: ficha,
      accion,
      listadosAuxiliares,
      disabled
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
const {notificarAdvertencia, notificarCorrecto}= useNotificaciones()

    const empleadoStore = useEmpleadoStore()
    const tabDefecto = ref('1')
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const empleado = ref(new Empleado())
    cargarVista(() => {
      obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        }
      })

      empleados.value = listadosAuxiliares.empleados
    })
    const reglas = {
      empleado: { required }
    }
    const v$ = useVuelidate(reglas, ficha)
    setValidador(v$.value)

    /********************************
     * FUNCIONES
     *******************************/
    async function filtrarListadoFichas(tab: string) {
      tabDefecto.value = tab
      await listar({ estado: tab })
    }

    async function empleadoSeleccionado() {
      const fichaEncontrada = ref()
      empleadoStore.idEmpleado = ficha.empleado
      await empleadoStore.cargarEmpleado()
      empleado.value = empleadoStore.empleado
      if (await empleadoStore.tieneFichaSocioeconomica()) {
        fichaEncontrada.value =
          await empleadoStore.obtenerUltimaFichaSocieconomica()
        console.log(fichaEncontrada.value)
        notificarCorrecto('Se ha encontrado una ficha socioeconomica del empleado seleccionado')
      }else{
        notificarAdvertencia('El empleado seleccionado aún no tiene ficha socioeconomica')
      }
    }

    /********************************
     * BOTONES DE TABLA
     *******************************/

    return {
      v$,
      ficha,
      mixin,
      accion,
      listadosAuxiliares,
      disabled,
      configuracionColumnas: configuracionColumnasFichaSocioeconomica,
      tabDefecto,
      empleado,
      tabOptions: tabOptionsProveedoresInternacionales,

      // listados
      empleados,
      filtrarEmpleados,

      //funciones
      filtrarListadoFichas,
      empleadoSeleccionado,
      ordenarLista
    }
  }
})
