import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { defineComponent } from 'vue';
import { ContactoProveedor } from '../../domain/ContactoProveedor';
import { ContactoProveedorLogController } from '../../infraestructure/ContactoProveedorLogController';

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';
import { useContactoProveedorStore } from 'stores/comprasProveedores/contactoProveedor';

export default defineComponent({
    components: { TabLayout },
    setup() {

        const mixin = new ContenedorSimpleMixin(ContactoProveedor, new ContactoProveedorLogController())
        const { entidad: contacto, accion, listado } = mixin.useReferencias()
        const { listar } = mixin.useComportamiento()

        const contactoProveedorStore = useContactoProveedorStore()

        async function consultar(id) {
            const results = await contactoProveedorStore.consultarAuditoria(id)
            listado.value = results
        }
        if (contactoProveedorStore.idcontacto !== null || contactoProveedorStore.idcontacto !== undefined)
            consultar(contactoProveedorStore.idcontacto)
        else
            listar()

        return {
            mixin,
            listado,
        }
    }

})