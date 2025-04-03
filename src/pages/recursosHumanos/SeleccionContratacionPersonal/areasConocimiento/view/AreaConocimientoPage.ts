// Dependencies
import { configuracionColumnasAreasConocimientos } from '../domain/configuracionColumnasAreasConocimientos';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';
import { acciones } from 'config/utils';
import { defineComponent } from 'vue';

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { ordenarLista } from 'shared/utils'
import { AreaConocimientoController } from '../infraestructure/AreaConocimientoController';
import { AreaConocimiento } from '../domain/AreaConocimiento';

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(AreaConocimiento, new AreaConocimientoController())
    const { entidad: conocimiento, accion, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
    // const { onReestablecer, onGuardado, onConsultado } = mixin.useHooks()

    const { cargos, filtrarCargos } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        cargos: { controller: new CargoController(), params: { estado: 1 } }
      })

      cargos.value = listadosAuxiliares.cargos
    })

    //reglas de validacion
    const reglas = {
      cargo: { required },
      nombre: { required },
      activo: { required }
    }
    const v$ = useVuelidate(reglas, conocimiento)
    setValidador(v$.value)


    return {
      mixin,
      conocimiento,
      disabled,
      accion,
      v$,
      acciones,
      configuracionColumnas: configuracionColumnasAreasConocimientos,

      cargos, filtrarCargos,
      ordenarLista,
    }
  },
})
