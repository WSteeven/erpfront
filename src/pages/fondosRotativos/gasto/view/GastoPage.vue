<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="mostrarListado"
    :tabOptions="tabAutorizarGasto"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :filtrar="filtrarGasto"
    tabDefecto="3"
    :forzarListar="true"
    :accion1="editarGasto"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Empleado Solicitante -->
          <div class="col-12 col-md-3" v-if="es_consultar">
            <label class="q-mb-sm block">Empleado Solicitante</label>
            <q-input
              v-model="gasto.empleado_info"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Lugar -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar</label>
            <q-select
              v-model="gasto.lugar"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.lugar.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @blur="v$.lugar.$touch"
              @filter="filtrarCantones"
              :option-value="(v) => v.id"
              :option-label="(v) => v.canton"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.lugar.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="gasto.fecha_viat"
              placeholder="Obligatorio"
              :error="!!v$.fecha_viat.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.fecha_viat.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="gasto.fecha_viat"
                      :mask="maskFecha"
                      :options="optionsFechaGasto"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_viat.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Proyectos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Proyectos</label>
            <q-select
              v-model="gasto.proyecto"
              :options="proyectos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.proyecto.$errors.length"
              error-message="Debes seleccionar un proyecto"
              use-input
              input-debounce="0"
              @blur="v$.proyecto.$touch"
              @filter="filtrarProyectos"
              @update:model-value="cambiarProyecto()"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.proyecto.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_proyecto
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.nombre }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Tareas -->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0">
            <label class="q-mb-sm block">Tareas</label>
            <q-select
              v-model="gasto.num_tarea"
              :options="tareas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.num_tarea.$errors.length"
              @filter="filtrarTareas"
              @blur="v$.num_tarea.$touch"
              error-message="Debes seleccionar una Tarea"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.num_tarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_tarea
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!--Tiene Factura-->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="esFactura"
              label="¿Tiene Factura?"
              disable
              @update:model-value="existeComprobante()"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Detalle -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Detalle</label>
            <q-select
              v-model="gasto.detalle"
              :options="detalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.detalle.$errors.length"
              error-message="Debes seleccionar un detalle"
              use-input
              input-debounce="0"
              @blur="v$.detalle.$touch"
              @update:model-value="cambiarDetalle()"
              @filter="filtrarDetalles"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.detalle.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarDetalle('detalle')">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>
          <!-- Subdetalle-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Subdetalle</label>
            <q-select
              v-model="gasto.sub_detalle"
              :options="sub_detalles"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              use-chips
              outlined
              multiple
              :disable="disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtarSubdetalles"
              @blur="v$.sub_detalle.$touch"
              @update:model-value="tieneFacturaSubDetalle()"
              :error="!!v$.sub_detalle.$errors.length"
              error-message="Debes seleccionar uno o varios sub_detalle"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.descripcion }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.nombres" />
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.sub_detalle.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarDetalle('sub_detalle')">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>
          <!-- Factura -->
          <div class="col-12 col-md-3" v-if="esFactura && gasto.detalle != null">
            <label class="q-mb-sm block">#Factura</label>
            <q-input
              v-model="gasto.factura"
              placeholder="Obligatorio"
              :mask="mascaraFactura"
              fill-mask
              :hint="mascaraFactura"
              :disable="disabled"
              :error="!!v$.factura.$errors.length"
              @blur="v$.factura.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.factura.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Numero de Comprobante -->
          <div class="col-12 col-md-3" v-if="esFactura == false">
            <label class="q-mb-sm block">Numero de Comprobante</label>
            <q-input
              v-model="gasto.num_comprobante"
              placeholder="Opcional"
              mask="#################"
              :disable="disabled"
              :error="!!v$.num_comprobante.$errors.length"
              @blur="v$.num_comprobante.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_comprobante.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- RUC -->
          <div class="col-12 col-md-3" v-if="esFactura && gasto.detalle != null">
            <label class="q-mb-sm block">RUC</label>
            <q-input
              v-model="gasto.ruc"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.ruc.$errors.length"
              @blur="v$.ruc.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.ruc.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Cantidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad</label>
            <q-input
              v-model="gasto.cantidad"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.cantidad.$errors.length"
              @blur="v$.cantidad.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.cantidad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Valor Unitario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor Unitario</label>
            <q-input
              v-model="gasto.valor_u"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor_u.$errors.length"
              @blur="v$.valor_u.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor_u.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Total -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total</label>
            <q-input
              v-model="gasto.total"
              placeholder="Obligatorio"
              type="number"
              disable
              :error="!!v$.total.$errors.length"
              @blur="v$.total.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.total.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!--Beneficiarios-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Beneficiarios</label>
            <q-select
              v-model="gasto.beneficiarios"
              :options="beneficiarios"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              use-chips
              outlined
              multiple
              :disable="disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarBeneficiarios"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.nombres + " " + opt.apellidos }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.nombres" />
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Autorizacion -->
          <div class="col-12 col-md-3" v-if="visualizarAutorizador">
            <label class="q-mb-sm block">Autorizaciòn Especial</label>
            <q-select
              v-model="gasto.aut_especial"
              :options="autorizaciones_especiales"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.aut_especial.$errors.length"
              error-message="Debes seleccionar un autorizador"
              use-input
              input-debounce="0"
              @blur="v$.aut_especial.$touch"
              @filter="filtrarAutorizacionesEspeciales"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.aut_especial.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Kilometraje -->
          <div class="col-12 col-md-3" v-if="esCombustibleEmpresa">
            <label class="q-mb-sm block">Kilometraje</label>
            <q-input
              v-model="gasto.kilometraje"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.kilometraje.$errors.length"
              @blur="v$.kilometraje.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.kilometraje.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!--es vehiculo alquilado-->
          <div class="col-12 col-md-3 q-mb-xl" v-if="esCombustibleEmpresa || mostarPlaca">
            <q-checkbox
              class="q-mb-lg"
              v-model="gasto.es_vehiculo_alquilado"
              label="¿Es vehiculo alquilado?"
              outlined
              dense
            />
          </div>

          <!-- Placa Vehiculo Alquilado -->
          <div class="col-12 col-md-3" v-if="gasto.es_vehiculo_alquilado">
            <label class="q-mb-sm block">Placa de Vehiculo Alquilado </label>
            <q-input
              v-model="gasto.placa"
              placeholder="obligatorio"
              :disable="disabled"
              :mask="mascara_placa"
              :error="!!v$.placa.$errors.length"
              @blur="v$.placa.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.placa.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Placa vehiculo -->
          <div
            class="col-12 col-md-3"
            v-if="
              (esCombustibleEmpresa || mostarPlaca) &&
              gasto.es_vehiculo_alquilado == false
            "
          >
            <label class="q-mb-sm block">Placas</label>
            <q-select
              v-model="gasto.vehiculo"
              :options="vehiculos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.vehiculo.$errors.length"
              @blur="v$.vehiculo.$touch"
              @filter="filtrarVehiculos"
              error-message="Debes seleccionar un numero de placa"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.placa"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.vehiculo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.placa
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Comprobante 1 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 1</label>
            <imagen-comprimida-component
              :imagen="gasto.comprobante1"
              file_extensiones=".jpg, image/*"
              :error="!!v$.comprobante1.$errors.length"
              error-message="Debes de cargar imagen de comprobante"
              @blur="v$.comprobante1.$touch"
              @update:modelValue="(data) => (gasto.comprobante1 = data)"
            >
              <template v-slot:error>
                <div v-for="error of v$.comprobante1.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </imagen-comprimida-component>
          </div>

          <!-- Comprobante 2 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 2</label>
            <imagen-comprimida-component
              :imagen="gasto.comprobante2"
              file_extensiones=".jpg, image/*"
              :error="!!v$.comprobante2.$errors.length"
              error-message="Debes de cargar reverso imagen de comprobante"
              @blur="v$.comprobante2.$touch"
              @update:modelValue="(data) => (gasto.comprobante2 = data)"
            >
              <template v-slot:error>
                <div v-for="error of v$.comprobante2.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </imagen-comprimida-component>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="gasto.observacion"
              placeholder="obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.observacion.$errors.length"
              autogrow
              @blur="v$.observacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.observacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Observacion de Anulacion -->
          <div class="col-12 col-md-3" v-if="es_consultar">
            <label class="q-mb-sm block">Observacion de Anulación</label>
            <q-input
              v-model="gasto.observacion_anulacion"
              placeholder="Opcional"
              disable
              type="textarea"
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Centro de Costo -->
          <div class="col-12 col-md-3" v-if="es_consultar">
            <label class="q-mb-sm block">Centro de Costo</label>
            <q-input
              v-model="gasto.centro_costo"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Sub Centro de Costo -->
          <div class="col-12 col-md-3" v-if="es_consultar">
            <label class="q-mb-sm block">Sub Centro de Costo</label>
            <q-input
              v-model="gasto.subcentro_costo"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-input v-model="gasto.estado_info" placeholder="" disable outlined dense>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./GastoPage.ts"></script>
