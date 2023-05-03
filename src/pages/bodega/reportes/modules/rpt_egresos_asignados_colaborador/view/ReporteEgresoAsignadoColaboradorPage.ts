//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import { useAuthenticationStore } from 'stores/authentication';

//Logica y controladores
import { defineComponent } from "vue";

export default defineComponent({
  components: {EssentialTable},
  setup(){
   /*********
     * Stores
     *********/
   const authenticationStore = useAuthenticationStore()
   

   /****************
    * Controladores
    ****************/
   const materialEmpleadoTareaController = new MaterialEmpleadoTareaController()
   const materialEmpleadoController = new MaterialEmpleadoController()
   const tareaController = new TareaController()

   /************
    * Variables
    ************/
   const { notificarAdvertencia, notificarError } = useNotificaciones()
   const listado = ref([])
   const listadoStockPersonal = ref([])
   const tareasSource: any = ref([])
   const filtro = reactive({
     tarea: null,
     tipoStock: null
   })
  }
})
