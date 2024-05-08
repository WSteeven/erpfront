
export const filtroIngresos = (label: string, ingresos: any, etiquetas: any) => {
    switch (label) {
        case 'OTROS':
            console.log('Diste clic en otros')
            return ingresos.value.filter((objeto) => !etiquetas.includes(objeto.motivo))
        default:
            console.log('Entro en default: ' + label)
            return ingresos.value.filter((objeto) => objeto.motivo === label)
    }
}

export const filtroEgresos = (label: string, egresos: any, etiquetas: any, key: string) => {
    switch (label) {
        case 'OTROS':
            console.log('Diste clic en otros')
            return egresos.value.filter((objeto) => !etiquetas.includes(objeto.motivo))
        default:
            console.log('Entro en default: ' + label)
            console.log(egresos.value);

            if (key == 'ESTADOS') {
                switch (label) {
                    case 'PENDIENTE':
                        return egresos.value.filter((objeto) => !objeto.firmada && objeto.estado_comprobante === 'PENDIENTE')
                    case 'PARCIAL':
                        return egresos.value.filter((objeto) => objeto.estado_comprobante === 'PARCIAL')
                        break
                    case 'NO REALIZADA':
                        return egresos.value.filter((objeto) => objeto.estado === label)
                        break
                    default:
                        return egresos.value.filter((objeto) => objeto.firmada || objeto.estado_comprobante == 'ACEPTADA')
                }
            }
            return egresos.value.filter((objeto) => objeto.motivo === label)
    }
}

export const filtroDevoluciones = (label: string, devoluciones: any) => {
    switch (label) {
        case 'PENDIENTE':
            return devoluciones.value.filter((objeto) => objeto.autorizacion == 'PENDIENTE' && objeto.estado == 'CREADA')
        case 'APROBADO':
            return devoluciones.value.filter((objeto) => objeto.autorizacion == 'APROBADO' && objeto.estado_bodega == 'PENDIENTE')
        case 'PARCIAL':
            return devoluciones.value.filter((objeto) => objeto.autorizacion == 'APROBADO' && objeto.estado_bodega == 'PARCIAL')
        case 'CANCELADO':
            return devoluciones.value.filter((objeto) => objeto.autorizacion == 'CANCELADO' || objeto.estado_bodega == 'NO REALIZADA')
        case 'COMPLETA':
            return devoluciones.value.filter((objeto) => objeto.estado_bodega == 'COMPLETA')
        default:
            console.log('Entro en default: ' + label)
    }
}

export const filtroPedidos = (label: string, pedidos: any) => {
    console.log('filtroPedidos', label, pedidos)
    switch (label) {
        case 'PENDIENTE':
            return pedidos.value.filter((objeto) => objeto.autorizacion == 'PENDIENTE')
        case 'APROBADO':
            return pedidos.value.filter((objeto) => objeto.autorizacion == 'APROBADO' && objeto.estado == 'PENDIENTE')
        case 'PARCIAL':
            return pedidos.value.filter((objeto) => objeto.autorizacion == 'APROBADO' && objeto.estado == 'PARCIAL')
        case 'CANCELADO':
            return pedidos.value.filter((objeto) => objeto.autorizacion == 'CANCELADO' || objeto.estado == 'NO REALIZADA')
        case 'COMPLETA':
            return pedidos.value.filter((objeto) => objeto.estado == 'COMPLETA')
        default:
            console.log('Entro en default: ' + label)
    }
}