<template>
  <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-py-md">
      <div class="col-12">{{ datos }}:{{ detalle }}</div>

      <!-- Fecha Inicio -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha Inicio</label>
        <q-input
          v-model="detalle.fecha_inicio"
          placeholder="Obligatorio"
          :error="!!v$.fecha_inicio.$errors.length"
          :disable="disabled"
          @blur="v$.fecha_inicio.$touch"
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
                <q-date
                  v-model="detalle.fecha_inicio"
                  :mask="maskFecha"
                  @update:model-value="calcularFechaFin"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:error>
            <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha Fin -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha Fin</label>
        <q-input
          v-model="detalle.fecha_fin"
          placeholder="Obligatorio"
          :error="!!v$.fecha_fin.$errors.length"
          :disable="disabled"
          @blur="v$.fecha_fin.$touch"
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
                <q-date
                  v-model="detalle.fecha_fin"
                  :mask="maskFecha"
                  @update:model-value="calcularDiasUtilizados"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:error>
            <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Dias utilizados -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Días utilizados</label>
        <q-input
          v-model="detalle.dias_utilizados"
          placeholder="Obligatorio"
          disable
          outlined
          dense
        />
      </div>

      <!-- Observaciones -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Observaciones</label>
        <q-input
          v-model="detalle.observacion"
          autogrow
          placeholder="Obligatorio"
          :disable="disabled"
          :error="!!v$.observacion.$errors.length"
          @blur="v$.observacion.$touch"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.observacion.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row justify-end q-pr-md q-pb-md">
      <!--    botones de submit-->
      <button-submits
        :accion="datos.accion"
        @editar="editar(detalle)"
        @guardar="guardar(detalle)"
        @cancelar="cancelar"
      />
    </div>
  </q-form>
</template>

<script src="./DetalleVacacionPage.ts" />
