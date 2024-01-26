import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const respuestas1_3 = [
      { label: 'No hay información', value: '1' },
      { label: 'Insuficiente', value: '2' },
      { label: 'Es adecuada', value: '3' },
    ]

    const respuestas1_4 = [
      { label: 'Muy clara', value: '1' },
      { label: 'Clara', value: '2' },
      { label: 'Poco clara', value: '3' },
      { label: 'Nada clara', value: '4' },
    ]

    const respuestas1_5 = [
      { label: 'Siempre o casi siempre', value: '1' },
      { label: 'A menudo', value: '2' },
      { label: 'A veces', value: '3' },
      { label: 'Nunca o casi nunca', value: '4' },
      { label: 'No tengo, no hay otras personas', value: '5' },
    ]

    const preguntas = reactive([
      {
        id: 1,
        pregunta: '¿Trabaja los sábados?',
        respuesta: null,
        posibles_respuestas: respuestas1_4,
      },
      {
        id: 2,
        pregunta: '¿Trabaja los domingos y festivos?',
        respuesta: null,
        posibles_respuestas: respuestas1_4,
      },
    ])

    return {
      preguntas,
    }
  }
})
