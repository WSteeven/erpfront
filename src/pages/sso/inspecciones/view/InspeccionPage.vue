<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasInspecciones"
    :tabOptions="tabOptionsEstadosInspecciones"
    :filtrar="filtrarInspecciones"
    :tabDefecto="tabActual"
    ajustar-celdas
    forzar-listar
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Titulo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Título</label>
            <q-input
              v-model="inspeccion.titulo"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.titulo.$errors.length"
              @blur="v$.titulo.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Descripcion -->
          <div class="col-12 col-md-9">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="inspeccion.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.descripcion.$errors.length"
              @blur="v$.descripcion.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Responsable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Responsable de la inspección</label>
            <q-input v-model="inspeccion.responsable" disable outlined dense />
          </div>

          <!-- Fecha y hora limite -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
              v-model="inspeccion.fecha_inicio"
              placeholder="Obligatorio"
              outlined
              :disable="disabled"
              type="datetime"
              :error="!!v$.fecha_inicio.$errors.length"
              @blur="v$.fecha_inicio.$touch"
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
                      v-model="inspeccion.fecha_inicio"
                      :mask="maskFecha"
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

         <!--  <div class="col-12 col-md-2">
            <label class="q-mb-sm block">Estado</label>
            <estado :propsTable="{ value: inspeccion.estado }"></estado>
          </div> -->

          <div v-if="accion !== acciones.nuevo" class="col-12 col-md-3">
            <q-toggle
              class="q-mt-lg q-pt-md"
              v-model="inspeccion.finalizado"
              label="¿Finalizado?"
              :disable="disabled"
              color="positive"
              outlined
              dense
            ></q-toggle>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./InspeccionPage.ts"></script>
