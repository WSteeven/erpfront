<template>
  <basic-container>
    <template #contenido>
      <q-card-section>
        <div class="column items-center justify-center" style="height: 50px">
          <h5>
            <strong>{{ vacante.nombre }}</strong>
          </h5>
        </div>
        <div class="row flex">
          <div class="col col-md-4 col-sm-4 col-xs-6">
            <q-badge outline color="primary">
              <q-icon class="bi-clock-fill" />
              {{
                dayjs() > dayjs(vacante.fecha_caducidad)
                  ? 'Finalizado'
                  : '&nbsp; Finaliza ' + dayjs().to(vacante.fecha_caducidad)
              }}
            </q-badge>
          </div>
          <div class="col col-md-4 col-sm-4 col-xs-6">
            <q-badge outline color="primary">
              <q-icon class="bi-suitcase-lg-fill" />
              &nbsp; {{ vacante.tipo_empleo }}
            </q-badge>
          </div>
          <div class="col col-md-4 col-sm-4 col-xs-6">
            <q-badge outline color="primary">
              <q-icon class="bi-people-fill" />
              &nbsp; Postulantes
              <strong class="q-px-sm">{{ vacante.numero_postulantes }}</strong>
            </q-badge>
          </div>
        </div>
        <div class="text-h6 q-pt-md">Descripción de la oferta</div>
        <div v-html="vacante.descripcion" />
        <div>
          <strong>Experiencia requerida en el cargo:</strong> Mínimo
          {{ vacante.anios_experiencia.toLowerCase() }}
        </div>
        <div class="text-h6 q-pt-sm">Conocimientos requeridos</div>
        <div>
          <ul>
            <li
              v-for="conocimiento of vacante.areas_conocimiento"
              :key="conocimiento"
            >
              {{ conocimiento }}
            </li>
          </ul>
        </div>
        <!-- <div>Creada {{ dayjs(vacante.created_at).fromNow() }}</div> -->
         <div class="row items-center">
            <q-btn class="col-10">Postularme</q-btn>
            <q-btn class="col-2" icon="bi-heart-fill"  color="red" unelevated @click="agregarAFavoritos(vacante.id)"></q-btn>
         </div>
      </q-card-section>
    </template>
  </basic-container>
</template>

<script src="./VisualizarVacantePage.ts" />
