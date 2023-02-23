import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt"
import { CustomActionTable } from "components/tables/domain/CustomActionTable"
import { estadosSubtareas } from "config/utils"
import { useNotificaciones } from "shared/notificaciones"
import { useSubtareaListadoStore } from "stores/subtareaListado"
import { Trabajo } from "../domain/Trabajo"
import { CambiarEstadoTrabajo } from "./CambiarEstadoTrabajo"
import { ComportamientoModalesTrabajo } from "./ComportamientoModalesTrabajo"

export const useBotonesTablaTrabajo = () => {
    const subtareaListadoStore = useSubtareaListadoStore()
    const modales = new ComportamientoModalesTrabajo()
    const { confirmar, notificarCorrecto, prompt, notificarAdvertencia } = useNotificaciones()
    const cambiarEstadoTrabajo = new CambiarEstadoTrabajo()

    /***************
     * Botones tabla
     ***************/
    /* const agregarSubtarea: CustomActionTable = {
        titulo: 'Crear una subtarea',
        icono: 'bi-plus',
        color: 'positive',
        accion: () => {
            subtareaListadoStore.idSubtareaSel    eccionada = null
            tareaStore.accionSubtarea = acciones.nuevo
            modales.abrirModalEntidad('SubtareasPage')
        },
    } */

    /* const imprimirListado: CustomActionTable = {
        titulo: 'Imprimir listado',
        icono: 'bi-printer',
        color: 'grey-8',
        accion: () => {
            subtareaListadoStore.idSubtareaSeleccionada = null
            tareaStore.accionSubtarea = acciones.nuevo
            modales.abrirModalEntidad('SubtareasPage')
        },
    } */

    /* const botonEditarSubtarea: CustomActionTable = {
        titulo: ({ entidad }) => entidad.estado === estadosSubtareas.CREADO ? 'Editar' : 'Visualizar',
        icono: ({ entidad }) => entidad.estado === estadosSubtareas.CREADO ? 'bi-pencil' : 'bi-eye',
        accion: async ({ entidad, posicion }) => {
            tareaStore.accionSubtarea = entidad.estado === estadosSubtareas.CREADO ? acciones.editar : acciones.consultar

            modales.abrirModalEntidad('SubtareasPage')
            subtareaListadoStore.posicionSubtareaSeleccionada = posicion
            subtareaListadoStore.idSubtareaSeleccionada = entidad.id
            console.log(entidad)
        },
    } */

    const botonFormulario: CustomActionTable = {
        titulo: 'Formulario',
        icono: 'bi-check2-square',
        color: 'indigo',
        visible: ({ entidad }) => [estadosSubtareas.EJECUTANDO, estadosSubtareas.REALIZADO, estadosSubtareas.PAUSADO, estadosSubtareas.FINALIZADO].includes(entidad.estado),
        accion: ({ entidad }) => {
            subtareaListadoStore.idSubtareaSeleccionada = entidad.id
            modales.abrirModalEntidad('EmergenciasPage')
        }
    }

    const botonVerPausas: CustomActionTable = {
        titulo: 'Ver pausas',
        icono: 'bi-list',
        color: 'grey-8',
        accion: ({ entidad }) => {
            subtareaListadoStore.idSubtareaSeleccionada = entidad.id
            modales.abrirModalEntidad('PausasRealizadasPage')
        }
    }

    const botonFinalizar: CustomActionTable = {
        titulo: 'Finalizar',
        color: 'positive',
        icono: 'bi-check',
        visible: ({ entidad }) => entidad.estado === estadosSubtareas.REALIZADO,
        accion: ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como finalizada la subtarea?', async () => {
            const { result } = await cambiarEstadoTrabajo.finalizar(entidad.id)
            entidad.estado = estadosSubtareas.FINALIZADO
            entidad.fecha_hora_finalizacion = result.fecha_hora_finalizacion
            entidad.dias_ocupados = result.dias_ocupados
            actualizarElemento(posicion, entidad)
            notificarCorrecto('Subtarea finalizada exitosamente!')
        }),
    }

    const botonAsignar: CustomActionTable = {
        titulo: 'Asignar',
        color: 'indigo',
        icono: 'bi-person-fill-check',
        visible: ({ entidad }) => entidad.estado === estadosSubtareas.CREADO,
        accion: ({ entidad, posicion }) => {
            confirmar('¿Está seguro de asignar la subtarea?', async () => {
                const { result } = await cambiarEstadoTrabajo.asignar(entidad.id)
                entidad.estado = estadosSubtareas.ASIGNADO
                entidad.fecha_hora_asignacion = result.fecha_hora_asignacion
                actualizarElemento(posicion, entidad)
                notificarCorrecto('Subtarea asignada exitosamente!')
            })
        },
    }

    const botonCancelar: CustomActionTable = {
        titulo: 'Cancelar',
        color: 'negative',
        icono: 'bi-x-circle-fill',
        visible: ({ entidad }) => entidad.estado === estadosSubtareas.SUSPENDIDO,
        accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de cancelar definitivamente la subtarea?'], async () => {
            const config: CustomActionPrompt = {
                mensaje: 'Ingrese el motivo de la cancelación',
                accion: async (data) => {
                    const { result } = await cambiarEstadoTrabajo.cancelar(entidad.id, data)
                    entidad.estado = estadosSubtareas.CANCELADO
                    entidad.fecha_hora_cancelacion = result.fecha_hora_cancelacion
                    entidad.causa_cancelacion = result.causa_cancelacion
                    notificarCorrecto('Trabajo cancelado exitosamente!')
                    actualizarElemento(posicion, entidad)
                }
            }

            prompt(config)
        }),
    }

    const botonReagendar: CustomActionTable = {
        titulo: 'Reagendar',
        color: 'info',
        icono: 'bi-calendar-check',
        visible: ({ entidad }) => entidad.estado === estadosSubtareas.SUSPENDIDO,
        accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de reagendar la subtarea?', () => {
            const config: CustomActionPrompt = {
                mensaje: 'Ingrese la nueva fecha',
                tipo: 'date',
                accion: async (data) => {
                    const { result } = await cambiarEstadoTrabajo.reagendar(entidad.id, data)
                    entidad.estado = estadosSubtareas.CREADO
                    entidad.fecha_hora_creacion = result.fecha_hora_creacion
                    notificarCorrecto('Trabajo reagendado exitosamente!')
                    actualizarElemento(posicion, entidad)
                }
            }

            prompt(config)
        }),
    }

    const botonSubirArchivos: CustomActionTable = {
        titulo: 'Archivos',
        color: 'yellow-9',
        icono: 'bi-folder-fill',
        visible: () => true,
        accion: async ({ entidad, posicion }) => {
            subtareaListadoStore.idSubtareaSeleccionada = entidad.id
            subtareaListadoStore.posicionSubtareaSeleccionada = posicion
            modales.abrirModalEntidad('GestorArchivoTrabajo')
        }
    }

    function actualizarElemento(posicion: number, entidad: Trabajo): void {
        if (posicion >= 0) {
            listado.value.splice(posicion, 1, entidad)
            listado.value = [...listado.value]
        }
    }

    return {
        botonFormulario,
        botonSubirArchivos,
        botonCancelar,
        botonReagendar,
        botonAsignar,
        botonFinalizar,
        botonVerPausas,
    }
}