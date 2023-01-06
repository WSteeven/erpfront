// Dependencias
import { configuracionColumnasTrabajoRealizado } from '../../../../../domain/configuracionColumnasTrabajoRealizado'
import { configuracionColumnasObservacion } from '../../../../../domain/configuracionColumnasObservacion'
import { configuracionColumnasMaterial } from '../../../../../domain/configuracionColumnasMaterial'
import { regiones, atenciones, tiposIntervenciones, causaIntervencion } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { computed, defineComponent, reactive, ref, Ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ComportamientoModalesControlAvanceGenericoContent } from "../application/ComportamientoModalesControlAvanceGenericoContent"
import TrabajoRealizado from '../../../../../domain/TrabajoRealizado'
import Observacion from '../../../../../domain/Observacion'
import { ControlAvance } from '../domain/ControlAvance'

export default defineComponent({
    components: {
        EssentialTable,
        ModalesEntidad,
    },
    setup() {
        const controlAvance = reactive(new ControlAvance())
        const acciones = {
            name: 'acciones',
            field: 'acciones',
            label: 'Acciones',
            align: 'center',
        }

        const columnasTrabajoRealizado = [
            ...configuracionColumnasTrabajoRealizado,
            acciones,
        ]

        const columnasObservacion = [...configuracionColumnasObservacion, acciones]

        const columnasMaterial = [...configuracionColumnasMaterial, acciones]

        const actividadesRealizadas: Ref<TrabajoRealizado[]> = ref([])

        /*{
            id: 1,
            hora: '08:15:14',
            detalle: 'SE REALIZÓ LA PAUSA POR ...',
            observacion: '',
        },
        {
            id: 2,
            hora: '12:36:45',
            detalle: 'HORA DE ALMUERZO ...',
            observacion: '',
        },
    ]*/

        const observaciones: Observacion[] = [
            {
                id: 1,
                detalle: 'SE REALIZÓ LA PAUSA POR ...',
            },
            {
                id: 2,
                detalle: 'HORA DE ALMUERZO ...',
            },
        ]


        const tablaActividadRealizada = {
            eliminar: () => {
                //
            },
            editar: () => {
                //
            },
        }

        const agregarActividad: CustomActionTable = {
            titulo: 'Agregar actividad',
            accion: () => {
                actividadesRealizadas.value.push(new TrabajoRealizado())
            },
        }

        const agregarObservacion: CustomActionTable = {
            titulo: 'Agregar observación',
            accion: () => {
                //
            },
        }

        const agregarMaterial: CustomActionTable = {
            titulo: 'Agregar material',
            accion: () => {
                //
            },
        }

        const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === controlAvance.tipo_intervencion))

        const materiales: CustomActionTable = {
            titulo: 'Seleccionar materiales',
            icono: 'bi-list',
            color: 'indigo',
            accion: ({ entidad }) => {
                // tareaStore.consultarSubtarea(entidad.id)
                modales.abrirModalEntidad('MaterialOcupadoPage')
                // router.push({ name: 'subtarea_asignada' })
            },
        }

        const agregarAvance: CustomActionTable = {
            titulo: 'Agregar actividad',
            icono: 'bi-box',
            accion: ({ entidad }) => {
                // cronologiaTrabajoRealizado.value.push()
                // tareaStore.consultarSubtarea(entidad.id)
                // modales.abrirModalEntidad('SubtareaAsignadaPage')
                // router.push({ name: 'subtarea_asignada' })
            }
        }

        const modales = new ComportamientoModalesControlAvanceGenericoContent()

        return {
            TrabajoRealizado,
            controlAvance,
            causasIntervencion,
            // columnas
            columnasTrabajoRealizado,
            columnasObservacion,
            columnasMaterial,
            // listados
            actividadesRealizadas,
            observaciones,
            materiales,
            // acciones tabla
            tablaActividadRealizada,
            agregarActividad,
            agregarObservacion,
            agregarMaterial,
            agregarAvance,
            // config
            regiones,
            atenciones,
            tiposIntervenciones,
            modales,
        }
    }
})