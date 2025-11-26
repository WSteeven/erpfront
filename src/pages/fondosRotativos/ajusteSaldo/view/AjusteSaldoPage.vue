<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Ajustes de Saldos"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!--Destinatario -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Destinatario</label>
            <q-select
              v-model="ajuste.destinatario"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              :disable="disabled"
              :error="!!v$.destinatario.$errors.length"
              error-message="Debes seleccionar un destinatario "
              :option-value="(v) => v.id"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="destinatario" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>

          <!-- motivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Motivo</label>
            <q-input
              v-model="ajuste.motivo"
              placeholder="Obligatorio" autogrow
              :disable="disabled"
              :error="!!v$.motivo.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="motivo" :v$="v$"/>
              </template>
            </q-input>
          </div>

          <!-- justificacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Justificación detallada</label>
            <q-input
              v-model="ajuste.descripcion"
              autogrow
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="descripcion" :v$="v$"/>
              </template>
            </q-input>
          </div>

          <!--Tipo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="ajuste.tipo"
              :options="opcionesTiposMovimientos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.tipo.$errors.length"
              error-message="Debes seleccionar un tipo "
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo" :v$="v$"/>
              </template>
            </q-select>
          </div>

          <!-- monto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto</label>
            <q-input
              v-model="ajuste.monto"
              type="number"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="descripcion" :v$="v$"/>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./AjusteSaldoPage.ts" />
