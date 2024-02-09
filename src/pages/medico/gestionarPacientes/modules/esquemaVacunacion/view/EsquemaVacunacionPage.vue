<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <div class="text-h6">Covid</div>
      <div class="q-mb-md">Esquema de vacunación</div>
      <div class="bg-desenfoque q-pa-md row q-mb-md">
        <div class="col-12 q-mb-md">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="esquema.observacion"
            placeholder="Opcional"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block">Dosis administradas</label>
          <div class="q-gutter-sm">
            <q-radio v-model="shape" val="line" label="Dosis 1" />
            <q-radio v-model="shape" val="rectangle" label="Dosis 2" />
            <q-radio v-model="shape" val="ellipse" label="Dosis 3" />
            <q-radio v-model="shape" val="polygon" label="Dosis 4" />
          </div>
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./EsquemaVacunacionPage.ts"></script>
