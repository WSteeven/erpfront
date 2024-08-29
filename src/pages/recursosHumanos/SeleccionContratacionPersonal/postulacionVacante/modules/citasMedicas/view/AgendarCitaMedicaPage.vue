<template>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <!-- Fecha de entrevista -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha Entrevista</label>
          <q-input
            v-model="examen.fecha_hora"
            placeholder="Obligatorio"
            :error="!!v$.fecha_hora.$errors.length"
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
                      v-model="examen.fecha_hora"
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
                      v-model="examen.fecha_hora"
                      :mask="mask"
                      color="primary"
                    />
                  </div>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.fecha_hora.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!--Canton -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Ciudad</label>
          <q-select
            v-model="examen.canton"
            :options="cantones"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            use-input
            input-debounce="0"
            @filter="filtrarCantones"
            :option-value="v => v.id"
            :option-label="v => v.canton"
            :error="!!v$.canton.$errors.length"
            emit-value
            map-options
            ><template v-slot:no-option>
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
                    >Provincia {{ scope.opt.provincia }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:error>
              <div v-for="error of v$.canton.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <!-- laboratorio -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Laboratorio</label>
          <q-input
            v-model="examen.laboratorio"
            placeholder="Nombre del laboratorio"
            :error="!!v$.laboratorio.$errors.length"
            @blur="v$.laboratorio.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.laboratorio.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- direccion -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="examen.direccion"
            autogrow
            placeholder="Dirección del laboratorio"
            :error="!!v$.direccion.$errors.length"
            @blur="v$.direccion.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- indicaciones -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Indicaciones</label>
          <q-input
            v-model="examen.indicaciones"
            autogrow
            placeholder="Indicaciones para los exámenes"
            :error="!!v$.indicaciones.$errors.length"
            @blur="v$.indicaciones.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.indicaciones.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-gutter-sm justify-end">
        <!-- Boton guardar -->
        <q-btn color="primary" no-caps push @click="guardar()">
          <q-icon name="bi-save" size="xs" class="q-pr-sm" />
          <span>Guardar</span>
        </q-btn>

        <q-btn color="negative" no-caps push @click="cancelar()">
          <q-icon name="bi-x" size="xs" class="q-pr-sm" />
          <span>Cancelar</span>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script src="./AgendarCitaMedicaPage.ts" />
