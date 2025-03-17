// Dependencies
import { defineComponent, defineSSRCustomElement, ref } from 'vue';

//Components
import ArchivoSeguimiento from 'subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { endpoints } from 'config/api';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo';
import { ArchivoTicketController } from 'pages/gestionTickets/tickets/infraestructure/ArchivoTicketController ';

// Logica y controladores

export default defineComponent({
    components: { EssentialTable, ArchivoSeguimiento },
    setup() {


        const refArchivoProveedor = ref()
        const mixinArchivoProveedor = new ContenedorSimpleMixin(Archivo, new ArchivoTicketController())


        return {
            endpoint: endpoints.archivos_proveedores,
            refArchivoProveedor,
            mixinArchivoProveedor,
        }
    }
})
