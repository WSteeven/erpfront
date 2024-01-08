// Dependencias
import { configuracionColumnasSubcentroCostos } from '../domain/configuracionColumnasSubcentroCostos'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubcentroCosto } from '../domain/SubcentroCosto'
import { SubcentroCostoController } from '../infraestructure/SubcentroCostosController'
import { CentroCostoController } from 'pages/gestionTrabajos/centroCostos/infraestructure/CentroCostosController'
import { CentroCosto } from 'pages/gestionTrabajos/centroCostos/domain/CentroCostos'


export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(SubcentroCosto, new SubcentroCostoController())
        const { entidad: subcentro, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()


        const centros_costos = ref()
        cargarVista(async () => {
            await obtenerListados({
                centros_costos: new CentroCostoController(),
            })
            centros_costos.value = listadosAuxiliares.centros_costos
        })


        const reglas = {
            nombre: { required },
        }

        const v$ = useVuelidate(reglas, subcentro)
        setValidador(v$.value)

        function filtrarCentrosCostos(val, update) {
            if (val === '') {
                update(() => centros_costos.value = listadosAuxiliares.centros_costos)
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                centros_costos.value = listadosAuxiliares.centros_costos.filter((v: CentroCosto) => v.nombre!.toLowerCase().indexOf(needle) > -1)
            })
        }


        return {
            v$, mixin, subcentro, disabled,
            configuracionColumnas: configuracionColumnasSubcentroCostos,

            centros_costos,filtrarCentrosCostos,

        }

    }
})