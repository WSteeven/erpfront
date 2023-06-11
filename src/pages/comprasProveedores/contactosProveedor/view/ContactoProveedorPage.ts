//Dependencias
import { configuracionColumnasContactosProveedores } from "../domain/configuracionColumnasContactosProveedores";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import ModalEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { defineComponent, onBeforeUnmount, onUnmounted, reactive, ref, watchEffect } from "vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { ContactoProveedor } from "../domain/ContactoProveedor";
import { ContactoProveedorController } from "../infraestructure/ContactoProveedorController";
import { ProveedorController } from "sistema/proveedores/infraestructure/ProveedorController";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { Proveedor } from "sistema/proveedores/domain/Proveedor";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { opciones_tipo_contacto } from "config/utils_compras_proveedores";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { ComportamientoModalesContactosProveedor } from "../application/ComportamientoModalesContactosProveedor";
import { useContactoProveedorStore } from "stores/comprasProveedores/contactoProveedor";


export default defineComponent({
    components: { TabLayout, ModalEntidad, },
    setup(props, {emit}) {
        const mixin = new ContenedorSimpleMixin(ContactoProveedor, new ContactoProveedorController())
        const { entidad: contacto, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado, onReestablecer,onGuardado } = mixin.useHooks()

        const contactoProveedorStore = useContactoProveedorStore()
        const StatusLoading = new StatusEssentialLoading()
        const proveedor = reactive(new Proveedor())

        const modales = new ComportamientoModalesContactosProveedor()


        cargarVista(async () => {
            obtenerListados({
                proveedores: new ProveedorController(),
            })
        })
        /**************************************************************
         * Hooks
         **************************************************************/
        onConsultado(() => {
            obtenerProveedor(contacto.proveedor)
        })
        onReestablecer(() => {
            proveedor.hydrate(new Proveedor())
        })
        onGuardado(()=>{
            emit('cerrar-modal')
            emit('guardado')
        })

        /**************************************************************
         * Validaciones
         **************************************************************/
        const reglas = {
            nombres: { required },
            apellidos: { required },
            celular: { required },
            tipo_contacto: { required },
            proveedor: { required },
        }
        const v$ = useVuelidate(reglas, contacto)
        setValidador(v$.value)

        /**************************************************************
         * Funciones
         **************************************************************/
        async function obtenerProveedor(proveedorId: number | null) {
            if (proveedorId !== null) {
                StatusLoading.activar()
                const { result } = await new ProveedorController().consultar(proveedorId)
                proveedor.hydrate(result)
                StatusLoading.desactivar()
            }
        }


        const botonVerLogs: CustomActionTable = {
            titulo: 'Historial',
            color: 'grey',
            icono: 'bi-file-text',
            accion: ({ entidad, posicion }) => {
                // console.log(entidad.id)
                contactoProveedorStore.idcontacto = entidad.id
                modales.abrirModalEntidad('ContactoProveedorLogPage')
            }
        }

        onBeforeUnmount(()=>{
            // console.log('onbeforeunmount')
            contactoProveedorStore.idcontacto = null
        })
        
        const {
            proveedores, filtrarProveedores,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        //llenar listados
        proveedores.value = listadosAuxiliares.proveedores

        return {
            mixin, contacto, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasContactosProveedores,

            //modales
            modales,

            proveedor,
            //listados
            proveedores,
            opciones_tipo_contacto,

            //funciones
            filtrarProveedores,
            obtenerProveedor,
            botonVerLogs,

        }
    }
})