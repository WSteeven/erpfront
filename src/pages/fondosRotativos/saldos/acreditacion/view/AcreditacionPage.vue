<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Usuario</label>
            <q-select v-model="acreditacion.usuario" :options="usuarios" transition-show="jump-up" transition-hide="jump-down"
              options-dense dense outlined :disable="disabled" :readonly="disabled" :error="!!v$.usuario.$errors.length"
              @blur="v$.usuario.$touch"
              error-message="Debes seleccionar un usuario" use-input input-debounce="0" @filter="filtrarUsuarios" @update:model-value="saldo_anterior()"
              :option-value="(v) => v.usuario_id" :option-label="(v) => v.nombres + ' ' + v.apellidos" emit-value map-options>
              <template v-slot:error>
                <div v-for="error of v$.usuario.$errors" :key="error.$uid">
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
          <!-- Tipo Fondo -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Tipo Fondo</label>
            <q-select v-model="acreditacion.tipo_fondo" :options="tiposFondos" transition-show="jump-up"
              transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
              :error="!!v$.tipo_fondo.$errors.length" error-message="Debes seleccionar un tipo de fondo" use-input
              input-debounce="0" @filter="filtrarTiposFondos" :option-value="(v) => v.id"
              @blur="v$.tipo_fondo.$touch"
              :option-label="(v) => v.descripcion" emit-value map-options>
              <template v-slot:error>
                <div v-for="error of v$.tipo_fondo.$errors" :key="error.$uid">
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
          <!-- Tipo Saldo -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Tipo Saldo</label>
            <q-select v-model="acreditacion.tipo_saldo" :options="tiposSaldos" transition-show="jump-up"
              transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
              :error="!!v$.tipo_saldo.$errors.length" error-message="Debes seleccionar un tipo de saldo" use-input
              @blur="v$.tipo_saldo.$touch"
              input-debounce="0" @filter="filtrarTiposSaldos" :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion" emit-value map-options>
              <template v-slot:error>
                <div v-for="error of v$.tipo_saldo.$errors" :key="error.$uid">
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
          <!-- Referencia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencia:</label>
            <q-input v-model="acreditacion.id_saldo" placeholder="Obligatorio" :disable="disabled"
              :error="!!v$.id_saldo.$errors.length" @blur="v$.id_saldo.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.id_saldo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Descripcion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripción del Saldo:</label>
            <q-input v-model="acreditacion.descripcion_acreditacion" placeholder="Obligatorio" :disable="disabled"
              :error="!!v$.descripcion_acreditacion.$errors.length" @blur="v$.descripcion_acreditacion.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.descripcion_acreditacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Saldo depositado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Saldo Anterior(*):</label>
            <q-input v-model="acreditacion.saldo_anterior" placeholder="Obligatorio" disable
              :error="!!v$.saldo_anterior.$errors.length" @blur="v$.saldo_anterior.$touch" outlined dense type="number">
              <template v-slot:error>
                <div v-for="error of v$.saldo_anterior.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!--  Saldo Disponible -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto:</label>
            <q-input v-model="acreditacion.monto" placeholder="Obligatorio" :disable="disabled"
              :error="!!v$.monto.$errors.length" @blur="v$.monto.$touch" outlined dense
              type="number">
              <template v-slot:error>
                <div v-for="error of v$.monto.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!--  Saldo Disponible -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Saldo Disponible:</label>
            <q-chip square>
              <q-avatar icon="bi-currency-dollar" color="green" text-color="white"></q-avatar>
             {{ acreditacion.saldo_actual }}
            </q-chip>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./AcreditacionPage.ts"></script>
