<template>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <!-- Cargo -->
        <div class="col-12 col-md-4 col-sm-3">
          <label class="q-mb-sm block">Cargo</label>
          <q-select
            v-model="banco.cargo"
            :options="cargos"
            transition-show="jump-up"
            transition-hide="jump-down"
            :disable="disabled"
            options-dense
            dense
            outlined
            :input-debounce="0"
            use-input
            @blur="v$.cargo.$touch"
            @filter="filtrarCargos"
            @popup-show="ordenarLista(cargos, 'nombre')"
            :error="!!v$.cargo.$errors.length"
            :option-value="v => v.id"
            :option-label="v => v.nombre"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.cargo.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- Estado de postulación -->
        <div class="col-12 col-md-4 col-sm-3">
          <label class="q-mb-sm block">Afinidad</label>
          <q-select
            v-model="banco.puntuacion"
            :options="likertCalificacionPostulante"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            use-chips
            outlined
            :disable="disabled"
          >
          </q-select>
        </div>

        <!-- Dirección  -->
        <div class="col-md-4 col-sm-12 col-xs-12">
          <label class="q-mb-sm block">Observación </label>
          <q-input
            v-model="banco.observacion"
            placeholder="Opcional"
            :disable="disabled"
            outlined
            dense
            autogrow
          >
          </q-input>
        </div>
      </div>
      <div class="row q-gutter-sm justify-end">
        <!-- Boton guardar -->
        <q-btn color="primary" no-caps push @click="agregarBanco()">
          <q-icon name="bi-arrow-left-right" size="xs" class="q-pr-sm" />
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
<script src="./AgregarBancoPostulantePage.ts" />
