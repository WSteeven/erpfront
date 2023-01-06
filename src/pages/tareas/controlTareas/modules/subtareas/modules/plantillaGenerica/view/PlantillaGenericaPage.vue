<template>
  <!--<div class="text-bold q-my-md q-ml-md">Plantilla genérica</div>-->
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
      icon="bi-circle"
      :done="done1"
    >
      <ControlAvanceGenericoContent></ControlAvanceGenericoContent>
    </q-step>

    <!--<q-step
      :name="2"
      title="2. Pausas realizadas"
      icon="bi-list-check"
      :done="done2"
    >
      <pausas-realizadas-content></pausas-realizadas-content>
    </q-step> -->

    <q-step
      :name="2"
      title="2. Imágenes adicionales"
      icon="bi-circle"
      :done="done2"
    >
      <imagen-adicional-content></imagen-adicional-content>
    </q-step>

    <q-step
      :name="3"
      title="3. Información adicional"
      icon="bi-circle"
      :done="done3"
    >
      <informacion-adicional-content></informacion-adicional-content>
    </q-step>
  </q-stepper>
</template>

<script src="./PlantillaGenericaPage.ts"></script>

<style lang="scss" scoped>
.my-custom-toggle {
  border: 1px solid #8d8d8d;
}
</style>
