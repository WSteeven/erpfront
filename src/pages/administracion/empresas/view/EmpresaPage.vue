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
          <!--Tipo de contribuyente -->
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
          <!-- Agente de retención -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Agente de retención</label>
            <q-toggle
              :label="empresa.agente_retencion ? 'SI' : 'NO'"
              v-model="empresa.agente_retencion"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
          <!--Tipo de negocio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de negocio</label>
            <q-select
              v-model="empresa.tipo_negocio"
              :options="opciones_tipo_negocio"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.tipo_negocio.$errors.length"
              error-message="Debes seleccionar un elemento"
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_negocio.$errors" :key="error.$uid">
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

          <!-- celular-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              mask="##########"
              v-model="empresa.celular"
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
              hint="Número de telefono fijo o extensión"
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
          <!--Pais -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">País</label>
            <q-select
              v-model="empresa.pais"
              :options="paises"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarPaises"
              @update:model-value="obtenerProvincias"
              :option-value="(v) => v.id"
              :option-label="(v) => v.pais + ' (' + v.abreviatura + ')'"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.pais }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.abreviatura
                    }}</q-item-label>
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

          <!--Provincia -->
          <div class="col-12 col-md-3" v-if="empresa.pais">
            <label class="q-mb-sm block">Provincia</label>
            <q-select
              v-model="empresa.provincia"
              :options="provincias"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarProvincias"
              @update:model-value="obtenerCantones"
              :option-value="(v) => v.id"
              :option-label="(v) => v.provincia"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!--Canton -->
          <div class="col-12 col-md-3" v-if="empresa.provincia">
            <label class="q-mb-sm block">Cantón</label>
            <q-select
              v-model="empresa.canton"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarCantones"
              :option-value="(v) => v.id"
              :option-label="(v) => v.canton"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!--ciudad-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ciudad</label>
            <q-input
              type="textarea"
              autogrow
              v-model="empresa.ciudad"
              placeholder="Opcional"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
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
