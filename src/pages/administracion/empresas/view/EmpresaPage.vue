<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Empresas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- identificacion-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Identificacion</label>
            <q-input
              mask="#############"
              v-model="empresa.identificacion"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.identificacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!--Cargo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de contribuyente</label>
            <q-select
              v-model="empresa.tipo_contribuyente"
              :options="opciones_tipo_contribuyente"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.tipo_contribuyente.$errors.length"
              error-message="Debes seleccionar un elemento"
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_contribuyente.$errors"
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
          <!-- razon social-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Razón social</label>
            <q-input
              v-model="empresa.razon_social"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
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

          <!-- nombre comercial-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre comercial</label>
            <q-input
              v-model="empresa.nombre_comercial"
              placeholder="Opcional"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>

          <!-- telefono-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Telefono</label>
            <q-input
              mask="##########"
              v-model="empresa.telefono"
              placeholder="Opcional"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>
          <!-- correo-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="empresa.correo"
              placeholder="Opcional"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>
          <!--direccion-->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              type="textarea"
              autogrow
              v-model="empresa.direccion"
              placeholder="Opcional"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./EmpresaPage.ts"></script>
