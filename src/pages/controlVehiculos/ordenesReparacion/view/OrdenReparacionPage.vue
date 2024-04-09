<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :tab-options="tabOptionsOrdenesReparaciones"
    :tabDefecto="tabActual"
    :filtrar="filtrarOrdenesReparaciones"
    titulo-pagina="Matriculas de Vehículos"
    ><template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-input
              v-model="orden.vehiculo"
              placeholder="Obligatorio"
              :error="!!v$.vehiculo.$errors.length"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Solicitante -->
          <div
            class="col-12 col-md-3 q-mb-md"
            v-if="accion == acciones.nuevo || orden.solicitante"
          >
            <label class="q-mb-sm block">Chofer que solicita</label>
            <q-input
              v-model="orden.solicitante"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Servicios -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Servicios a realizar</label>
            <q-select
              v-model="orden.servicios"
              :options="servicios"
              options-dense
              clearable
              dense
              outlined
              use-input
              use-chips
              input-debounce="0"
              @filter="filtrarServicios"
              multiple
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
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
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Observación -->
          <div class="col-12">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              autogrow
              v-model="orden.observacion"
              placeholder="Opcional"
              hint="Ingresa alguna observación o novedad presentada en el interior del vehículo"
              outlined
              dense
            ></q-input>
          </div>
        </div>
      </q-form> </template
  ></tab-layout-filter-tabs2>
</template>

<script src="./OrdenReparacionPage.ts" />
