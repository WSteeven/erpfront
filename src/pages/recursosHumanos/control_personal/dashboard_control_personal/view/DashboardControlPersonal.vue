<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
          Análisis de datos: Módulo de Control de Personal
        </div>
        <!-- Tiempos -->
        <div class="row q-col-gutter-sm">
          <iframe
            title="Dashboard de Tareas de Técnicos"
            :width="$q.screen.width"
            :height="$q.screen.height"
            src="https://app.powerbi.com/view?r=eyJrIjoiMTMwNWQxOTUtMDM3Zi00ZTIwLWIxOTktMDI3M2E5MDBmYmY3IiwidCI6IjhiODI2NjQwLTRkZTQtNDEyOS04MWNlLTU3NjE0MTIwZjAwMCIsImMiOjR9"
            frameborder="0"
            allowFullScreen="true"
          ></iframe>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./DashboardControlPersonal.ts" />
