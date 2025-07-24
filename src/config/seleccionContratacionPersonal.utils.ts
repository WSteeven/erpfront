import { TabOption } from 'src/components/tables/domain/TabOption'

export const aniosExperiencia = [
  '3 meses',
  '6 meses',
  '1 año',
  '2 años',
  '3 años',
  '4 años',
  '5 años',
  '10 años',
  '15 años'
]

export const tabOptionsSolicitudesPersonal: TabOption[] = [
  { value: '1', label: 'PENDIENTES' },
  { value: '2', label: 'APROBADAS' },
  { value: '3', label: 'CANCELADAS' },
  { value: '4', label: 'PUBLICADAS' }
]

export const opcionesTablaVacantes = {
  inactivas: 'INACTIVAS',
  publicadas: 'PUBLICADAS',
  vigentes: 'VIGENTES',
  expiradas: 'EXPIRADAS'
}

export const tabOptionsVacantes: TabOption[] = [
  {
    value: opcionesTablaVacantes.publicadas,
    label: opcionesTablaVacantes.publicadas
  },
  {
    value: opcionesTablaVacantes.inactivas,
    label: opcionesTablaVacantes.inactivas
  },
  {
    value: opcionesTablaVacantes.vigentes,
    label: opcionesTablaVacantes.vigentes
  },
  {
    value: opcionesTablaVacantes.expiradas,
    label: opcionesTablaVacantes.expiradas
  }
]

export const estadosPostulacion = {
  POSTULADO: 'POSTULADO', // cuando el postulante registra su postulación
  REVISION_CV: 'REVISION CV', // cuando RRHH abre la postulación, esta opción se marca automaticamente y se notifica al postulante
  ENTREVISTA: 'EN ENTREVISTA',
  /**
   * Luego de la entrevista hay 3 posibles pasos
   * DESCARTADO -> cuando no se cumple las expectativas del puesto o del postulante
   * SELECCIONADO -> cuando se cumple las expectativas del puesto o del postulante y luego pasa a la fase de examenes medicos
   * EXAMENES MEDICOS -> cuando el postulante debe hacerse los examenes medicos para verificar si es contratable en tema de SALUD.
   * CONTRATADO -> cuando ha avanzado en todas las fases y automaticamente pasa a ser empleado de la empresa.
   * BANCO DE CANDIDATOS -> cuando no es apto para el puesto o si lo es pero no se continua el proceso ya que hay mejores prospectos o se cierra inesperadamente el proceso.
   * queda en banco de candidatos para ser llamado en un futuro proceso.
   *
   */
  DESCARTADO: 'DESCARTADO',
  PRESELECCIONADO: 'PRESELECCIONADO',
  SELECCIONADO: 'SELECCIONADO',
  EXAMENES_MEDICOS: 'EXAMENES MEDICOS',
  CONTRATADO: 'CONTRATADO',
  BANCO_DE_CANDIDATOS: 'BANCO DE CANDIDATOS',
  RECHAZADO: 'RECHAZADO' // cuando el perfil del postulante no aplica para el cargo ni para banco de candidatos
}

export const opcionesEstadosPostulaciones = [
  estadosPostulacion.POSTULADO,
  estadosPostulacion.REVISION_CV,
  estadosPostulacion.ENTREVISTA,
  estadosPostulacion.DESCARTADO,
  estadosPostulacion.SELECCIONADO,
  estadosPostulacion.EXAMENES_MEDICOS,
  estadosPostulacion.CONTRATADO,
  estadosPostulacion.BANCO_DE_CANDIDATOS,
  estadosPostulacion.RECHAZADO
]

export const likertCalificacionPostulante = ['EXCELENTE', 'BUENO', 'REGULAR']
export const likertCalificacionPostulacion = [
  'ALTA PRIORIDAD',
  'BAJA PRIORIDAD',
  'NO CONSIDERAR'
]

