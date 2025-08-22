<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Estados Claro Ventas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Estado</label>
            <q-input
              v-model="estado.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- abreviatura -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Abreviatura</label>
            <q-input
              v-model="estado.abreviatura"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.abreviatura.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="abreviatura" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- tipo -->
          <!-- idealmente deberia ir una lista -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Tipo</label>
            <q-input
              v-model="estado.tipo"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.tipo.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="tipo" :v$="v$" />
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./EstadoPage.ts" />
