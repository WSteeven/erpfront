<template>
  <tab-layout-filter-tabs-2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :accion1="btnDesactivar"
    :accion2="btnActivar"
    :tab-options="tabOptionsClienteClaro"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarClientes"
  >
    >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- supervisor -->
          <div
            class="col-12 col-md-3"
            v-if="store.esJefeVentasClaro || store.esAdministrador"
          >
            <label class="q-mb-sm block">Supervisor</label>
            <q-select
              v-model="cliente.supervisor"
              :options="vendedores"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.supervisor.$errors.length"
              @blur="v$.supervisor.$touch"
              error-message="Debes seleccionar un supervisor de ventas"
              use-input
              input-debounce="0"
              @filter="filtrarVendedores"
              :option-value="(v) => v.empleado_id"
              :option-label="(v) => v.empleado_info"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.empleado_info }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.tipo_vendedor }}
                      {{ scope.opt.modalidad_info }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.supervisor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarVendedores">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
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
