// Dependencias
import { configuracionColumnasContactos } from '../domain/configuracionColumnasContactos'
import { defineComponent } from "vue"

// Componentes
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContactoController } from "../infraestructure/ContactoController"
import { ClienteFinal } from "../domain/ClienteFinal"
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'

export default defineComponent({
    components: {
        TabLayout,
    },
    setup() {
        const mixin = new ContenedorSimpleMixin(ClienteFinal, new ContactoController())
        const { entidad: contacto, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados } = mixin.useComportamiento()

        cargarVista(async () => {
            await obtenerListados({
                provincias: new ProvinciaController(),
                ciudades: new CantonController(),
            })
        })

        return {
            mixin,
            contacto,
            configuracionColumnasContactos,
            listadosAuxiliares,
        }
    }
})