
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