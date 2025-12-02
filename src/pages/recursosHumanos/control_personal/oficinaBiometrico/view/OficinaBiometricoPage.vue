<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Oficinas con Dispositivo Biométrico"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrar"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm">
          <!-- Nombre-->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
                v-model="oficina.nombre"
                placeholder="Obligatorio"
                type="textarea"
                :disable="disabled"
                :error="!!v$.nombre.$errors.length"
                autogrow
                @blur="v$.nombre.$touch"
                outlined
                dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- descripcion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
                v-model="oficina.descripcion"
                placeholder="Opcional"
                type="textarea"
                :disable="disabled"
                autogrow
                outlined
                dense
            >
<!--                :error="!!v$.descripcion.$errors.length"-->
<!--                @blur="v$.descripcion.$touch"-->
<!--              <template v-slot:error>-->
<!--                <error-component clave="descripcion" :v$="v$" />-->
<!--              </template>-->
            </q-input>
          </div>

          <!-- Canton -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Canton</label>
            <q-select
                v-model="oficina.canton"
                :options="cantones"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                hint="Obligatorio"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @filter="filtrarCantones"
                @popup-show="ordenarLista(cantones, 'canton')"
                :option-value="v => v.id"
                :option-label="v => v.canton"
                emit-value
                map-options
            >
              <template v-slot:error>
                <error-component clave="canton" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!--Dirección-->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
                v-model="oficina.direccion"
                placeholder="Opcional"
                type="textarea"
                :disable="disabled"
                autogrow
                outlined
                dense
            >
<!--                :error="!!v$.direccion.$errors.length"-->
<!--                @blur="v$.direccion.$touch"-->
<!--              <template v-slot:error>-->
<!--                <error-component clave="direccion" :v$="v$" />-->
<!--              </template>-->
            </q-input>
          </div>

          <!-- Activo -->
          <div class="col-12 col-md-4">
            <label>¿Activo?</label> <br />
            <q-toggle
                :label="oficina.activo ? 'SI' : 'NO'"
                v-model="oficina.activo"
                color="primary"
                keep-color
                :disable="disabled"
                icon="bi-check2-circle"
                unchecked-icon="clear"
            />
          </div>

          <!-- Dirección IP -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Dirección IP</label>
            <q-input
                v-model="oficina.direccion_ip"
                placeholder="Opcional"
                :disable="disabled"
                autogrow
                outlined
                dense
            />
          </div>

          <!-- Puerto -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Puerto</label>
            <q-input
                v-model="oficina.puerto"
                placeholder="Opcional"
                type="number"
                :disable="disabled"
                outlined
                dense
            />
          </div>

          <!-- clave de acceso -->
          <div class="col-12 ">
            <label class="q-mb-sm block">Clave de acceso</label>
            <q-input
                v-model="oficina.clave_acceso"
                placeholder="Opcional"
                :disable="disabled"
                autogrow
                outlined
                dense
            />
          </div>

        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./OficinaBiometricoPage.ts" />