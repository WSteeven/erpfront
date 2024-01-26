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

    const respuestas1_5a = [
      { label: 'Siempre o casi siempre', value: '1' },
      { label: 'A menudo', value: '2' },
      { label: 'A veces', value: '3' },
      { label: 'Nunca o casi nunca', value: '4' },
      { label: 'No trabajo turnos rotativos', value: '5' },
    ]

    const respuestas1_6 = [
      { label: 'Puede decidir', value: '1' },
      { label: 'Se me consulta', value: '2' },
      { label: 'Solo recibo informacion', value: '3' },
      { label: 'Ninguna participacion', value: '4' },
    ]

    const respuestas1_7 = [
      { label: 'No interviene', value: '1' },
      { label: 'Insuficiuente', value: '2' },
      { label: 'Adecuada', value: '3' },
      { label: 'Excesiva', value: '4' },
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
      {
        id: '10c',
        pregunta: 'Puedes tomar decisiones relativas a: la distribución del entorno directo de tu puesto de trabajo (espacio, mobiliario, ¿objetos personales…)?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '10d',
        pregunta: '¿Puedes tomar decisiones relativas a: cómo tienes que hacer tu trabajo (método, protocolos, procedimientos de trabajo…)?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '10e',
        pregunta: '¿Puedes tomar decisiones relativas a: la cantidad de trabajo que tienes que realizar?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '10f',
        pregunta: '¿Puedes tomar decisiones relativas a: la calidad del trabajo que realizas?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '10g',
        pregunta: '¿Puedes tomar decisiones relativas a: la reducción de situaciones anormales o incidencias que ocurren en tu trabajo?',
        respuesta: null,
        posibles_respuestas: respuestas1_4b,
      },
      {
        id: '10h',
        pregunta: '¿Puedes tomar decisiones relativas a: la distribución de los turnos rotativos?',
        respuesta: null,
        posibles_respuestas: respuestas1_5a
      },
      {
        id: '11a',
        pregunta: '¿Qué nivel de participación tienes en los siguientes aspectos de tu trabajo: introducción de cambios en los equipos y materiales?',
        respuesta: null,
        posibles_respuestas: respuestas1_6
      },
      {
        id: '11b',
        pregunta: '¿Qué nivel de participación tienes en los siguientes aspectos de tu trabajo: introducción de cambios en la manera de trabajar?',
        respuesta: null,
        posibles_respuestas: respuestas1_6
      },
      {
        id: '11c',
        pregunta: '¿Qué nivel de participación tienes en los siguientes aspectos de tu trabajo: lanzamiento de nuevos o mejores productos o servicios?',
        respuesta: null,
        posibles_respuestas: respuestas1_6
      },
      {
        id: '11d',
        pregunta: '¿Qué nivel de participación tienes en los siguientes aspectos de tu trabajo: reestructuración o reorganización de departamentos o áreas de trabajo?',
        respuesta: null,
        posibles_respuestas: respuestas1_6
      },
      {
        id: '11e',
        pregunta: '¿Qué nivel de participación tienes en los siguientes aspectos de tu trabajo: cambios en la dirección o entre tus superiores?',
        respuesta: null,
        posibles_respuestas: respuestas1_6
      },
      {
        id: '11f',
        pregunta: '¿Qué nivel de participación tienes en los siguientes aspectos de tu trabajo: contratación o incorporación de nuevos empleados?',
        respuesta: null,
        posibles_respuestas: respuestas1_6
      },
      {
        id: '11g',
        pregunta: '¿Qué nivel de participación tienes en los siguientes aspectos de tu trabajo: contratación o incorporación de nuevos empleados?',
        respuesta: null,
        posibles_respuestas: respuestas1_6
      },
      {
        id: '12a',
        pregunta: '¿Cómo valoras la supervisión que tu responsable inmediato ejerce sobre los siguientes aspectos de tu trabajo? El método para realizar el trabajo.',
        respuesta: null,
        posibles_respuestas: respuestas1_7
      },
      {
        id: '12b',
        pregunta: '¿Cómo valoras la supervisión que tu responsable inmediato ejerce sobre los siguientes aspectos de tu trabajo? La planificación del trabajo',
        respuesta: null,
        posibles_respuestas: respuestas1_7
      },
      {
        id: '12c',
        pregunta: '¿Cómo valoras la supervisión que tu responsable inmediato ejerce sobre los siguientes aspectos de tu trabajo? El ritmo de trabajo',
        respuesta: null,
        posibles_respuestas: respuestas1_7
      },
      {
        id: '12d',
        pregunta: '¿Cómo valoras la supervisión que tu responsable inmediato ejerce sobre los siguientes aspectos de tu trabajo? La calidad del trabajo realizado',
        posibles_respuestas: respuestas1_7
      },
      {
        id: '13a',
        pregunta: '¿Cómo valoras el grado de información que te proporciona la empresa sobre los siguientes aspectos? Las posibilidades de formación',
        posibles_respuestas: respuestas1_4a
      },
      {
        id: '13b',
        pregunta: '¿Cómo valoras el grado de información que te proporciona la empresa sobre los siguientes aspectos? Las posibilidades de promoción',
        posibles_respuestas: respuestas1_4a
      },
      {
        id: '13c',
        pregunta: '¿Cómo valoras el grado de información que te proporciona la empresa sobre los siguientes aspectos? Los requisitos para ocupar plazas de promoción',
        posibles_respuestas: respuestas1_4a
      },
      {
        id: '13d',
        pregunta: '¿Como valoras el grado de información que te proporciona la empresa sobre los siguientes aspectos? La situación de la empresa en el mercado',
        posibles_respuestas: respuestas1_4a
      },
      {
        id: '14a',
        pregunta: 'Para realizar tu trabajo, ¿cómo valoras la información que recibes sobre los siguientes aspectos? Lo que debes hacer (funciones, competencias y atribuciones).',
        posibles_respuestas: respuestas1_4a
      },
      {
        id: '14b',
        pregunta: 'Para realizar tu trabajo, ¿cómo valoras la información que recibes sobre los siguientes aspectos? Cómo debes hacerlo (métodos, protocolos, procedimientos de trabajo).',
        posibles_respuestas: respuestas1_4a
      },





    ])

    return {
      preguntas,
    }
  }
})
