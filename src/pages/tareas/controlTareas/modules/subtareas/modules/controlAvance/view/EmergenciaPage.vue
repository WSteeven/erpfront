<template>
  <q-page padding>
    <div class="full-width text-bold q-mb-md">Información general</div>
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Regional -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Regional</label>
        <q-select
          v-model="controlAvance.regional"
          :options="regiones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          emit-value
          map-options
          dense
          outlined
        />
      </div>

      <!-- Atenciones -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Atención (URBANO / INTERURBANO)</label>
        <q-select
          v-model="controlAvance.atencion"
          :options="atenciones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          emit-value
          map-options
          dense
          outlined
        />
      </div>

      <!-- Tipo de intervencion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de intervención</label>
        <q-select
          v-model="controlAvance.tipo_intervencion"
          :options="tiposIntervenciones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          use-input
          input-debounce="0"
          :option-label="(item) => item.descripcion"
          :option-value="(item) => item.id"
          emit-value
          map-options
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <!-- Fecha de intervencion -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Causa de intervención</label>
        <q-select
          v-model="controlAvance.causa_intervencion"
          :options="causasIntervencion"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          use-input
          input-debounce="0"
          :option-label="(item) => item.descripcion"
          :option-value="(item) => item.descripcion"
          emit-value
          map-options
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="full-width text-bold q-mb-md">Fechas y horas</div>
      <!-- Fecha del reporte del problema -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de reporte del problema</label>
        <q-input v-model="controlAvance.fecha_reporte_problema" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="controlAvance.fecha_reporte_problema"
                  mask="DD-MM-YYYY"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de reporte de problema (24H)</label>
        <q-input
          v-model="controlAvance.hora_reporte_problema"
          placeholder="Obligatorio"
          mask="time"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon name="bi-clock" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="controlAvance.hora_reporte_problema"
                  format24h
                  now-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Fecha de arribo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de arribo</label>
        <q-input v-model="controlAvance.fecha_arribo" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="controlAvance.fecha_arribo"
                  mask="DD-MM-YYYY"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Hora de arribo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de arribo (24H)</label>
        <q-input
          v-model="controlAvance.hora_arribo"
          placeholder="Obligatorio"
          mask="time"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon name="bi-clock" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="controlAvance.hora_arribo" format24h now-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Fecha de fin reparacion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de fin de reparación</label>
        <q-input v-model="controlAvance.fecha_fin_reparacion" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="controlAvance.fecha_fin_reparacion"
                  mask="DD-MM-YYYY"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Hora fin reparacion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de fin de reparación (24H)</label>
        <q-input
          v-model="controlAvance.hora_fin_reparacion"
          placeholder="Obligatorio"
          mask="time"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon name="bi-clock" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="controlAvance.hora_fin_reparacion"
                  format24h
                  now-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Fecha de retiro de personal -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de retiro de personal</label>
        <q-input v-model="controlAvance.fecha_retiro_personal" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="controlAvance.fecha_retiro_personal"
                  mask="DD-MM-YYYY"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Hora fin reparacion -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Hora de retiro de personal (24H)</label>
        <q-input
          v-model="controlAvance.hora_retiro_personal"
          placeholder="Obligatorio"
          mask="time"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon name="bi-clock" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="controlAvance.hora_retiro_personal"
                  format24h
                  now-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Tiempo de espera adicionales</label>
        <q-input
          v-model="controlAvance.tiempo_espera_adicional"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>

      <div class="col-12 q-mb-sm text-bold">Distancia de la afectación</div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Estación de referencia</label>
        <q-input
          v-model="controlAvance.estacion_referencia"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Distancia</label>
        <q-input
          v-model="controlAvance.distancia"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>
    </div>

    <div>
      <div class="q-mb-md">
        <essential-table
          titulo="Cronología de trabajos realizados"
          :configuracionColumnas="columnasTrabajoRealizado"
          :datos="controlAvance.trabajos_realizados"
          :alto-fijo="false"
          :permitirConsultar="false"
          :permitir-buscar="false"
          :permitirEditarCeldas="true"
          :permitirEditar="$q.screen.xs"
          :permitirEditarModal="$q.screen.xs"
          :mostrarFooter="!controlAvance.trabajos_realizados.length"
          separador="cell"
          :accion1Header="agregarActividadRealizada"
          @eliminar="eliminarTrabajoRealizado"
        ></essential-table>
      </div>
      <!--:accion1Header="agregarActividadRealizada"-->

      <div class="q-mb-md">
        <essential-table
          titulo="Observaciones / Mejoras / Pendientes"
          :configuracionColumnas="columnasObservacion"
          :datos="controlAvance.observaciones"
          :alto-fijo="false"
          :permitirConsultar="false"
          :permitir-buscar="false"
          :permitirEditarCeldas="true"
          :permitirEditar="$q.screen.xs"
          :permitirEditarModal="$q.screen.xs"
          :mostrarFooter="!controlAvance.observaciones.length"
          separador="cell"
          :accion1Header="agregarObservacion"
          @eliminar="eliminarObservacion"
        ></essential-table>
      </div>

      <div class="q-mb-md">
        <essential-table
          titulo="Materiales utilizados"
          :configuracionColumnas="columnasMaterial"
          :datos="materiales"
          :alto-fijo="false"
          :permitirConsultar="false"
          :permitirEliminar="false"
          :permitirEditar="false"
          :mostrar-header="true"
          :permitirEditarModal="true"
          separador="cell"
          :accion1="botonEditarCantidad"
        ></essential-table>
      </div>
    </div>

    <div class="full-width text-bold q-mb-md">Evidencia fotográfica</div>
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Imagen elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"
          >Lecturas del OTDR antes de iniciar los trabajos</label
        >
        <selector-imagen
          :imagen="controlAvance.imagen_lectura_antes"
          @update:modelValue="
            (data) => (controlAvance.imagen_lectura_antes = data)
          "
        >
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"
          >Fotografía del incidente o lugar de afectación</label
        >
        <selector-imagen :imagen="controlAvance.imagen_incidente">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía lecturas de reparación</label>
        <selector-imagen :imagen="controlAvance.imagen_reparacion">
        </selector-imagen>
      </div>
    </div>

    <div class="full-width text-bold q-mb-md">Fotográfia del cableado</div>
    <div class="row q-col-gutter-sm">
      <!-- Imagen elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Punta inicial</label>
        <selector-imagen :imagen="controlAvance.imagen_punta_inicial">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Punta final</label>
        <selector-imagen :imagen="controlAvance.imagen_punta_final">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Evidencia del cableado</label>
        <selector-imagen :imagen="controlAvance.imagen_evidencia_cableado">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Mangas tejidas</label>
        <selector-imagen :imagen="controlAvance.imagen_mangas_tejidas">
        </selector-imagen>
      </div>
    </div>

    <!-- Botones formulario -->
    <div class="row q-gutter-md justify-end">
      <q-btn color="primary" no-caps :to="{ name: 'trabajo_asignado' }" push>
        <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon>
        <div>Volver</div>
      </q-btn>
    </div>
  </q-page>
</template>

<script src="./EmergenciaPage.ts"></script>
