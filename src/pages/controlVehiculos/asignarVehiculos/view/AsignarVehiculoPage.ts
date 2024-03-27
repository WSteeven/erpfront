import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue"

import { defineComponent } from "vue";


export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin()

        return {
            tabOptionsAsignacionVehiculos: tabOptionsAsignacionVehiculos,
        }
    }
})