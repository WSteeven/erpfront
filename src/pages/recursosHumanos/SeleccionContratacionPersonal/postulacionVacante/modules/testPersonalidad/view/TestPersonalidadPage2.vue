<template>
  <h5>Test de Personalidad</h5>
  <q-card class="q-pa-md bg-grey-3">
    <div class="text-h6">INSTRUCCIONES</div>
    <p>
      A continuación encontrará, una serie de frases que permitirán conocer sus
      actitudes e intereses. En general, no existen contestaciones correctas o
      incorrectas, porque las personas tienen distintos intereses y ven las
      cosas desde distintos puntos de vista. Conteste con sinceridad; de esta
      forma se podrá conocer mejor su forma de ser.
    </p>
    <p>
      Anote sus contestaciones en la Hoja de respuesta que le han entregado. En
      primer lugar escriba sus datos (nombre, e-mail, etc.) en la parte
      superior. Cada frase contiene tres posibles respuestas (A, B y C) y
      normalmente la alternativa B viene con un interrogante, para ser señalada
      cuando no es posible decidirse entre la A o la C. En la Hoja encontrará
      estas letras para dar sus respuestas. Las frases están ordenadas
      numéricamente; siga esta numeración al contestar. Lea atentamente cada
      frase y las posibles respuestas; así le será más fácil decidirse.
    </p>
    <p>
      Ahora lea los ejemplos que se presentan a continuación y piense en cómo
      los contestaría. A modo de práctica, marque en la sección “Ejemplos de
      Prueba” de la Hoja de Respuestas, sus preferencias. Si tiene dudas,
      pregunte al examinador.
    </p>

    <div class="q-mt-md">
      <div><strong>Ejemplos:</strong></div>
      <ul>
        <li>
          1. Me gusta presenciar una competición deportiva.<br />
          A. Verdadero B. ? C. Falso
        </li>
        <li>
          2. Prefiero las personas.<br />
          A. Reservadas B. ? C. Que hacen amigos fácilmente
        </li>
        <li>
          3. El dinero no hace la felicidad.<br />
          A. Verdadero B. ? C. Falso
        </li>
      </ul>
    </div>

    <p>
      <strong>Al contestar tenga en cuenta lo siguiente:</strong>
    </p>
    <ul>
      <li>
        No piense demasiado el contenido de las frases, ni emplee mucho tiempo
        en decidirse. Las frases son muy cortas para darle todos los detalles
        que Ud. quisiera: por ejemplo, se ha puesto: “...presenciar una
        competición deportiva...”, y tal vez a Ud. le guste más el fútbol que el
        tenis; debe contestar pensando en lo que es habitual para Ud.
        Generalmente, se contestan cinco o seis frases por minuto y se tarda
        poco más de media hora para completar todo el Cuadernillo.
      </li>
      <li>
        Evite señalar la respuesta B (?) excepto cuando le sea imposible
        decidirse por las otras dos; lo corriente es que esto le ocurra solo en
        muy pocas frases.
      </li>
      <li>
        Procure no dejar ninguna pregunta sin contestar. Es posible que alguna
        no tenga nada que ver con Ud. (porque no se aplica perfectamente a su
        caso); intente elegir la respuesta que vaya mejor con su modo de ser.
        Tal vez algunas frases le parezcan muy personales; no se preocupe y
        recuerde que las Hojas de Respuestas se guardan como documentos
        confidenciales y no pueden ser valoradas sin una planilla especial; por
        otra parte, al obtener los resultados no se consideran las respuestas
        una a una, sino globalmente.
      </li>
      <li>
        Conteste sinceramente. No señale sus respuestas pensando en lo que “es
        bueno” o lo que “interesa” para impresionar al examinador. Además, el
        Cuadernillo se desarrolló para ser sensible a respuestas
        contradictorias.
      </li>
    </ul>

    <div class="text-subtitle2 text-center q-mt-md">
      <strong
        >ESPERE, NO PASE A LA PÁGINA SIGUIENTE HASTA QUE SE LO INDIQUEN</strong
      >
    </div>
  </q-card>
  <q-card class="q-pa-md">
    <div v-if="!finalizado" class="row q-col-gutter-md q-py-md">
      <div
        v-for="(pregunta, index) in preguntasTestPersonalidad"
        :key="pregunta.id"
        :class="pregunta.id !== 171? 'col-12 col-md-6': 'col-12'"
      >
        <q-card class="q-pa-md q-mb-md bg-grey-3" v-if="pregunta.id === 171">
          <p>
            Las preguntas que vienen a continuación se diseñaron como ejercicios
            de <strong>resolución de problemas</strong>. En ellas hay una y solo
            una respuesta correcta. Si no está seguro de cuál es la correcta,
            elija la que crea mejor. Vea un ejemplo aquí debajo:
          </p>

          <div class="q-mt-md">
            <div class="text-subtitle1 q-mb-xs"><strong>Ejemplo:</strong></div>
            <div>“Toro” es a “ternero” como “caballo” es a:</div>
            <ul>
              <li>A. Potro</li>
              <li>B. Ternera</li>
              <li>C. Yegua</li>
            </ul>
            <p class="q-mt-sm">
              La contestación correcta es <strong>“Potro”</strong>; es la cría
              del caballo, como ternero es la cría del toro.
            </p>
          </div>
        </q-card>

        <q-card class="col-md-3 q-pa-sm" >
              <div class="text-subtitle2">
                <span v-if="pregunta.ejemplo">{{ index + 1 }}. {{ pregunta.texto }}</span> <br>
                <div v-if="pregunta.ejemplo" class="text-center q-mt-sm">
                  <strong>{{ pregunta.ejemplo }}</strong>
                </div>

                <span v-else>{{ index + 1 }}. {{ pregunta.texto }}</span>
              </div>

              <option-group-component
                v-if="componenteCargado"
                v-model="respuestasTestPersonalidad[pregunta.id]"
                :options="getOpciones(pregunta)"
                :horizontal="false"
                type="radio"
              />
        </q-card>
      </div>

      <q-btn
        label="Enviar respuestas"
        color="primary"
        @click="enviarRespuestas"
        :disable="
          Object.keys(respuestasTestPersonalidad).length !==
          preguntasTestPersonalidad.length
        "
        class="full-width q-mt-md"
      />
    </div>

    <div v-else class="text-center q-pa-md">
      <q-icon name="check_circle" color="green" size="56px" />
      <div class="text-h6 q-mt-md">¡Respuestas enviadas con éxito!</div>
    </div>
  </q-card>
</template>
<script src="./TestPersonalidadPage.ts" />
