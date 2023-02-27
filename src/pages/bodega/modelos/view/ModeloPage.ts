//Dependencias
import { configuracionColumnasModelos } from '../domain/configuracionColumnasModelos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MarcaController } from 'pages/bodega/marcas/infraestructure/MarcaController'
import { ModeloController } from '../infraestructure/ModeloController'
import { Modelo } from '../domain/Modelo'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: {
    TabLayout,
    //EssentialSelectableTable,

  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Modelo, new ModeloController())
    const { entidad: modelo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()


    const opciones = ref([])
    //obtener el listado de todas las marcas
    cargarVista(async() => {
      obtenerListados({
        marcas: {
          controller: new MarcaController(),
          params: { campos: 'id,nombre' },
        },
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


    //aqui va el listado
    opciones.value = listadosAuxiliares.marcas

    return {
      mixin,
      modelo,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasModelos,
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
            opciones.value = listadosAuxiliares.marcas
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones.value= listadosAuxiliares.marcas.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
    }
  },
})
