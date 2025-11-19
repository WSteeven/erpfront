<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    :filtrar="filtrarListado"
    :tab-defecto="currentTab"
    :tab-options="tabOptions"
    :accion1="btnGenerarDescuento"
    ajustarCeldas
    :mostrar-formulario="true"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <!-- Identificación -->
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Identificación</label>
            <q-input
              v-model="empleado.identificacion"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Nombres -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Nombres</label>
            <q-input
              v-model="empleado.nombres"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>
          <!-- Apellidos -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Apellidos</label>
            <q-input
              ref="refApellidos"
              v-model="empleado.apellidos"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./HoraPendientePage.ts" />
