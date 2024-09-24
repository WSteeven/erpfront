import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';
import { defineComponent, reactive } from 'vue';
import { Vacante } from '../../vacantes/domain/Vacante';
import { VacanteController } from '../../vacantes/infraestructure/VacanteController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { ref } from 'vue';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';

export default defineComponent({
  components: { TabLayout, EssentialTable, GraficoGenerico },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacante, new VacanteController())
    const { listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } = mixin.useComportamiento()

    const cargando = new StatusEssentialLoading()
    const vacantes = ref([])
    const dashboard = reactive({
      fecha_inicio: '',
      fecha_fin: '',
      vacante: null,
    })



    cargarVista(async () => {
      await obtenerListados({
        vacantes: { controller: new VacanteController(), params: { activo: 1 } }
      })

      vacantes.value = listadosAuxiliares.vacantes
    })
    /***************
     * Reglas de validacion
     ***************/
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      vacante:{required}
    }
    const v$ = useVuelidate(reglas, dashboard)
    setValidador(v$.value)

    /***************
     * Funciones
     ***************/
    function filtrarVacantes(val, update) {
      if (val.value === '') {
        update(()=> vacantes.value = listadosAuxiliares.vacantes)
        return
      }
      update(()=>{
        const needle = val.toLowerCase()
        vacantes.value = vacantes.value.filter((vacante: Vacante) => vacante.nombre!.toLowerCase().indexOf(needle) > -1)
      })
    }

    return {
      v$,
      dashboard,

      //listados
      vacantes, filtrarVacantes,


    }

  }
})
