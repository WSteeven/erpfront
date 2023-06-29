<template>
  <div class="q-pa-md">
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
        icon="settings"
        :done="step > 1"
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          {{ proveedor }}
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
              :option-label="(v)=>v.nombre" 
              :option-value="(v)=>v.id" 
              map-options
            />
          </div>
          <div class="col-12 col-md-12">
            <q-table
              :rows="criterios"
              row-key="id"
              dense
              :pagination="initialPagination"
              bordered
              selection="multiple"
              v-model:selected="selected"
              @selection="criterioSeleccionado"
            >
            </q-table>
          </div>
          <!-- tabla de criterios de bienes -->
          <div class="col-12 col-md-12" v-if="criteriosBienes.length>0">
            <q-table
            title="Criterios de bienes"
            :rows="criteriosBienes"
            row-key="id"
            dense bordered
            />
            <div class="q-mt-md">Selected: {{ JSON.stringify(criteriosBienes) }}</div>
          </div>
          <!-- tabla de criterios de servicios -->
          <div class="col-12 col-md-12" v-if="criteriosServicios.length>0">
            <q-table
            title="Criterios de servicios"
            :rows="criteriosServicios"
            row-key="id"
            dense bordered
            />
          </div>
          <div class="q-mt-md">Selected: {{ JSON.stringify(criteriosServicios) }}</div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Otorga una calificación"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Calificar y finalizar" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepper.next()"
            color="primary"
            :label="step === 3 ? 'Finish' : 'Continue'"
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
