//Dependencias
import { configuracionColumnasEtiquetas } from '../domain/configuracionColumnasEtiquetas'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MarcaController } from 'pages/bodega/marcas/infraestructure/MarcaController'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { Etiqueta } from '../domain/Etiqueta'
import { EtiquetaController } from '../infraestructure/EtiquetaController';
import { CategoriaController } from 'pages/intranet/categorias/infraestructure/CategoriaController'

export default defineComponent({
  components: {
    TabLayout,
    //EssentialSelectableTable,

  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Etiqueta, new EtiquetaController())
    const { entidad: etiqueta, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()


    const opciones = ref([])
    //obtener el listado de todas las marcas
    cargarVista(async () => {
      obtenerListados({
        categorias: {
          controller: new CategoriaController(),
          params: { activo: 1 }
        }

      })
    })

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      categoria: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, etiqueta)
    setValidador(v$.value)


    //aqui va el listado
    opciones.value = listadosAuxiliares.marcas

    return {
      mixin,
      etiqueta,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasEtiquetas,
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
            opciones.value = listadosAuxiliares.categorias
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones.value = listadosAuxiliares.categorias.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
    }
  },
})
