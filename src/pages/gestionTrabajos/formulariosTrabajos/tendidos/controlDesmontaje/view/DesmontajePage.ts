// Dependencias
import { configuracionColumnasTramos } from '../domain/configuacionColumnasTramos'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Tramo } from '../domain/Tramo'
import { defineComponent, Ref, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { accionesTabla } from 'config/utils'

export default defineComponent({
    components: {
        EssentialTable,
    },
    setup() {
        const tramos: Ref<Tramo[]> = ref([])
        const refTramos = ref()

        const btnAgregarTramo: CustomActionTable = {
            titulo: 'Agregar tramo',
            icono: 'bi-arrow-bar-down',
            accion: async () => {
                const tramo: Tramo = new Tramo()
                tramos.value.push(tramo)
                refTramos.value.abrirModalEntidad(tramo, tramos.value.length - 1)
                //                  emergencia.trabajo_realizado.push(fila)
                //                    refTrabajos.value.abrirModalEntidad(fila, emergencia.trabajo_realizado.length - 1)

            }
        }

        const btnContinuar: CustomActionTable = {
            titulo: 'Continuar',
            icono: 'bi-play',
            accion: async ({ entidad }) => {
                // trabajoAsignadoStore.idSubtareaSeleccionada = entidad.id
                // modales.abrirModalEntidad('DetalleTrabajoAsignadoPage')
            },
        }

        return {
            columnas: [...configuracionColumnasTramos, accionesTabla],
            btnContinuar,
            btnAgregarTramo,
            tramos,
            refTramos,
        }
    }
})
