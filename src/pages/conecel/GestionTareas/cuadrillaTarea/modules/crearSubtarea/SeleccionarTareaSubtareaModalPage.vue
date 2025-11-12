<template>
<!--  <q-page padding>-->
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section class="q-py-xs">
        <div class="row q-col-gutter-x-sm">
          <!-- Tarea -->
          <div class="col-12 col-md-6 q-mb-md col-sm-6">
            <label class="q-mb-sm block">Selecciona la tarea</label>
            <q-select
              v-model="request.tarea"
              :options="tareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              hint="Obligatorio"
              dense
              outlined
              :error="!!v$.tarea.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtrarTareas"
              error-message="Debe seleccionar una tarea"
              :option-label="item => item.codigo_tarea + ' - ' + item.titulo"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <error-component clave="tarea" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Grupos -->
          <div class="col-12 col-md-6 q-mb-md col-sm-6">
            <label class="q-mb-sm block">Selecciona el grupo</label>
            <q-select
                v-model="request.grupo"
                :options="grupos"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                clearable
                hint="Obligatorio"
                dense
                outlined
                :disable="datos?.grupo!==0"
                :error="!!v$.grupo.$errors.length"
                error-message="Debe seleccionar un grupo"
                @update:model-value="actualizarNombreGrupo"
                :option-label="item => item.nombre"
                :option-value="item => item.id"
                emit-value
                map-options
            >
              <template v-slot:error>
                <error-component clave="grupo" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <div
              class="col-12"
          >
            <label class="q-mb-sm block">Título de la subtarea</label>
            <q-input
                autogrow
                v-model="request.titulo"
                placeholder="Obligatorio"
                :error="!!v$.titulo.$errors.length"
                outlined
                dense
            >
              <template v-slot:error>
                <error-component clave="titulo" :v$="v$"/>
              </template>
            </q-input>
          </div>

        </div>
      </q-card-section>
      <q-card-actions align="right">

        <ButtonSubmits
                       :accion="acciones.nuevo"
                       @cancelar="reestablecer"
                       @guardar="guardarSubtarea"
        />
      </q-card-actions>
    </q-card>
<!--  </q-page>-->
</template>
<script src="./SeleccionarTareaSubtareaModalPage.ts" />
