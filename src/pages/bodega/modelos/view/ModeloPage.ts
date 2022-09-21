//Dependencias
import { configuracionColumnasModelos } from '../domain/configuracionColumnasModelos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

//Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
//modales para crear nuevas marcas
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useOrquestadorSelectorMarcas } from '../application/OrquestadorSelectorMarcas'
import { MarcaController } from 'pages/bodega/marcas/infraestructure/MarcaController'
import { ModeloController } from '../infraestructure/ModeloController'
import { ComportamientoModalesModelos } from '../application/ComportamientoModalesModelos'
import { Marca } from 'pages/bodega/marcas/domain/Marca'
import { Modelo } from '../domain/Modelo'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: {
    TabLayout,
    //EssentialSelectableTable,
    LabelAbrirModal,
    ModalesEntidad,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Modelo, new ModeloController())
    const { entidad: modelo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

    

    //obtener el listado de todas las marcas
    cargarVista(() => {
      obtenerListados({
        marcas: new MarcaController(),
      })
    })

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      marca: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, modelo)
    setValidador(v$.value)

    //instanciar el comportamiento del modal
    const modalesModelo = new ComportamientoModalesModelos()

    //selector del orquestador
    /* const {
      refListadoSeleccionable: refListadoSeleccionableMarcas,
      criterioBusqueda: criterioBusquedaMarca,
      listado: listadoMarcas,
      listar: listarMarcas,
      limpiar: limpiarMarca,
      seleccionar: seleccionarMarca,
    } = useOrquestadorSelectorMarcas(modelo, 'marcas')

    onReestablecer(() => (criterioBusquedaMarca.value = null))
    onConsultado(() => seleccionarMarca(modelo.marca)) */

    //aqui va el listado
    const opciones = listadosAuxiliares.marcas 

    return {
      mixin,
      modelo,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasModelos,
      //modal
      modalesModelo,
      //selector
      /* refListadoSeleccionableMarcas,
      criterioBusquedaMarca,
      listadoMarcas,
      listarMarcas,
      limpiarMarca,
      seleccionarMarca, 
      configuracionColumnasMarcas,
      */
      //listado
      listadosAuxiliares,
      opciones,

      /**
       * Función para filtrar el SELECT de marcas,
       * @param val String, tecla que ingresa el usuario para la busqueda
       * @param update actualizacion del listado con el filtro
       * @returns listado  con las coincidencias encontradas
       */
      filterFn(val, update) {
        if (val === '') {
          update(() => {
            opciones.marcas = listadosAuxiliares.marcas
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones.marcas = listadosAuxiliares.marcas.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
    }
  },
})
