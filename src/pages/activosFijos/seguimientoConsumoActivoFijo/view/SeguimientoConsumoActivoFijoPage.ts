// Dependencias
import { configuracionColumnasSeguimientoConsumoActivoFijo } from '../domain/configuracionColumnasSeguimientoConsumoActivoFijo'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTablePagination from 'components/tables/view/EssentialTablePagination.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarArchivo from 'shared/prompts/SolicitarArchivo.vue'

// Logica y controladores
import { ComportamientoModalesSeguimientoConsumoActivoFijo } from '../application/ComportamientoModalesSeguimientoConsumoActivoFijo'
import { SeguimientoConsumoActivoFijoController } from '../infraestructure/SeguimientoConsumoActivoFijoController'
import { ArchivoController } from 'subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SeguimientoConsumoActivoFijo } from '../domain/SeguimientoConsumoActivoFijo'
import { obtenerFechaActual } from 'shared/utils'

export default defineComponent({
    components: { EssentialTablePagination, ModalEntidad, SolicitarArchivo },
    setup() {
        /**********
         * Stores
         **********/
        const authenticationStore = useAuthenticationStore()

        /************
         * Variables
         ************/
        const opcionesSeguimientoConsumo = {
            SEGUIMIENTO_CONSUMO: 'Seguimiento de consumo',
            HISTORIAL_SEGUIMIENTO: 'Historial del seguimiento de consumo',
        }
        const tab = ref(opcionesSeguimientoConsumo.SEGUIMIENTO_CONSUMO)
        const modales = new ComportamientoModalesSeguimientoConsumoActivoFijo()
        const { prompt } = useNotificaciones()
        const mostrarSolicitarArchivo = ref(false)

        /********
         * Mixin
        *********/
        const mixin = new ContenedorSimpleMixin(SeguimientoConsumoActivoFijo, new SeguimientoConsumoActivoFijoController(), new ArchivoController())
        const { entidad: seguimiento, listado } = mixin.useReferencias()
        const { listar, editarParcial } = mixin.useComportamiento()

        /************
         * Funciones
         ************/
        const btnAgregar: CustomActionTable = {
            titulo: 'Agregar seguimiento',
            icono: 'bi-plus',
            color: 'primary',
            accion: () => modales.abrirModalEntidad('AgregarSeguimientoConsumoActivoFijoPage')
        }

        const btnEditar: CustomActionTable = {
            titulo: 'Editar cantidad',
            icono: 'bi-pencil',
            color: 'primary',
            visible: ({ entidad }) => obtenerFechaActual('YYYY-MM-DD') === entidad.created_at.split(' ')[0],
            accion: async ({ entidad, posicion }) => {
                const data: CustomActionPrompt = {
                    titulo: 'Editar cantidad',
                    mensaje: 'Ingresa la cantidad',
                    tipo: 'number',
                    defecto: listado.value[posicion].cantidad_utilizada,
                    accion: async (cantidad: number) => {
                        seguimiento.hydrate(entidad)
                        await editarParcial(entidad.id, {
                            detalle_producto: entidad.detalle_producto_id,
                            cliente: entidad.cliente_id,
                            cantidad_anterior: entidad.cantidad_utilizada ?? 0,
                            cantidad_utilizada: cantidad,
                        })
                        listado.value[posicion].cantidad_utilizada = cantidad
                    }
                }
                prompt(data)
            }
        }

        const btnJustificativoUso: CustomActionTable = {
            titulo: 'Justificativo uso',
            icono: 'bi-upload',
            color: 'blue-grey',
            accion: async ({ entidad }) => {
                seguimiento.hydrate(entidad)
                mostrarSolicitarArchivo.value = true
            }
        }

        const btnSeReportoSicosep: CustomActionTable<SeguimientoConsumoActivoFijo> = {
            titulo: ({ entidad }) => entidad.se_reporto_sicosep ? 'No se reportó Sicosep' : 'Se reportó Sicosep',
            icono: ({ entidad }) => entidad.se_reporto_sicosep ? 'bi-toggle2-on' : 'bi-toggle2-off',
            color: ({ entidad }) => entidad.se_reporto_sicosep ? 'negative' : 'positive',
            accion: ({ entidad }) => editarParcial(entidad.id, { se_reporto_sicosep: !entidad.se_reporto_sicosep })
        }

        /********
         * Init
         ********/
        listar({ empleado_id: authenticationStore.user.id })

        return {
            tab,
            listado,
            mixin,
            opcionesSeguimientoConsumo,
            configuracionColumnasSeguimientoConsumoActivoFijo,
            accionesTabla,
            btnAgregar,
            btnEditar,
            btnJustificativoUso,
            btnSeReportoSicosep,
            modales,
            mostrarSolicitarArchivo,
            seguimiento,
        }
    }
})