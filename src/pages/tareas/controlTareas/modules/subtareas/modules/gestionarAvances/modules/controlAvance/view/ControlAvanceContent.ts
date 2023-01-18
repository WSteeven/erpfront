// Dependencias
import { computed, defineComponent, reactive, Ref, ref } from "vue";
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
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { useTendidoStore } from "stores/tendido";
import { useAuthenticationStore } from "stores/authentication";

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

        const tendidoStore = useTendidoStore()
        const authenticationStore = useAuthenticationStore()

        const columnasTrabajoRealizado = [
            ...configuracionColumnasTrabajoRealizado
        ]

        const columnasObservacion = [...configuracionColumnasObservacion, acciones]

        const columnasMaterial = [...configuracionColumnasMaterial, acciones]

        const cronologiaTrabajoRealizado: Ref<TrabajoRealizado[]> = ref([])

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

        const materiales: any = ref([])

        async function obtenerMateriales() {
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { tarea: 1, grupo: authenticationStore.user.grupo_id })
            const response: AxiosResponse = await axios.get(ruta)
            materiales.value = response.data.results
        }

        obtenerMateriales()

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