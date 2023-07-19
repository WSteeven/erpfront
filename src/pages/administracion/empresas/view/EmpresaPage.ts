//Dependencias
import { configuracionColumnasEmpresas } from "../domain/configuracionColumnasEmpresas";
import { required } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Empresa } from "../domain/Empresa";
import { EmpresaController } from "../infraestructure/EmpresaController";
import { opciones_tipo_contribuyente, opciones_tipo_negocio } from "config/utils_compras_proveedores";
import { PaisController } from "sistema/pais/infraestructure/pais.controller";
import { ProvinciaController } from "sistema/provincia/infraestructure/ProvinciaController";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { acciones } from "config/utils";
import { LocalStorage } from "quasar";



export default defineComponent({
    components: { TabLayout },
    emits: ['cerrar-modal', 'guardado'],
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Empresa, new EmpresaController())
        const { entidad: empresa, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados, } = mixin.useComportamiento()
        const { onGuardado, onConsultado } = mixin.useHooks()

        const StatusLoading = new StatusEssentialLoading()

        // const paises = ref([])
        // const provincias = ref([])
        // const cantones = ref([])
        cargarVista(async () => {
            await obtenerListados({
                paises: new PaisController(),
            })
        })


        onGuardado(() => {
            emit('cerrar-modal')
            emit('guardado')
        })
        onConsultado(() => {
            //obtener listados
            obtenerProvincias(empresa.pais)
            obtenerCantones(empresa.provincia)
        })

        /**************************************************************
         * Validaciones
         **************************************************************/
        const reglas = {
            identificacion: { required },
            tipo_contribuyente: { required },
            tipo_negocio: { required },
            razon_social: { required },
            celular: { required },
        }
        const v$ = useVuelidate(reglas, empresa)
        setValidador(v$.value)

        /**************************************************************
         * Funciones
        **************************************************************/
        async function obtenerProvincias(paisId: number | null) {
            empresa.provincia = null
            if (paisId !== null) {
                StatusLoading.activar()
                listadosAuxiliares.provincias = (await new ProvinciaController().listar({ pais_id: paisId })).result
                provincias.value = listadosAuxiliares.provincias
                StatusLoading.desactivar()
            }
        }
        async function obtenerCantones(provinciaId: number | null) {
            empresa.canton = null
            if (provinciaId !== null) {
                StatusLoading.activar()
                // listadosAuxiliares.cantones = (await new CantonController().listar({ provincia_id: provinciaId })).result
                listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString()).filter((v) => v.provincia_id == provinciaId)
                cantones.value = listadosAuxiliares.cantones
                StatusLoading.desactivar()
            }
        }

        const { paises, filtrarPaises,
            provincias, filtrarProvincias,
            cantones, filtrarCantones,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        //carga de listados auxiliares
        paises.value = listadosAuxiliares.paises



        return {
            mixin, empresa, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasEmpresas,

            acciones,

            //listados
            opciones_tipo_contribuyente,
            opciones_tipo_negocio,
            obtenerProvincias,
            obtenerCantones,
            paises, filtrarPaises,
            provincias, filtrarProvincias,
            cantones, filtrarCantones,
        }
    }
})

