import { useNotificaciones } from 'shared/notificaciones'

export function useRejectedFiles(props) {
  const {
    notificarError,
    notificarAdvertencia,
    notificarInformacion,
  } = useNotificaciones()
  const onRejected = rejectedEntries => {
    rejectedEntries.forEach(element => {
      switch (element.failedPropValidation) {
        case 'accept':
          notificarError(
            `El archivo ${element.file.name}  debe ser de un formato válido.`
          )
          notificarInformacion(`Formato/s aceptado/s ${props.formato}`)
          break
        case 'duplicate':
          notificarError(`El archivo ${element.file.name} ya está adjuntado.`)
          break
        case 'max-files':
          notificarError(
            `No se pudo agregar el archivo ${element.file.name} porque solo se permite un máximo de ${props.maxFiles} archivo/s.`
          )
          break
        case 'max-total-size':
          notificarError(
            `El archivo ${element.file.name} excede el tamaño máximo permitido.`
          )
          break
        default:
          notificarAdvertencia(
            'El tamaño total de los archivos no debe exceder los 10mb.'
          )
      }
    })
  }

  return { onRejected }
}