<template>
  <q-form @submit.prevent class="window-height">
    <q-card class="rounded-card custom-shadow">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Me dirijo al siguiente trabajo</label>
            <q-select
              v-model="movilizacion.subtarea"
              :options="subtareas"
              :error="!!v$.subtarea.$errors.length"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="
                (item) => item.codigo_subtarea + ' - ' + item.titulo
              "
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_subtarea
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.subtarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Tipo trabajo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Motivo</label>
            <q-select
              v-model="movilizacion.motivo"
              :options="motivosMovilizacion"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.descripcion"
              :option-value="(item) => item.id"
              emit-value
              map-options
              :error="!!v$.motivo.$errors.length"
              @blur="v$.motivo.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.motivo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Coordenadas -->
          <div class="col-12 col-md-4 q-mx-auto q-mb-xl">
            <q-card flat class="custom-shadows nso-border q-pa-md">
              <label class="q-mb-sm text-center block text-bold"
                >Coordenadas</label
              >
              <div class="col-12">
                <label class="q-mb-sm block">Longitud</label>
                <q-input
                  v-model="movilizacion.longitud"
                  :error="!!v$.longitud.$errors.length"
                  outlined
                  dense
                  disable
                >
                  <template v-slot:error>
                    <div v-for="error of v$.longitud.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <label class="q-mb-sm block">Latitud</label>
                <q-input
                  v-model="movilizacion.latitud"
                  :error="!!v$.latitud.$errors.length"
                  outlined
                  dense
                  disable
                >
                  <template v-slot:error>
                    <div v-for="error of v$.latitud.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>

              <q-btn
                color="positive"
                no-caps
                glossy
                push
                rounded
                no-wrap
                class="q-mx-auto block"
                @click="obtenerCoordenadas()"
                :disable="disabled"
              >
                <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
                Actualizar ubicación</q-btn
              >
            </q-card>
          </div>
        </div>

        <div class="row">
          <q-btn
            class="col-12"
            color="primary"
            type="submit"
            no-caps
            push
            @click="comenzar()"
          >
            <q-icon name="bi-car-front-fill" size="xs" class="q-pr-sm"></q-icon>
            <span>Comenzar viaje</span>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script src="./MovilizacionSubtareaPage.ts"></script>
