<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasBeneficiarios"
    paginate
    full
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Código Beneficiario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código Beneficiario</label>
            <q-input
              v-model="beneficiario.codigo_beneficiario"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.codigo_beneficiario.$errors.length"
              @blur="v$.codigo_beneficiario.$touch"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.codigo_beneficiario.$errors"
                  :key="error.$uid"
                >
                  <div>{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Tipo de Documento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de Documento</label>
            <q-select
              v-model="beneficiario.tipo_documento"
              :options="tiposDocumentosIdentificacionesCash"
              :disable="disabled"
              :option-value="v => v.value"
              :option-label="v => v.nombre"
              :error="!!v$.tipo_documento.$errors.length"
              @blur="v$.tipo_documento.$touch"
              hint="Obligatorio"
              options-dense
              emit-value
              map-options
              outlined
              dense
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_documento.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Identificación Beneficiario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Identificación Beneficiario</label>
            <q-input
              v-model="beneficiario.identificacion_beneficiario"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.identificacion_beneficiario.$errors.length"
              @blur="v$.identificacion_beneficiario.$touch"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identificacion_beneficiario.$errors"
                  :key="error.$uid"
                >
                  <div>{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Nombre Beneficiario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre Beneficiario</label>
            <q-input
              v-model="beneficiario.nombre_beneficiario"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.nombre_beneficiario.$errors.length"
              @blur="v$.nombre_beneficiario.$touch"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.nombre_beneficiario.$errors"
                  :key="error.$uid"
                >
                  <div>{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Dirección -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="beneficiario.direccion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Ciudad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ciudad</label>
            <q-select
              v-model="beneficiario.canton"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              hint="Opcional"
              options-dense
              :disable="disabled"
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
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Teléfono -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Teléfono</label>
            <q-input
              v-model="beneficiario.telefono"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Localidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Localidad</label>
            <q-input
              v-model="beneficiario.localidad"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Correo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="beneficiario.correo"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>

      <essential-table
        titulo="Cuentas bancarias"
        :configuracionColumnas="configuracionColumnasCuentaBancariaAccion"
        :datos="beneficiario.cuentas_bancarias"
        ajustar-celdas
        :alto-fijo="false"
        :accion1Header="btnAgregarCuentaBancaria"
        :permitir-buscar="false"
        :permitir-consultar="false"
        :permitir-editar="false"
        :disable="disabled"
        permitirEditarCeldas
        @eliminar="btnEliminarCuentaBancaria"
        :v$="v$"
        key-error="cuentas_bancarias"
      ></essential-table>
    </template>
  </tab-layout>
</template>

<script src="./BeneficiarioPage.ts"></script>
