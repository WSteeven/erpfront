<template>
  <q-card>
    <q-card-section>
      <div class="row q-col-gutter-sm q-py-none">
        <!-- Fecha  -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block"
            >Selecciona una fecha para mostrar las coordenadas de las tareas en
            el mapa</label
          >
          <q-input
            v-model="fecha"
            placeholder="Obligatorio"
            readonly
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="fecha" :mask="maskFecha" today-btn>
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <!--Estado -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Estado de tarea</label>
          <q-select
            v-model="estado_tarea"
            :options="estados_tareas"
            options-dense
            dense
            outlined
            multiple
            use-chips
            hint="Obligatorio"
            :option-value="v => v.value"
            :option-label="v => v.label"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <no-option-component />
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">&nbsp;</label>
          <q-btn
            class="full-width"
            color="primary"
            label="Consultar"
            icon="search"
            @click="consultarTareas"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <q-expansion-item
        class="overflow-hidden q-mb-md expansion"
        label="Representación de colores"
        header-class="text-bold bg-header-collapse"
        :default-opened="false"
      >
        <div class="row q-col-gutter-sm q-py-none">
          <div class="col-12 col-md-6 rounded-borders border-grey">
            <label class="q-mb-sm block"
              >Representación de colores según estado</label
            >
            <q-item
              v-for="estado in estado_tarea"
              :key="estado"
              class="q-pa-none"
            >
              <q-item-section>
                <q-chip :color="obtenerColorEstado(estado)">{{
                  estado
                }}</q-chip>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-12 col-md-6 rounded-borders border-grey">
            <label class="q-mb-sm block"
              >Representación de colores según grupo</label
            >
            <q-item
              v-for="grupo in gruposTareas"
              :key="grupo"
              class="q-pa-none"
            >
              <q-item-section avatar>
                <q-avatar :style="{ backgroundColor: grupo.color }" size="xs" />
              </q-item-section>
              <q-item-section>{{ grupo.nombre }}</q-item-section>
              <!--            <q-item-section side top>-->
              <!--              <q-checkbox v-model="grupo.activo" />-->
              <!--            </q-item-section>-->
            </q-item>
          </div>
        </div>
      </q-expansion-item>
    </q-card-section>

    <q-card-section>
      <h5 class="q-my-none">Mapa de Rutas</h5>
    </q-card-section>
    <q-card-section>
      <mapa-rutas
        @crear-subtarea="crearSubtarea"
        :grupos="gruposTareas"
        :tareas-sin-grupo="tareasSinGrupo"
        height="600px"
      />
    </q-card-section>
    <q-card-section></q-card-section>
    <hr />
  </q-card>
  <modales-entidad
      :comportamiento="modales"
      :persistente="true"
      :fullWidth="false"
  ></modales-entidad>
<!--      @guardado="guardado"-->
</template>
<script src="./CuadrillaPage.ts" />
