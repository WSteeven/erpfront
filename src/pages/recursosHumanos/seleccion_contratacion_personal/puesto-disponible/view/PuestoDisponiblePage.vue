<template>
  <q-page >
    <div class="row q-col-gutter-sm  q-my-sm flex flex-center ">
      <q-card class="col-12 col-md-4 q-my-md  q-mx-md " v-for="puesto_trabajo of puestos_trabajos" :key="puesto_trabajo.id" :class="{'puesto-card':$q.screen.md||$q.screen.lg||$q.screen.xl}" flat bordered>
        <q-card-section>
          <div class="text-h5 q-mt-sm q-mb-xs text-center text-bold">{{ puesto_trabajo.nombre }}</div>
        </q-card-section>
        <q-card-section horizontal>
          <q-card-section class="col-5 flex flex-center">
            <q-img
              class="rounded-borders"
              loading="lazy"
              :src="puesto_trabajo.imagen_referencia"
            />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-caption text-grey text-justify">
             {{puesto_trabajo.descripcion_vacante  }}
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-actions class="flex justify-center centers">
          <q-btn flat icon="bi-clock">
            <p class="q-mx-sm q-my-sm">{{ puesto_trabajo.tiempo_caducidad }}</p>
          </q-btn>
          <q-btn flat icon="bi-suitcase-lg-fill">
            <p class="q-mx-sm q-my-sm">{{ puesto_trabajo.tipo_empleo }}</p></q-btn
          >
          <q-btn flat icon="bi-people-fill">
            <p class="q-mx-sm q-my-sm">Postulantes</p>
            <span class="q-mx-sm">{{ puesto_trabajo.numero_postulantes }}</span></q-btn
          >
        </q-card-actions>
      </q-card>

    </div>
  </q-page>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./PuestoDisponiblePage.ts"></script>

<style  scoped>
.puesto-card{
  width: 30%;
}

</style>
