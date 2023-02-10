<template>
  <q-page padding class="q-pa-lg">
    <div class="text-h6 q-mb-md">Perfil</div>
    <form @submit.prevent>
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- Nombre -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="perfil.nombres"
            label="Nombre"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          />
        </div>

        <!-- Apellidos -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="perfil.apellidos"
            label="Apellidos"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          />
        </div>

        <!-- Fecha de nacimiento -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="perfil.fecha_nacimiento"
            label="Fecha de nacimiento"
            outlined
            dense
            mask="date"
            :rules="[
              'date',
              (val) => (val && val.length > 0) || 'Campo requerido',
            ]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="perfil.fecha_nacimiento">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- Teléfono -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="perfil.telefono"
            label="Teléfono"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          />
        </div>

        <!-- Correo -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="perfil.email"
            type="email"
            label="Correo"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          />
        </div>

        <!-- Tipo de identificacion -->
        <!-- <div class="col-12 col-md-3">
          <q-select
            v-model="perfil.tipo_identificacion"
            label="Tipo de identificación"
            placeholder="Seleccione..."
            :options="tipos_identificaciones"
            outlined
            options-dense
            dense
          />
        </div> -->

        <!-- Indentificacion -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="perfil.identificacion"
            label="Identificación"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          />
        </div>
      </div>

      <div class="row justify-end">
        <q-btn color="primary" @click="actualizar()" no-caps unelevated>
          <q-icon name="bi-save" class="q-mr-md" size="xs"></q-icon>
          Actualizar perfil
        </q-btn>
      </div>
    </form>
  </q-page>
</template>

<script src="./PerfilPage.ts"></script>
