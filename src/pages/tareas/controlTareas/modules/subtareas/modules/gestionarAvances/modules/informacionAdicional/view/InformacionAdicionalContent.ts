import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const informacionAdicional = [
            {
                etiqueta: 'Primero',
                tipo_dato: 'text',
                valor: '35',
            },
            {
                etiqueta: 'Segundo',
                tipo_dato: 'text',
                valor: '54555',
            },
            {
                etiqueta: 'tercero',
                tipo_dato: 'text',
                valor: '353333',
            },
            {
                etiqueta: 'Cuarto',
                tipo_dato: 'number',
                valor: 35,
            },
        ]

        return {
            informacionAdicional
        }
    }
})