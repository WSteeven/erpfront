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
          <!-- Supervisor -->
          <div
            class="col-12 col-md-4"
            v-if="store.esJefeVentasClaro || store.esAdministrador"
          >
            <label class="q-mb-sm block">Supervisor</label>
            <q-select
              v-model="cliente.supervisor"
              :options="vendedores"
              use-input
              input-debounce="0"
              @filter="filtrarVendedores"
              :option-value="v => v.empleado_id"
              :option-label="v => v.empleado_info"
              emit-value
              map-options
              dense
              outlined
              :disable="disabled"
              :error="!!v$.supervisor?.$errors.length"
              @blur="v$.supervisor?.$touch"
            />
            <template v-if="v$.supervisor?.$errors">
              <div
                v-for="error in v$.supervisor.$errors"
                :key="error.$uid"
                class="error-msg"
              >
                {{ error.$message }}
              </div>
            </template>
          </div>

          <!-- Tipo de Cliente -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Tipo de Cliente</label>
            <q-select
              v-model="cliente.tipo_cliente"
              :options="['cliente', 'prospecto']"
              emit-value
              map-options
              dense
              outlined
              :disable="disabled"
              :error="!!v$.tipo_cliente?.$errors.length"
              @blur="v$.tipo_cliente?.$touch"
            />
            <template v-if="v$.tipo_cliente?.$errors">
              <div
                v-for="error in v$.tipo_cliente.$errors"
                :key="error.$uid"
                class="error-msg"
              >
                {{ error.$message }}
              </div>
            </template>
          </div>

          <!-- Identificación -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Identificación</label>
            <q-input
              v-model="cliente.identificacion"
              dense
              outlined
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.identificacion.$errors.length"
              @blur="v$.identificacion.$touch"
            />
            <template v-if="v$.identificacion.$errors">
              <div
                v-for="error in v$.identificacion.$errors"
                :key="error.$uid"
                class="error-msg"
              >
                {{ error.$message }}
              </div>
            </template>
          </div>

          <!-- Nombres / Apellidos -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombres</label>
            <q-input
              v-model="cliente.nombres"
              dense
              outlined
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombres.$errors.length"
              @blur="v$.nombres.$touch"
            />
          </div>

          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Apellidos</label>
            <q-input
              v-model="cliente.apellidos"
              dense
              outlined
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.apellidos.$errors.length"
              @blur="v$.apellidos.$touch"
            />
          </div>

          <!-- Correo electrónico -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Correo Electrónico (Gmail)</label>
            <q-input
              v-model="cliente.correo_electronico"
              dense
              outlined
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.correo_electronico?.$errors.length"
              @blur="v$.correo_electronico?.$touch"
            />
            <template v-if="v$.correo_electronico?.$errors">
              <div
                v-for="error in v$.correo_electronico.$errors"
                :key="error.$uid"
                class="error-msg"
              >
                {{ error.$message }}
              </div>
            </template>
          </div>
          <!-- Teléfonos -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Teléfono 1 (Biometrico)</label>
            <q-input
              v-model="cliente.telefono1"
              dense
              outlined
              placeholder="Obligatorio"
              :error="!!v$.telefono1.$errors.length"
              @blur="v$.telefono1.$touch"
            >
              <template v-slot:prepend>
              </template>
            </q-input>
          </div>

          <!-- Cantón / Parroquia -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Cantón</label>
            <q-select
              v-model="cliente.canton"
              :options="opciones_cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarCantones"
              @update:model-value="cantonSeleccionado"
              hint="Selecciona un canton para filtrar sus parroquias"
              :option-value="v => v.id"
              :option-label="v => v.canton"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Parroquia</label>
            <q-select
              v-model="cliente.parroquia"
              :options="opciones_parroquias"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarParroquias"
              :error="!!v$.parroquia.$errors.length"
              error-message="Debes seleccionar una parroquia"
              :option-value="v => v.id"
              :option-label="v => v.parroquia"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.parroquia.$errors" :key="error.$uid">
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



          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Teléfono 2</label>
            <q-input
              v-model="cliente.telefono2"
              dense
              outlined
              placeholder="Opcional"
            >
              <template v-slot:prepend>
              </template>
            </q-input>
          </div>

          <!-- Dirección -->
          <div class="col-12 col-md-8">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="cliente.direccion"
              type="textarea"
              autogrow
              dense
              outlined
              :disable="disabled"
              placeholder="Obligatorio"
              :error="!!v$.direccion.$errors.length"
              @blur="v$.direccion.$touch"
            />
          </div>

          <!-- Foto Cédula Frontal -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Foto Cédula (Frontal)</label>
            <selector-imagen
              :mostrar-campo="true"
              :disable="disabled"
              placeholder="Obligatorio"
              file_extensiones=".jpg, image/*"
              :imagen="cliente.foto_cedula_frontal"
              :alto="'400px'"
              @update:model-value="data => (cliente.foto_cedula_frontal = data)"
            />
          </div>

          <!-- Foto Cédula Posterior -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Foto Cédula (Posterior)</label>
            <selector-imagen
              :mostrar-campo="true"
              :disable="disabled"
              placeholder="Obligatorio"
              file_extensiones=".jpg, image/*"
              :imagen="cliente.foto_cedula_posterior"
              :alto="'400px'"
              @update:model-value="
                data => (cliente.foto_cedula_posterior = data)
              "
            />
          </div>

          <!-- Fecha de expedición -->
          <!-- Fecha de expedición de cédula -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block"
              >Fecha de expedición de la cédula</label
            >
            <q-input
              v-model="cliente.fecha_expedicion_cedula"
              placeholder="Obligatorio"
              :error="!!v$.fecha_expedicion_cedula?.$errors.length"
              @blur="v$.fecha_expedicion_cedula?.$touch"
              :disable="disabled"
              readonly
              outlined
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
                      v-model="cliente.fecha_expedicion_cedula"
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
                <div
                  style="clear: inherit"
                  v-for="error of v$.fecha_expedicion_cedula?.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Activo Toggle -->
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
