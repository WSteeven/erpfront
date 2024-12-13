<template>
  <!-- SBF luz -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Luz</label>
    <option-group-component
      v-model="servicio_basico.luz"
      :options="optionsServiciosBasicos"
      :disable="disable"
    />
    <div class="text-negative q-pb-sm">
      <small>
        <error-component clave="luz" :v$="v$" />
      </small>
    </div>
  </div>

  <!-- SBF agua -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Agua</label>
    <option-group-component
      v-model="servicio_basico.agua"
      :options="optionsServiciosBasicos"
      :disable="disable"
    />
    <div class="text-negative q-pb-sm">
      <small>
        <error-component clave="agua" :v$="v$" />
      </small>
    </div>
  </div>

  <!-- SBF telefono -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Teléfono</label>
    <option-group-component
      v-model="servicio_basico.telefono"
      :options="optionsServiciosBasicos"
      :disable="disable"
    />
    <div class="text-negative q-pb-sm">
      <small>
        <error-component clave="telefono" :v$="v$" />
      </small>
    </div>
  </div>

  <!-- SBF internet -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Internet</label>
    <option-group-component
      v-model="servicio_basico.internet"
      :options="optionsServiciosBasicos"
      :disable="disable"
    />
    <div class="text-negative q-pb-sm">
      <small>
        <error-component clave="internet" :v$="v$" />
      </small>
    </div>
  </div>

  <!-- SBF cable -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Cable</label>
    <option-group-component
      v-model="servicio_basico.cable"
      :options="optionsServiciosBasicos"
      :disable="disable"
    />
    <div class="text-negative q-pb-sm">
      <small>
        <error-component clave="cable" :v$="v$" />
      </small>
    </div>
  </div>

  <!-- SBF Servicios Sanitarios -->
  <div class="col-12 col-md-4">
    <label class="q-mb-sm block">Servicios Sanitarios</label>
    <option-group-component
      v-model="servicio_basico.servicios_sanitarios"
      :options="optionsServiciosBasicos"
      :disable="disable"
    />
    <div class="text-negative q-pb-sm">
      <small>
        <error-component clave="servicios_sanitarios" :v$="v$" />
      </small>
    </div>
  </div>
</template>

<script src="./ServiciosBasicos.ts" />
