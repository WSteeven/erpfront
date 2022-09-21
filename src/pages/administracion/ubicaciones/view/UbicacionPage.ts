//Dependencias
//import { configuracionColumnasPerchas } from "pages/administracion/perchas/domain/configuracionColumnasPerchas";
//import { configuracionColumnasPisos } from "pages/administracion/pisos/domain/configuracionColumnasPisos";
import { configuracionColumnasUbicaciones } from '../domain/configuracionColumnasUbicaciones'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

//Componentes
//import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useOrquestadorSelectorPisos } from '../application/OrquestadorSelectorPisos'
import { useOrquestadorSelectorPerchas } from '../application/OrquestadorSelectorPerchas'
import { PerchaController } from 'pages/administracion/perchas/infraestructure/PerchaController'
import { PisoController } from 'pages/administracion/pisos/infraestructure/PisoController'
import { UbicacionController } from '../infraestructure/UbicacionController'
import { ComportamientoModalesUbicacion } from '../application/ComportamientoModalesUbicacion'
import { Percha } from 'pages/administracion/perchas/domain/Percha'
import { Piso } from 'pages/administracion/pisos/domain/Piso'
import { Ubicacion } from '../domain/Ubicacion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Ubicacion,
      new UbicacionController()
    )
    const {
      entidad: ubicacion,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    //perchas
    /* const mixinPercha = new ContenedorSimpleMixin(Percha, new PerchaController())
        const {listadosAuxiliares}=mixinPercha.useReferencias()
        const {obtenerListados, cargarVista} =mixinPercha.useComportamiento()
 */
    //obtener los listados
    cargarVista(() => {
      obtenerListados({
        perchas: new PerchaController(),
        pisos: new PisoController(),
      })
    })

    //Reglas de validacion
    const reglas = {
      //codigo: {required},
      percha: { required },
      piso: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, ubicacion)
    setValidador(v$.value)

    //instanciar el comportamiento del modal
    const modalesUbicacion = new ComportamientoModalesUbicacion()

    /* 
        //perchas
        const {
            refListadoSeleccionable: refListadoSeleccionablePerchas,
            criterioBusqueda: criterioBusquedaPercha,
            listado: listadoPerchas,
            listar: listarPerchas,
            limpiar: limpiarPercha,
            seleccionar: seleccionarPercha,
        } = useOrquestadorSelectorPerchas(ubicacion, 'perchas')

        onReestablecer(()=>(criterioBusquedaPercha.value=null))
        onConsultado(()=>seleccionarPercha(ubicacion.percha))
 
        //pisos
        const {
            refListadoSeleccionable: refListadoSeleccionablePisos,
            criterioBusqueda: criterioBusquedaPiso,
            listado: listadoPisos,
            listar: listarPisos,
            limpiar: limpiarPiso,
            seleccionar: seleccionarPiso,
        } = useOrquestadorSelectorPisos(ubicacion, 'pisos')

        onReestablecer(()=>(criterioBusquedaPiso.value=null))
        onConsultado(()=>seleccionarPiso(ubicacion.piso)) */

    //asignar el listado a las opciones de los selects
    const opciones = listadosAuxiliares.perchas
    /* const opciones_perchas = listadosAuxiliares.perchas
        const opciones_pisos = listadosAuxiliares.pisos */
    return {
      mixin,
      ubicacion,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasUbicaciones,
      //modal
      modalesUbicacion,
      //listados
      opciones,
      /* opciones_perchas,
            opciones_pisos, */
      filterPercha(val, update) {
        if (val === '') {
          update(() => {
            opciones.perchas = listadosAuxiliares.perchas
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones.perchas = listadosAuxiliares.perchas.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1 || v.sucursal.toLowerCase().indexOf(needle)>-1
          )
        })
      },
      filterPiso(val, update) {
        if (val === '') {
          update(() => {
            opciones.pisos = listadosAuxiliares.pisos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones.pisos = listadosAuxiliares.pisos.filter(
            (v) => v.fila.toLowerCase().indexOf(needle) > -1 || v.columna.toLowerCase().indexOf(needle)>-1
          )
        })
      },

      /* 
            //selector perchas
            refListadoSeleccionablePerchas,
            criterioBusquedaPercha,
            listadoPerchas,
            listarPerchas,
            limpiarPercha,
            seleccionarPercha,
            configuracionColumnasPerchas,
            
            //selector pisos
            refListadoSeleccionablePisos,
            criterioBusquedaPiso,
            listadoPisos,
            listarPisos,
            limpiarPiso,
            seleccionarPiso,
            configuracionColumnasPisos, */
    }
  },
})