export const tabOptionsEstadosPostulaciones: TabOption[] = [
  { value: estadosPostulacion.POSTULADO, label: estadosPostulacion.POSTULADO },
  {
    value: estadosPostulacion.REVISION_CV,
    label: estadosPostulacion.REVISION_CV
  },
  {
    value: estadosPostulacion.PRESELECCIONADO,
    label: estadosPostulacion.PRESELECCIONADO
  },
  {
    value: estadosPostulacion.ENTREVISTA,
    label: estadosPostulacion.ENTREVISTA
  },
  {
    value: estadosPostulacion.DESCARTADO,
    label: estadosPostulacion.DESCARTADO
  },
  {
    value: estadosPostulacion.SELECCIONADO,
    label: estadosPostulacion.SELECCIONADO
  },
  {
    value: estadosPostulacion.EXAMENES_MEDICOS,
    label: estadosPostulacion.EXAMENES_MEDICOS
  },
  { value: estadosPostulacion.CONTRATADO, label: estadosPostulacion.CONTRATADO }
  // { value: estadosPostulacion.BANCO_DE_CANDIDATOS, label: estadosPostulacion.BANCO_DE_CANDIDATOS },
  // { value: estadosPostulacion.RECHAZADO, label: estadosPostulacion.RECHAZADO },
]

export const tabOptionsBancoPostulante: TabOption[] = [
  { value: 0, label: 'ACTIVO' },
  { value: 1, label: 'DESCARTADO' }
]

