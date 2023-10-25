// Dependencias
import { configuracionColumnasParroquias } from '../domain/configuracionColumnasParroquias'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
//import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { LocalStorage } from 'quasar'
import { acciones } from 'config/utils';
import { Parroquia } from '../domain/Parroquia'
import { ParroquiaController } from '../infraestructure/ParroquiaController'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Parroquia, new ParroquiaController())
        const { entidad: parroquia, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

        const {
            provincias, filtrarProvincias,
            cantones, filtrarCantones, ordenarCantones
        } = useFiltrosListadosSelects(listadosAuxiliares)

        //Obtener el listado de las categorias
        cargarVista(async () => {
            obtenerListados({
                provincias: new ProvinciaController(),
            })
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            provincias.value = listadosAuxiliares.provincias
            cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
        })

        // Reglas de validacion
        const reglas = {
            provincia: { required },
            canton: { required },
            parroquia: { required },
        }

        const v$ = useVuelidate(reglas, parroquia)
        setValidador(v$.value)

        return {
            mixin,
            parroquia,
            disabled,
            accion,
            v$,
            configuracionColumnas: configuracionColumnasParroquias,
            acciones,


            //listado
            provincias, filtrarProvincias,
            cantones, filtrarCantones, ordenarCantones,

        }
    },
})
