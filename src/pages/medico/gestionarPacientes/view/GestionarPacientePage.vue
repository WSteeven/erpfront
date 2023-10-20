<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :permitir-editar="false"
  >
    <template #formulario>
      <detalle-paciente
        v-if="empleado.id"
        :empleado="empleado"
      ></detalle-paciente>
    </template>
  </tab-layout>

  <!-- <modales-entidad
    :comportamiento="modales"
    @guardado="(data) => guardado(data)"
    :mixin-modal="mixinFamiliares"
  ></modales-entidad> -->
</template>

<script src="./GestionarPacientePage.ts" />
