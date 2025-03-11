<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <div class="row q-col-gutter-sm q-mb-lg">
        <div class="col-12 text-pdrimary text-bold q-py-sm q-my-sm">
          <q-icon name="bi-x-diamond" class="q-mr-sm" color="primary"></q-icon>
          Registro de la actividad
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha y hora de inicio</label>
          <q-input
            v-model="actividad.fecha_hora_inicio"
            outlined
            disable
            dense
          />
        </div>

        <!-- <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha y hora de fin</label>
          <q-input v-model="actividad.fecha_hora_fin" outlined disable dense />
        </div> -->

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo de evento</label>
          <q-select
            v-model="actividad.tipo_evento_bitacora"
            :options="listadosAuxiliares.tiposEventos"
            transition-show="scale"
            transition-hide="scale"
            hint="Obligatorio"
            options-dense
            dense
            outlined
            :disable="disabled"
            :option-label="item => item.nombre"
            :option-value="item => item.id"
            @update:model-value="validarNotificacionInmediata()"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.tipo_evento_bitacora.$errors.length"
            @blur="v$.tipo_evento_bitacora.$touch"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No se han agregado tipos de eventos
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div
                v-for="error of v$.tipo_evento_bitacora.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <label class="block q-mb-sm">{{ '' }}</label>
          <q-toggle
            keep-color
            v-model="actividad.notificacion_inmediata"
            label="Notificar inmediatamente"
            :disable="disabled"
            color="positive"
            icon="bi-bell-fill"
          />
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Medio por el cual se notificó</label>
          <q-input
            v-model="actividad.medio_notificacion"
            outlined
            disable
            dense
          />
        </div>

        <div class="col-12 col-md-6">
          <voice-input
            v-model="actividad.actividad"
            label="Actividad"
            :disable="disabled"
            :error="!!v$.actividad.$errors.length"
            @blur="v$.actividad.$touch"
            :v$="v$"
            keyError="actividad"
          >
          </voice-input>
        </div>

        <!-- <div class="col-12 col-md-6">
          <voice-input
            v-model="actividad.ubicacion"
            label="Ubicación"
            :disable="disabled"
          ></voice-input>
        </div> -->

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">{{ 'Fotografía de evidencia 1' }}</label>
          <selector-imagen
            :imagen="actividad.fotografia_evidencia_1"
            file_extensiones=".jpg, image/*"
            @update:modelValue="d => (actividad.fotografia_evidencia_1 = d)"
            hint="Opcional"
            :disable="disabled"
          />
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">{{ 'Fotografía de evidencia 2' }}</label>
          <selector-imagen
            :imagen="actividad.fotografia_evidencia_2"
            file_extensiones=".jpg, image/*"
            @update:modelValue="d => (actividad.fotografia_evidencia_2 = d)"
            hint="Opcional"
            :disable="disabled"
          />
        </div>
      </div>
        
      <div class="row q-col-gutter-sm">
        <div class="col-12 text-pdrimary text-bold q-py-sm q-mt-sm">
          <q-icon name="bi-x-diamond" class="q-mr-sm" color="primary"></q-icon>
          Archivos adjuntos (Opcional)
        </div>
        <q-checkbox
          keep-color
          v-model="actividad.mostrar_seccion_archivos_adjuntos"
          label="Mostrar seccion"
          color="positive"
          :disable="disabled"
        />
        <div
          v-show="actividad.mostrar_seccion_archivos_adjuntos"
          class="col-12 q-mb-md"
        >
          <gestor-archivos
            ref="refArchivo"
            label="Adjuntar archivos"
            :mixin="mixin"
            :disable="disabled"
            :listar-al-guardar="false"
            quiero-subir-archivos
            :permitir-subir="false"
            :permitir-eliminar="
              accion == acciones.nuevo || accion == acciones.editar
            "
            :idModelo="idEntidad"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-12 text-pdrimary text-bold q-py-sm q-mt-sm">
          <q-icon name="bi-x-diamond" class="q-mr-sm" color="primary"></q-icon>
          Visitante (Opcional)
        </div>
        <q-checkbox
          keep-color
          v-model="actividad.mostrar_seccion_visitante"
          label="Mostrar seccion"
          color="positive"
          :disable="disabled"
        />
        <div v-if="actividad.mostrar_seccion_visitante" class="col-12 q-mb-md">
          <formulario-visitante
            :visitante="actividad.visitante"
            :v$="v$"
            :disable="disabled"
          />
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./ActividadBitacoraPage.ts"></script>
