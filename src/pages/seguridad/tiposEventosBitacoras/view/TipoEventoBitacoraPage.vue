<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasTipoEventoBitacora"
    paginate
    full
  >
    <template #formulario>
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-12 text-bold q-py-sm q-mb-md">
          <q-icon name="bi-x-diamond" class="q-mr-sm" color="primary"></q-icon>
          Información general
          <!-- <q-separator class="q-my-xs"></q-separator> -->
        </div>

        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Nombre del tipo de evento</label>
          <q-input
            v-model="tipo.nombre"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.nombre.$errors.length"
            @blur="v$.nombre.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3 q-mb-lg">
          <br />
          <q-toggle
            v-model="tipo.notificacion_inmediata"
            label="Notificar inmediatamente cuando se seleccione este evento"
            :disable="disabled"
            checked-icon="bi-check"
            color="positive"
            outlined
            dense
          ></q-toggle>
        </div>

        <div class="col-12 col-md-3 q-mb-lg">
          <br />
          <q-toggle
            v-model="tipo.activo"
            label="Activo"
            :disable="disabled"
            checked-icon="bi-check"
            color="positive"
            outlined
            dense
          ></q-toggle>
        </div>

        <div class="col-12">
          <label class="q-mb-sm block">Descripción</label>
          <essential-editor v-model="tipo.descripcion" :disable="disabled">
          </essential-editor>
          <div
            v-for="error of v$.descripcion.$errors"
            :key="error.$uid"
            class="text-negative text-uppercase"
          >
            <small>{{ error.$message }}</small>
          </div>
        </div>
      </div>
    </template>
  </tab-layout>
</template>

<script src="./TipoEventoBitacoraPage.ts"></script>
