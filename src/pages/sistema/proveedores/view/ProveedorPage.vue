<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores"
    :accion1="botonCalificarProveedor"
    :accion2="botonVerMiCalificacionProveedor"
    :accion3="botonVerCalificacionProveedor"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información general"
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
              <label v-else class="q-mb-sm block"
                >Persona (natural/juridica)</label
              >
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
              <label class="q-mb-sm block">Tipo de contribuyente</label>
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
            <div class="col-12 col-md-3" v-if="empresa.razon_social">
              <label class="q-mb-sm block">Razón social</label>
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
            <div class="col-12 col-md-3" v-if="empresa.tipo_negocio">
              <label class="q-mb-sm block">Tipo de negocio</label>
              <q-select
                v-model="empresa.tipo_negocio"
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

            <!-- celular-->
            <div class="col-12 col-md-3" v-if="empresa.celular">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                mask="##########"
                v-model="empresa.celular"
                placeholder="Opcional"
                disable
                outlined
                dense
              ></q-input>
            </div>
            <!-- telefono-->
            <div class="col-12 col-md-3" v-if="empresa.telefono">
              <label class="q-mb-sm block">Telefono</label>
              <q-input
                mask="##########"
                v-model="empresa.telefono"
                placeholder="Opcional"
                disable
                outlined
                dense
              ></q-input>
            </div>
            <!-- correo-->
            <div class="col-12 col-md-3" v-if="empresa.correo">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                v-model="empresa.correo"
                placeholder="Opcional"
                disable
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Datos del proveedor"
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
            <!-- Contactos financiero y tecnico -->
            <div class="col-12 col-md-12">
              <q-expansion-item
                class="overflow-hidden q-mb-md expansion"
                label="Contactos del proveedor"
                header-class="text-bold bg-header-collapse"
                default-opened
              >
                <div class="row q-col-gutter-sm q-pa-sm">
                  <div class="col-12 col-md-12">
                    <essential-table
                      ref="refContactos"
                      titulo="Contactos del proveedor"
                      :configuracionColumnas="columnasContactosProveedor"
                      :datos="proveedor.contactos"
                      :accion1Header="abrirModalContacto"
                      :permitirBuscar="false"
                      :permitirConsultar="false"
                      :permitirEditar="true"
                      :permitirEliminar="true"
                      :mostrarBotones="false"
                      :permitirEditarModal="true"
                      :modalMaximized="false"
                      :alto-fijo="false"
                      :mostrarFooter="mostrarFooter"
                    ></essential-table>
                  </div>
                </div>
              </q-expansion-item>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Configuración inicial"
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
            <!--Categorias-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Categorias</label>
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
            <!--Departamentos que califican-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Departamentos que califican</label>
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
                hint="Dept. Contable califica a todos los proveedores"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                :option-disable="
                  (v) =>
                    v.nombre === 'CONTABILIDAD' || v.nombre === 'contabilidad'
                "
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
    @guardado="guardado"
  ></modales-entidad>
</template>

<script src="./ProveedorPage.ts"></script>
