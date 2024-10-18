<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md expansion"
        label="Información del Empleado"
        header-class="text-bold bg-header-collapse"
        default-opened
      >
        <template v-slot:header="scope">
          {{ !scope.expanded ?'Empleado: '+ empleado.nombres + ' ' + empleado.apellidos : 'Información del Empleado'}}
        </template>
        <div class="row q-pa-sm">
          <empleado-info-page alto="200px" />
        </div>
      </q-expansion-item>

      <q-expansion-item v-for="vacacion of vacaciones" :key="vacacion.id"
        class="overflow-hidden q-mb-md expansion"
        :label="'Período '+vacacion.periodo"
        header-class="text-bold bg-header-collapse"
        default-opened
      >

        <div class="row q-pa-sm">
          {{vacacion}}
        </div>
      </q-expansion-item>

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12 col-md-3">
          <p>Aqui va el plan de vacaciones</p>
          {{ plan }}
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./PlanVacacionPage.ts" />