export const  alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const preguntasTestPersonalidad: PreguntaTest[] = [
  {
    id: 1,
    texto: 'En un negocio sería más interesante encargarse de:',
    opciones: [
      'Las máquinas o llevar registros',
      '?',
      'Entrevistar y hablar con personas'
    ]
  },
  {
    id: 2,
    texto:
      'Normalmente me voy a dormir sintiéndome satisfecho de cómo ha ido el día.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 3,
    texto:
      'Si observo que la línea de razonamiento de otra persona es incorrecta, normalmente:',
    opciones: ['Se lo señalo', '?', 'Lo paso por alto']
  },
  {
    id: 4,
    texto: 'Me gusta muchísimo tener invitados y hacer que lo pasen bien.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 5,
    texto:
      'Cuando tomo una decisión siempre pienso cuidadosamente en lo que es correcto y justo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 6,
    texto:
      'Me atrae más pasar una tarde ocupado en una tarea tranquila a la que tenga afición que estar en una reunión animada.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 7,
    texto: 'Admiro más a:',
    opciones: [
      'Una persona con capacidad de tipo medio, pero con una moral estricta',
      '?',
      'Una persona con talento, aunque a veces no sea responsable'
    ]
  },
  {
    id: 8,
    texto: 'Sería más interesante ser:',
    opciones: ['Ingeniero de la construcción', '?', 'Escritor de teatro']
  },
  {
    id: 9,
    texto: 'Normalmente soy el que da el primer paso al hacer amigos',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 10,
    texto: 'Me encantan las buenas novelas u obras de teatro / cine.',
    opciones: ['Verdadero', '?', 'Falso']
  },

  {
    id: 11,
    texto:
      'Cuando la gente autoritaria trata de dominarme hago justamente lo contrario de lo que quiere.',
    opciones: ['Sí', '?', 'No']
  },
  {
    id: 12,
    texto:
      'Algunas veces no congenio muy bien con los demás porque mis ideas no son convencionales y corrientes.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 13,
    texto:
      'Muchas personas te “apuñalarían por la espalda” para salir ellas adelante.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 14,
    texto:
      'Me meto en problemas porque a veces sigo adelante con mis ideas sin comentarlas con las personas que puedan estar implicadas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 15,
    texto: 'Hablo de mis sentimientos:',
    opciones: [
      'Con facilidad cuando las personas parecen estar interesadas',
      '?',
      'Solo si no tengo más remedio'
    ]
  },
  {
    id: 16,
    texto: 'Me aprovecho de la gente.',
    opciones: ['Algunas veces', '?', 'Nunca']
  },
  {
    id: 17,
    texto:
      'Mis pensamientos son demasiado complicados y profundos para ser comprendidos por muchas personas.',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 18,
    texto: 'Prefiero:',
    opciones: [
      'Comentar mis problemas con los amigos',
      '?',
      'Guardarlos para mis adentros'
    ]
  },
  {
    id: 19,
    texto:
      'Pienso acerca de cosas que debería haber dicho, pero que no las dije',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 20,
    texto:
      'Siempre estoy alerta ante los intentos de propagandas en las cosas que leo',
    opciones: ['Sí', '?', 'No']
  },

  {
    id: 21,
    texto: 'Si las personas actúan como si yo no les gustara:',
    opciones: ['No me perturba', '?', 'Normalmente me hace daño']
  },
  {
    id: 22,
    texto:
      'Cuando observo que difiero de alguien en puntos de vista sociales, prefiero:',
    opciones: [
      'Discutir el significado de nuestras diferencias básicas',
      '?',
      'Cambiar el tema'
    ]
  },
  {
    id: 23,
    texto: 'He dicho cosas que hirieron los sentimientos de otros.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 24,
    texto:
      'Si tuviera que cocinar o construir algo seguiría las instrucciones exactamente.',
    opciones: [
      'Verdadero, para evitar problemas',
      '?',
      'Falso, porque podría hacer algo más interesante'
    ]
  },
  {
    id: 25,
    texto: 'A la hora de construir o hacer algo preferiría trabajar:',
    opciones: ['Con otros', '?', 'Yo solo']
  },
  {
    id: 26,
    texto:
      'Me gusta hacer planes con antelación para no perder tiempo en las tareas.',
    opciones: ['Raras veces', '?', 'A menudo']
  },
  {
    id: 27,
    texto:
      'Normalmente me gusta hacer mis planes yo solo, sin interrupciones y sugerencias de otros.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 28,
    texto: 'Cuando me siento tenso incluso pequeñas cosas me sacan de quicio.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 29,
    texto: 'Puedo encontrarme bastante a gusto en un ambiente desorganizado.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 30,
    texto:
      'Si mis planes, cuidadosamente elaborados, tuvieran que ser cambiados a causa de otras personas:',
    opciones: [
      'Eso me molestaría e irritaría',
      '?',
      'Me parecería bien y estaría contento de cambiarlos'
    ]
  },

  {
    id: 31,
    texto: 'Preferiría:',
    opciones: [
      'Estar en una oficina, organizando y atendiendo a personas',
      '?',
      'Ser arquitecto dibujar planos en un despacho tranquilo'
    ]
  },
  {
    id: 32,
    texto:
      'Cuando las pequeñas cosas comienzan a marchar mal unas detrás de otras:',
    opciones: [
      'Me siento como si no pudiera dormir',
      '?',
      'Continúo de un modo normal'
    ]
  },
  {
    id: 33,
    texto:
      'Me satisface y entretiene cuidarme de las necesidades de los demás.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 34,
    texto:
      'A veces hago observaciones tontas , a modo de broma, para sorprender a los demás',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 35,
    texto:
      'Cuando llega el momento de hacer algo que he planeado y esperado, a veces no me apetece ya continuarlo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 36,
    texto:
      'En las situaciones que dependen de mí me siento bien dando instrucciones a los demás.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 37,
    texto: 'Preferiría emplear una tarde:',
    opciones: [
      'Haciendo con tranquilidad y sosiego algo por lo que tenga afición',
      '?',
      'En una fiesta animada.'
    ]
  },
  {
    id: 38,
    texto:
      'Cuando yo sé muy bien lo que el grupo tiene que hacer, me gusta ser el único en dar las órdenes.',
    opciones: ['Sí', '?', 'No']
  },
  {
    id: 39,
    texto:
      'Me divierte mucho el humor rápido y vivaz de algunas series de televisión',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 40,
    texto:
      'Le doy más valor y respeto a las normas y buenas maneras, que a una vida fácil.',
    opciones: ['Verdadero', '?', 'Falso']
  },

  {
    id: 41,
    texto:
      'Me encuentro tímido y retraído a la hora de hacer amigos entre personas desconocidas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 42,
    texto: 'Si pudiera, preferiría hacer ejercicio con:',
    opciones: ['La esgrima o la danza', '?', 'El tenis o la lucha libre']
  },
  {
    id: 43,
    texto:
      'Normalmente hay una gran diferencia entre lo que la gente dice y lo que hace.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 44,
    texto: 'Resultaría más interesante ser músico que mecánico.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 45,
    texto: 'Las personas forman su opinión acerca de mí demasiado rápidamente.',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 46,
    texto: 'Soy de esas personas que:',
    opciones: [
      'Siempre están haciendo cosas prácticas que necesitan ser hechas',
      '?',
      'Imaginan o piensan acerca de cosas sobre sí mismas'
    ]
  },
  {
    id: 47,
    texto: 'Algunas personas creen que es difícil intimar conmigo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 48,
    texto:
      'Puedo engañar a las personas siendo amigable cuando en realidad me desagradan.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 49,
    texto:
      'Mis pensamientos tienden más a girar sobre cosas realistas y prácticas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 50,
    texto: 'Suelo ser reservado y guardar mis problemas para mis adentros.',
    opciones: ['Verdadero', '?', 'Falso']
  },

  {
    id: 51,
    texto:
      'Después de tomar una decisión sobre algo sigo pensando si será acertada o errónea.',
    opciones: ['Normalmente verdadero', '?', 'Normalmente falso']
  },
  {
    id: 52,
    texto:
      'En el fondo no me gustan las personas que son “diferentes” u originales.',
    opciones: [
      'Verdadero, normalmente no me gustan',
      '?',
      'Falso, normalmente las encuentro interesantes'
    ]
  },
  {
    id: 53,
    texto: 'Estoy más interesado en:',
    opciones: [
      'Buscar un significado personal a la vida',
      '?',
      'Asegurarme un trabajo con un buen sueldo'
    ]
  },
  {
    id: 54,
    texto:
      'Me perturbo más que otros cuando las personas se enfadan entre ellas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 55,
    texto: 'Lo que este mundo necesita es:',
    opciones: [
      'Más ciudadanos íntegros y constantes',
      '?',
      'Más reformadores con opiniones sobre cómo mejorar el mundo'
    ]
  },
  {
    id: 56,
    texto: 'Prefiero los juegos en los que:',
    opciones: [
      'Se forman equipos o se tiene un compañero',
      '?',
      'Cada uno hace su partida'
    ]
  },
  {
    id: 57,
    texto:
      'Normalmente dejo algunas cosas a la buena suerte, en vez de hacer planes complejos y con todo detalle.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 58,
    texto:
      'Frecuentemente tengo periodos de tiempo en que me es difícil abandonar el sentimiento de compadecerme a mí mismo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 59,
    texto:
      'Mis mejores horas del día son aquellas que estoy solo con mis pensamientos y proyectos.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 60,
    texto:
      'Si la gente me interrumpe cuando estoy intentando hacer algo, eso no me perturba.',
    opciones: ['Verdadero, no me siento mal', '?', 'Falso, me molesta']
  },

  {
    id: 61,
    texto: 'Siempre conservo mis pertenencias en perfectas condiciones.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 62,
    texto:
      'A veces me siento frustrado por las personas demasiado rápidamente.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 63,
    texto:
      'No me siento a gusto cuando hablo o muestro mis sentimientos de afecto o cariño.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 64,
    texto: 'En mi vida personal, casi siempre alcanzo las metas que me pongo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 65,
    texto:
      'Si el sueldo fuera el mismo, preferiría ser un científico más que un directivo de ventas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 66,
    texto:
      'Si la gente hace algo incorrecto, normalmente le digo lo que pienso.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 67,
    texto: 'Pienso que mis necesidades emocionales:',
    opciones: ['No están demasiado satisfechas', '?', 'Están bien satisfechas']
  },
  {
    id: 68,
    texto:
      'Normalmente me gusta estar en medio de mucha actividad y excitación.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 69,
    texto:
      'La gente debería insistir, más de lo que hace ahora, en que las normas morales sean seguidas estrictamente.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 70,
    texto: 'Preferiría vestir:',
    opciones: ['De modo aseado y sencillo', '?', 'A la moda y original']
  },

  {
    id: 71,
    texto:
      'Me suelo sentir desconcertado si de pronto paso a ser el centro de la atención en un grupo social.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 72,
    texto:
      'Me pone irritado que la gente insista en que yo siga las mínimas reglas de seguridad.',
    opciones: [
      'Verdadero, porque no siempre son necesarias',
      '?',
      'Falso, porque es importante hacer las cosas correctamente'
    ]
  },
  {
    id: 73,
    texto: 'Comenzar a conversar con extraños:',
    opciones: ['Nunca me ha dado problemas', '?', 'Me cuesta bastante']
  },
  {
    id: 74,
    texto: 'Si trabajara en un periódico preferiría los temas de:',
    opciones: ['Literatura o cine', '?', 'Deportes o política']
  },
  {
    id: 75,
    texto: 'Dejo que pequeñas cosas me perturben más de lo que deberían.',
    opciones: ['A veces', '?', 'Raras veces']
  },
  {
    id: 76,
    texto:
      'Es acertado estar en guardia con los que hablan de modo amable, porque se pueden aprovechar de uno.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 77,
    texto:
      'En la calle me detendría más a contemplar un artista pintando que a ver la construcción de un edificio.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 78,
    texto:
      'Las personas se hacen perezosas en su trabajo cuando consiguen hacerlo con facilidad.',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 79,
    texto:
      'Se me ocurren ideas nuevas sobre todo tipo de cosas, demasiadas para ponerlas en práctica.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 80,
    texto:
      'Cuando hablo con alguien que no conozco todavía, no doy más información que la necesaria.',
    opciones: ['Normalmente Verdadero', '?', 'Normalmente Falso']
  },

  {
    id: 81,
    texto: 'Pongo más atención en:',
    opciones: [
      'Las cosas prácticas que me rodean',
      '?',
      'Los pensamientos y la imaginación'
    ]
  },
  {
    id: 82,
    texto:
      'Cuando la gente me critica delante de otros me siento muy descorazonado y herido.',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 83,
    texto:
      'Encuentro más interesante a la gente si sus puntos de vista son diferentes de los de la mayoría.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 84,
    texto: 'Al tratar con la gente es mejor:',
    opciones: [
      'Poner todas las cartas sobre la mesa',
      '?',
      'No descubrir tu propio juego'
    ]
  },
  {
    id: 85,
    texto:
      'A veces me gustaría más ponerme en mi sitio que perdonar y olvidar.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 86,
    texto: 'Me gusta la gente que:',
    opciones: [
      'Es estable y tradicional en sus intereses',
      '?',
      'Reconsidera seriamente sus puntos de vista sobre la vida'
    ]
  },
  {
    id: 87,
    texto:
      'A veces me siento demasiado responsable sobre cosas que suceden a mi alrededor.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 88,
    texto: 'El trabajo que me es familiar y habitual:',
    opciones: ['Me aburre y me da sueño', '?', 'Me da seguridad y confianza']
  },
  {
    id: 89,
    texto:
      'Logro terminar las cosas mejor cuando trabajo solo que cuando lo hago en equipo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 90,
    texto: 'Normalmente no me importa si mi habitación está desordenada.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 91,
    texto:
      'Me resulta fácil ser paciente, aun cuando alguien es lento para comprender lo que estoy explicándole.',
    opciones: ['Verdadero', '?', 'Falso, me cuesta ser paciente']
  },
  {
    id: 92,
    texto:
      'Me gusta unirme a otros que van a hacer algo juntos, como ir a un museo o de excursión.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 93,
    texto: 'Soy algo perfeccionista y me gusta que las cosas se hagan bien.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 94,
    texto:
      'Cuándo tengo que hacer una larga cola por algún motivo, no me pongo tan intranquilo y nervioso como la mayoría.',
    opciones: ['Verdadero, no me pongo', '?', 'Falso, me pongo intranquilo']
  },
  {
    id: 95,
    texto:
      'La gente me trata menos razonablemente de lo que merecen mis buenas intenciones.',
    opciones: ['A veces', '?', 'Nunca']
  },
  {
    id: 96,
    texto: 'Me lo paso bien con gente que muestra abiertamente sus emociones.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 97,
    texto: 'No dejo que me depriman pequeñas cosas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 98,
    texto:
      'Si pudiera ayudar en el desarrollo de un invento útil preferiría encargarme de:',
    opciones: [
      'Investigarlo en el laboratorio',
      '?',
      'Mostrar a las personas su utilización'
    ]
  },
  {
    id: 99,
    texto:
      'Si ser cortés y amable no da resultado puedo ser rudo y astuto cuando sea necesario.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 100,
    texto: 'Me gusta ir a menudo a espectáculos y diversiones.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 101,
    texto: 'Me siento insatisfecho conmigo mismo.',
    opciones: ['A veces', '?', 'Rara veces']
  },
  {
    id: 102,
    texto:
      'Si nos perdiéramos en una ciudad y los amigos no estuvieran de acuerdo conmigo en el camino a seguir:',
    opciones: [
      'No protestaría y les seguiría',
      '?',
      'Les haría saber que yo creía que mi camino era mejor'
    ]
  },
  {
    id: 103,
    texto: 'La gente me considera una persona animada y sin preocupaciones.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 104,
    texto:
      'Si el banco se descuidara y no me cobrara algo que debiera, creo que:',
    opciones: [
      'Lo indicaría y lo pagaría',
      '?',
      'Yo no tengo por qué decírselo'
    ]
  },
  {
    id: 105,
    texto: 'Siempre tengo que estar luchando contra mi timidez.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 106,
    texto:
      'Los profesores, sacerdotes y otras personas emplean mucho tiempo intentando impedirnos hacer lo que deseamos.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 107,
    texto:
      'Cuando estoy con un grupo, normalmente me siento, escucho y dejo que los demás lleven el peso de la conversación.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 108,
    texto:
      'Normalmente aprecio más belleza de un poema que una excelente estrategia en un deporte.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 109,
    texto: 'Si uno es franco y abierto los demás intentan aprovecharse de él.',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 110,
    texto:
      'Siempre me interesan las cosas mecánicas y soy bastante bueno para arreglarlas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 111,
    texto:
      'A veces estoy tan enfrascado en mis pensamientos que, a no ser que salga de ellos, pierdo la noción del tiempo y desordeno o no encuentro mis cosas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 112,
    texto:
      'Parece como si no pudiera confiar en más de la mitad de la gente que voy conociendo.',
    opciones: [
      'Verdadero, no se puede confiar en ella',
      '?',
      'Falso, se puede confiar en ella'
    ]
  },
  {
    id: 113,
    texto:
      'Normalmente descubro que conozco a los demás mejor que ellos me conocen a mí.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 114,
    texto: 'A menudo los demás dicen que mis ideas son realistas y prácticas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 115,
    texto:
      'Si creo que lo merecen, hago agudas y sarcásticas observaciones a los demás.',
    opciones: ['A veces', '?', 'Nunca']
  },
  {
    id: 116,
    texto:
      'A veces me siento como si hubiera hecho algo malo, aunque realmente no lo haya hecho.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 117,
    texto:
      'Me resulta fácil hablar sobre mi vida, incluso sobre aspectos que otros considerarían muy personales.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 118,
    texto:
      'Me gusta diseñar modos por los que el mundo pudiera cambiar y mejorar.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 119,
    texto:
      'Tiendo a ser muy sensible y preocuparme mucho acerca de algo que he hecho.',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 120,
    texto: 'En el periódico que acostumbro a hojear me intereso más por:',
    opciones: [
      'Los artículos sobre los problemas sociales',
      '?',
      'Todas las noticias locales'
    ]
  },
  {
    id: 121,
    texto: 'Preferiría emplear una tarde libre en:',
    opciones: [
      'Leer o trabajar en solitario en un proyecto',
      '?',
      'Hacer alguna tarea con los amigos'
    ]
  },
  {
    id: 122,
    texto: 'Cuando hay algo molesto que hacer, prefiero:',
    opciones: [
      'Dejarlo a un lado hasta que no haya más remedio que hacerlo',
      '?',
      'Comenzar a hacerlo de inmediato'
    ]
  },
  {
    id: 123,
    texto: 'Prefiero tomar la comida de medio día:',
    opciones: ['Con un grupo de gente', '?', 'En solitario']
  },
  {
    id: 124,
    texto:
      'Soy paciente con las personas, incluso cuando no son corteses y consideradas con mis sentimientos.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 125,
    texto:
      'Cuando hago algo, normalmente me tomo tiempo para pensar antes en todo lo que necesito para la tarea.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 126,
    texto:
      'Me siento molesto cuando la gente emplea mucho tiempo para explicar algo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 127,
    texto: 'Mis amigos probablemente me describen como una persona:',
    opciones: ['Cálida y amigable', '?', 'Formal y objetiva']
  },
  {
    id: 128,
    texto: 'Cuando algo me perturba, normalmente me olvido pronto de ello.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 129,
    texto: 'Como afición agradable prefiero:',
    opciones: [
      'Hacer o reparar algo',
      '?',
      'Trabajar en grupo en una tarea comunitaria'
    ]
  },
  {
    id: 130,
    texto:
      'Creo que debo reclamar si en el restaurant recibo mal servicio o alimentos deficientes.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 131,
    texto:
      'Tengo más cambios de humor que la mayoría de las personas que conozco.',
    opciones: ['Normalmente verdadero', '?', 'Normalmente falso']
  },
  {
    id: 132,
    texto:
      'Cuando los demás no ven las cosas como la veo yo, normalmente logro convencerlos.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 133,
    texto:
      'Creo que ser libre para ser lo que desee es más importante que tener buenos modales y respetar las normas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 134,
    texto: 'Me encanta hacer reír a la gente con historias ingeniosas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 135,
    texto: 'Me considero una persona socialmente muy atrevida y comunicativa.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 136,
    texto:
      'Si una persona es lo suficientemente lista para eludir las normas sin que parezca que las incumple:',
    opciones: [
      'Podría incumplirlas si tiene razones especiales para ello',
      '?',
      'Debería seguirlas a pesar de todo'
    ]
  },
  {
    id: 137,
    texto: 'Cuando me uno a un nuevo grupo, normalmente encajo pronto.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 138,
    texto:
      'Prefiero leer historias rudas o de acción realista más que novelas sentimentales e imaginativas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 139,
    texto:
      'Sospecho que la persona que se muestra abiertamente amigable conmigo pueda ser desleal cuando yo no esté delante.',
    opciones: ['Casi nunca', '?', 'A menudo']
  },
  {
    id: 140,
    texto: 'Cuando era niño empleaba la mayor parte de mi tiempo en:',
    opciones: ['Hacer o construir algo', '?', 'Leer o imaginar cosas ideales']
  },

  {
    id: 141,
    texto:
      'Muchas personas son demasiado quisquillosas y sensibles, y por su propio bien deberían “endurecerse”.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 142,
    texto:
      'Me muestro tan interesado en pensar en las ideas que a veces paso por alto los detalles prácticos.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 143,
    texto:
      'Si alguien me hace una pregunta demasiado personal intento cuidadosamente evitar contestarla.',
    opciones: ['Normalmente verdadero', '?', 'Normalmente falso']
  },
  {
    id: 144,
    texto:
      'Cuando me piden hacer una tarea voluntaria digo que estoy demasiado ocupado.',
    opciones: ['A veces', '?', 'Rara veces']
  },
  {
    id: 145,
    texto:
      'Mis amigos me consideran una persona algo abstraída y no siempre práctica.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 146,
    texto: 'Me siento muy abatido cuando la gente me critica en un grupo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 147,
    texto: 'Les surgen más problemas a quienes:',
    opciones: [
      'Se cuestionan o cambian métodos que son ya satisfactorios',
      '?',
      'Descartan enfoques nuevos o prometedores'
    ]
  },
  {
    id: 148,
    texto:
      'Soy muy cuidadoso cuando se trata de elegir a alguien con quien “abrirme” francamente.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 149,
    texto:
      'Me gusta más intentar nuevos modos de hacer las cosas que seguir caminos ya conocidos.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 150,
    texto: 'Los demás dicen que suelo ser demasiado crítico conmigo mismo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 151,
    texto:
      'Generalmente me gusta más una comida si contiene alimentos familiares y cotidianos que si tiene alimentos poco corrientes.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 152,
    texto:
      'Puedo pasar fácilmente una mañana entera sin tener necesidad de hablar con alguien.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 153,
    texto: 'Deseo ayudar a las personas.',
    opciones: ['Siempre', '?', 'A veces']
  },
  {
    id: 154,
    texto: 'Yo creo que:',
    opciones: [
      'Algunos trabajos no deberían ser hechos tan cuidadosamente como otros',
      '?',
      'Cualquier trabajo habría que hacerlo bien si es que se va a hacer'
    ]
  },
  {
    id: 155,
    texto: 'Me resulta difícil ser paciente cuando la gente me critica.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 156,
    texto: 'Prefiero los momentos en que hay gente a mí alrededor.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 157,
    texto:
      'Cuando realizo una tarea no me encuentro satisfecho a no ser que ponga especial atención incluso a los pequeños detalles.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 158,
    texto:
      'Algunas veces me “sacan de quicio” de un modo insoportable pequeñas cosas, aunque reconozca que son triviales.',
    opciones: ['Sí', '?', 'No']
  },
  {
    id: 159,
    texto:
      'Me gusta más escuchar a la gente hablar de sus sentimientos personales que de otros temas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 160,
    texto: 'Hay ocasiones en que no me siento de humor para ver a nadie.',
    opciones: ['Muy raras veces', '?', 'Bastante a menudo']
  },

  {
    id: 161,
    texto: 'Me gustaría más ser consejero orientador que arquitecto.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 162,
    texto:
      'En mi vida cotidiana casi nunca me encuentro con problemas que no puedo afrontar.',
    opciones: ['Verdadero, puedo afrontarlos fácilmente', '?', 'Falso']
  },
  {
    id: 163,
    texto: 'Cuando las personas hacen algo que me molesta, normalmente:',
    opciones: ['No le doy importancia', '?', 'Se lo digo']
  },
  {
    id: 164,
    texto: 'Yo creo más en:',
    opciones: [
      'Ser claramente serio en la vida cotidiana',
      '?',
      'Seguir casi siempre el dicho “Diviértete y sé feliz”'
    ]
  },
  {
    id: 165,
    texto: 'Me gusta que haya alguna competitividad en las cosas que hago.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 166,
    texto:
      'La mayoría de las normas se han hecho para no cumplirlas cuando haya buenas razones para ello.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 167,
    texto:
      'Me cuesta bastante hablar delante de un grupo numeroso de personas.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 168,
    texto: 'Preferiría un hogar en el que:',
    opciones: [
      'Se sigan normas estrictas de conducta',
      '?',
      'No haya muchas normas'
    ]
  },
  {
    id: 169,
    texto:
      'En las reuniones sociales suelo sentirme tímido e inseguro de mí mismo.',
    opciones: ['Verdadero', '?', 'Falso']
  },
  {
    id: 170,
    texto: 'En la televisión prefiero:',
    opciones: [
      'Un programa sobre nuevos inventos prácticos',
      '?',
      'Un concierto de un artista famoso'
    ]
  },

    //relaciones
  {
    id: 171,
    texto: '“Minuto” es a “hora” como “Segundo” es a:',
    opciones: ['Minuto', 'Milisegundo', 'Hora']
  },
  {
    id: 172,
    texto: '“Renacuajo” es a “rana” como “larva” es a:',
    opciones: ['Araña', 'Gusano', 'Insecto']
  },
  {
    id: 173,
    texto: '“Jamón” es a “cerdo” como “chuleta” es a:',
    opciones: ['Cordero', 'Pollo', 'Merluza']
  },
  {
    id: 174,
    texto: '“Hielo” es a “agua” como “roca” es a:',
    opciones: ['Lava', 'Arena', 'Petróleo']
  },
  {
    id: 175,
    texto: '“Mejor” es a “pésimo” como “peor” es a:',
    opciones: ['Malo', 'Santo', 'Óptimo']
  },
  {
    id: 176,
    texto: '¿Cuál de las tres palabras indica algo diferente de las otras dos?',
    opciones: ['Terminal', 'Estacional', 'Cíclico']
  },
  {
    id: 177,
    texto: '¿Cuál de las tres palabras indica algo diferente de las otras dos?',
    opciones: ['Gato', 'Cerca', 'Planeta']
  },
  {
    id: 178,
    texto: 'Lo opuesto de “correcto” es lo opuesto de:',
    opciones: ['Bueno', 'Erróneo', 'Adecuado']
  },
  {
    id: 179,
    texto: '¿Cuál de las tres palabras indica algo diferente de las otras dos?',
    opciones: ['Probable', 'Eventual', 'Inseguro']
  },
  {
    id: 180,
    texto: 'Lo opuesto de lo opuesto de “inexacto” es:',
    opciones: ['Casual', 'Puntual', 'Incorrecto']
  },

  //   sucesiones
  {
    id: 181,
    texto: '¿Qué número debe seguir al final de estos?',
    ejemplo: '1 – 4 – 9 – 16 ....',
    opciones: ['20', '25', '32']
  },
  {
    id: 182,
    texto: '¿Qué letra debe seguir al final de estas?',
    ejemplo: 'A – B – D – G ....',
    opciones: ['H', 'K', 'J']
  },
  {
    id: 183,
    texto: '¿Qué letra debe seguir al final de estas?',
    ejemplo: 'E – I – L ....',
    opciones: ['M', 'N', 'O']
  },
  {
    id: 184,
    texto: '¿Qué número debe seguir al final de estos?',
    ejemplo: '1/12 – 1/6 – 1/3 – 2/3 ....',
    opciones: ['3/4', '4/3', '3/2']
  },
  {
    id: 185,
    texto: '¿Qué número debe seguir al final de estos?',
    ejemplo: '1  2  0  3  –1....',
    opciones: ['5', '4', '-3']
  }
]

export interface PreguntaTest {
  id: number
  texto: string
  ejemplo: string
  opciones: string[]
}
