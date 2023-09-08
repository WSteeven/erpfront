<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores"
    :accion1="botonCalificarProveedor"
    :accion2="botonVerMiCalificacionProveedor"
    :accion3="botonVerCalificacionProveedor"
    :puedeExportar="true"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información General"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Empresa -->
            <div class="col-12 col-md-3">
              <label-abrir-modal
                v-if="mostrarLabelModal"
                label="Persona (natural/juridica)"
                @click="modales.abrirModalEntidad('EmpresaPage')"
              />
              <label v-else class="q-mb-sm block">Razón Social</label>
              <!-- Persona (natural/juridica) -->
              <q-select
                v-model="proveedor.empresa"
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
                @popup-show="ordenarEmpresas"
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
            <!-- identificacion-->
            <div class="col-12 col-md-3" v-if="empresa.identificacion">
              <label class="q-mb-sm block">Identificacion/RUC</label>
              <q-input
                mask="#############"
                v-model="empresa.identificacion"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!--Tipo de contribuyente -->
            <div class="col-12 col-md-3" v-if="empresa.tipo_contribuyente">
              <label class="q-mb-sm block">Tipo de Contribuyente</label>
              <q-select
                v-model="empresa.tipo_contribuyente"
                :options="opcionesTipoContribuyente"
                transition-show="jump-up"
                transition-hide="jump-down"
                disable
                options-dense
                dense
                outlined
                :option-value="(v) => v.value"
                :option-label="(v) => v.label"
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
            <!-- razon social-->
            <div class="col-12 col-md-3" v-if="empresa.nombre_comercial">
              <label class="q-mb-sm block">Nombre Comercial</label>
              <q-input
                v-model="empresa.razon_social"
                placeholder="Obligatorio"
                :readonly="disabled"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!--Tipo de negocio -->
            <div class="col-12 col-md-3" v-if="empresa.regimen_tributario">
              <label class="q-mb-sm block">Régimen Tributario</label>
              <q-select
                v-model="empresa.regimen_tributario"
                :options="opcionesTipoNegocio"
                transition-show="jump-up"
                transition-hide="jump-down"
                disable
                options-dense
                dense
                outlined
                :option-value="(v) => v.value"
                :option-label="(v) => v.label"
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

            <!-- correo-->
            <div class="col-12 col-md-3" v-if="empresa.correo">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                v-model="empresa.correo"
                autogrow
                disable
                outlined
                dense
              ></q-input>
            </div>
            <!-- provincia -->
            <div class="col-12 col-md-3" v-if="empresa.nombre_provincia">
              <label class="q-mb-sm block">Provincia</label>
              <q-input
                v-model="empresa.nombre_provincia"
                autogrow
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!--sitio_web-->
            <div class="col-12 col-md-3" v-if="empresa.sitio_web">
              <label class="q-mb-sm block">Sitio Web</label>
              <i class="bi bi-globe q-mt-lg">
                <a
                  class="q-mt-lg"
                  :href="'https://' + empresa.sitio_web"
                  target="_blank"
                  >{{ empresa.sitio_web }}</a
                >
              </i>
            </div>

            <!-- actividad economica-->
            <div class="col-12 col-md-9" v-if="empresa.actividad_economica">
              <label class="q-mb-sm block">Actividad Económica</label>
              <q-input
                v-model="empresa.actividad_economica"
                autogrow
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- años de experiencia -->
            <div class="col-12 col-md-3" v-if="empresa.antiguedad_proveedor">
              <label class="q-mb-sm block">Actividades Comerciales desde</label>
              <q-input
                v-model="empresa.antiguedad_proveedor"
                autogrow
                disable
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Datos Comerciales del Proveedor"
          header-class="text-bold bg-header-collapse"
          default-opened
          ><div class="row q-col-gutter-sm q-pa-sm">
            <!-- Sucursal -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Sucursal</label>
              <q-input
                v-model="proveedor.sucursal"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.sucursal.$errors.length"
                @blur="v$.sucursal.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!--Canton -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Ciudad</label>
              <q-select
                v-model="proveedor.canton"
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
                @update:model-value="obtenerParroquias"
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
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.canton }}</q-item-label>
                      <q-item-label caption
                        >Provincia {{ scope.opt.provincia }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!--Parroquia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Parroquia</label>
              <q-select
                v-model="proveedor.parroquia"
                :options="parroquias"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarParroquias"
                :error="!!v$.parroquia.$errors.length"
                error-message="Debes seleccionar una parroquia"
                :option-value="(v) => v.id"
                :option-label="(v) => v.parroquia"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.parroquia.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.parroquia }}</q-item-label>
                      <q-item-label caption
                        >Cantón {{ scope.opt.canton }}</q-item-label
                      >
                    </q-item-section>
                  </q-item> </template
                ><template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <!-- Celular  -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                v-model="proveedor.celular"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- Telefono  -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Teléfono</label>
              <q-input
                v-model="proveedor.telefono"
                placeholder="Opcional"
                hint="Número de telefono fijo o extensión"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- Direccion  -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="proveedor.direccion"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.direccion.$errors.length"
                outlined
                dense
                ><template v-slot:error>
                  <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Estado -->
            <div class="col-12 col-md-3">
              <label>Estado</label> <br />
              <q-toggle
                :label="proveedor.estado ? 'ACTIVO' : 'INACTIVO'"
                v-model="proveedor.estado"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
              />
            </div>
            <!-- Datos financieros del proveedor -->
            <div class="col-12 col-md-12">
              <q-expansion-item
                class="overflow-hidden q-mb-md expansion"
                label="Datos Financieros del Proveedor"
                header-class="text-bold bg-header-collapse"
                default-opened
              >
                <div class="row q-col-gutter-sm q-pa-sm">
                  <!-- Banco -->
                  <div class="col-12 col-md-3">
                    <label class="q-mb-sm block">Banco</label>
                    <q-select
                      v-model="proveedor.banco"
                      :options="bancos"
                      transition-show="jump-up"
                      transition-hide="jump-down"
                      :disable="disabled"
                      options-dense
                      dense
                      outlined
                      :input-debounce="0"
                      use-input
                      hint="Obligatorio"
                      :error="!!v$.banco.$errors.length"
                      @blur="v$.banco.$touch"
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
                </div>
              </q-expansion-item>
            </div>
            <!-- Contactos financiero, tecnico y comercial -->
            <div class="col-12 col-md-12">
              <q-expansion-item
                class="overflow-hidden q-mb-md expansion"
                label="Contactos del Proveedor"
                header-class="text-bold bg-header-collapse"
                default-opened
              >
                <div class="row q-col-gutter-sm q-pa-sm">
                  <div class="col-12 col-md-12">
                    <essential-table
                      ref="refContactos"
                      titulo="Contactos del Proveedor"
                      :configuracionColumnas="columnasContactosProveedor"
                      :datos="proveedor.contactos"
                      :accion1Header="abrirModalContacto"
                      :permitirBuscar="false"
                      :permitirConsultar="false"
                      :permitirEditar="true"
                      :permitirEliminar="true"
                      :mostrarBotones="false"
                      :mostrarCantidadElementos="false"
                      :permitirEditarModal="true"
                      :modalMaximized="false"
                      :alto-fijo="false"
                      :mostrarFooter="false"
                    ></essential-table>
                  </div>
                </div>
              </q-expansion-item>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información para Calificador del Proveedor"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Ofrece-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Ofrece</label>
              <q-select
                v-model="proveedor.tipos_ofrece"
                :options="ofertas"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                multiple
                dense
                use-chips
                outlined
                :error="!!v$.tipos_ofrece.$errors.length"
                @update:model-value="actualizarCategorias"
                error-message="Debes seleccionar al menos una opcion"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
                ><template
                  v-slot:option="{ itemProps, opt, selected, toggleOption }"
                >
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      {{ opt.nombre }}
                      <q-item-label v-bind:inner-h-t-m-l="opt.nombre" />
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        :model-value="selected"
                        @update:model-value="toggleOption(opt)"
                      />
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
            <!-- {{ categorias }} -->
            <!--Categorias-->
            <div class="col-12 col-md-3">
              <label-abrir-modal
                v-if="mostrarLabelModal"
                label="Categorias"
                @click="modales.abrirModalEntidad('CategoriaOfertaPage')"
              />
              <label v-else class="q-mb-sm block">Categorias</label>
              <q-select
                v-model="proveedor.categorias_ofrece"
                :options="categorias"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                multiple
                dense
                use-chips
                outlined
                @popup-show="ordenarCategorias"
                :error="!!v$.categorias_ofrece.$errors.length"
                error-message="Debes seleccionar al menos una opcion"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
                ><template
                  v-slot:option="{ itemProps, opt, selected, toggleOption }"
                >
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      {{ opt.nombre }}
                      <q-item-label v-bind:inner-h-t-m-l="opt.nombre" />
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        :model-value="selected"
                        @update:model-value="toggleOption(opt)"
                      />
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
            <!-- {{proveedor.categorias_ofrece}}  -->
            <!--Departamentos que califican-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Departamentos que Califican al Proveedor</label
              >
              <q-select
                v-model="proveedor.departamentos"
                :options="departamentos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                multiple
                dense
                use-chips
                outlined
                :error="!!v$.departamentos.$errors.length"
                error-message="Debes seleccionar al menos una opcion"
                hint="Dept. Financiero califica a todos los proveedores"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                :option-disable="(v) => v.id === departamentoFinanciero.id"
                emit-value
                map-options
                ><template
                  v-slot:option="{ itemProps, opt, selected, toggleOption }"
                >
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      {{ opt.nombre }}
                      <q-item-label v-bind:inner-h-t-m-l="opt.nombre" />
                      <q-item-label caption>{{ opt.responsable }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        :model-value="selected"
                        @update:model-value="toggleOption(opt)"
                      />
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

            <!-- Departamentos -->
            <!-- <div class="col-12 col-md-3" v-if="false">
              <label>Departamentos calificadores</label>
              <q-option-group
                :options="
                  departamentos.map((v) => {
                    return { label: v.nombre, value: v.id }
                  })
                "
                type="checkbox"
                v-model="proveedor.departamentos"
              />
            </div> -->
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>
  <modales-entidad
    :comportamiento="modales"
    @guardado="(data) => guardado(data)"
  ></modales-entidad>
</template>

<script src="./ProveedorPage.ts"></script>
