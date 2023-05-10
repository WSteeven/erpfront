//Dependencias
import { configuracionColumnasClientes } from "../domain/configuracionColumnasClientes";
import { required } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { acciones, opcionesEstados } from "config/utils";

//Components
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue"
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";
import SelectorImagen from 'components/SelectorImagen.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Cliente } from "../domain/Cliente";
import { ClienteController } from "../infraestructure/ClienteController";
import { computed, defineComponent, ref } from "vue";
import { EmpresaController } from "pages/administracion/empresas/infraestructure/EmpresaController";
import { CantonController } from "sistema/ciudad/infraestructure/CantonControllerontroller";
import { ParroquiaController } from "sistema/parroquia/infraestructure/ParroquiaController";
import { Parroquia } from "sistema/parroquia/domain/Parroquia";
import { ComportamientoModalesCliente } from "../application/ComportamientoModalesCliente";


export default defineComponent({
    components: { TabLayout, LabelAbrirModal, ModalesEntidad, SelectorImagen },
    setup() {
        const mixin = new ContenedorSimpleMixin(Cliente, new ClienteController())
        const { entidad: cliente, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

        const mostrarLabelModal = computed(()=>accion.value ===acciones.nuevo)
        const modales = new ComportamientoModalesCliente()


        const opciones_empresas = ref([])
        const opciones_cantones = ref([])
        const opciones_parroquias = ref([])
        const parroquias = ref([])
        cargarVista(async () => {
            obtenerListados({
                empresas: new EmpresaController(),
                cantones: new CantonController(),
                parroquias: new ParroquiaController(),
            })
        })

        /**************************************************************
         * Validaciones
         **************************************************************/
        const reglas = {
            empresa: { required },
            parroquia: { required },
            requiere_bodega: { required },
            estado: { required },
        }
        const v$ = useVuelidate(reglas, cliente)
        setValidador(v$.value)

        async function guardado(){
            const {result} = await new EmpresaController().listar()
            opciones_empresas.value = result
        }

        //llenar listados
        opciones_empresas.value = listadosAuxiliares.empresas
        opciones_cantones.value = listadosAuxiliares.cantones
        opciones_parroquias.value = listadosAuxiliares.parroquias

        return {
            mixin, cliente, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasClientes,

            //listados
            opciones_empresas,
            opciones_cantones,
            opciones_parroquias,
            opcionesEstados,

            //modal
            modales,
            mostrarLabelModal,
            guardado,

            //filtros
            filtrarCanton(val, update) {
                if (val == '') {
                    update(() => {
                        opciones_cantones.value = listadosAuxiliares.cantones
                    })
                    return
                }
                update(() => {
                    opciones_cantones.value = listadosAuxiliares.cantones.filter((v) => v.canton.toLowerCase().indexOf(val.toLowerCase()) > -1)
                })
            },
            cantonSeleccionado(val){
                parroquias.value = listadosAuxiliares.parroquias.filter((v)=>v.canton_id === val)
                opciones_parroquias.value = parroquias.value
            },
            filtrarParroquia(val, update) {
                if(val==''){
                    update(()=>{
                        opciones_parroquias.value = parroquias.value
                    })
                    return
                }
                update(()=>{
                    opciones_parroquias.value = parroquias.value.filter((v:Parroquia) => v.parroquia.toLowerCase().indexOf(val.toLowerCase()) > -1)
                })
            }


        }
    }
})
