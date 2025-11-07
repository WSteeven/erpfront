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

        <div class="col-12 col-md-2 ">
          <label class="q-mb-sm block">&nbsp;</label>
          <q-btn
            class="full-width"
            color="primary"
            label="Consultar"
            icon="search"
            @click="consultarTareas"
          />
        </div>
        <div class="col-12 col-md-2 rounded-borders border-grey " >
          <label class="q-mb-sm block">Representación de colores según estado</label>
          <q-item
            v-for="estado in estado_tarea"
            :key="estado"
            class="q-pa-none"
          >
            <q-item-section><q-chip :color="obtenerColorEstado(estado)">{{estado}}</q-chip> </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-sm q-py-none">
        <div class="col-12 col-md-2 rounded-borders border-grey " >
          <label class="q-mb-sm block">Representación de colores según grupo</label>
          <q-item
              v-for="grupo in grupos" :key="grupo"
              class="q-pa-none"
          >
            <q-item-section avatar>
              <q-avatar :style="{ backgroundColor: obtenerColorGrupo(grupo.id) }" size="xs" />
            </q-item-section>
            <q-item-section>{{grupo.nombre_alternativo}} </q-item-section>
            <q-item-section side top>
              <q-checkbox v-model="grupo.activo" />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
<!--    {{rutas}}-->
<!--      {{JSON.stringify(gruposConVehiculos, null, 2)}}-->
      {{gruposConVehiculos}}
    <q-card-section>
      <mapa-base ref="mapaRef" height="600px" @map-ready="onMapReady" />
      <rutas-dinamicas :map="map" :grupos="gruposConVehiculos" />
    </q-card-section>
    <q-card-section v-if="false">
      <div class="row rounded-borders q-py-none">
        <rutas-mapa :rutas="rutas" />
        <!-- Mapa -->
        <div class="col-12">
          <label class="q-mb-sm block">Mapa</label>
          <mapa-component
            ref="refMapa"
            :autoFit="false"
            :puntos="puntosMapa"
            :rutas="rutas"
            :height="alturaMapa"
            @punto-click="seleccionarPunto"
            :punto-seleccionado="puntoSeleccionado"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script src="./CuadrillaPage.ts" />
