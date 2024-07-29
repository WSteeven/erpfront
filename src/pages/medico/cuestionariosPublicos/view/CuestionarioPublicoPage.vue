<template>
  <q-page paddingd class="bg-body">
    <div v-if="linkActivo && linkExiste" class="q-pa-sm">
      <transition name="scale" mode="out-in">
        <q-card
          v-if="!cuestionarioPublico.formulario_cuestionario.length"
          flat
          class="q-mb-sm bg-desenfoque border-white"
        >
          <q-card-section class="row q-col-gutter-sm text-center">
            <div class="full-width text-bold">Cuestionarios disponibles</div>
            <small class="block text-center full-width q-mb-md"
              >Los cuestionarios que no puede seleccionar ya han sido
              completados por usted</small
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
        <div v-if="cuestionarioPublico.formulario_cuestionario.length">
          <q-btn
            color="primary"
            no-caps
            unelevated
            square
            class="q-mb-md"
            @click="cuestionarioPublico.formulario_cuestionario = []"
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
        <div v-if="cuestionarioPublico.formulario_cuestionario.length">
          <q-card flat class="q-mb-sm border-white">
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

              <div
                v-if="mensaje"
                class="col-12 text-positive text-bold text-h5"
              >
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
                  v-for="(
                    item, index
                  ) in cuestionarioPublico.formulario_cuestionario"
                  :key="item.id"
                  class="col-12 col-md-6 text-bold text-justify q-mb-md"
                >
                  <!--  {{
                    cuestionarioPublico.formulario_cuestionario[index].respuesta
                  }} -->
                  <div v-if="item.cuestionario[0].respuesta">
                    <label class="q-mb-sm block">{{
                      item.codigo + '- ' + item.pregunta
                    }}</label>
                    <q-select
                      v-model="item.respuesta"
                      :options="mapearCuestionario(item.cuestionario)"
                      color="primary"
                      @update:model-value="
                        establecerNoConsume(index, item.respuesta)
                      "
                      :disable="index !== 0 && noConsume"
                      outlined
                      dense
                      :multiple="
                        index === 4 &&
                        tipoCuestionarioSeleccionado === ALCOHOL_DROGAS
                      "
                      options-dense
                      :option-disable="
                        (it) => desahabilitarNoConsume(it.value, index)
                      "
                      emit-value
                      map-options
                      :error="
                        !!v$.formulario_cuestionario.$each.$response.$errors[
                          index
                        ].respuesta.length
                      "
                    >
                      <template
                        v-if="index === 4"
                        v-slot:option="{
                          itemProps,
                          opt,
                          selected,
                          toggleOption,
                        }"
                      >
                        <q-item v-bind="itemProps">
                          <q-item-section>
                            {{ opt.label }}
                            <q-item-label v-bind:inner-h-t-m-l="opt.label" />
                          </q-item-section>
                          <q-item-section side>
                            <q-checkbox
                              :model-value="selected"
                              dense
                              @update:model-value="toggleOption(opt)"
                            />
                          </q-item-section>
                        </q-item>
                      </template>

                      <template v-slot:error>
                        <div
                          v-for="error of v$.formulario_cuestionario.$each
                            .$response.$errors[index].pregunta"
                          :key="error.$uid"
                        >
                          <div class="error-msg">{{ error.$message }}</div>
                        </div>
                      </template>
                    </q-select>
                  </div>

                  <div
                    v-show="
                      !item.cuestionario[0].respuesta &&
                      verificarSiEsSelectMultiple(index) &&
                      tipoCuestionarioSeleccionado === ALCOHOL_DROGAS
                    "
                  >
                    <label class="q-mb-sm block">{{
                      item.codigo + '- ' + item.pregunta
                    }}</label>

                    <q-input
                      v-model="item.respuesta"
                      :placeholder="'Escriba...'"
                      outlined
                      :disable="noConsume"
                      dense
                      :error="
                        !!v$.formulario_cuestionario.$each.$response.$errors[
                          index
                        ].respuesta.length
                      "
                    >
                      <template v-slot:error>
                        <div
                          v-for="error of v$.formulario_cuestionario.$each
                            .$response.$errors[index].pregunta"
                          :key="error.$uid"
                        >
                          <div class="error-msg">{{ error.$message }}</div>
                        </div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <div class="row full-width justify-center">
                <button-submits
                  v-if="cuestionarioPublico.formulario_cuestionario.length"
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
    </div>

    <div
      v-if="linkExiste && !linkActivo"
      class="row items-center bg-primary justify-center text-white window-height"
    >
      <q-icon name="bi-cloud-sun" size="100px" class="q-mr-lg"></q-icon>
      <span class="text-h3"> El enlace actual ha sido inhabilitado </span>
    </div>

    <div
      v-if="!linkExiste"
      class="row items-center bg-indigo justify-center text-white window-height"
    >
      <q-icon
        name="bi-emoji-expressionless"
        size="100px"
        class="q-mr-lg"
      ></q-icon>
      <span class="text-h3"> El enlace no es correcto</span>
    </div>
  </q-page>
</template>

<script src="./CuestionarioPublicoPage.ts"></script>
