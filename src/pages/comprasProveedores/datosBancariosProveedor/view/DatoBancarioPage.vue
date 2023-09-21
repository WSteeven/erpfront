<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Datos Bancarios del Proveedor"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información del proveedor"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Empresa -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Razón Social</label>
              <q-select
                v-model="dato.empresa"
                :options="empresas"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarEmpresas"
                @update:model-value="obtenerEmpresa"
                :error="!!v$.empresa.$errors.length"
                hint="Agrega elementos desde el panel de empresas"
                error-message="Debes seleccionar una empresa"
                :option-value="(v) => v.id"
                :option-label="(v) => v.razon_social"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.empresa.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.razon_social }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.identificacion }} |{{
                          scope.opt.nombre_comercial
                        }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
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
            <!--nombre comercial-->
            <div class="col-12 col-md-3" v-if="empresa.nombre_comercial">
              <label class="q-mb-sm block">Nombre Comercial</label>
              <q-input
                v-model="empresa.nombre_comercial"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- identificacion-->
            <div class="col-12 col-md-3" v-if="empresa.identificacion">
              <label class="q-mb-sm block">Identificacion/RUC</label>
              <q-input
                mask="#############"
                v-model="empresa.identificacion"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- correo-->
            <div class="col-12 col-md-3" v-if="empresa.correo">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                v-model="empresa.correo"
                disable
                autogrow
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Datos Bancarios del Proveedor"
          header-class="text-bold bg-header-collapse"
          default-opened
          ><div class="row q-col-gutter-sm q-pa-sm">
            <!--Banco -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Banco</label>
              <q-select
                v-model="dato.banco"
                :options="bancos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarBancos"
                :error="!!v$.banco.$errors.length"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.banco.$errors"
                    :key="error.$uid"
                  >
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
            <!--Tipo de Contacto-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de Cuenta</label>
              <q-select
                v-model="dato.tipo_cuenta"
                :options="tiposCuentas"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.tipo_cuenta.$errors.length"
                :option-value="(v) => v.value"
                :option-label="(v) => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.tipo_cuenta.$errors"
                    :key="error.$uid"
                  >
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

            <!-- numero de cuenta-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">N° Cuenta</label>
              <q-input
                v-model="dato.numero_cuenta"
                type="number"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.numero_cuenta.$errors.length"
                @blur="v$.numero_cuenta.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.numero_cuenta.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- nombre titular de la cuenta-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Titular de la Cta.</label>
              <q-input
                v-model="dato.nombre_propietario"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.nombre_propietario.$errors.length"
                outlined
                dense
                ><template v-slot:error>
                  <div
                    v-for="error of v$.nombre_propietario.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- identificacion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">N° Identificación</label>
              <q-input
                v-model="dato.identificacion"
                mask="#############"
                hint="Identificacion del Titular de la Cta."
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./DatoBancarioPage.ts" />
