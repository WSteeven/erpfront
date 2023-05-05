<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cargos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
             <!-- Tipo -->
             <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Tipo</label>
              <q-select
                v-model="prestamoAnticipo.tipo"
                :options="tipos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.tipo.$errors" :key="error.$uid">
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
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Tipo de Prestamo</label>
              <q-select
                v-model="prestamoAnticipo.tipo_prestamo"
                :options="filteredTipoPrestamo"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.tipo_prestamo.$errors" :key="error.$uid">
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
            <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="prestamoAnticipo.fecha" placeholder="Obligatorio" :error="!!v$.fecha.$errors.length"
              :disable="disabled" @blur="v$.fecha.$touch" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="prestamoAnticipo.fecha" :mask="maskFecha"  today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Valor  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor </label>
            <q-input v-model="prestamoAnticipo.valor" placeholder="Obligatorio" type="number" :disable="disabled"
              :error="!!v$.valor.$errors.length" @blur="v$.valor.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.valor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
           <!-- Forma de pago -->
           <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Forma de pago</label>
              <q-select
                v-model="prestamoAnticipo.forma_pago"
                :options="formas_pago"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.forma_pago.$errors" :key="error.$uid">
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

        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./PrestamoAnticipoPage.ts"></script>
