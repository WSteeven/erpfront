//Dependencias
import { configuracionColumnasTransferencias } from "../domain/configuracionColumnasTransferencias";
import { required, requiredIf } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { acciones, } from "config/utils";


//Componentes
import TabLayoutFilterTabs from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import  ModalesEntidad  from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TransferenciaController } from "../infraestructure/TransferenciaController";
import { Transferencia } from "../domain/Transferencia";
import { useNotificacionStore } from "stores/notificacion";
import {useQuasar} from 'quasar'


export default defineComponent()