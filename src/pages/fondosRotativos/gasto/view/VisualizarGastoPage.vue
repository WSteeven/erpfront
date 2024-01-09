<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Lugar -->
          <div class="col-12 col-md-3" v-if="isConsultar">
            <label class="q-mb-sm block">Lugar</label>
            <q-input
              v-model="gasto.lugar_info"
              placeholder=""
              type="textarea"
              autogrow
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="isConsultar === false">
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
            <label class="q-mb-sm block">Fecha de Gasto</label>
            <q-input
              v-model="gasto.fecha_viat"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              readonly
              @blur="v$.fecha_viat.$touch"
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="gasto.fecha_viat" :mask="maskFecha" today-btn>
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
          <!-- Fecha de creacion-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Creacion</label>
            <q-input
              v-model="gasto.created_at"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Proyectos -->
          <div class="col-12 col-md-3" v-if="isConsultar">
            <label class="q-mb-sm block">Proyectos</label>
            <q-input
              v-model="gasto.proyecto_info"
              placeholder=""
              type="textarea"
              autogrow
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3"  v-if="isConsultar === false">
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
              @update:model-value="cambiar_proyecto()"
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
          <div
            class="col-12 col-md-3"
            v-if="gasto.proyecto >= 0 && isConsultar"
          >
            <label class="q-mb-sm block">Tareas</label>
            <q-input
              v-model="gasto.tarea_info"
              placeholder=""
              disable
              type="textarea"
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
          <div
            class="col-12 col-md-3"
            v-if="gasto.proyecto >= 0 && isConsultar === false"
          >
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

          <!-- Factura -->
          <div class="col-12 col-md-3" v-if="esFactura">
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
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- RUC -->
          <div class="col-12 col-md-3" v-if="esFactura">
            <label class="q-mb-sm block">RUC</label>
            <q-input
              v-model="gasto.ruc"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
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
              outlined
              dense
            >
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
              outlined
              dense
            >
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
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Autorizacion -->
          <div class="col-12 col-md-3" v-if="isconsultar">
            <label class="q-mb-sm block">Autorizaciòn Especial</label>
            <q-input
              v-model="gasto.aut_especial_user"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Detalle -->
          <div class="col-12 col-md-3 q-mb-md" v-if="isConsultar">
            <label class="q-mb-sm block">Detalle</label>
            <q-input
              v-model="gasto.detalle_info"
              placeholder="Obligatorio"
              type="textarea"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>
          <div class="col-12 col-md-3 q-mb-md" v-if="isConsultar === false">
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
              @update:model-value="cambiar_detalle()"
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
                <q-btn color="positive" @click="recargar_detalle('detalle')">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>
          <!-- Subdetalle-->
          <div class="col-12 col-md-3" v-if="isConsultar">
            <label class="q-mb-sm block">Subdetalle</label>
            <q-input
              v-model="gasto.sub_detalle_info"
              placeholder="Obligatorio"
              type="textarea"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>
          <div class="col-12 col-md-3" v-if="isConsultar === false">
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
              @update:model-value="tiene_factura_subdetalle()"
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
                <q-btn color="positive" @click="recargar_detalle('sub_detalle')">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>
          <!-- Placa -->
          <div class="col-12 col-md-3" v-if="isConsultar">
            <label class="q-mb-sm block">Placa</label>
            <q-input
              v-model="gasto.placa"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Placa vehiculo -->
          <div
            class="col-12 col-md-3"
            v-if="
              (esCombustibleEmpresa || mostarPlaca) && isConsultar === false
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
          <!-- Kilometraje -->
          <div class="col-12 col-md-3" v-if="esCombustibleEmpresa">
            <label class="q-mb-sm block">Kilometraje</label>
            <q-input
              v-model="gasto.kilometraje"
              placeholder="Obligatorio"
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
          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="gasto.observacion"
              placeholder="Opcional"
              type="textarea"
              :error="!!v$.observacion.$errors.length"
              @blur="v$.observacion.$touch"
              :disable="disabled"
              autogrow
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
          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación Autorizador</label>
            <q-input
              v-model="gasto.detalle_estado"
              placeholder="Opcional"
              type="textarea"
              :disable="disabled"
              autogrow
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
          <!-- Empleado -->
          <div class="col-12 col-md-3" v-if="isconsultar">
            <label class="q-mb-sm block">Empleado</label>
            <q-input
              v-model="gasto.empleado_info"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!--Beneficiaros-->
          <div class="col-12 col-md-3" v-if="isConsultar">
            <label class="q-mb-sm block">Beneficiarios</label>
            <q-input
              v-model="gasto.beneficiarios_info"
              placeholder=""
              type="textarea"
              autogrow
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="isConsultar === false">
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
          <!-- Comprobante 1 Archivo -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Comprobante 1</label>
            <imagen-comprimida-component
              :imagen="gasto.comprobante1"
              :texto1="'R.U.C.: ' + gasto.ruc"
              :texto2="'Factura: ' + gasto.factura"
              :texto3="
                'Comprobante: ' + gasto.num_comprobante != null
                  ? gasto.num_comprobante
                  : ''
              "
              :texto4="'Empleado: ' + gasto.empleado_info"
              @update:modelValue="(data) => (gasto.comprobante1 = data)"
            >
            </imagen-comprimida-component>
          </div>

          <!-- Comprobante 2 Archivo -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Comprobante 2</label>
            <imagen-comprimida-component
              :imagen="gasto.comprobante2"
              :texto1="'R.U.C.: ' + gasto.ruc"
              :texto2="'Factura: ' + gasto.factura"
              :texto3="
                'Comprobante: ' + gasto.num_comprobante != null
                  ? gasto.num_comprobante
                  : ''
              "
              :texto4="'Empleado: ' + gasto.empleado_info"
              @update:modelValue="(data) => (gasto.comprobante2 = data)"
            >
            </imagen-comprimida-component>
          </div>
        </div>
      </q-form>
      <div
        class="q-pa-md q-gutter-sm flex flex-center"
        v-if="usuario.id == gasto.aut_especial && gasto.estado_info == 'POR APROBAR'"
      >
        <q-btn color="positive" @click="aprobar_gasto(gasto, 'aprobar')" v-if="issubmit">
          <q-icon name="bi-check-circle" size="xs"></q-icon>Aprobar</q-btn
        >
        <q-btn color="negative" @click="aprobar_gasto(gasto, 'rechazar')" v-if="issubmit">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Rechazar</q-btn
        >
      </div>
      <div
        class="q-pa-md q-gutter-sm flex flex-center"
        v-if="
          (usuario.id == gasto.aut_especial || authenticationStore.esAdministrador) &&
          gasto.estado_info == 'APROBADO' &&
          estaSemanAC == true &&
          issubmit == true
        "
      >
        <q-btn color="negative" @click="aprobar_gasto(gasto, 'anular')">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Anular</q-btn
        >
      </div>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarGastoPage.ts"></script>
