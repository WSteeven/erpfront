// Dependencias
import { computed, defineComponent, reactive } from "vue";
import { configuracionColumnasTrabajoRealizado } from '../../../../../domain/configuracionColumnasTrabajoRealizado'
import { configuracionColumnasObservacion } from '../../../../../domain/configuracionColumnasObservacion'
import { configuracionColumnasMaterial } from '../../../../../domain/configuracionColumnasMaterial'
import { regiones, atenciones, tiposIntervenciones, causaIntervencion } from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import flatPickr from 'vue-flatpickr-component'

// Logica y controladores
import TrabajoRealizado from '../../../../../domain/TrabajoRealizado'
import { ControlAvance } from "../domain/ControlAvance";
import Observacion from '../../../../../domain/Observacion'
import Material from '../../../../../domain/Material'

export default defineComponent({
    components: {
        EssentialTable,
        flatPickr,
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

        const cronologiaTrabajoRealizado: TrabajoRealizado[] = [
            {
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
        ]

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

        const materiales: Material[] = [
            {
                id: 1,
                producto: 'VARILLA DE ANCLAJE',
                medida: 'UNIDAD',
                cantidad_usada: 1,
            },
            {
                id: 2,
                producto: 'CABLE TENSOR',
                medida: 'METRO',
                cantidad_usada: 2,
            },
            {
                id: 3,
                producto: 'GRILLETES',
                medida: 'UNIDAD',
                cantidad_usada: 2,
            },
        ]

        const tablaTrabajoRealizado = {
            eliminar: () => {
                //
            },
            editar: () => {
                //
            },
        }

        const tablaObservacion = {
            eliminar: () => {
                //
            },
            editar: () => {
                //
            },
        }

        const tablaMateriales = {
            eliminar: () => {
                //
            },
            editar: () => {
                //
            },
        }

        const agregarActividadRealizada: CustomActionTable = {
            titulo: 'Agregar actividad realizada',
            accion: () => {
                //
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

        return {
            controlAvance,
            causasIntervencion,
            // columnas
            columnasTrabajoRealizado,
            columnasObservacion,
            columnasMaterial,
            // listados
            cronologiaTrabajoRealizado,
            observaciones,
            materiales,
            // acciones tabla
            tablaTrabajoRealizado,
            tablaObservacion,
            tablaMateriales,
            agregarActividadRealizada,
            agregarObservacion,
            agregarMaterial,
            // config
            regiones,
            atenciones,
            tiposIntervenciones,
        }
    }
})