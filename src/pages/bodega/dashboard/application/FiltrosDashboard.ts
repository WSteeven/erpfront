
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
            if (key == 'ESTADOS') {
                switch (label) {
                    case 'PENDIENTE':
                        return egresos.value.filter((objeto) => !objeto.firmada)
                    case 'PARCIAL':
                        return egresos.value.filter((objeto) => objeto.estado_comprobante === 'PARCIAL')
                        break
                    case 'NO REALIZADA':
                        return egresos.value.filter((objeto) => objeto.estado === label)
                        break
                    default:
                        return egresos.value.filter((objeto) => objeto.firmada || objeto.estado_comprobante =='ACEPTADA')
                }
            }
            return egresos.value.filter((objeto) => objeto.motivo === label)
    }
}