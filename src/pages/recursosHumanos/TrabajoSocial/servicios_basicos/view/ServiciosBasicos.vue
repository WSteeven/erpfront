<template>
  <!-- SBF luz -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Luz</label>
    <option-group-component
      v-model="servicio_basico.luz"
      :options="optionsServiciosBasicos"
      :disable="disable"
      clave="luz"
      :v$="v$"
      :error="!!v$.luz.$errors.length"
    />
  </div>

  <!-- SBF agua -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Agua</label>
    <option-group-component
      v-model="servicio_basico.agua"
      :options="optionsServiciosBasicos"
      :disable="disable"
      clave="agua"
      :v$="v$"
      :error="!!v$.agua.$errors.length"
    />
  </div>

  <!-- SBF telefono -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Teléfono</label>
    <option-group-component
      v-model="servicio_basico.telefono"
      :options="optionsServiciosBasicos"
      :disable="disable"
      clave="telefono"
      :v$="v$"
      :error="!!v$.telefono.$errors.length"
    />
  </div>

  <!-- SBF internet -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Internet</label>
    <option-group-component
      v-model="servicio_basico.internet"
      :options="optionsServiciosBasicos"
      :disable="disable"
      clave="internet"
      :v$="v$"
      :error="!!v$.internet.$errors.length"
    />
  </div>

  <!-- SBF cable -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Cable</label>
    <option-group-component
      v-model="servicio_basico.cable"
      :options="optionsServiciosBasicos"
      :disable="disable"
      clave="cable"
      :v$="v$"
      :error="!!v$.cable.$errors.length"
    />
  </div>

  <!-- SBF Servicios Sanitarios -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Servicios Sanitarios</label>
    <option-group-component
      v-model="servicio_basico.servicios_sanitarios"
      :options="optionsServiciosBasicos"
      :disable="disable"
      clave="servicios_sanitarios"
      :v$="v$"
      :error="!!v$.servicios_sanitarios.$errors.length"
    />
  </div>
</template>

<script src="./ServiciosBasicos.ts" />
