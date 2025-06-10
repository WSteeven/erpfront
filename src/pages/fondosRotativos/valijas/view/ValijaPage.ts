import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Valija } from 'pages/fondosRotativos/valijas/domain/Valija'
import { ValijaController } from 'pages/fondosRotativos/valijas/infraestructure/ValijaController'
import { defineComponent } from 'vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { acciones } from 'config/utils'
import { useVuelidate } from '@vuelidate/core'
import { configuracionColumnasValijas } from 'pages/fondosRotativos/valijas/domain/configuracionColumnasValijas'
import {required, requiredIf} from 'shared/i18n-validators'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { DepartamentoController } from 'recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import NoOptionComponent from 'components/NoOptionComponent.vue';
import ErrorComponent from 'components/ErrorComponent.vue';
import {ordenarLista} from 'shared/utils';
import SelectorImagen from 'components/SelectorImagen.vue';

export default defineComponent({
  components: { SelectorImagen, ErrorComponent, NoOptionComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Valija, new ValijaController())
    const {
      entidad: valija,
      accion,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    const { empleados, filtrarEmpleados, departamentos, filtrarDepartamentos } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        },
        departamentos: {
          controller: new DepartamentoController(),
          params: { activo: 1 }
        }
      })
    })

    //Reglas de validacion
    const reglas = {
      empleado: { required },
      descripcion: { required },
      imagen_evidencia: { required },
      departamento: {required: requiredIf(()=>valija.destinatario==null)},
      destinatario: {required: requiredIf(()=>valija.departamento==null)}
    }

    const v$ = useVuelidate(reglas, valija)
    setValidador(v$.value)

    return {
      mixin,
      valija,
      disabled,
      accion,
      acciones,
      v$,
      configuracionColumnas: configuracionColumnasValijas,

      // listados
      empleados,
      filtrarEmpleados,
      departamentos,
      filtrarDepartamentos,

      // funciones
      ordenarLista
    }
  }
})
