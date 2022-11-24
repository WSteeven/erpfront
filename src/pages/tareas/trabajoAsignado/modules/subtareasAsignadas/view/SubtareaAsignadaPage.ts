// Dependencias
import { configuracionColumnasTecnico } from 'pages/tareas/subtareas/domain/configuracionColumnasTecnico'
import { tiposTareasTelconet, provincias, ciudades } from 'config/utils'
import { Subtarea } from "pages/tareas/subtareas/domain/Subtarea"
import { useTareaStore } from "stores/tarea"
import { computed, defineComponent, reactive, ref } from "vue"

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { ClienteFinal } from 'pages/tareas/contactos/domain/ClienteFinal'
import { ContactoController } from 'pages/tareas/contactos/infraestructure/ContactoController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProvinciaController } from 'pages/sistema/provincia/infraestructure/ProvinciaController'

export default defineComponent({
    components: { EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
        const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados, consultar } = mixin.useComportamiento()
        const { onConsultado } = mixin.useHooks()

        const store = useTareaStore()

        const tiposTrabajos = ref([])
        const grupos = ref([])
        const subtareas = ref([])

        const clienteFinal = reactive(new ClienteFinal())
        const opcionesUbicacion = { manual: 'ubicacion_manual', cliente: 'cliente_final' }
        const tipoUbicacionTrabajo = ref(opcionesUbicacion.manual)

        cargarVista(async () => {
            await obtenerListados({
                tiposTrabajos: {
                    controller: new TipoTrabajoController(),
                    params: { cliente: store.tarea.cliente }
                },
                subtareas: {
                    controller: new SubtareaController(),
                    params: { tarea_id: store.tarea.id }
                },
                grupos: new GrupoController(),
                clientesFinales: new ContactoController(),
                provincias: new ProvinciaController(),
                cantones: new CantonController(),
            })

            grupos.value = listadosAuxiliares.grupos
            tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
            subtareas.value = listadosAuxiliares.subtareas
            clientesFinales.value = listadosAuxiliares.clientesFinales
            provincias.value = listadosAuxiliares.provincias
            cantones.value = listadosAuxiliares.cantones
            // subtarea.hydrate(store.subtareaAsignada)
        })

        // Filtro tipos de clientes finales
        const clientesFinales = ref()
        function filtrarClientesFinales(val, update) {
            if (val === '') {
                update(() => {
                    clientesFinales.value = listadosAuxiliares.clientesFinales
                })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                clientesFinales.value = listadosAuxiliares.clientesFinales.filter(
                    (v) => v.nombres.toLowerCase().indexOf(needle) > -1
                )
            })
        }

        // Filtro provincias
        const provincias = ref()
        function filtrarProvincias(val, update) {
            if (val === '') {
                update(() => {
                    provincias.value = listadosAuxiliares.provincias
                })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                provincias.value = listadosAuxiliares.provincias.filter(
                    (v) => v.provincia.toLowerCase().indexOf(needle) > -1
                )
            })
        }

        // Filtro cantones
        const cantones = ref([])
        function filtrarCantones(val, update) {
            if (val === '') {
                update(() => {
                    cantones.value = listadosAuxiliares.cantones
                })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                cantones.value = listadosAuxiliares.cantones.filter(
                    (v) => v.canton.toLowerCase().indexOf(needle) > -1
                )
            })
        }

        const cantonesPorProvincia = computed(() => cantones.value.filter((canton: any) => canton.provincia_id === subtarea.ubicacion_tarea.provincia))

        async function obtenerClienteFinal(clienteFinalId: number) {
            const clienteFinalController = new ContactoController()
            const { result } = await clienteFinalController.consultar(clienteFinalId)
            clienteFinal.hydrate(result)
        }

        //if (store.idSubtareaAsignada) 
        consultar({ id: store.idSubtareaAsignada })

        onConsultado(() => {
            if (subtarea.cliente_final) {
                obtenerClienteFinal(subtarea.cliente_final)
                tipoUbicacionTrabajo.value = opcionesUbicacion.cliente
            } else {
                tipoUbicacionTrabajo.value = opcionesUbicacion.manual
            }
        })

        return {
            subtarea,
            tiposTareasTelconet,
            configuracionColumnasTecnico,
            provincias, ciudades,
            tiposTrabajos,
            grupos,
            subtareas,
            clienteFinal,
            tipoUbicacionTrabajo,
            filtrarClientesFinales,
            filtrarCantones,
            filtrarProvincias,
            listadosAuxiliares,
            cantonesPorProvincia,
            clientesFinales,
        }
    }
})