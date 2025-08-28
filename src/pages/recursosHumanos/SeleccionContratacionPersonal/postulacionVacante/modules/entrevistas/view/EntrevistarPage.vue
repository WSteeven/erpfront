<template>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <!-- Fecha de entrevista -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha Entrevista</label>
          <q-input
            v-model="entrevista.fecha_hora"
            placeholder="Obligatorio"
            :error="!!v$.fecha_hora.$errors.length"
            :disable="disabled"
            @blur="v$.fecha_hora.$touch"
            readonly
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <div class="q-gutter-md row items-start">
                    <q-date
                      v-model="entrevista.fecha_hora"
                      :mask="mask"
                      :options="optionsFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                    <q-time
                      v-model="entrevista.fecha_hora"
                      :mask="mask"
                      :hourOptions="hourOptions"
                      :minuteOptions="minuteOptions"
                      color="primary"
                    />
                  </div>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <error-component clave="fecha_hora" :v$="v$" />
            </template>
          </q-input>
        </div>

        <!-- Fecha de inicio -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Duración (minutos)</label>
          <q-input
            v-model="entrevista.duracion"
            type="number"
            step="5"
            placeholder="Duración de la entrevista (minutos)"
            :error="!!v$.duracion.$errors.length"
            :disable="disabled"
            @blur="v$.duracion.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <error-component clave="duracion" :v$="v$" />
            </template>
          </q-input>
        </div>

        <!--Canton -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Ciudad</label>
          <q-select
            v-model="entrevista.canton"
            :options="cantones"
            transition-show="jump-up"
            transition-hide="jump-down"
            :disable="disabled"
            options-dense
            dense
            outlined
            use-input
            input-debounce="0"
            @filter="filtrarCantones"
            :option-value="v => v.id"
            :option-label="v => v.canton"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.canton }}</q-item-label>
                  <q-item-label caption
                    >Provincia {{ scope.opt.provincia }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- {{ entrevista }} -->
        <div class="col-12 col-md-3">
          Tipo de entrevista
          <option-group-component
            v-model="entrevista.presencial"
            :options="options"
            :disable="disabled"
          />
        </div>
        <!-- update:model-value="actualizada" -->

        <div class="col-12 col-md-6" v-if="entrevista.presencial">
          <label class="q-mb-sm block"
            >Dirección del lugar de la entrevista</label
          >
          <q-input
            type="textarea"
            v-model="entrevista.direccion"
            placeholder="Obligatorio"
            outlined
            dense
            autogrow
            :disable="disabled"
            :error="!!v$.direccion.$errors.length"
            @blur="v$.direccion.$touch"
          >
            <template v-slot:error>
              <error-component clave="direccion" :v$="v$" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6" v-if="!entrevista.presencial">
          <label class="q-mb-sm block">Link de la reunión</label>
          <q-input
            type="url"
            v-model="entrevista.link"
            placeholder="Obligatorio"
            outlined
            dense
            autogrow
            :error="!!v$.link.$errors.length"
            @blur="v$.link.$touch"
          >
            <template v-slot:error>
              <error-component clave="link" :v$="v$" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          ¿Desea reagendar entrevista?
          <option-group-component
            v-model="entrevista.reagendada"
            :disable="disabled"
          />
        </div>

        <!-- Nueva fecha hora -->
        <div class="col-12 col-md-3" v-if="entrevista.reagendada">
          <label class="q-mb-sm block">Nueva Fecha</label>
          <q-input
            v-model="entrevista.nueva_fecha_hora"
            placeholder="Obligatorio"
            :error="!!v$.nueva_fecha_hora.$errors.length"
            :disable="disabled"
            @blur="v$.fecha_hora.$touch"
            readonly
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <div class="q-gutter-md row items-start">
                    <q-date
                      v-model="entrevista.nueva_fecha_hora"
                      :mask="mask"
                      :options="optionsFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                    <q-time
                      v-model="entrevista.nueva_fecha_hora"
                      :mask="mask"
                      :hourOptions="hourOptions"
                      :minuteOptions="minuteOptions"
                      color="primary"
                    />
                  </div>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <error-component clave="nueva_fecha_hora" :v$="v$" />
            </template>
          </q-input>
        </div>

        <!-- Observación -->
        <div class="col-12 col-md-3" v-if="accion !== acciones.nuevo">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            type="textarea"
            v-model="entrevista.observacion"
            placeholder="Opcional"
            outlined
            :disable="disabled"
            dense
            autogrow
          />
        </div>
        <div class="col-12 col-md-3">
          ¿Asistió a la entrevista?
          <option-group-component
            v-model="entrevista.asistio"
            :disable="disabled"
          />
        </div>
      </div>
      <div class="row q-gutter-sm justify-end">
        <div class="row q-gutter-xs">
          <q-btn
            v-if="accion === acciones.consultar"
            push
            no-caps
            @click="() => (accion = acciones.editar)"
            color="secondary"
          >
            <q-tooltip class="bg-dark"> Editar</q-tooltip>
            <q-icon name="bi-pencil-square" class="q-pr-sm" size="xs" />
            <span>Editar</span>
          </q-btn>
        </div>

        <ButtonSubmits
          :accion="accion"
          @guardar="guardar"
          @editar="editar(entrevista)"
          @cancelar="reestablecer"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script src="./EntrevistarPage.ts" />
