//Dependencias
import { configuracionColumnasEmpresas } from "../domain/configuracionColumnasEmpresas";
import { required, requiredIf } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Empresa } from "../domain/Empresa";
import { EmpresaController } from "../infraestructure/EmpresaController";
import { opcionesTipoContribuyente, opcionesTipoNegocio } from "config/utils_compras_proveedores";
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
        const { onGuardado, onConsultado, onReestablecer, onBeforeGuardar, onBeforeConsultar } = mixin.useHooks()

        const StatusLoading = new StatusEssentialLoading()

        const experiencia_comercial = ref(false)
        const is_month = ref(false)
        // const provincias = ref([])
        // const cantones = ref([])
        cargarVista(async () => {
            await obtenerListados({
                provincias: {
                    controller: new ProvinciaController(),
                    params: { pais_id: 66 }
                }
            })
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            cantones.value = listadosAuxiliares.cantones
        })

        /**************************************************************
         * Hooks
         **************************************************************/
        onBeforeConsultar(() => {
            experiencia_comercial.value=false
        })
        onBeforeGuardar(() => {
            // actualizarCamposRepresentanteLegal()
        })
        onConsultado(() => {
            experiencia_comercial.value = empresa.antiguedad_proveedor?true:false
            cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
        })
        onReestablecer(() => {
            cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            experiencia_comercial.value=false
        })

        onGuardado(() => {
            emit('cerrar-modal', false)
            emit('guardado')
        })
        /**************************************************************
         * Validaciones
         **************************************************************/
        const reglas = {
            identificacion: { required },
            tipo_contribuyente: { required },
            regimen_tributario: { required },
            razon_social: { required },
            representante_legal: { requiredIfTipoContribuyenteSociedad: requiredIf(() => empresa.tipo_contribuyente == 'SOCIEDAD') },
            identificacion_representante: { requiredIfTipoContribuyenteSociedad: requiredIf(() => empresa.tipo_contribuyente == 'SOCIEDAD') },
            antiguedad_proveedor: { requiredIfTipoContribuyenteSociedad: requiredIf(() => experiencia_comercial.value) },
            // celular: { required },
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

        function actualizarCamposRepresentanteLegal() {
            console.log(empresa.tipo_contribuyente)
            if (empresa.tipo_contribuyente != 'SOCIEDAD') {
                empresa.representante_legal = null
                empresa.identificacion_representante = null
            }
        }

        /**Verifica si es un mes */
        function checkValue(val, reason, details) {
            is_month.value = reason === 'month' ? false : true
        }

        const {
            // paises, filtrarPaises,
            provincias, filtrarProvincias,
            cantones, filtrarCantones,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        //carga de listados auxiliares
        // paises.value = listadosAuxiliares.paises

        provincias.value = listadosAuxiliares.provincias
        cantones.value = listadosAuxiliares.cantones


        return {
            mixin, empresa, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasEmpresas,

            acciones,

            experiencia_comercial,
            is_month,

            //listados
            opcionesTipoContribuyente,
            opcionesTipoNegocio,
            obtenerProvincias,
            obtenerCantones,
            // paises, filtrarPaises,
            provincias, filtrarProvincias,
            cantones, filtrarCantones,

            //funciones
            actualizarCamposRepresentanteLegal,
            checkValue,
        }
    }
})

