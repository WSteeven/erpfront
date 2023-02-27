//Dependencias
import { configuracionColumnasNotificaciones } from "../domain/configuracionColumnasNotificaciones";

//Componentes
import EssentialTable from "components/tables/view/EssentialTable.vue";
import { defineComponent } from "vue";
import { Notificacion } from "../domain/Notificacion";
import { NotificacionController } from "../infraestructure/NotificacionController";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";

//Logica y controladores

export default defineComponent({
  components: {EssentialTable},
  setup(){
    const mixin = new ContenedorSimpleMixin(Notificacion, new NotificacionController())
    const {entidad: notificacion, disabled, accion, listado} = mixin.useReferencias()
    const {listar} = mixin.useComportamiento()

    /* A function that is defined in the mixin. It is a function that is used to list all the entities. */
    listar()


    /* A custom action button that will be added to the table. */
    const BotonMarcarLeido: CustomActionTable={
      titulo: 'Marcar como leído',
      color:'primary',
      icono: 'bi-file-check',
      accion:({entidad, posicion})=>{
        console.log('Marcaste el boton de leído')
        console.log(posicion, entidad)
      }
    }

    return{
      mixin, notificacion, disabled, accion, listado,
      configuracionColumnas: configuracionColumnasNotificaciones,
      BotonMarcarLeido,

    }
  }
})
