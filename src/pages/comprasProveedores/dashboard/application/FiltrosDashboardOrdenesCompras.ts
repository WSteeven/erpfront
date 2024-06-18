
export const filtroOrdenesComprasCreadas = (label: string, ordenes: any) => {
    switch (label) {
        case 'PENDIENTES':
            return ordenes.value.filter((orden) => orden.autorizacion_id === 1)
        case 'APROBADO':
            return ordenes.value.filter((orden) => orden.autorizacion_id === 2)
        case 'CANCELADO':
            return ordenes.value.filter((orden) => orden.autorizacion_id === 3)
        default:
            return ordenes.value
    }
}

export const filtroOrdenesComprasAprobadas = (label: string, ordenes: any) => {
    switch (label) {
        case 'PENDIENTES DE REVISAR':
            return ordenes.value.filter((orden) => orden.estado_id === 1)
        case 'REVISADAS':
            return ordenes.value.filter((orden) => orden.estado_id === 2 && orden.realizada == false)
        case 'REALIZADAS':
            return ordenes.value.filter((orden) => orden.realizada === true && orden.pagada === false)
        default: // aqui entran las pagadas
            return ordenes.value.filter((orden) => orden.pagada === true)
    }
}
export const filtroOrdenesComprasProveedores = (label: string, ordenes: any) => {
    console.log(label, ordenes.value)
    switch (label) {
        case 'ANULADAS':
            return ordenes.value.filter((orden) => orden.autorizacion_id === 3 || orden.estado_id === 4)
        case 'PENDIENTES DE REVISAR':
            return ordenes.value.filter((orden) => orden.autorizacion_id === 1 || orden.estado_id === 1)
        case 'REVISADAS':
            return ordenes.value.filter((orden) => orden.estado_id === 2 && orden.realizada == false)
        case 'REALIZADAS':
            return ordenes.value.filter((orden) => orden.realizada === true && orden.pagada === false)
        default: // aqui entran las pagadas
            return ordenes.value.filter((orden) => orden.pagada === true)
    }
}

