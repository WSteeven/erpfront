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
            <label class="q-mb-sm block">RUC/Cédula</label>
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
            <label class="q-mb-sm block">Tipo de Contribuyente</label>
            <q-select
              v-model="empresa.tipo_contribuyente"
              :options="opcionesTipoContribuyente"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              @update:model-value="actualizarCamposRepresentanteLegal"
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
          <!-- representante legal -->
          <div
            class="col-12 col-md-3"
            v-if="empresa.tipo_contribuyente == 'SOCIEDAD'"
          >
            <label class="q-mb-sm block">Representante Legal</label>
            <q-input
              v-model="empresa.representante_legal"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.representante_legal.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.representante_legal.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- identificacion representante legal -->
          <div
            class="col-12 col-md-3"
            v-if="empresa.tipo_contribuyente == 'SOCIEDAD'"
          >
            <label class="q-mb-sm block"
              >Identificación del Representante Legal</label
            >
            <q-input
              v-model="empresa.identificacion_representante"
              placeholder="Obligatorio"
              mask="##########"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.identificacion_representante.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identificacion_representante.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- razon social-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Razón Social</label>
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
            <label class="q-mb-sm block">Nombre Comercial</label>
            <q-input
              v-model="empresa.nombre_comercial"
              placeholder="Opcional"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>
          <!--Regimen tributario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Regimen Tributario</label>
            <q-select
              v-model="empresa.regimen_tributario"
              :options="opcionesTipoNegocio"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.regimen_tributario.$errors.length"
              error-message="Debes seleccionar un elemento"
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.regimen_tributario.$errors"
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
          <!-- Lleva contabilidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lleva Contabilidad</label>
            <q-toggle
              :label="empresa.lleva_contabilidad ? 'SI' : 'NO'"
              v-model="empresa.lleva_contabilidad"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
          <!-- Agente de retención -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Agente de Retención</label>
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
          <!-- Contribuyente especial -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Contribuyente Especial</label>
            <q-toggle
              :label="empresa.contribuyente_especial ? 'SI' : 'NO'"
              v-model="empresa.contribuyente_especial"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- celular-->
          <!-- <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              mask="##########"
              v-model="empresa.celular"
              placeholder="Obligatorio"
              :error="!!v$.celular.$errors.length"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
              ><template v-slot:error>
                <div v-for="error of v$.celular.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template></q-input
            >
          </div> -->
          <!-- telefono-->
          <!-- <div class="col-12 col-md-3">
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
          </div> -->
          <!-- correo-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="empresa.correo"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>
          <!--Pais -->
          <!-- <div class="col-12 col-md-3" v-if="false">
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
          </div> -->

          <!--Provincia -->
          <div class="col-12 col-md-3">
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
            <label class="q-mb-sm block">Ciudad</label>
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
          <!-- <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ciudad</label>
            <q-input
              type="textarea"
              autogrow
              v-model="empresa.ciudad"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div> -->
          <!--sitio_web-->
          <div
            class="col-12 col-md-3"
            v-if="
              empresa.sitio_web ||
              accion == acciones.nuevo ||
              accion == acciones.editar
            "
          >
            <label class="q-mb-sm block">Sitio Web</label>
            <q-input
              v-if="accion == acciones.nuevo || accion == acciones.editar"
              type="url"
              autogrow
              v-model="empresa.sitio_web"
              placeholder="Opcional"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
            <i v-else class="bi bi-globe">
              <a
                class="q-mt-md"
                :href="'https://' + empresa.sitio_web"
                target="_blank"
                >{{ empresa.sitio_web }}</a
              >
            </i>
          </div>
          <!--direccion-->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              type="textarea"
              autogrow
              v-model="empresa.direccion"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
          <!--actividad economica-->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Actividad Económica</label>
            <q-input
              type="textarea"
              autogrow
              v-model="empresa.actividad_economica"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- checkbox para añadir experiencia como proveedor -->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="experiencia_comercial"
              label="¿Experiencia comercial?"
              :disable="disabled || soloLectura"
              @update:model-value="
                () =>
                  (empresa.antiguedad_proveedor = experiencia_comercial ?empresa.antiguedad_proveedor: null)
              "
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Experiencia como proveedor -->
          <div class="col-12 col-md-3" v-if="experiencia_comercial">
            <label class="q-mb-sm block">Fecha de Inicio Comercial </label>
            <q-input
              v-model="empresa.antiguedad_proveedor"
              placeholder="Obligatorio"
              :value="empresa.antiguedad_proveedor"
              mask="##-####"
              hint="Fecha de inicio de actividades comerciales como proveedor"
              :error="!!v$.antiguedad_proveedor.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.antiguedad_proveedor.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="is_month"
                  >
                    <q-date
                      v-model="empresa.antiguedad_proveedor"
                      minimal
                      mask="MM-YYYY"
                      emit-immediately
                      default-view="Years"
                      @update:model-value="checkValue"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.antiguedad_proveedor.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Es proveedor-->
          <div class="col-12 col-md-3">
            <label>¿Es Proveedor?</label> <br />
            <q-toggle
              :label="empresa.es_proveedor ? 'SI' : 'NO'"
              v-model="empresa.es_proveedor"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
            />
          </div>

          <!-- Es cliente -->
          <div class="col-12 col-md-3">
            <label
              >¿Es Cliente?
              <q-tooltip
                >Da garantías en los bienes o servicios ofertados</q-tooltip
              ></label
            >
            <br />
            <q-toggle
              :label="empresa.es_cliente ? 'SI' : 'NO'"
              v-model="empresa.es_cliente"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./EmpresaPage.ts"></script>
