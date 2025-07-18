<template>
  <basic-container>
    <template #contenido>
      <q-card-section>
        <div class="column items-center justify-center">
          <h5 class="text-center text-body1 text-md-h5 text-bold q-mb-sm">
            <strong>{{ vacante.nombre }}</strong>
          </h5>
        </div>
        <div class="row flex">
          <div class="col col-md-3 col-sm-4 col-xs-6">
            <q-badge outline color="primary">
              <q-icon class="bi-clock-fill" />
              {{
                dayjs() > dayjs(vacante.fecha_caducidad)
                  ? 'FINALIZADO'
                  : '&nbsp; FINALIZA ' +
                    dayjs().to(vacante.fecha_caducidad).toUpperCase()
              }}
            </q-badge>
          </div>
          <div class="col col-md-3 col-sm-4 col-xs-6">
            <q-badge outline color="primary">
              <q-icon class="bi-suitcase-lg-fill" />
              &nbsp; {{ vacante.modalidad }}
            </q-badge>
          </div>
          <!-- ciudad -->
          <div class="col col-md-3 col-sm-4 col-xs-6">
            <q-badge outline color="primary">
              <q-icon class="bi-geo-alt-fill" />
              &nbsp; {{ vacante.canton }}
            </q-badge>
          </div>
          <div class="col col-md-3 col-sm-4 col-xs-6">
            <q-badge outline color="primary">
              <q-icon class="bi-people-fill" />
              &nbsp; POSTULANTES
              <strong class="q-px-sm">{{ vacante.numero_postulantes }}</strong>
            </q-badge>
          </div>
          <div
            class="col col-md-3 col-sm-4 col-xs-6 q-py-md"
            v-if="vacante.num_plazas > 1"
          >
            <q-badge outline color="primary">
              <q-icon class="bi-people-fill" />
              &nbsp; PLAZAS DISPONIBLES
              <strong class="q-px-sm">{{ vacante.num_plazas }}</strong>
            </q-badge>
          </div>
        </div>
        <div class="text-h6 q-pt-md">Descripción de la oferta</div>
        <div v-html="vacante.descripcion" />
        <div v-if="vacante.anios_experiencia !== null">
          <strong>Experiencia requerida en el cargo:</strong> Mínimo
          {{ vacante.anios_experiencia?.toLowerCase() }}
        </div>
        <div v-if="vacante.requiere_licencia">
          <strong>Licencia de conducir requerida:</strong> SI
        </div>
        <div v-if="vacante.disponibilidad_viajar">
          <strong>Debe tener disponibilidad de viajar:</strong> SI
        </div>
        <div class="text-subtitle1 text-bold q-pt-sm">
          Conocimientos requeridos
        </div>
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
        <div
          class="text-subtitle1 text-bold q-pt-sm"
          v-if="vacante.requiere_formacion_academica"
        >
          Formación académica requerida
        </div>
        <div
          v-for="formacion of vacante.formaciones_academicas"
          :key="formacion.id"
        >
          <div>
            {{ formacion.nivel }} - {{ formacion.nombre }} O EQUIVALENTE
          </div>
        </div>
        <div class="row q-py-sm" v-if="vacante.rango_edad">
          <q-badge outline color="primary">
            <!--          Edad personalizada -->
            <div class="text-center">
              Edad entre
              <strong> {{ vacante.edad_personalizada.min }}</strong> a
              <strong> {{ vacante.edad_personalizada.max }}</strong>
              años
            </div>
          </q-badge>
        </div>

        <div v-if="vacante.acepta_discapacitados">
          <q-badge outline color="positive">
            <!--              <q-icon class="bi-person-wheelchair" size="sm" />-->
            <span class="material-icons" style="font-size: 20px">blind</span>
            Esta vacante acepta personas discapacitadas
          </q-badge>
        </div>

        <div class="column items-center" v-if="vacante.estado_mi_postulacion">
          <div class="row rounded-4">
            <p>
              Estado de mi postulación:
              <strong>
                &nbsp;
                <q-chip> {{ vacante.estado_mi_postulacion }}</q-chip>
              </strong>
            </p>
          </div>
        </div>
        <div
          class="column items-center q-pt-md"
          v-if="route.name !== 'rrhh_postulaciones'"
        >
          <div class="row" v-if="!vacante.es_completada">
            <q-btn
              v-if="!vacante.ya_postulada"
              glossy
              rounded
              @click="btnPostular(vacante.id)"
              color="primary"
              >Postularme
            </q-btn>
            <q-chip v-else color="primary" text-color="white" icon="bi-check"
              >Ya has postulado a esta vacante
            </q-chip>
            <q-btn
              :icon="vacante.es_favorita ? 'bi-heart-fill' : 'bi-heart'"
              color="red"
              round
              flat
              unelevated
              @click="btnAgregarAFavoritos(vacante.id)"
            ></q-btn>
          </div>
          <div class="row" v-else>
            <q-chip>Esta vacante ya ha sido completada</q-chip>
          </div>
        </div>
      </q-card-section>
    </template>
  </basic-container>
</template>

<script src="./VisualizarVacantePage.ts" />
