<template>
  <tab-layout
      :mixin="mixin"
      :configuracionColumnas="configuracionColumnas"
      titulo-pagina="Tipos de actividades"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-glutter-sm q-py-md">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Actividad</label>
            <q-input
                v-model="tipo_actividad.nombre"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.nombre.$errors.length"
                outlined
                dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$"/>
              </template>
            </q-input>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
                :label="tipo_actividad.activo ? 'ACTIVO' : 'INACTIVO'"
                v-model="tipo_actividad.activo"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./TipoActividadPage.ts"/>