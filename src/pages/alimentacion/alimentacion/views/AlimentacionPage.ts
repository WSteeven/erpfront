import { computed, defineComponent, ref } from 'vue'

//Componentes

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { required } from 'shared/i18n-validators'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { Alimentacion } from '../domain/Alimentacion'
import { AlimentacionController } from '../infraestructure/AlimentacionController'
import { configuracionColumnasAlimentacion } from '../domain/configuracionColumnasAlimentacion'
import useVuelidate from '@vuelidate/core'
import { estadosAlimentacion, tabOptionsEstadosAlimentacion } from 'config/recursosHumanos.utils'


export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Alimentacion,
      new AlimentacionController()
    )
    const { setValidador,listar } =
    mixin.useComportamiento()

    const {
      entidad: alimentacion,
      disabled,
      accion,
      listado,
    } = mixin.useReferencias()
    const is_month = ref(false)

    /*************
     * Validaciones
     **************/
    const reglas = {
      mes: { required },
      nombre: { required },
    }
    const v$ = useVuelidate(reglas, alimentacion)
    setValidador(v$.value)



    /**Verifica si es un mes */
    function checkValue(reason) {
      is_month.value = reason === 'month' ? false : true
      obtenerNombreMes()
    }

    function obtenerNombreMes() {
      const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ]
      const [mes, anio] = alimentacion.mes!.split('-')
      alimentacion.nombre = `Rol de Pagos de ${alimentacion.es_quincena ? 'QUINCENA DEL MES DE ' : ''
        }  ${meses[parseInt(mes, 10) - 1]} de ${anio}`
    }

    let tabActualGasto = '3'

    function filtrarAlimentacion(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabActualGasto = tabSeleccionado
    }




    return {
      listado,
      configuracionColumnasAlimentacion,
      tabOptionsEstadosAlimentacion,
      estadosAlimentacion,
      filtrarAlimentacion,
      accionesTabla,
      accion,
      alimentacion,
      maskFecha,
      is_month,
      checkValue,
      v$,
    }
  },
})
