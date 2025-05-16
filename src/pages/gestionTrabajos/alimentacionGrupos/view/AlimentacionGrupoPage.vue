<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasAlimentacionGrupo"
    :paginate="true"
    puede-filtrar
    puede-exportar
    ajustar-celdas
    :mostrar-formulario="mostrarFormulario"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-md border-white rounded q-mb-xl">
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="alimentacion.fecha"
              placeholder="Obligatorio"
              :error="!!v$.fecha.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.fecha.$touch"
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
                    <q-date
                      v-model="alimentacion.fecha"
                      :mask="maskFecha"
                      today-btn
                    >
                      <!-- :options="optionsFecha" -->
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

              <template v-slot:error>
                <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="block q-mb-sm">&nbsp;</label>
            <q-btn
              color="positive"
              icon="bi-plus"
              label="Agregar registro"
              unelevated
              square
              no-caps
              @click="agregarGrupo()"
            ></q-btn>
          </div>

          <div class="col-12 col-md-3">
            <br />
            <q-checkbox
              v-model="alimentacion.editar_participantes"
              label="Editar participantes (Desmarque para descartar cambios)"
              @update:model-value="limpiarSubtarea()"
              outlined
              dense
            ></q-checkbox>
          </div>

          <div
            v-if="!!datos && !datos.idGrupo || !alimentacion.grupo"
            class="col-12 border-callout-warning bg-solid q-pb-sm"
          >
            <q-icon
              name="bi-cone-striped"
              color="warning"
              class="q-mr-sm"
            ></q-icon>
            <span
              v-html="
                'El empleado responsable no pertenece a ningún grupo. Comuníquese con RRHH para asignarle un grupo en el sistema en caso de que sea necesario.<br>Sino pertenece a ningún grupo <b>Finalice sin registrar alimentación</b>.'
              "
            ></span>
          </div>
        </div>

        <div
          v-for="(alimentacionGrupo, index) in alimentacion.alimentacion_grupos"
          :key="index"
          class="row q-col-gutter-sm q-py-md q-mb-xl bg-desenfoque border-white rounded"
        >
          <!-- :class="{ 'border-callout-info': index % 2 === 0 }" -->

          <q-btn
            class="btn-quitar-item"
            color="negative"
            label="Quitar"
            icon="bi-x"
            no-caps
            rounded
            no-wrap
            @click="alimentacion.alimentacion_grupos.splice(index, 1)"
          />

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="alimentacionGrupo.grupo_id"
              :options="grupos"
              @filter="filtrarGrupos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              error-message="Seleccione un grupo"
              :disable="disabled || noSePuedeEditar || existeSubtarea"
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index].grupo_id
                  .length
              "
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
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].grupo_id"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div v-if="!consultado" class="col-12 col-md-4">
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="alimentacionGrupo.tarea_id"
              :options="tareas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || noSePuedeEditar || existeSubtarea"
              @filter="filtrarTareasTitulo"
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index].tarea_id
                  .length
              "
              error-message="Seleccione una tarea"
              use-input
              input-debounce="0"
              :option-value="v => v.id"
              :option-label="v => v.codigo_tarea + ' | ' + v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].tarea_id"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_tarea
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div v-if="consultado" class="col-12 col-md-4">
            <label class="q-mb-sm block">Tarea</label>
            <q-input
              v-model="alimentacionGrupo.tarea"
              disable
              outlined
              dense
              autogrow
            />
          </div>

          <div class="col-12 col-md-2">
            <label class="q-mb-sm block">Cantidad personas</label>
            <q-input
              v-model="alimentacionGrupo.cantidad_personas"
              placeholder="Obligatorio"
              :disable="disabled"
              type="number"
              outlined
              dense
              error-message="Escriba la cantidad de personas"
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index]
                  .cantidad_personas.length
              "
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].cantidad_personas"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total</label>
            <q-input
              :model-value="
                PRECIO_ALIMENTACION * alimentacionGrupo.cantidad_personas
              "
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo alimentación</label>
            <q-select
              v-model="alimentacionGrupo.tipo_alimentacion_id"
              :options="subdetalles"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || noSePuedeEditar"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarSubdetalles"
              error-message="Seleccionar un tipo de alimentación"
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index]
                  .tipo_alimentacion_id.length
              "
              :option-value="v => v.id"
              :option-label="v => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:option="{ itemProps, opt }">
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.descripcion }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.nombres" />
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].tipos_alimentacion"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>

              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-9">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="alimentacionGrupo.observacion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- <div class="col-12 col-md-2">
            <label class="block q-mb-sm">&nbsp;</label>
            <q-btn color="pink-10" label="Quitar item" icon="bi-x" no-caps unelevated rounded no-wrap/>
          </div> -->
        </div>

        <div v-show="alimentacion.editar_participantes">
          <div class="text-bold">Editar participantes</div>
          <designar-responsable-trabajo
            :disable="disabled"
            :accion="accion"
            :v$="v$"
            :subtarea-inicial="subtarea"
            @seleccionarGrupo="seleccionarGrupo"
            @seleccionarEmpleado="seleccionarEmpleado"
            @seleccionarModoDesignacion="seleccionarModoDesignacion"
            @seleccionarResponsable="seleccionarResponsable"
            @actualizar-empleados="
              empleados => (subtarea.empleados_designados = empleados)
            "
          ></designar-responsable-trabajo>
        </div>
      </q-form>
    </template>

    <template #custom-buttons>
      <!-- v-if="!!datos && !datos.idGrupo" -->
      <q-btn
        icon="bi-cone-striped"
        label="Finalizar sin registrar alimentación"
        no-caps
        unelevated
        square
        color="warning"
        class="q-mr-xs"
        @click="
          () => {
            $emit('guardado', 'AlimentacionGrupoPage')
            // $emit('cerrar-modal', false)
          }
        "
      />
    </template>
  </tab-layout>
</template>

<script src="./AlimentacionGrupoPage.ts"></script>

<style lang="scss">
.btn-quitar-item {
  position: absolute;
  top: -18px;
  right: 0;
}
</style>
