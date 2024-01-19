<template>
  <tab-layout-filter-tabs-2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :accion1="btnDesactivar"
    :accion2="btnActivar"
    :tab-options="tabOptionsClienteClaro"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarClientes">
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- cantidad de ventas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Identificacion</label>
            <q-input
              v-model="cliente.identificacion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.identificacion.$errors.length"
              @blur="v$.identificacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombres</label>
            <q-input
              v-model="cliente.nombres"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombres.$errors.length"
              @blur="v$.nombres.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombres.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Apellidos</label>
            <q-input
              v-model="cliente.apellidos"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.apellidos.$errors.length"
              @blur="v$.apellidos.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.apellidos.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Telefono 1 -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Telefono 1</label>
            <q-input
              v-model="cliente.telefono1"
              autogrow
              :error="!!v$.telefono1.$errors.length"
              @blur="v$.telefono1.$touch"
              outlined
              dense
              placeholder="Obligatorio"
            >
              <template v-slot:prepend>
                <q-icon name="bi-telephone-fill" />
              </template>
              <template v-slot:error>
                <div v-for="error of v$.telefono1.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Telefono 2 -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Telefono 2</label>
            <q-input
              v-model="cliente.telefono2"
              autogrow
              outlined
              dense
              placeholder="Opcional"
            >
              <template v-slot:prepend>
                <q-icon name="bi-telephone-fill" />
              </template>
            </q-input>
          </div>

          <!-- Direccion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="cliente.direccion"
              placeholder="obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.direccion.$errors.length"
              autogrow
              @blur="v$.direccion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3" v-if="accion !== acciones.nuevo">
            <br />
            <q-toggle
              v-model="cliente.activo"
              checked-icon="check"
              :disable="disabled"
              :label="cliente.activo ? 'Activo' : 'Inactivo'"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs-2>
</template>
<script src="./ClienteClaroPage.ts"></script>
