<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
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
              <label class="q-mb-sm block">Razón Social</label>
              <q-input v-model="empresa.razon_social" disable dense outlined />
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
                disable
                outlined
                dense
              />
            </div>

            <!--Canton -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Ciudad</label>
              <q-input v-model="proveedor.canton" disable dense outlined />
            </div>

            <!--Parroquia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Parroquia</label>
              <q-input v-model="proveedor.parroquia" disable dense outlined />
            </div>
            <!-- Celular  -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                v-model="proveedor.celular"
                placeholder="Opcional"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- Telefono  -->
            <div class="col-12 col-md-3" v-if="proveedor.telefono">
              <label class="q-mb-sm block">Teléfono</label>
              <q-input
                v-model="proveedor.telefono"
                placeholder="Opcional"
                hint="Número de telefono fijo o extensión"
                disable
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
                disable
                outlined
                dense
              />
            </div>
            <!-- Estado -->
            <div
              class="col-12 col-md-3"
              v-if="accion != acciones.nuevo && accion != acciones.editar"
            >
              <label>Estado</label> <br />
              <q-toggle
                :label="proveedor.estado ? 'ACTIVO' : 'INACTIVO'"
                v-model="proveedor.estado"
                color="primary"
                disable
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
              />
            </div>

            <!-- referido -->
            <div class="col-12 col-md-3 q-mb-xl">
              <q-checkbox
                class="q-mt-lg q-pt-md"
                v-model="esReferido"
                label="¿Es referido?"
                disable
                outlined
                dense
              ></q-checkbox>
            </div>

            <!-- Referencia  -->
            <div class="col-12 col-md-3" v-if="esReferido">
              <label class="q-mb-sm block">Referido por</label>
              <q-input
                v-model="proveedor.referencia"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              />
            </div>
            <!-- Forma de pago-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Forma de Pago</label>
              <q-select
                v-model="proveedor.forma_pago"
                :options="formasPagos"
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
                ><template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <!-- Plazo de creditos-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Plazo de Crédito</label>
              <q-input
                v-model="proveedor.plazo_credito"
                placeholder="Opcional"
                disable
                autogrow
                outlined
                dense
              />
            </div>
            <!-- Anticipos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Anticipos</label>
              <q-input
                v-model="proveedor.anticipos"
                autogrow
                placeholder="Opcional"
                disable
                outlined
                dense
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
                  <div class="col-12 col-md-12">
                    <essential-table
                      ref="refContactos"
                      titulo="Datos Bancarios del Proveedor"
                      :configuracionColumnas="columnasDatosBancarios"
                      :datos="empresa.datos_bancarios"
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
            <!-- Datos logisticos del proveedor -->
            <div class="col-12 col-md-12">
              <q-expansion-item
                class="overflow-hidden q-mb-md expansion"
                label="Logísticas del Proveedor"
                header-class="text-bold bg-header-collapse"
                default-opened
              >
                <div class="row q-col-gutter-sm q-pa-sm">
                  <!-- Tiempo de entrega  -->
                  <div class="col-12 col-md-3">
                    <label class="q-mb-sm block">Tiempo de Entrega</label>
                    <q-input
                      v-model="proveedor.tiempo_entrega"
                      placeholder="Obligatorio"
                      disable
                      outlined
                      dense
                    />
                  </div>
                  <!-- Envio -->
                  <div class="col-12 col-md-3">
                    <label>Realiza Envios</label> <br />
                    <q-toggle
                      :label="proveedor.envios ? 'SI' : 'NO'"
                      v-model="proveedor.envios"
                      @update:model-value="
                        () =>
                          proveedor.envios
                            ? proveedor.tipo_envio
                            : (proveedor.tipo_envio = [])
                      "
                      color="primary"
                      keep-color
                      icon="bi-check2-circle"
                      unchecked-icon="clear"
                    />
                  </div>

                  <!-- Tipo de envio-->
                  <div class="col-12 col-md-3" v-if="proveedor.envios">
                    <label class="q-mb-sm block">Tipo de Envío</label>
                    <q-select
                      v-model="proveedor.tipo_envio"
                      :options="tiposEnvios"
                      transition-show="jump-up"
                      transition-hide="jump-down"
                      disable
                      options-dense
                      multiple
                      dense
                      use-chips
                      outlined
                      :option-value="(v) => v.value"
                      :option-label="(v) => v.label"
                      emit-value
                      map-options
                      ><template
                        v-slot:option="{
                          itemProps,
                          opt,
                          selected,
                          toggleOption,
                        }"
                      >
                        <q-item v-bind="itemProps">
                          <q-item-section>
                            {{ opt.label }}
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

                  <!-- Transporte incluido -->
                  <div class="col-12 col-md-3" v-if="proveedor.envios">
                    <label>Transporte Incluído</label> <br />
                    <q-toggle
                      :label="proveedor.transporte_incluido ? 'SI' : 'NO'"
                      v-model="proveedor.transporte_incluido"
                      color="primary"
                      keep-color
                      icon="bi-check2-circle"
                      unchecked-icon="clear"
                    />
                  </div>

                  <!-- Garantía-->
                  <div class="col-12 col-md-3">
                    <label
                      >Ofrece garantías
                      <q-tooltip
                        >Da garantías en los bienes o servicios
                        ofertados</q-tooltip
                      ></label
                    >
                    <br />
                    <q-toggle
                      :label="proveedor.garantia ? 'SI' : 'NO'"
                      v-model="proveedor.garantia"
                      color="primary"
                      keep-color
                      icon="bi-check2-circle"
                      unchecked-icon="clear"
                    />
                  </div>

                  <!-- Tabla de archivos -->
                  <div class="col-12 q-mb-md">
                    <gestor-archivos
                      ref="refArchivo"
                      label="Información Adicional del Proveedor"
                      :mixin="mixinEmpresas"
                      disable
                      :listarAlGuardar="false"
                      :permitir-subir="false"
                      :permitir-eliminar="false"
                      :idModelo="empresa.id"
                    >
                      <template #boton-subir>
                        <q-btn
                          v-if="mostrarBotonSubir"
                          color="positive"
                          push
                          no-caps
                          class="full-width q-mb-lg"
                          @click="subirArchivos()"
                        >
                          <q-icon
                            name="bi-upload"
                            class="q-mr-sm"
                            size="xs"
                          ></q-icon>
                          Subir archivos seleccionados</q-btn
                        >
                      </template>
                    </gestor-archivos>
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
                disable
                options-dense
                multiple
                dense
                use-chips
                outlined
                :option-value="(v) => v.value"
                :option-label="(v) => v.label"
                emit-value
                map-options
              />
            </div>
            <!--Categorias-->
            <div class="col-12 col-md-4">
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
                disable
                options-dense
                multiple
                dense
                use-chips
                outlined
                @popup-show="ordenarCategorias"
                @update:model-value="actualizarDepartamentos"
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
            <div class="col-12 col-md-5">
              <label class="q-mb-sm block"
                >Departamentos que Califican al Proveedor</label
              >
              <q-select
                v-model="proveedor.departamentos"
                :options="departamentos"
                transition-show="jump-up"
                transition-hide="jump-down"
                disable
                options-dense
                multiple
                dense
                use-chips
                outlined
                :max-values="3"
                hint="Dept. Financiero califica a todos los proveedores (Máx. 3 depts.)"
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
              </q-select>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./VisualizarProveedorPage.ts"></script>
