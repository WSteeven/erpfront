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
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Razón social</label>
          <q-input
            disable
            dense
            outlined
            v-model:model-value="proveedor.razon_social"
          />
        </div>
        <!-- sucursal -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Sucursal</label>
          <q-input
            disable
            dense
            outlined
            v-model:model-value="proveedor.sucursal"
          />
        </div>
        <!-- direccion -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            disable
            dense
            outlined
            v-model:model-value="proveedor.direccion"
          />
        </div>
        <!-- tipos que ofrece -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Ofrece</label>
          <q-select
            disable
            dense
            outlined
            v-model="proveedor.tipos_ofrece"
            :options="ofertas"
            multiple
            use-chips
            :option-label="(v) => v.nombre"
            :option-value="(v) => v.id"
            map-options
          />
        </div>
      </div>
    </q-expansion-item>
    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      done-color="positive"
      active-color="primary"
      inactive-color="gray"
    >
      <q-step
        :name="1"
        title="Configura los parametros a calificar"
        caption="Ten en cuenta lo que ofrece el proveedor"
        icon="settings"
        :done="step > 1"
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12 col-md-12">
            <q-table
              title="Criterios disponibles"
              :columns="columnasCriterios"
              :rows="criterios"
              row-key="id"
              dense
              :pagination="initialPagination"
              bordered
              selection="multiple"
              v-model:selected="seleccionados"
              @selection="criterioSeleccionado"
            />
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Criterios de bienes"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- tabla de criterios de bienes -->
          <div class="col-12 col-md-12">
            <essential-table
              titulo="Criterios de bienes"
              :configuracionColumnas="[
                ...columnasCriteriosConPeso,
                accionesTabla,
              ]"
              :datos="criteriosBienes"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarFooter="true"
              :altoFijo="false"
              :accion1="botonEditarCantidadCriterioBien"
              :accion2="botonEliminarCriterioBien"
            >
            </essential-table>
          </div>
        </div>
      </q-step>

      <q-step
        :name="3"
        title="Criterios de Servicios"
        icon="add_comment"
        :done="step > 3"
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- tabla de criterios de servicios -->
          <div class="col-12 col-md-12">
            <essential-table
              titulo="Criterios de servicios"
              :configuracionColumnas="[
                ...columnasCriteriosConPeso,
                accionesTabla,
              ]"
              :datos="criteriosServicios"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarFooter="true"
              :altoFijo="false"
              :accion1="botonEditarCantidadCriterioServicio"
              :accion2="botonEliminarCriterioServicio"
            >
            </essential-table>
          </div>
          <!-- <div v-else><q-icon class="bi-warning"></q-icon><p>aqui va la calificacion</p></div> -->
        </div>
      </q-step>
      <q-step
        :name="4"
        title="Otorga una calificación"
        icon="bi-plus"
        :done="step > 4"
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <p>aqui va la calificacion</p>
          <div class="col-12 col-md-12">
            <essential-table
              titulo="Criterios de bienes"
              :configuracionColumnas="[
                ...columnasCriteriosConCalificacion,
                accionesTabla,
              ]"
              :datos="criteriosBienes"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarFooter="true"
              :altoFijo="false"
              :accion1="botonCalificarCriterioBien"
            >
            </essential-table>
          </div>
          <div class="col-12 col-md-12">
            <essential-table
              titulo="Criterios de servicios"
              :configuracionColumnas="[
                ...columnasCriteriosConCalificacion,
                accionesTabla,
              ]"
              :datos="criteriosServicios"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarFooter="true"
              :altoFijo="false"
              :accion1="botonCalificarCriterioBien"
            >
            </essential-table>
          </div>
        </div>
      </q-step>
      <q-step
        :name="5"
        title="Resúmen"
        caption="Resultados de tu calificación y valoración global"
        icon="bi-plus-circle"
      >
      <q-card>
        <div class="col-12 justify-center">Tu calificación para el proveedor es: <h4>{{ resultadosCalificacion.calificacion }}</h4></div>
        Fecha de calificación: <q-chip >{{ resultadosCalificacion.fecha_calificacion }}</q-chip>
      </q-card>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="step<5"
            @click="botonNext"
            color="primary"
            :label="step === 4 ? 'Finalizar' : 'Continuar'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
  <!-- Modal de seleccion de detalles -->
  <essential-selectable-table
    ref="refListado"
    :configuracion-columnas="columnasCriterios"
    :datos="criterios"
    tipo-seleccion="multiple"
    @selected="seleccionarCriterio"
  ></essential-selectable-table>
</template>

<script src="./CalificacionProveedorPage.ts" />
