import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent } from 'vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { configuracionColumnasBaseComision } from 'pages/ventas-claro/estadisticas/basesComisiones/domain/configuracionColumnasBaseComision'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { BaseComision } from 'pages/ventas-claro/estadisticas/basesComisiones/domain/BaseComision'
import { BaseComisionController } from 'pages/ventas-claro/estadisticas/basesComisiones/infraestructure/BaseComisionController'
import {helpers, minValue, required} from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { ModalidadController } from 'pages/ventas-claro/modalidad/infrestructure/ModalidadController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { acciones } from 'config/utils'
import { configuracionColumnasComisiones } from 'pages/ventas-claro/estadisticas/basesComisiones/domain/configuracionColumnasComisiones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import {Comision} from 'pages/ventas-claro/estadisticas/basesComisiones/domain/Comision';

export default defineComponent({
  components: { EssentialTable, ErrorComponent, TabLayout, NoOptionComponent },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      BaseComision,
      new BaseComisionController()
    )
    const {
      entidad: base,
      disabled,
      listadosAuxiliares,
      accion
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()

    const store = useAuthenticationStore()

    const { modalidades, filtrarModalidades } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        modalidades: {
          controller: new ModalidadController(),
          params: { campos: 'id,nombre' }
        }
      })

      modalidades.value = listadosAuxiliares.modalidades
    })
    /*************
     * Validaciones
     **************/
    const reglas = {
      modalidad: { required },
      presupuesto_ventas: { required },
      bono_comision_semanal: { required },
      comisiones: {
        $each: helpers.forEach({
          desde: { required },
          hasta: { required },
          comision: { required, minValue: minValue(0) }
        })
      },
    }
    const v$ = useVuelidate(reglas, base)
    setValidador(v$.value)


    /*********************
     * BOTONES DE TABLA
     ********************/
    onReestablecer(()=>{
      base.comisiones = []
    })



    /*********************
     * BOTONES DE TABLA
     ********************/
    const btnAgregarFila: CustomActionTable = {
      titulo: 'Agregar Item',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar ítem',
      accion: () => {
        console.log('le diste clic a agregar otra fila para las comisiones')
        const comision = new Comision()
        base.comisiones.push(comision)
      }
    }

    return {
      v$,
      base,
      disabled,
      acciones,
      accion,
      store,
      mixin,
      modalidades,
      filtrarModalidades,
      configuracionColumnas: configuracionColumnasBaseComision,
      configuracionColumnasComisiones,

      btnAgregarFila
    }
  }
})
