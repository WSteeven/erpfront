<template>
  <div class="q-pa-md">
    <q-expansion-item
      class="overflow-hidden q-mb-md expansion"
      label="Información del proveedor"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-sm">
        <!-- razon social -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Razón social</label>
          <q-input
            disable
            dense
            outlined
            v-model:model-value="proveedor.razon_social"
          />
        </div>
        <!-- sucursal -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Sucursal</label>
          <q-input
            disable
            dense
            outlined
            v-model:model-value="proveedor.sucursal"
          />
        </div>
        <!-- direccion -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            disable autogrow
            dense
            outlined
            v-model:model-value="proveedor.direccion"
          />
        </div>
        <!-- tipos que ofrece -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Ofrece</label>
          <q-select
            disable
            dense
            outlined
            v-model="proveedor.tipos_ofrece"
            :options="ofertas"
            multiple
            use-chips
            :option-label="v => v.nombre"
            :option-value="v => v.id"
            map-options
          />
        </div>
      </div>
    </q-expansion-item>
    <q-stepper
      v-model="step"
      ref="stepper"
      :vertical="$q.screen.xs || $q.screen.sm"
      animated
      alternative-labels
      done-color="positive"
      active-color="primary"
      inactive-color="gray"
    >
      <!--            Paso 1-->
      <q-step
        title="Configura los criterios a calificar"
        :name="1"
        icon="settings"
        :done="step > 1"
      >
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-12">
            <q-table
              title="Criterios disponibles"
              :columns="columnasCriterios"
              :rows="criterios"
              row-key="id"
              dense
              :pagination="initialPagination"
              bordered
              wrap-cells
              selection="multiple"
              v-model:selected="seleccionados"
              @selection="criterioSeleccionado"
            />
          </div>
        </div>
      </q-step>

      <!--        Criterios de bienes -->
      <q-step
        :name="2"
        :disable="criteriosBienes.length == 0"
        title="Criterios de bienes"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="row q-col-gutter-sm">
          <!-- tabla de criterios de bienes -->
          <div class="col-12 col-md-12">
            <essential-table
              titulo="Criterios de bienes"
              :configuracionColumnas="[
                ...columnasCriteriosConPeso,
                accionesTabla
              ]"
              :datos="criteriosBienes"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarFooter="true"
              ajustarCeldas
              :altoFijo="false"
              :accion1="btnEditarCantidadCriterioBien"
              :accion2="btnEliminarCriterioBien"
            >
            </essential-table>
          </div>
        </div>
      </q-step>

      <q-step
        :name="3"
        :disable="criteriosServicios.length == 0"
        title="Criterios de Servicios"
        icon="add_comment"
        :done="step > 3"
      >
        <div class="row q-col-gutter-sm">
          <!-- tabla de criterios de servicios -->
          <div class="col-12 col-md-12">
            <essential-table
              titulo="Criterios de servicios"
              :configuracionColumnas="[
                ...columnasCriteriosConPeso,
                accionesTabla
              ]"
              :datos="criteriosServicios"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarFooter="true"
              :altoFijo="false"
              ajustarCeldas
              :accion1="btnEditarCantidadCriterioServicio"
              :accion2="btnEliminarCriterioServicio"
            >
            </essential-table>
          </div>
        </div>
      </q-step>

      <!--        Paso Calificar -->
      <q-step
        :name="4"
        title="Otorga una calificación"
        icon="bi-plus"
        :done="step > 4"
      >
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-12" v-if="criteriosBienes.length > 0">
            <essential-table
              titulo="Criterios de bienes"
              :configuracionColumnas="[
                ...columnasCriteriosConCalificacion,
                accionesTabla
              ]"
              :datos="criteriosBienes"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :permitirBuscar="false"
              :mostrarFooter="false"
              :mostrarCantidadElementos="false"
              :altoFijo="false"
              ajustarCeldas
              :accion1="btnCalificarCriterioBien"
            >
            </essential-table>
          </div>
          <div class="col-12 col-md-12" v-if="criteriosServicios.length > 0">
            <essential-table
              titulo="Criterios de servicios"
              :configuracionColumnas="[
                ...columnasCriteriosConCalificacion,
                accionesTabla
              ]"
              :datos="criteriosServicios"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :permitirBuscar="false"
              :mostrarCantidadElementos="false"
              :mostrarFooter="false"
              :altoFijo="false"
              ajustarCeldas
              :accion1="btnCalificarCriterioServicio"
            >
            </essential-table>
          </div>
          <!-- carga de archivos de soporte -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              :mixin="mixin"
              :disable="disabled"
              :permitir-eliminar="true"
              :idModelo="idDetalleDepartamentoProveedor"
              @inicializado="cargarArchivos"
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
                  <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                  Subir archivos seleccionados
                </q-btn>
              </template>
            </gestor-archivos>
          </div>
        </div>
      </q-step>

      <!--        Paso ver calificación otorgada -->
      <q-step
        :name="5"
        title="Resúmen"
        caption="Valoración global del proveedor"
        icon="bi-plus-circle"
      >
        <q-card class="q-pa-sm">
          <div class="col-12 justify-center">
            Tu calificación para el proveedor es:
            <h4>{{ resultadosCalificacion.calificacion }}/100</h4>
          </div>
          Fecha de calificación:
          <q-chip>{{ resultadosCalificacion.fecha_calificacion }}</q-chip>
        </q-card>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="botonNext"
            color="primary"
            :label="step === 5 ? 'Finalizar' : 'Continuar'"
          />
          <q-btn
            v-if="step > 1 && step < 5"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Anterior"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script src="./RecalificacionProveedorPage.ts" />
