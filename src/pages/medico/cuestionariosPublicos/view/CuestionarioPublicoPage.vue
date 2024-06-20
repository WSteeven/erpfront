<template>
  <q-page padding class="bg-body">
    <transition name="scale" mode="out-in">
      <q-card
        v-if="!cuestionarioPublico.preguntas.length"
        flat
        class="q-mb-sm bg-desenfoque border-white"
      >
        <q-card-section class="row q-col-gutter-sm text-center">
          <div class="full-width text-bold">Cuestionarios disponibles</div>
          <small class="block text-center full-width q-mb-md"
            >Los cuestionarios que no puede seleccionar ya han sido completados
            por usted</small
          >

          <div class="text-center full-width">
            <q-btn
              v-for="(tipo, index) in listadosAuxiliares.tiposCuestionarios"
              :key="index"
              class="full-width text-primary bg-white q-mb-sm"
              no-caps
              unelevated
              :disable="tipo.finalizado"
              @click="consultarPreguntas(tipo.id)"
            >
              <q-icon
                v-if="tipo.finalizado"
                name="bi-check-circle-fill"
                class="q-mr-sm"
                color="primary"
              ></q-icon>
              <q-icon
                v-else
                name="bi-check-circle"
                class="q-mr-sm"
                color="accent"
              ></q-icon>
              {{ tipo.titulo }}
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </transition>

    <transition name="scale" mode="out-in">
      <div v-if="cuestionarioPublico.preguntas.length">
        <q-btn
          color="primary"
          no-caps
          unelevated
          square
          class="q-mb-md"
          @click="cuestionarioPublico.preguntas = []"
        >
          <q-icon name="bi-arrow-left" class="q-mr-sm"></q-icon>
          Volver a ver los cuestionarios disponibles</q-btn
        >

        <q-card flat class="q-mb-sm bg-desenfoque border-white">
          <informacion-persona
            ref="refInformacionPersona"
            v-model="cuestionarioPublico"
            :mixin="mixin"
            :validador="v$"
            :tipo-cuestionario="tipoCuestionarioSeleccionado"
            @cedula-validada="(validado) => (cedulaValida = validado)"
          ></informacion-persona>
        </q-card>
      </div>
    </transition>
    <!-- @update:model-value="hidratarPersona" -->

    <transition name="scale" mode="out-in">
      <div v-if="cuestionarioPublico.preguntas.length">
        <q-card
          v-if="cuestionarioPublico.preguntas.length"
          flat
          class="q-mb-sm border-white"
        >
          <q-card-section class="row q-col-gutter-sm text-center">
            <cuestionario-psicosocial-header
              v-if="
                tipoCuestionarioSeleccionado ===
                opcionesTiposCuestionarios.CUESTIONARIO_PSICOSOCIAL
              "
            ></cuestionario-psicosocial-header>

            <cuestionario-diagnostico-consumo-drogas-header
              v-if="
                tipoCuestionarioSeleccionado ===
                opcionesTiposCuestionarios.CUESTIONARIO_DIAGNOSTICO_CONSUMO_DE_DROGAS
              "
            ></cuestionario-diagnostico-consumo-drogas-header>

            <div v-if="mensaje" class="col-12 text-positive text-bold text-h5">
              <div class="q-mb-md">{{ mensaje }}</div>
              <q-rating
                :model-value="5"
                name="bi-star-fill"
                maz="5"
                color="amber"
              ></q-rating>
            </div>

            <div class="row q-col-gutter-sm">
              <div
                v-for="(item, index) in cuestionarioPublico.preguntas"
                :key="item.id"
                class="col-12 col-md-6 text-bold text-justify q-mb-md"
              >
                <label class="q-mb-sm block">{{
                  item.codigo + '.- ' + item.pregunta
                }}</label>
                <q-select
                  v-if="item.cuestionario[0].respuesta"
                  v-model="item.respuesta"
                  :options="mapearCuestionario(item.cuestionario)"
                  color="primary"
                  outlined
                  dense
                  options-dense
                  emit-value
                  map-options
                  :error="
                    !!v$.preguntas.$each.$response.$errors[index].respuesta
                      .length
                  "
                >
                  <template v-slot:error>
                    <div
                      v-for="error of v$.preguntas.$each.$response.$errors[
                        index
                      ].pregunta"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-select>

                <q-input
                  v-else
                  v-model="item.respuesta"
                  placeholder="Escriba..."
                  :error="
                    !!v$.preguntas.$each.$response.$errors[index].respuesta
                      .length
                  "
                  outlined
                  dense
                >
                  <template v-slot:error>
                    <div
                      v-for="error of v$.preguntas.$each.$response.$errors[
                        index
                      ].pregunta"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row full-width justify-center">
              <button-submits
                v-if="cuestionarioPublico.preguntas.length"
                :accion="accion"
                label-guardar="Guardar y enviar respuestas"
                :permitirCancelar="false"
                @guardar="guardarCuestionario()"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </transition>
  </q-page>
</template>

<script src="./CuestionarioPublicoPage.ts"></script>
