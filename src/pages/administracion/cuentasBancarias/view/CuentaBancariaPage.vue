<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cuentas Bancarias Empresariales"
  >
    <template #caption>
      <div class="q-pb-md q-pt-none">
        <em class="text-caption"
          >Las que se usarán para la generación de cash y de roles de pagos
        </em>
      </div>
    </template>
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!--Tipo de cuenta -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo de Cuenta</label>
            <q-select
              v-model="cuenta.tipo_cuenta"
              :options="tiposCuentas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.tipo_cuenta.$errors.length"
              error-message="Debes seleccionar un tipo "
              :option-value="v => v.value"
              :option-label="v => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo_cuenta" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Banco -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Banco</label>
            <q-select
              v-model="cuenta.banco"
              :options="bancos"
              hint="Agregue elementos desde el panel de bancos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.banco.$errors.length"
              error-message="Debes seleccionar un banco"
              use-input
              input-debounce="0"
              @filter="filtrarBancos"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="banco" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Numero de cuenta -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">N° Cuenta</label>
            <q-input
              v-model="cuenta.numero_cuenta"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.numero_cuenta.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="numero_cuenta" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Observación -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="cuenta.observacion"
              type="textarea"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense autogrow
            />
          </div>

          <!-- Es principal -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">¿Marcar como Principal?</label>
            <q-toggle
              :label="cuenta.es_principal ? 'SI' : 'NO'"
              v-model="cuenta.es_principal"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./CuentaBancariaPage.ts" />
