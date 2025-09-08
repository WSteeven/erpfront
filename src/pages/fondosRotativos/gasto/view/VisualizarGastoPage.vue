<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Empleado Solicitante -->
          <div class="col-12 col-md-3">
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

          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">¿Para qué empresa es el gasto?</label>
            <q-select
                v-model="gasto.cliente"
                :options="clientes"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                hint="Empresa para la que hizo este gasto."
                :disable="disabled"
                :option-value="v => v.id"
                :option-label="v => v.razon_social"
                emit-value
                map-options
            />
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
                <error-component clave="lugar" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
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
                <error-component clave="fecha_viat" :v$="v$"/>
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
          <div class="col-12 col-md-3" v-if="isConsultar === false">
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
                <error-component clave="proyecto" :v$="v$"/>
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
               <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Tareas -->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0 && isConsultar">
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
                <error-component clave="num_tarea" :v$="v$"/>
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
              <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Autorizacion -->
          <div class="col-12 col-md-3">
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
                <error-component clave="detalle" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
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
                <error-component clave="sub_detalle" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargar_detalle('sub_detalle')">
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
                <error-component clave="factura" :v$="v$"/>
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
                <error-component clave="num_comprobante" :v$="v$"/>
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
                <error-component clave="ruc" :v$="v$"/>
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
                <error-component clave="cantidad" :v$="v$"/>
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
                <error-component clave="valor_u" :v$="v$"/>
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
                <error-component clave="total" :v$="v$"/>
              </template>
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
          <div class="col-12 col-md-3" v-if="!isConsultar">
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
               <no-option-component/>
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
                <error-component clave="kilometraje" :v$="v$"/>
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
              disable
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
                <error-component clave="placa" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Placa vehiculo -->
          <div
            class="col-12 col-md-3"
            v-if="
              isConsultar &&
              (esCombustibleEmpresa || mostarPlaca) &&
              !gasto.es_vehiculo_alquilado
            "
          >
            <label class="q-mb-sm block">Placa</label>
            <q-input
              v-model="gasto.placa"
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
            v-if="
              !isConsultar &&
              (esCombustibleEmpresa || mostarPlaca) &&
              !gasto.es_vehiculo_alquilado
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
                <error-component clave="vehiculo" :v$="v$"/>
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
                <no-option-component/>
              </template>
            </q-select>
          </div>

          <!-- Comprobante 1 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 1</label>
            <selector-imagen
              :imagen="gasto.comprobante1"
              :texto1="gasto.empleado_info"
              :texto2="'RUC: '+gasto.ruc"
              :texto3="gasto.num_comprobante"
              :texto4="'# FACTURA: '+gasto.factura"
              :texto5="'TOTAL: $ '+gasto.total"
              file_extensiones=".jpg, image/*"
              @update:modelValue="(data) => (gasto.comprobante1 = data)"
              :error="!!v$.comprobante1.$errors.length"
            ></selector-imagen>
          </div>

          <!-- Comprobante 2 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 2</label>
            <selector-imagen
              :imagen="gasto.comprobante2"
              :texto1="gasto.empleado_info"
              :texto2="'RUC: '+gasto.ruc"
              :texto3="gasto.num_comprobante"
              :texto4="'# FACTURA: '+gasto.factura"
              :texto5="'TOTAL: $ '+gasto.total"
              file_extensiones=".jpg, image/*"
              @update:modelValue="(data) => (gasto.comprobante2 = data)"
              :error="!!v$.comprobante2.$errors.length"
            ></selector-imagen>
          </div>

          <!-- Comprobante 3 Archivo -->
          <div class="col-12 col-md-3" v-if="gasto.comprobante3">
            <label class="q-mb-sm block">Comprobante 3</label>
            <selector-imagen
                :imagen="gasto.comprobante3"
                :texto1="gasto.empleado_info"
                :texto2="'RUC: '+gasto.ruc"
                :texto3="gasto.num_comprobante"
                :texto4="'# FACTURA: '+gasto.factura"
                :texto5="'TOTAL: $ '+gasto.total"
                file_extensiones=".jpg, image/*"
                @update:modelValue="(data) => (gasto.comprobante3 = data)"
            ></selector-imagen>
          </div>

          <!-- Comprobante 4 Archivo -->
          <div class="col-12 col-md-3" v-if="gasto.comprobante4">
            <label class="q-mb-sm block">Comprobante 4</label>
            <selector-imagen
                :imagen="gasto.comprobante4"
                :texto1="gasto.empleado_info"
                :texto2="'RUC: '+gasto.ruc"
                :texto3="gasto.num_comprobante"
                :texto4="'# FACTURA: '+gasto.factura"
                :texto5="'TOTAL: $ '+gasto.total"
                file_extensiones=".jpg, image/*"
                @update:modelValue="(data) => (gasto.comprobante4 = data)"
            ></selector-imagen>
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
                <error-component clave="observacion" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Observacion Autorizador-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación Autorizador</label>
            <q-input
              v-model="gasto.detalle_estado"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.detalle_estado.$errors.length"
              @blur="v$.detalle_estado.$touch"
              autogrow
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="detalle_estado" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Observacion de Anulacion -->
          <div class="col-12 col-md-3" v-if="gasto.estado === estadosGastos.APROBADO">
            <label class="q-mb-sm block">Observacion de Anulación</label>
            <q-input
              v-model="gasto.observacion_anulacion"
              placeholder="Opcional"
              :disable="!permitirAnular"
              type="textarea"
              autogrow
              outlined
              :error="!!v$.observacion_anulacion.$errors.length"
              @blur="v$.observacion_anulacion.$touch"
              dense
            >
              <template v-slot:error>
                <error-component clave="observacion_anulacion" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Centro de Costo -->
          <div class="col-12 col-md-3">
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
          <div class="col-12 col-md-3">
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
        </div>
      </q-form>
      <q-separator color="primary" v-if="gasto.se_envia_valija"></q-separator>
      <div
          v-if="gasto.se_envia_valija"
          id="step1"
          class="col-12 text-primary bg-blue-1 q-px-md q-py-sm text-bold"
      >
        <q-icon name="bi-view-list" class="q-mr-sm"></q-icon>
        Detalles de envío de valija
      </div>
      <q-separator color="primary" v-if="gasto.se_envia_valija"></q-separator>
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Courier -->
        <div class="col-12 col-md-6" v-if="gasto.se_envia_valija">
          <label class="q-mb-sm block">Courier</label>
          <q-input
              v-model="gasto.envio_valija.courier"
              placeholder="Obligatorio"
              disable
              outlined
              dense
          />
        </div>

        <!-- Fotografía Guía -->
        <div class="col-12 col-md-6" v-if="gasto.se_envia_valija">
          <label class="q-mb-sm block">Fotografía Guía</label>
          <selector-imagen
              :imagen="gasto.envio_valija.fotografia_guia"
              disable
              file_extensiones=".jpg, image/*"
          />
        </div>

        <!-- Aqui va el componente de valija -->
        <div class="col-12 rounded-8">
          <essential-table
              v-if="gasto.se_envia_valija"
              :datos="gasto.registros_valijas"
              :configuracion-columnas="configuracionColumnasValijas"
              ajustar-celdas
              disable
              :permitirConsultar="false"
              :permitirEditarCeldas="true"
              :permitirEditar="true"
              permitirEditarModal
              :permitirEliminar="false"
              :altoFijo="false"
              :mostrar-header="false"
              :mostrarFooter="false"
          />
        </div>
      </div>
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
          permitirAnular === true
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
