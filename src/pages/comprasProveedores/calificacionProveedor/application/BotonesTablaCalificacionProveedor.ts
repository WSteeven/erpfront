import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt"
import { CustomActionTable } from "components/tables/domain/CustomActionTable"
import { likertCalificacion } from "config/utils_compras_proveedores"
import { useNotificaciones } from "shared/notificaciones"
import { reactive, ref } from "vue"

import ArchivoSeguimiento from "pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue"

export const useBotonesTablaCalificacionProveedor = (listado) => {

    const { confirmar, prompt, promptItems } = useNotificaciones()
    const criteriosBienes = ref<any>([])
    const criteriosServicios = ref<any>([])
    const refArchivoProveedor = ref()

    /************************************************************** 
     * btnes de tabla
     **************************************************************/
    const btnEliminarCriterioBien: CustomActionTable = {
        titulo: 'Quitar',
        color: 'negative',
        icono: 'bi-x',
        accion: ({ entidad, posicion }) => {
            eliminarBien({ entidad, posicion })
        },
        visible: () => true
    }
    const btnEliminarCriterioServicio: CustomActionTable = {
        titulo: 'Quitar',
        color: 'negative',
        icono: 'bi-x',
        accion: ({ entidad, posicion }) => {
            eliminarServicio({ entidad, posicion })
        },
        visible: () => true
    }
    const btnEditarCantidadCriterioBien: CustomActionTable = {
        titulo: 'Peso',
        icono: 'bi-pencil',
        accion: ({ posicion }) => {
            const config: CustomActionPrompt = {
                titulo: 'Confirmación',
                mensaje: 'Ingresa la cantidad',
                defecto: criteriosBienes.value[posicion].peso,
                tipo: 'number',
                validacion: (val) => val > 0 && val <= 100,
                accion: (data) => {
                    criteriosBienes.value[posicion].peso = data
                },
            }

            prompt(config)
        },
        visible: () => true
    }
    const btnEditarCantidadCriterioServicio: CustomActionTable = {
        titulo: 'Peso',
        icono: 'bi-pencil',
        accion: ({ posicion }) => {
            const config: CustomActionPrompt = {
                titulo: 'Confirmación',
                mensaje: 'Ingresa la cantidad',
                defecto: criteriosServicios.value[posicion].peso,
                tipo: 'number',
                validacion: (val) => val > 0 && val <= 100,
                accion: (data) => {
                    criteriosServicios.value[posicion].peso = data
                },
            }

            prompt(config)
        },
        visible: () => true
    }
    // const btnSubirArchivosBien: CustomActionTable={
    //     titulo: 'SubirArchivos',
    //     icono: 'bi-folder-plus',
    //     color: 'secondary',
    //     accion: ({data, posicion} )=>{
    //         console.log('Diste clic en subir archivos, aquí debe abrirse un modal')
    //         // refArchivoProveedor.value.quiero_subir_archivos = true

    //     }
    // }
    const btnCalificarCriterioBien: CustomActionTable = {
        titulo: 'Calificación',
        icono: 'bi-pencil',
        accion: ({ entidad, posicion }) => {
            const config: CustomActionPrompt = reactive({
                titulo: 'Califica',
                mensaje: 'Ingresa una puntuación',
                defecto: criteriosBienes.value[posicion].puntaje,
                tipo: 'radio',
                accion: (data) => {
                    criteriosBienes.value[posicion].puntaje = data
                    criteriosBienes.value[posicion].calificacion = (.2 * data * criteriosBienes.value[posicion].peso).toFixed(2)

                    const config: CustomActionPrompt = {
                        titulo: 'Comentario',
                        mensaje: 'Ingresa un comentario',
                        defecto: criteriosBienes.value[posicion].comentario,
                        tipo: 'text',
                        accion: (data) => {
                            criteriosBienes.value[posicion].comentario = data
                        },
                    }

                    prompt(config)
                },
                items: likertCalificacion
            })
            promptItems(config)
        }
    }
    const btnCalificarCriterioServicio: CustomActionTable = {
        titulo: 'Calificación',
        icono: 'bi-pencil',
        accion: ({ entidad, posicion }) => {
            const config: CustomActionPrompt = reactive({
                titulo: 'Califica',
                mensaje: 'Ingresa una puntuación',
                defecto: criteriosServicios.value[posicion].puntaje,
                tipo: 'radio',
                accion: (data) => {
                    criteriosServicios.value[posicion].puntaje = data
                    criteriosServicios.value[posicion].calificacion = (.2 * data * criteriosServicios.value[posicion].peso).toFixed(2)

                    const config: CustomActionPrompt = {
                        titulo: 'Comentario',
                        mensaje: 'Ingresa un comentario',
                        defecto: criteriosServicios.value[posicion].comentario,
                        tipo: 'text',
                        accion: (data) => {
                            criteriosServicios.value[posicion].comentario = data
                        },
                    }

                    prompt(config)
                },
                items: likertCalificacion
            })
            promptItems(config)
        }
    }

    /************************************************************** 
     * Funciones
     **************************************************************/
    function eliminarBien({ entidad, posicion }) {
        confirmar('¿Está seguro de continuar?',
            () => {
                criteriosBienes.value.splice(posicion, 1)
                listado.value.splice(posicion, 1)
            })
    }
    function eliminarServicio({ entidad, posicion }) {
        confirmar('¿Está seguro de continuar?',
            () => {
                criteriosServicios.value.splice(posicion, 1)
                listado.value.splice(posicion, 1)
            })
    }

    return {
        //botones
        btnCalificarCriterioBien,
        btnCalificarCriterioServicio,
        btnEditarCantidadCriterioBien,
        btnEditarCantidadCriterioServicio,
        btnEliminarCriterioBien,
        btnEliminarCriterioServicio,
        // btnSubirArchivosBien,

        //listados
        criteriosBienes,
        criteriosServicios,
        listado,
    }
}