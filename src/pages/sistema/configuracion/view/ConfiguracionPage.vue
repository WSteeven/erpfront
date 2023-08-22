<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Configuracion General"
  >
    <template #formulario>
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
                <div v-for="error of v$.razon_social.$errors" :key="error.$uid">
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
              :readonly="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- direccion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Direccion</label>
            <q-input
              v-model="configuracion.nombre_comercial"
              autogrow
              placeholder="Obligatorio"
              :readonly="disabled"
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
              :readonly="disabled"
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
              :readonly="disabled"
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
              :readonly="disabled"
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
              :readonly="disabled"
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
              @update:model-value="(data) => (configuracion.logo_claro = data)"
            ></selector-imagen>
          </div>

          <!-- Logo oscuro -->
          <div class="col-12 col-md-4">
            <label for="q-mb-sm block">Logo (tema oscuro)</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="configuracion.logo_oscuro"
              :alto="'400px'"
              @update:model-value="(data) => (configuracion.logo_oscuro = data)"
            ></selector-imagen>
          </div>

          <!-- Logo oscuro -->
          <div class="col-12 col-md-4">
            <label for="q-mb-sm block">Logo (marca de agua)</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="configuracion.logo_oscuro"
              :alto="'400px'"
              @update:model-value="
                (data) => (configuracion.logo_marca_agua = data)
              "
            ></selector-imagen>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ConfiguracionPage.ts"></script>
