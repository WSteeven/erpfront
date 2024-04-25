<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md-4 q-mb-md">

        <q-card class="q-pa-md">
          <q-card-section>

              <q-form @submit.prevent="agregarEvento">
                <div class="row q-col-gutter-sm q-mb-md">
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                  <q-input v-model="evento.titulo" label="Título" dense outlined required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-select v-model="evento.tipo" label="Tipo de Evento" outlined :options="tiposEvento" dense required /></div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-input v-model="evento.inicio" label="Fecha y Hora de Inicio" type="datetime" dense outlined required /></div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-input v-model="evento.fin" label="Fecha y Hora de Fin" type="datetime" dense outlined required /></div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-input v-model="evento.descripcion" label="Descripción" dense outlined textarea /></div>

                <q-btn type="submit" color="primary" label="Agregar Evento" />
              </div>
              </q-form>


          </q-card-section>
        </q-card>

      </div>
      <div class="col-12 col-md-8 q-mb-md">

        <CalendarioEventos :eventos="eventos"></CalendarioEventos>


      </div>
    </div>
  </q-page>
</template>

<script src="./EventoPage.ts"></script>
