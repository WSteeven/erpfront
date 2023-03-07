<template>
  <q-page padding>
    <div class="full-width text-bold q-mb-md">Información general</div>
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Regional -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Regional</label>
        <q-select
          v-model="emergencia.regional"
          :options="regiones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          emit-value
          map-options
          dense
          outlined
          :error="!!v$.regional.$errors.length"
          @blur="v$.regional.$touch"
        >
          <template v-slot:error>
            <div v-for="error of v$.regional.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Atenciones -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Atención (URBANO / INTERURBANO)</label>
        <q-select
          v-model="emergencia.atencion"
          :options="atenciones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          emit-value
          map-options
          dense
          outlined
          :error="!!v$.atencion.$errors.length"
          @blur="v$.atencion.$touch"
        >
          <template v-slot:error>
            <div v-for="error of v$.atencion.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Tipo de intervencion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de intervención</label>
        <q-select
          v-model="emergencia.tipo_intervencion"
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
          :error="!!v$.tipo_intervencion.$errors.length"
          @blur="v$.tipo_intervencion.$touch"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:error>
            <div
              v-for="error of v$.tipo_intervencion.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Causa de intervencion -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Causa de intervención</label>
        <q-select
          v-model="emergencia.causa_intervencion"
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
          :error="!!v$.causa_intervencion.$errors.length"
          @blur="v$.causa_intervencion.$touch"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>

          <template #error>
            <div
              v-for="error of v$.causa_intervencion.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <div class="full-width text-bold q-mb-md">Fechas y horas</div>

      <!-- Fecha del reporte del problema -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de reporte del problema</label>
        <q-input
          v-model="emergencia.fecha_reporte_problema"
          outlined
          dense
          :error="!!v$.fecha_reporte_problema.$errors.length"
          @blur="v$.fecha_reporte_problema.$touch"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="emergencia.fecha_reporte_problema"
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

          <template #error>
            <div
              v-for="error of v$.fecha_reporte_problema.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Hora reporte problema -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de reporte de problema (24H)</label>
        <q-input
          v-model="emergencia.hora_reporte_problema"
          type="time"
          stack-label
          outlined
          dense
          :error="!!v$.hora_reporte_problema.$errors.length"
          @blur="v$.hora_reporte_problema.$touch"
        >
          <template #error>
            <div
              v-for="error of v$.hora_reporte_problema.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha de arribo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de arribo</label>
        <q-input
          v-model="emergencia.fecha_arribo"
          outlined
          dense
          :error="!!v$.fecha_arribo.$errors.length"
          @blur="v$.fecha_arribo.$touch"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="emergencia.fecha_arribo"
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

          <template #error>
            <div v-for="error of v$.fecha_arribo.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Hora de arribo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de arribo (24H)</label>
        <q-input
          v-model="emergencia.hora_arribo"
          type="time"
          stack-label
          outlined
          dense
          :error="!!v$.hora_arribo.$errors.length"
          @blur="v$.hora_arribo.$touch"
        >
          <template #error>
            <div v-for="error of v$.hora_arribo.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha de fin reparacion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de fin de reparación</label>
        <q-input
          v-model="emergencia.fecha_fin_reparacion"
          outlined
          dense
          :error="!!v$.fecha_fin_reparacion.$errors.length"
          @blur="v$.fecha_fin_reparacion.$touch"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="emergencia.fecha_fin_reparacion"
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

          <template #error>
            <div
              v-for="error of v$.fecha_fin_reparacion.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Hora fin reparacion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de fin de reparación (24H)</label>
        <q-input
          v-model="emergencia.hora_fin_reparacion"
          type="time"
          stack-label
          outlined
          dense
          :error="!!v$.hora_fin_reparacion.$errors.length"
          @blur="v$.hora_fin_reparacion.$touch"
        >
          <template #error>
            <div
              v-for="error of v$.hora_fin_reparacion.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Fecha de retiro de personal -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de retiro de personal</label>
        <q-input
          v-model="emergencia.fecha_retiro_personal"
          outlined
          dense
          :error="!!v$.fecha_retiro_personal.$errors.length"
          @blur="v$.fecha_retiro_personal.$touch"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="emergencia.fecha_retiro_personal"
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

          <template #error>
            <div
              v-for="error of v$.fecha_retiro_personal.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Hora retiro personal -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de retiro de personal (24H)</label>
        <q-input
          v-model="emergencia.hora_retiro_personal"
          type="time"
          stack-label
          outlined
          dense
          :error="!!v$.hora_retiro_personal.$errors.length"
          @blur="v$.hora_retiro_personal.$touch"
        >
          <template #error>
            <div
              v-for="error of v$.hora_retiro_personal.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Tiempo de espera adicional -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Tiempo de espera adicionales</label>
        <q-input
          v-model="emergencia.tiempo_espera_adicional"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>

      <div class="col-12 q-mb-sm text-bold">Distancia de la afectación</div>

      <!-- Estación de referencia -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Estación de referencia</label>
        <q-input
          v-model="emergencia.estacion_referencia"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Distancia -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Distancia</label>
        <q-input
          v-model="emergencia.distancia_afectacion"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>
    </div>

    <div>
      <div class="q-mb-md">
        <essential-table
          ref="refTrabajos"
          titulo="Cronología de trabajos realizados"
          :configuracionColumnas="columnasTrabajoRealizado"
          :datos="emergencia.trabajo_realizado"
          :alto-fijo="false"
          :permitirConsultar="false"
          :permitir-buscar="false"
          :permitirEditarModal="true"
          :mostrarFooter="!emergencia.trabajo_realizado.length"
          separador="cell"
          :accion1Header="agregarActividadRealizada"
          @eliminar="eliminarTrabajoRealizado"
          :modalMaximized="$q.screen.xs"
        ></essential-table>
      </div>

      <div class="q-mb-md">
        <essential-table
          ref="refObservaciones"
          titulo="Observaciones / Mejoras / Pendientes"
          :configuracionColumnas="columnasObservacion"
          :datos="emergencia.observaciones"
          :alto-fijo="false"
          :permitirConsultar="false"
          :permitir-buscar="false"
          :permitirEditarModal="true"
          :mostrarFooter="!emergencia.observaciones.length"
          separador="cell"
          :accion1Header="agregarObservacion"
          @eliminar="eliminarObservacion"
          :modalMaximized="$q.screen.xs"
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
          :mostrar-footer="false"
          :permitirEditarModal="true"
          separador="cell"
          :accion1="botonEditarCantidad"
        ></essential-table>
      </div>

      <div class="q-mb-md">
        <tabla-devolucion-producto
          :listado="emergencia.materiales_devolucion"
          :listadoProductos="listadosAuxiliares.productos"
          @actualizar="(data) => (emergencia.materiales_devolucion = data)"
          :alto-fijo="false"
          :mostrarFooter="!emergencia.materiales_devolucion.length"
        >
        </tabla-devolucion-producto>
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
          :imagen="emergencia.imagen_lectura_antes"
          @update:modelValue="
            (data) => (emergencia.imagen_lectura_antes = data)
          "
        >
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"
          >Fotografía del incidente o lugar de afectación</label
        >
        <selector-imagen :imagen="emergencia.imagen_incidente">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía lecturas de reparación</label>
        <selector-imagen :imagen="emergencia.imagen_reparacion">
        </selector-imagen>
      </div>
    </div>

    <div class="full-width text-bold q-mb-md">Fotográfia del cableado</div>
    <div class="row q-col-gutter-sm">
      <!-- Imagen elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Punta inicial</label>
        <selector-imagen :imagen="emergencia.imagen_punta_inicial">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Punta final</label>
        <selector-imagen :imagen="emergencia.imagen_punta_final">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Evidencia del cableado</label>
        <selector-imagen :imagen="emergencia.imagen_evidencia_cableado">
        </selector-imagen>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Mangas tejidas</label>
        <selector-imagen :imagen="emergencia.imagen_mangas_tejidas">
        </selector-imagen>
      </div>
    </div>

    <button-submits
      :accion="accion"
      @cerrar-modal="emit('cerrar-modal')"
      @cancelar="reestablecer()"
      @editar="editar(emergencia)"
      @guardar="guardar(emergencia)"
    />

    <!-- Botones formulario -->
    <!-- <div class="row q-gutter-md justify-end">
      <q-btn color="primary" no-caps :to="{ name: 'trabajo_asignado' }" push>
        <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon>
        <div>Volver</div>
      </q-btn>
    </div> -->
  </q-page>
</template>

<script src="./EmergenciaPage.ts"></script>
