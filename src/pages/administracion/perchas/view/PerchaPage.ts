//Dependencias
import { configuracionColumnasPerchas } from '../domain/configuracionColumnasPerchas'
//import { configuracionColumnasSucursales } from "pages/administracion/sucursales/domain/configuracionColumnasSucursales";
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

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

export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Percha, new PerchaController())
    const {
      entidad: percha,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    //Obtener los listados
    cargarVista(() => {
      obtenerListados({
        sucursales: new SucursalController(),
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

    //instanciar el comportamiento del modal
    const modalesPercha = new ComportamientoModalesPercha()

    /* const {
            refListadoSeleccionable: refListadoSeleccionableSucursales,
            criterioBusqueda: criterioBusquedaSucursal,
            listado: listadoSucursales,
            listar: listarSucursales,
            limpiar: limpiarSucursal,
            seleccionar: seleccionarSucursal,
        } = useOrquestadorSelectorSucursales(percha, 'sucursales')

        onReestablecer(()=>(criterioBusquedaSucursal.value =null))
        onConsultado(()=>seleccionarSucursal(percha.sucursal)) */

    //asignar el listado a las opciones del select
    const opciones = listadosAuxiliares.sucursales

    return {
      mixin,
      percha,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasPerchas,
      //modal y listado
      modalesPercha,
      opciones,

      /**
       * Funcion para filtrar el SELECT de sucursales,
       * @param val String, tecla que ingresa el usuario para la busqueda
       * @param update actualizacion del listado con el filtro
       * @returns listado  con las coincidencias encontradas
       */
      filterFn(val, update){
        if(val===''){
            update(()=>{
                opciones.sucursales = listadosAuxiliares.sucursales
            })
            return
        }
        update(()=>{
            const needle = val.toLowerCase()
            opciones.sucursales = listadosAuxiliares.sucursales.filter((v)=>v.lugar.toLowerCase().indexOf(needle)>-1)
        })
      },
      //Selector
      /* refListadoSeleccionableSucursales,
            criterioBusquedaSucursal,
            listadoSucursales,
            listarSucursales,
            limpiarSucursal,
            seleccionarSucursal,
            configuracionColumnasSucursales, */
    }
  },
})
