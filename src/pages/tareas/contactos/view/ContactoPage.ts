// Dependencias
import { defineComponent } from "vue"
import { configuracionColumnasContactos } from '../domain/configuracionColumnasContactos'
import { provincias, ciudades } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContactoController } from "../infraestructure/ContactoController"
import { Contacto } from "../domain/Contacto"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"

export default defineComponent({
    components: {
        TabLayout,
    },
    setup() {
        const mixin = new ContenedorSimpleMixin(Contacto, new ContactoController())
        const { entidad: contacto, listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados } = mixin.useComportamiento()

        return {
            mixin,
            contacto,
            configuracionColumnasContactos,
            provincias,
            ciudades,
        }
    }
})