// Dependencias
import { configuracionColumnasTecnico } from 'pages/tareas/subtareas/domain/configuracionColumnasTecnico'
import { tiposTareasTelconet, provincias, ciudades } from 'config/utils'
import { Subtarea } from "pages/tareas/subtareas/domain/Subtarea"
import { useTareaStore } from "stores/tarea"
import { defineComponent, ref } from "vue"

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTareaController } from 'pages/tareas/tiposTareas/infraestructure/TipoTareaController'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'

export default defineComponent({
    components: { EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
        const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados, consultar } = mixin.useComportamiento()

        const store = useTareaStore()

        const tiposTrabajos = ref([])
        const grupos = ref([])
        const subtareas = ref([])

        cargarVista(async () => {
            await obtenerListados({
                tiposTrabajos: {
                    controller: new TipoTareaController(),
                    params: { cliente: store.tarea.cliente }
                },
                subtareas: {
                    controller: new SubtareaController(),
                    params: { tarea_id: store.tarea.id }
                },
                grupos: new GrupoController(),
            })

            grupos.value = listadosAuxiliares.grupos
            tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
            subtareas.value = listadosAuxiliares.subtareas
            // subtarea.hydrate(store.subtareaAsignada)
        })

        //if (store.idSubtareaAsignada) 
        consultar({ id: store.idSubtareaAsignada })

        return {
            subtarea,
            tiposTareasTelconet,
            configuracionColumnasTecnico,
            provincias, ciudades,
            tiposTrabajos,
            grupos,
            subtareas,
        }
    }
})