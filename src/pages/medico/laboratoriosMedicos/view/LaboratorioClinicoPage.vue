<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasLaboratorioClinico"
    :permitir-eliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del laboratorio</label>
            <q-input
              v-model="laboratorioClinico.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
              @blur="v$.nombre.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Canton -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantón</label>
            <q-select
              v-model="laboratorioClinico.canton"
              :options="cantones"
              hint="Obligatorio"
              @filter="filtrarCantones"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="(item) => item.canton"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.canton.$errors.length"
              @blur="v$.canton.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
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

          <!-- Direccion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="laboratorioClinico.direccion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.direccion.$errors.length"
              @blur="v$.direccion.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Celular -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              v-model="laboratorioClinico.celular"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.celular.$errors.length"
              @blur="v$.celular.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.celular.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Correo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="laboratorioClinico.correo"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.correo.$errors.length"
              @blur="v$.correo.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.correo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Coordenadas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordenadas</label>
            <q-input
              v-model="laboratorioClinico.coordenadas"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-lg">
            <label class="q-mb-sm block">&nbsp;</label>
            <q-toggle
              v-model="laboratorioClinico.activo"
              :label="laboratorioClinico.activo ? 'Activo' : 'Inactivo'"
              :disable="disabled"
              checked-icon="bi-eye"
              color="positive"
              outlined
              dense
            ></q-toggle>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./LaboratorioClinicoPage.ts"></script>
