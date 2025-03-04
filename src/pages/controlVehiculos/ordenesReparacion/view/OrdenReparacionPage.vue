<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :tab-options="tabOptionsOrdenesReparaciones"
    :tabDefecto="tabActual"
    :permitirEditar="visibleParaAdmin"
    :accion1="btnValorReparacion"
    :filtrar="filtrarOrdenesReparaciones"
    titulo-pagina="Matriculas de Vehículos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Solicitante -->
          <div
            class="col-12 col-md-4 q-mb-md"
            v-if="accion == acciones.nuevo || orden.solicitante"
          >
            <label class="q-mb-sm block">Chofer que solicita</label>
            <q-select
              v-model="orden.solicitante"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              @filter="filtrarEmpleados"
              :option-label="item => item.apellidos + ' ' + item.nombres"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Vehiculo -->
          <!-- <div class="col-12 col-md-3 q-mb-md" v-if="!store.esMecanicoGeneral">
            <label class="q-mb-sm block">Vehículo</label>
            <q-input
              v-model="orden.vehiculo"
              placeholder="Obligatorio"
              :error="!!v$.vehiculo.$errors.length"
              disable
              outlined
              dense
            ></q-input>
          </div> -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="orden.vehiculo"
              :options="vehiculos"
              hint="Agregue elementos desde el panel de vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              :option-label="item => item.placa"
              :option-value="item => item.id"
              :error="!!v$.vehiculo.$errors.length"
              @blur="v$.vehiculo.$touch"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.marca + ' ' + scope.opt.modelo }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
              <template v-slot:error>
                <error-component clave="vehiculo" :v$="v$" />
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarVehiculos">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="orden.fecha"
              autogrow
              :disable="disabled"
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
                      v-model="orden.fecha"
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
            </q-input>
          </div>

          <!-- Select autorizacion -->
          <div
            v-if="orden.autorizacion"
            class="col-12 col-md-4 q-mb-md q-pt-none"
          >
            <q-chip
              color="light-green-2"
              class="text-positive text-bold q-mb-xs"
              >Autorización
            </q-chip>
            <q-select
              v-model="orden.autorizacion"
              :options="autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || orden.autorizador !== store.user.id"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- valor_reparacion -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Valor de Reparación</label>
            <q-input
              type="number"
              v-model="orden.valor_reparacion"
              placeholder="Opcional"
              hint="Puedes completar este valor luego de la aprobación del registro"
              outlined
              :disable="disabled"
              dense
            />
          </div>

          <!-- Servicios -->
          <div class="col-12 col-md-12 q-mb-md">
            <label class="q-mb-sm block">Servicios a realizar</label>
            <q-select
              v-model="orden.servicios"
              :options="servicios"
              options-dense
              clearable
              dense
              :disable="disabled"
              outlined
              use-input
              use-chips
              hint="Si el servicio a realizar no está en esta lista, por favor escribirlo en la observación"
              input-debounce="0"
              @filter="filtrarServicios"
              multiple
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.tipo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Observación -->
          <div class="col-12">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              autogrow
              v-model="orden.observacion"
              :error="!!v$.observacion.$errors.length"
              placeholder="Obligatorio"
              hint="Ingresa alguna observación o novedad presentada en el interior del vehículo"
              outlined
              :disable="disabled"
              dense
            >
              <template v-slot:error>
                <error-component clave="observacion" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Evidencia fotográfica"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idOrden"
            >
              <template #boton-subir>
                <q-btn
                  v-if="false"
                  color="positive"
                  push
                  no-caps
                  class="full-width q-mb-lg"
                  @click="subirArchivos()"
                >
                  <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                  Subir archivos seleccionados
                </q-btn>
              </template>
            </gestor-archivos>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./OrdenReparacionPage.ts" />
