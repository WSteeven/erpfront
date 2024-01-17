// Dependencias
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'

import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

import { VendedoresController } from 'pages/ventas-claro/vendedores/infrestructure/VendedoresController'
import { ClienteClaro } from '../domain/ClienteClaro'
import { ClienteClaroController } from '../infrestucture/ClienteClaroController'
import { configuracionColumnasClienteClaro } from '../domain/configuracionColumnasClienteClaro'
import { maxLength,minLength,required } from 'shared/i18n-validators'


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
      ClienteClaro,
      new ClienteClaroController()
    )
    const { entidad: cliente_claro, accion, disabled,listadosAuxiliares } = mixin.useReferencias()
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
      identificacion: {
        required,
        maxLength: maxLength(10),
        minLenght: minLength(10)
      },
      nombres: {
        required,
      },
      apellidos: {
        required,
      },
      direccion: {
        required,
      },
      telefono1: {
        required,
        maxLength: maxLength(10),
        minLenght: minLength(7),
      },
      telefono2: {
        maxLength: maxLength(10),
        minLenght: minLength(7),
      },
    }
    const v$ = useVuelidate(reglas, cliente_claro)
    setValidador(v$.value)

    onGuardado(() => {
      console.log('guardado');

      listar({})
    })
     /**Verifica si es un mes */
     function checkValue(val, reason) {
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
      cliente_claro,
      accion,
      disabled,
      maskFecha,
      configuracionColumnas: configuracionColumnasClienteClaro,
    }
  },
})
