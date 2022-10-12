<template>
  <!-- <q-page padding> -->
  <div class="text-h6 q-my-md q-ml-md">Gestionar avances</div>
  <q-stepper
    v-model="step"
    header-nav
    ref="stepper"
    active-color="primary"
    active-icon="bi-check"
    animated
    flat
  >
    <q-step
      :name="1"
      title="1. Control de avance"
      icon="bi-list-check"
      :done="done1"
    >
      <ControlAvanceContent></ControlAvanceContent>
    </q-step>

    <q-step
      :name="2"
      title="2. Pausas realizadas"
      icon="bi-list-check"
      :done="done2"
    >
      <pausas-realizadas-content></pausas-realizadas-content>
    </q-step>

    <q-step
      :name="3"
      title="3. Imágenes adicionales"
      icon="bi-list-check"
      :done="done3"
    >
      <imagen-adicional-content></imagen-adicional-content>
    </q-step>

    <q-step
      :name="4"
      title="4. Información adicional"
      icon="bi-list-check"
      :done="done4"
    >
      <informacion-adicional-content></informacion-adicional-content>
    </q-step>
  </q-stepper>
  <!-- <modales-entidad :comportamiento="modalesSubtarea" /> -->
  <!-- </q-page> -->
</template>

<script src="./GestionarAvancesPage.ts"></script>

<style lang="scss" scoped>
.my-custom-toggle {
  border: 1px solid #8d8d8d;
}
</style>
