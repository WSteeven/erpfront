//dependencies
import { computed, defineComponent, ref } from 'vue';
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'

//Components
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';
import EssentialTable from 'components/tables/view/EssentialTable.vue';

//logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Devolucion } from '../domain/Devolucion'
import { DevolucionController } from '../infraestructure/DevolucionController'
import { useNotificaciones } from 'shared/notificaciones';
import { useNotificacionStore } from 'stores/notificacion';
import { LocalStorage, useQuasar } from 'quasar';
import { useCargandoStore } from 'stores/cargando';
import { useDevolucionStore } from 'stores/devolucion';
import { Condicion } from 'pages/administracion/condiciones/domain/Condicion';

export default defineComponent({
    components: { TabLayout, EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Devolucion, new DevolucionController())
        const { entidad: devolucion} = mixin.useReferencias()
        const { notificarError } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const devolucionStore = useDevolucionStore()

        const condiciones = ref()
        condiciones.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())

        if (devolucionStore.devolucion) {
            devolucion.hydrate(devolucionStore.devolucion)
        } else {
            console.log('else->', devolucionStore.devolucion)
        }

        const configuracionColumnasProductos = computed(() => [...configuracionColumnasProductosSeleccionados,
        {
            name: 'condiciones',
            field: 'condiciones',
            label: 'Estado del producto',
            align: 'left',
            sortable: false,
            visible: true,
            type: 'select',
            options: condiciones.value.map((v: Condicion) => { return { label: v.nombre } })
        },
        {
            name: 'observacion',
            field: 'observacion',
            label: 'Observación',
            align: 'left',
            type: 'string',
            sortable: false,
        }])


        return {
            devolucion, mixin,
            configuracionColumnas: configuracionColumnasDevoluciones,
            configuracionColumnasProductos,


        }
    }
})