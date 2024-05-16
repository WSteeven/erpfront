<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" >
      <q-card-section >
        <h5 class="fw-bold text-center">Nombre de Puesto</h5>
      </q-card-section>
      <q-card-section horizontal>
        <q-img class="col-6"  src="https://cdn.quasar.dev/img/parallax1.jpg" />
        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="flex justify-center centers">
        <q-btn flat icon="bi-clock"> <p class="q-mx-sm q-my-sm">Hace un día</p> </q-btn>
        <q-btn flat icon="bi-suitcase-lg-fill"> <p class="q-mx-sm q-my-sm">Tiempo Completo</p></q-btn>
        <q-btn flat icon="bi-people-fill"> <p class="q-mx-sm q-my-sm">Postulantes</p> <span class="q-mx-sm">10</span></q-btn>
      </q-card-actions>
    </q-card>
    </div>
  </q-page>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./PuestoAplicadoPage.ts"></script>
<style  scoped>
.my-card{
  height: 415px ;
/*  width: 30%;
  max-width: 100%*/
}
</style>
