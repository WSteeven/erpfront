<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <p>Aqui va el formulario</p>
      <div class="row">
        <div class="col-12">
          <p>Aqui va el plan de vacaciones</p>
          {{ plan }}
          <p>Info del empleado</p>
          <pre style="white-space: break-spaces">
          {{ JSON.stringify(empleado, null, 2) }}
        </pre
          >
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./PlanVacacionPage.ts" />
