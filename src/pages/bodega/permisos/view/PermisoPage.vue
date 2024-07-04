<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="permisos_armas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- DESCRIPCION DEL PERMISO -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Permiso</label>
            <q-input
              v-model="permiso.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
              mask="DOC-### ### ###"
              fill-mask
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- FECHA DE EMISION -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Fecha de Emisión</label>
            <q-input
              v-model="permiso.fecha_emision"
              placeholder="Opcional"
              outlined
              :disable="disabled"
              type="datetime"
              dense
              :error="!!v$.fecha_emision.$errors.length"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="permiso.fecha_emision"
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
                  v-for="error of v$.fecha_emision.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- FECHA DE CADUCIDAD -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Fecha de Caducidad</label>
            <q-input
              v-model="permiso.fecha_caducidad"
              placeholder="Opcional"
              outlined
              :disable="disabled"
              type="datetime"
              dense
              :error="!!v$.fecha_caducidad.$errors.length"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="permiso.fecha_caducidad"
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
                  v-for="error of v$.fecha_caducidad.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Foto de perfil -->
          <div class="col-12 col-md-6 col-sm-6">
            <label for="q-mb-sm block">Imagen del Permiso</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="permiso.imagen_permiso"
              :comprimir="true"
              :alto="'200px'"
              :error="!!v$.imagen_permiso.$errors.length
                "
              @update:model-value="(data) => (permiso.imagen_permiso = data)"
            ></selector-imagen>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./PermisoPage.ts"></script>
