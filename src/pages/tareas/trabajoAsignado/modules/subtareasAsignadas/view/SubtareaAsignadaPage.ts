// Dependencias
import { configuracionColumnasArchivoSubtarea } from 'controlTareas/modules/subtareasListadoContent/modules/gestorArchivosSubtareas/domain/configuracionColumnasArchivoSubtarea'
import { configuracionColumnasTecnico } from 'subtareas/domain/configuracionColumnasTecnico'
import { tiposTareasTelconet, ciudades, accionesTabla, rolesAdmitidos } from 'config/utils'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { computed, defineComponent, reactive, ref, watch } from "vue"
import { useTareaStore } from "stores/tarea"

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTrabajoController } from 'tiposTrabajos/infraestructure/TipoTrabajoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { ContactoController } from 'tareas/contactos/infraestructure/ContactoController'
import { SubtareaController } from 'subtareas/infraestructure/SubtareaController'
import { GrupoController } from 'tareas/grupos/infraestructure/GrupoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ClienteFinal } from 'tareas/contactos/domain/ClienteFinal'
import { Subtarea } from 'subtareas/domain/Subtarea'
import { ArchivoSubtareaController } from 'pages/tareas/controlTareas/modules/subtareasListadoContent/modules/gestorArchivosSubtareas/infraestructure/ArchivoSubtareaController'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { descargarArchivoUrl, quitarItemDeArray, stringToArray } from 'shared/utils'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export default defineComponent({
    components: { EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
        const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados, consultar } = mixin.useComportamiento()
        const { onConsultado } = mixin.useHooks()

        const store = useTareaStore()

        const trabajoAsignadoStore = useTrabajoAsignadoStore()

        const tiposTrabajos = ref([])
        const grupos = ref([])
        const subtareas = ref([])

        const clienteFinal = reactive(new ClienteFinal())
        const opcionesUbicacion = { manual: 'ubicacion_manual', cliente: 'cliente_final' }
        const tipoUbicacionTrabajo = ref(opcionesUbicacion.manual)

        const archivos = ref([])
        async function obtenerArchivos() {
            const { result } = await new ArchivoSubtareaController().listar({ subtarea: trabajoAsignadoStore.idSubtareaSeleccionada })
            archivos.value = result
        }
        obtenerArchivos()

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
        consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })

        onConsultado(() => {
            if (subtarea.cliente_final) {
                obtenerClienteFinal(subtarea.cliente_final)
                tipoUbicacionTrabajo.value = opcionesUbicacion.cliente
            } else {
                tipoUbicacionTrabajo.value = opcionesUbicacion.manual
            }

            subtarea.tecnicos_grupo_principal = subtarea.tecnicos_grupo_principal.map((empleado: Empleado) => {
                const tecnico = new Empleado()
                tecnico.hydrate(empleado)

                const roles = stringToArray(tecnico.roles ?? '')
                tecnico.roles = quitarItemDeArray(roles, rolesAdmitidos.empleado).join(',')

                return tecnico
            })
        })

        const botonDescargar: CustomActionTable = {
            titulo: 'Descargar',
            icono: 'bi-download',
            color: 'positive',
            accion: ({ entidad }) => {
                descargarArchivoUrl(entidad.ruta)
            },
        }

        return {
            subtarea,
            tiposTareasTelconet,
            configuracionColumnasTecnico,
            columnasGestor: [...configuracionColumnasArchivoSubtarea, accionesTabla],
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
            archivos,
            botonDescargar,
        }
    }
})