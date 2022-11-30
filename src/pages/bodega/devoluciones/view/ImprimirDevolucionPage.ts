//dependencias
import { configuracionColumnasDevoluciones } from "../domain/configuracionColumnasDevoluciones";
import { defineComponent } from "vue";

//componentes
import EssentialTable from "components/tables/view/EssentialTable.vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";


export default defineComponent({
    components: { EssentialTable },
    props: {
        mixin: {
            type: Object as () => ContenedorSimpleMixin<any>,
            required: true,
        }
    },
    setup(props) {
        const { entidad: devolucion } = props.mixin.useReferencias()
        console.log(devolucion)


        return {
            devolucion,
        }
    }
})
