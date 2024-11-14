<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Descuentos a Empleados"
    :tab-options="tabOptions"
    ajustar-celdas
    :tab-defecto="tabDefecto"
    :filtrar="filtrar"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Empleados -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="descuento.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.empleado.$errors.length"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
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
          <!-- Descuentos Generales -->
          <div class="col-12 col-md-3 col-sm-4">
            <label class="q-mb-sm block">Tipo Descuento</label>
            <q-select
              v-model="descuento.tipo_descuento"
              :options="descuentos_generales"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              :disable="disabled"
              outlined
              use-input
              input-debounce="0"
              @update:model-value="()=> descuento.multa=null"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
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
          <!-- Multa -->
          <div class="col-12 col-md-3 col-sm-4">
            <label class="q-mb-sm block">Multa</label>
            <q-select
              v-model="descuento.multa"
              :options="multas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              :disable="disabled"
              outlined
              use-input
              input-debounce="0"
              @update:model-value="()=> descuento.tipo_descuento=null"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
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
          <!-- Fecha -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Fecha del descuento</label>
            <q-input
              v-model="descuento.fecha_descuento"
              placeholder="Obligatorio"
              :error="!!v$.fecha_descuento.$errors.length"
              :disable="disabled"
              @blur="v$.fecha_descuento.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="descuento.fecha_descuento"
                      :mask="maskFecha"
                      today-btn
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
                  v-for="error of v$.fecha_descuento.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Valor  -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Valor </label>
            <q-input
              v-model="descuento.valor"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor.$errors.length"
              @blur="v$.valor.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Descripcion -->
          <div class="col-12">
            <div class="row justify-between">
              <label class="q-mb-sm block">Descripción</label>
            </div>
            <essential-editor
              v-model="descuento.descripcion"
              :disable="disabled"
              :barra-herramientas="barraDefault"
            >
            </essential-editor>
            <div
              v-for="error of v$.descripcion.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>{{ error.$message }}</small>
            </div>
          </div>

          <!-- Mes que inicia el cobro -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Mes inicia cobro</label>
            <q-input
              v-model="descuento.mes_inicia_cobro"
              mask="####-##"
              placeholder="Obligatorio"
              :error="!!v$.mes_inicia_cobro.$errors.length"
              :disable="disabled"
              @blur="v$.mes_inicia_cobro.$touch"
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
                      v-model="descuento.mes_inicia_cobro"
                      minimal
                      :mask="maskFecha"
                      emit-immediately
                      default-view="Years"
                      @update:model-value="checkMes"
                    >
                      <!--                      default-view="Years"-->
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
                  v-for="error of v$.mes_inicia_cobro.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Cantidad de cuotas  -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Cantidad Cuotas </label>
            <q-input
              v-model="descuento.cantidad_cuotas"
              placeholder="Obligatorio"
              type="number"
              :disable="accion !== acciones.nuevo"
              :error="!!v$.cantidad_cuotas.$errors.length"
              @blur="v$.valor.$touch"
              @update:model-value="calcularCantidadCuotas"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.cantidad_cuotas.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- pagado -->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">Pagado</label>
            <q-toggle
              :label="descuento.pagado ? 'SI' : 'NO'"
              v-model="descuento.pagado"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              disable
            />
          </div>

          <!--          {{ v$.$errors }}-->

          <div class="col-12" v-if="descuento.cuotas.length > 0">
            <essential-table
              titulo="Cuotas a Pagar"
              :datos="descuento.cuotas"
              :configuracion-columnas="
                accion == acciones.editar
                  ? [...configuracionColumnasCuotasDescuento, accionesTabla]
                  : configuracionColumnasCuotasDescuento
              "
              ajustar-celdas
              desplegar-desde="3"
              :accion1="btnPagarCuota"
              :accion2="btnComentarioCuota"
              :accion3="btnAplazarCuota"
              :altoFijo="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./DescuentoPage.ts"></script>
