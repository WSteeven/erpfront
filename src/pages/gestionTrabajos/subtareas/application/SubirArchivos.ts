// Dependencias
// import { configuracionColumnasArchivoSubtarea } from '../domain/configuracionColumnasArchivoSubtarea'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { descargarArchivoUrl, formatBytes } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosError, AxiosResponse } from 'axios'
import { apiConfig, endpoints } from 'config/api'
import { accionesTabla } from 'config/utils'
// import { defineComponent, ref } from 'vue'

import { ArchivoSubtareaController } from "../modules/gestorArchivosTrabajos/infraestructure/ArchivoSubtareaController"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { Archivo } from "../modules/gestorArchivosTrabajos/domain/Archivo"
import { configuracionColumnasArchivoSubtarea } from '../modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea'

export const useSubirArchivos = (subtarea_id: number) => {

    const mixin = new ContenedorSimpleMixin(Archivo, new ArchivoSubtareaController())
    const { entidad: archivo, listado } = mixin.useReferencias()
    const { editar, eliminar, listar } = mixin.useComportamiento()

    const { prompt, notificarCorrecto, notificarError } = useNotificaciones()

    /***************
    * Botones tabla
    ***************/
    const btnEliminar: CustomActionTable = {
        titulo: 'Eliminar',
        icono: 'bi-trash3',
        color: 'negative',
        accion: async ({ entidad, posicion }) => {
            await eliminar(entidad, () => listado.value.splice(posicion, 1))
        }
    }

    const btnComentar: CustomActionTable = {
        titulo: 'Comentar',
        icono: 'bi-chat-square-text',
        color: 'primary',
        accion: ({ entidad }) => {
            const config: CustomActionPrompt = {
                mensaje: 'Ingrese el comentario',
                defecto: entidad.comentario,
                accion: (data) => {
                    entidad.comentario = data
                    archivo.hydrate(entidad)
                    editar(archivo)
                }
            }

            prompt(config)
        },
    }

    const btnDescargar: CustomActionTable = {
        titulo: 'Descargar',
        icono: 'bi-download',
        color: 'positive',
        accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta)
    }

    const axios = AxiosHttpRepository.getInstance()
    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(endpoints.archivos_subtareas)}`

    /************
    * Funciones
    *************/
    async function factoryFn(files) {
        const fd = new FormData()
        fd.append('file', files[0])
        fd.append('subtarea_id', subtarea_id + '')

        try {
            const response: AxiosResponse = await axios.post(ruta, fd)
            // files.value = []
            listado.value.push(response.data.modelo)
            notificarCorrecto(response.data.mensaje)
        } catch (error: unknown) {
            const axiosError = error as AxiosError
            notificarError(axiosError.response?.data.mensaje)
        }
    }

    return {
        listado,
        // extraerExtension: (nombre: string) => nombre.split('.').at(-1),
        // formatBytes,
        //columnas: [...configuracionColumnasArchivoSubtarea, accionesTabla],
        btnEliminar,
        btnComentar,
        btnDescargar,
        factoryFn,
    }
}