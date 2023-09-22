<template>
  <q-page padding>
    <div class="text-right q-mb-md">
      <b class="block text-subtitle1 text-thin text-primary">
        {{ 'Configuración General' }}</b
      >
      <small class="text-grey-9 text-bold">{{ 'SISTEMA' }}</small>
    </div>

    <q-card class="rounded custom-shadow no-border">
      <q-card-section>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- ruc -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">RUC/Identificacion</label>
              <q-input
                v-model="configuracion.ruc"
                placeholder="Obligatorio"
                type="number"
                :readonly="disabled"
                :error="!!v$.ruc.$errors.length"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.ruc.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- representante -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Representante</label>
              <q-input
                v-model="configuracion.representante"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.representante.$errors.length"
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.representante.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- razon social -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Razón Social</label>
              <q-input
                v-model="configuracion.razon_social"
                placeholder="Obligatorio"
                :readonly="disabled"
                :error="!!v$.razon_social.$errors.length"
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.razon_social.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- nombre comercial -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Nombre Comercial</label>
              <q-input
                v-model="configuracion.nombre_comercial"
                placeholder="Obligatorio"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- direccion -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Direccion</label>
              <q-input
                v-model="configuracion.direccion_principal"
                autogrow
                placeholder="Obligatorio"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- telefono -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Telefono</label>
              <q-input
                v-model="configuracion.telefono"
                autogrow
                type="tel"
                placeholder="Obligatorio"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- celular -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                v-model="configuracion.celular1"
                autogrow
                type="tel"
                placeholder="Obligatorio"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- sitio web -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Sitio web</label>
              <q-input
                v-model="configuracion.sitio_web"
                autogrow
                type="email"
                placeholder="Obligatorio"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- correo principal -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Correo principal</label>
              <q-input
                v-model="configuracion.correo_principal"
                autogrow
                placeholder="Obligatorio"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Moneda -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Moneda</label>
              <q-input
                v-model="configuracion.moneda"
                autogrow
                placeholder="Obligatorio"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Logo claro -->
            <div class="col-12 col-md-4">
              <label for="q-mb-sm block">Logo (tema claro)</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="configuracion.logo_claro"
                :alto="'400px'"
                @update:model-value="
                  (data) => (configuracion.logo_claro = data)
                "
              ></selector-imagen>
            </div>

            <!-- Logo oscuro -->
            <div class="col-12 col-md-4">
              <label for="q-mb-sm block">Logo (tema oscuro)</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="configuracion.logo_oscuro"
                :alto="'400px'"
                @update:model-value="
                  (data) => (configuracion.logo_oscuro = data)
                "
              ></selector-imagen>
            </div>

            <!-- Logo oscuro -->
            <div class="col-12 col-md-4">
              <label for="q-mb-sm block">Logo (marca de agua)</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="configuracion.logo_marca_agua"
                :alto="'400px'"
                @update:model-value="
                  (data) => (configuracion.logo_marca_agua = data)
                "
              ></selector-imagen>
            </div>
          </div>

          <div class="row justify-end">
            <!-- Boton guardar -->
            <q-btn
              color="primary"
              type="submit"
              no-caps
              push
              :class="{ 'full-width': $q.screen.xs }"
              @click="guardar(configuracion)"
            >
              <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
              <span>{{ 'Guardar' }}</span>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./ConfiguracionPage.ts"></script>
