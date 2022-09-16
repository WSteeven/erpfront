//Dependencias
import { configuracionColumnasModelos } from "../domain/configuracionColumnasModelos";
import { configuracionColumnasMarcas } from "pages/bodega/marcas/domain/configuracionColumnasMarcas";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

//Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
//modales para crear nuevas marcas
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useOrquestadorSelectorMarcas } from "../application/OrquestadorSelectorMarcas";
import { MarcaController } from "pages/bodega/marcas/infraestructure/MarcaController";
import { ModeloController } from "../infraestructure/ModeloController";
import { ComportamientoModalMarcas } from "../application/ComportamientoModalMarcas";
import { Marca } from "pages/bodega/marcas/domain/Marca";
import { Modelo } from "../domain/Modelo";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";

export default defineComponent({
    components: {
        TabLayout, 
        EssentialSelectableTable,
        LabelAbrirModal,
        ModalesEntidad
    },
    setup(){
        const mixin = new ContenedorSimpleMixin(Modelo, new ModeloController())
        const {entidad: modelo, disabled, accion} = mixin.useReferencias()
        const {onConsultado, onReestablecer}=mixin.useHooks()
        const {setValidador} = mixin.useComportamiento()

        //marcas
        const mixinMarca = new ContenedorSimpleMixin(Marca, new MarcaController())
        const { listadosAuxiliares} = mixinMarca.useReferencias()
        const {obtenerListados, cargarVista} = mixinMarca.useComportamiento()

        //obtener el listado de todas las marcas
        cargarVista(()=>{
            obtenerListados({
                marcas: new MarcaController(),
            })
        })

        //Reglas de validacion
        const reglas = {
            nombre: {required},
            marca: {required},
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, modelo)
        setValidador(v$.value)

        //instanciar el comportamiento del modal
        const modalesModelo = new ComportamientoModalMarcas()

        const {
            refListadoSeleccionable: refListadoSeleccionableMarcas,
            criterioBusqueda: criterioBusquedaMarca,
            listado: listadoMarcas,
            listar: listarMarcas,
            limpiar: limpiarMarca,
            seleccionar: seleccionarMarca
        } = useOrquestadorSelectorMarcas(modelo, 'marcas')

        onReestablecer(()=>(criterioBusquedaMarca.value=null))
        onConsultado(()=>seleccionarMarca(modelo.marca))
    
        //aqui va el listado

        return {
            mixin, modelo, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasModelos,
            //selector
            refListadoSeleccionableMarcas,
            criterioBusquedaMarca,
            listadoMarcas,
            listarMarcas,
            limpiarMarca,
            seleccionarMarca,
            configuracionColumnasMarcas,
            //listado
            listadosAuxiliares,
        }
    }
})