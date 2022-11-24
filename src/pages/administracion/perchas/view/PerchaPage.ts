//Dependencias
import { configuracionColumnasPerchas } from '../domain/configuracionColumnasPerchas'
//import { configuracionColumnasSucursales } from "pages/administracion/sucursales/domain/configuracionColumnasSucursales";
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

//Componentes
//import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
//import { useOrquestadorSelectorSucursales } from "../application/OrquestadorSelectorSucursales";
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { PerchaController } from '../infraestructure/PerchaController'
import { Percha } from '../domain/Percha'
import { ComportamientoModalesPercha } from '../application/ComportamientoModalesPercha'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { PisoController } from 'pages/administracion/pisos/infraestructure/PisoController'

export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Percha, new PerchaController())
    const { entidad: percha, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =mixin.useComportamiento()

    const opciones_sucursales = ref([])
    //Obtener los listados
    cargarVista(() => {
      obtenerListados({
        sucursales: {
          controller: new SucursalController(),
          params: { campos: 'id,lugar' },
        },
        // pisos:new PisoController(),
      })
    })

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      sucursal: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, percha)
    setValidador(v$.value)

    //asignar el listado a las opciones del select
    opciones_sucursales.value = listadosAuxiliares.sucursales
    // opciones_pisos.value = listadosAuxiliares.pisos

    return {
      group: ref([]),
      mixin,
      percha,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasPerchas,
      //listado
      opciones_sucursales,
      // opciones_pisos,

      /**
       * Funcion para filtrar el SELECT de sucursales,
       * @param val String, tecla que ingresa el usuario para la busqueda
       * @param update actualizacion del listado con el filtro
       * @returns listado  con las coincidencias encontradas
       */
      filtrarSucursales(val, update) {
        if (val === '') {
          update(() => {
            opciones_sucursales.value = listadosAuxiliares.sucursales
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_sucursales.value = listadosAuxiliares.sucursales.filter((v) => v.lugar.toLowerCase().indexOf(needle) > -1)
        })
      },
    }
  },
})
