// Dependencias
import { tiposTareasTelconet, provincias, ciudades } from 'config/utils'
import { Subtarea } from "pages/tareas/subtareas/domain/Subtarea"
import { defineComponent, ref, watchEffect } from "vue"

import { configuracionColumnasTecnico } from 'pages/tareas/subtareas/domain/configuracionColumnasTecnico'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useTareaStore } from "stores/tarea"
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { TipoTareaController } from 'pages/tareas/tiposTareas/infraestructure/TipoTareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export default defineComponent({
    components: { EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
        const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados } = mixin.useComportamiento()

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
            subtarea.hydrate(store.subtareaAsignada)
        })


        // const subtarea = new Subtarea()
        //subtarea.hydrate(store.subtareaAsignada)
        async function obtenerTecnicoResponsable(grupo_id: number) {
            // Obtener grupo
            const grupoController = new GrupoController()
            const { result } = await grupoController.consultar(grupo_id)
            const responsable = result.empleado_id

            const empleadoController = new EmpleadoController()
            const { result: tecnicoResponsable } = await empleadoController.consultar(responsable)

            subtarea.tecnico_responsable = tecnicoResponsable.nombres + ' ' + tecnicoResponsable.apellidos
        }

        watchEffect(() => {
            if (subtarea.grupo)
                obtenerTecnicoResponsable(subtarea.grupo)

        })

        return {
            subtarea,
            tiposTareasTelconet,
            configuracionColumnasTecnico,
            provincias, ciudades,
            tiposTrabajos,
            grupos,
            subtareas,
            obtenerTecnicoResponsable,
        }
    }
})