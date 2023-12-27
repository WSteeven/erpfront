// Dependencias
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, Ref, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { imprimirArchivo, removeAccents } from 'shared/utils'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import axios, { AxiosResponse } from 'axios'

import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { UmbralVentas } from '../domain/UmbralVentas'
import { UmbralVentasController } from '../infrestucture/UmbralVentasController'
import { configuracionColumnasUmbralVentas } from '../domain/configuracionColumnasUmbralVentas'
import { VendedoresController } from 'pages/ventas-claro/vendedores/infrestructure/VendedoresController'


export default defineComponent({
  components: {
    TabLayout,
    ModalesEntidad,
    SelectorImagen,
    EssentialTable,
    EssentialTableTabs,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      UmbralVentas,
      new UmbralVentasController()
    )
    const { entidad: umbral_venta, accion, disabled,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, listar,obtenerListados,cargarVista } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    useCargandoStore().setQuasar(useQuasar())
    const is_month = ref(false)
    const vendedores = ref([])

    cargarVista(async () => {
      await obtenerListados({
        vendedores: {
          controller: new VendedoresController(),
          params: {
            tipo_vendedor:'SUPERVISOR_VENTAS'
          },
        },
      })
      vendedores.value = listadosAuxiliares.vendedores
    })
    const reglas = {
      cantidad_ventas: {
        required: true,
      },
      vendedor: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, umbral_venta)
    setValidador(v$.value)

    onGuardado(() => {
      console.log('guardado');

      listar({})
    })
     /**Verifica si es un mes */
     function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }
    function filtrarVendedores(val, update) {
      if (val === '') {
        update(() => {
          vendedores.value = listadosAuxiliares.vendedores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        vendedores.value = listadosAuxiliares.vendedores.filter(
          (v) =>
            v.codigo_vendedor.toLowerCase().indexOf(needle) > -1 ||
            v.empleado_info.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      removeAccents,
      mixin,
      v$,
      is_month,
      checkValue,
      filtrarVendedores,
      vendedores,
      umbral_venta,
      accion,
      disabled,
      maskFecha,
      configuracionColumnas: configuracionColumnasUmbralVentas,
    }
  },
})
