import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const respuestas1_3 = [
      { label: 'No hay información', value: '1' },
      { label: 'Insuficiente', value: '2' },
      { label: 'Es adecuada', value: '3' },
    ]

    const respuestas1_4a = [
      { label: 'Muy clara', value: '1' },
      { label: 'Clara', value: '2' },
      { label: 'Poco clara', value: '3' },
      { label: 'Nada clara', value: '4' },
    ]

    const respuestas1_4b = [
      { label: 'Siempre o casi siempre', value: '1' },
      { label: 'A menudo', value: '2' },
      { label: 'A veces', value: '3' },
      { label: 'Nunca o casi nunca', value: '4' },
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
        id: '1',
        pregunta: '¿Trabaja los sábados?',
        respuesta: null,
        posibles_respuestas: respuestas1_4a,
      },
      {
        id: '2',
        pregunta: '¿Trabaja los domingos y festivos?',
        respuesta: null,
        posibles_respuestas: respuestas1_4a,
      },
      {
        id: '3',
        pregunta: '¿Tienes la posibilidad de tomar días u horas libres para atender asuntos de tipo personal?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '4',
        pregunta: '¿Con qué frecuencia tienes que trabajar más tiempo del horario habitual, hacer horas extra o llevarte trabajo a casa?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '5',
        pregunta: '¿Dispones de al menos de 48 horas consecutivas de descanso en el transcurso de una semana (7 días consecutivos)?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '6',
        pregunta: '¿Tu horario laboral te permite compaginar tu tiempo libre (vacaciones, días libres, horario de entrada y salida) con los de tu familia y amigos?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '7',
        pregunta: '¿Puedes decidir cuándo las pausas reglamentarias (pausa comida o bocadillo)?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '8',
        pregunta: 'Durante la jornada de trabajo y fuera de las pautas reglamentarias, ¿puedes detener tu trabajo o hacer una parada corta cuando lo necesitas?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '9',
        pregunta: '¿Puedes marcar tu propio ritmo de trabajo a lo largo de la jornada laboral?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '10a',
        pregunta: '¿Puedes tomar decisiones relativas a: lo que debes hacer (actividad y tareas a realizar?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '10b',
        pregunta: 'Puedes tomar decisiones relativas a: ¿la distribución de tareas a lo largo de tu jornada?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },


    ])

    return {
      preguntas,
    }
  }
})
