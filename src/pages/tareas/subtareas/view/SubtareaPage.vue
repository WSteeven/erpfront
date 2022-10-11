<template>
  <!-- <q-page padding> -->
  <div class="text-h6 q-my-md q-ml-md">Subtarea seleccionada</div>
  <q-stepper
    v-model="step"
    header-nav
    ref="stepper"
    active-color="primary"
    active-icon="bi-check"
    animated
    flat
  >
    <!-- General -->
    <q-step :name="1" title="1. General" icon="bi-gear" :done="done1">
      <q-form @submit.prevent="enviar()">
        <!-- Datos de la subtarea -->
        <q-expansion-item
          class="overflow-hidden q-mb-md"
          style="border-radius: 8px; border: 1px solid #ddd"
          icon="bi-paperclip"
          label="Información general"
          header-class="bg-grey-1"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Subtarea -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Código subtarea</label>
              <q-input
                v-model="subtarea.codigo_subtarea"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Detalle de la subtarea -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block"
                >Detalle / Ruta / Enlace / Proyecto</label
              >
              <q-input
                v-model="subtarea.detalle"
                outlined
                dense
                autogrow
                type="textarea"
              ></q-input>
            </div>

            <!-- Cliente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Cliente</label>
              <q-input
                v-model="subtarea.cliente"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Grupo -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Grupo asignado</label>
              <q-input
                v-model="subtarea.grupo"
                placeholder="Obligatorio"
                outlined
                dense
              ></q-input>
            </div>

            <!-- Técnico responsable -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Técnico responsable</label>
              <q-input
                v-model="subtarea.grupo"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Tipo trabajo -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de trabajo</label>
              <q-select
                v-model="subtarea.tipo_trabajo"
                :options="tiposTareasTelconet"
                transition-show="flip-up"
                transition-hide="flip-down"
                options-dense
                emit-value
                map-options
                dense
                outlined
              />
            </div>

            <!-- Servicio -->
            <!--<div class="col-12 col-md-3">
              <label class="q-mb-sm block">Servicio</label>
              <q-select
                v-model="subtarea.servicio"
                :options="tiposTareasTelconet"
                transition-show="flip-up"
                transition-hide="flip-down"
                options-dense
                emit-value
                map-options
                dense
                outlined
              />
            </div> -->

            <!-- Coordinador -->
            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordinador</label>
          <q-input
            v-model="subtarea.coordinador"
            outlined
            dense
            disable
          ></q-input>
        </div> -->

            <!-- Fecha de creacion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora de creación</label>
              <q-input v-model="subtarea.fecha_creacion" outlined dense disable>
              </q-input>
            </div>

            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de agendamiento</label>
          <q-input v-model="subtarea.fecha_agendamiento" outlined dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="subtarea.fecha_agendamiento"
                    mask="DD-MM-YYYY"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div> -->

            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora de agendamiento</label>
          <flat-pickr
            v-model="subtarea.hora_agendamiento"
            :config="{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'H:i',
            }"
          />
        </div> -->

            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de reagendamiento</label>
          <q-input v-model="subtarea.fecha_reagendamiento" outlined dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="subtarea.fecha_reagendamiento"
                    mask="DD-MM-YYYY"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div> -->

            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora de reagendamiento</label>
          <flat-pickr
            v-model="subtarea.hora_reagendamiento"
            :config="{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'H:i',
            }"
          />
        </div> -->

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora de asignación</label>
              <q-input v-model="subtarea.fecha_creacion" outlined dense disable>
              </q-input>
            </div>

            <!-- Fecha de inicio -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha y hora de inicio de trabajo</label
              >
              <q-input v-model="subtarea.fecha_inicio" outlined dense disable>
              </q-input>
            </div>

            <!-- Fecha de finalizacion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha y hora de finalización de trabajo</label
              >
              <q-input
                v-model="subtarea.fecha_finalizacion"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Cantidad de días -->
            <!-- <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Cantidad de días</label>
          <q-input
            v-model="subtarea.cantidad_dias"
            outlined
            dense
            disable
          ></q-input>
        </div> -->

            <!-- Fecha y hora de estado realizado -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha y hora de estado realizado</label
              >
              <q-input
                v-model="subtarea.fecha_hora_estado_realizado"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Fecha y hora de estado suspendido -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha y hora de estado suspendido</label
              >
              <q-input
                v-model="subtarea.fecha_hora_estado_suspendido"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Causa de la suspencion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Causa de la suspención</label>
              <q-input
                v-model="subtarea.causa_suspencion"
                placeholder="Opcional"
                outlined
                dense
              ></q-input>
            </div>

            <!-- Fecha y hora de estado cancelacion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora de cancelación</label>
              <q-input
                v-model="subtarea.fecha_hora_estado_cancelado"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Causa de la suspencion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Causa de la cancelación</label>
              <q-input
                v-model="subtarea.causa_cancelacion"
                placeholder="Opcional"
                outlined
                dense
              ></q-input>
            </div>

            <!-- Es dependiente -->
            <div class="col-12 col-md-3">
              <br />
              <q-checkbox
                v-model="subtarea.es_dependiente"
                label="Es dependiente"
                outlined
                dense
              ></q-checkbox>
            </div>

            <!--  Subtarea de la q depende -->
            <div v-if="subtarea.es_dependiente" class="col-12 col-md-3">
              <label class="q-mb-sm block">Subtarea dependiente</label>
              <q-input
                v-model="subtarea.subtarea_dependiente"
                @update:model-value="
                  (v) => (subtarea.subtarea_dependiente = v.toUpperCase())
                "
                outlined
                dense
              ></q-input>
            </div>

            <!-- Regional -->
            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Regional</label>
          <q-select
            v-model="subtarea.regional"
            :options="regiones"
            transition-show="flip-up"
            transition-hide="flip-down"
            options-dense
            emit-value
            map-options
            dense
            outlined
          />
        </div> -->

            <!-- Atencion -->
            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Atención</label>
          <q-select
            v-model="subtarea.atencion"
            :options="atenciones"
            transition-show="flip-up"
            transition-hide="flip-down"
            options-dense
            emit-value
            map-options
            dense
            outlined
          />
        </div> -->

            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo de intervención</label>
          <q-select
            v-model="subtarea.tipo_intervencion"
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
      -->

            <!--<div class="col-12 col-md-3">
          <label class="q-mb-sm block">Causa de intervención</label>
          <q-select
            v-model="subtarea.causa_intervencion"
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
      -->

            <div class="col-12">
              <label class="q-mb-sm block"
                >Descripción completa del trabajo a realizar</label
              >
              <q-input
                v-model="subtarea.descripcion_completa"
                placeholder="Opcional"
                autogrow
                outlined
                dense
              ></q-input>
            </div>

            <div class="col-12">
              <essential-table
                titulo="Técnicos del grupo principal"
                :configuracionColumnas="columnas"
                :datos="datos"
                :mostrarBotones="false"
                :permitirConsultar="false"
                :permitirEditar="false"
                :alto-fijo="false"
                :mostrar-header="false"
                :mostrar-footer="false"
                @eliminar="eliminarTecnico"
              >
              </essential-table>
            </div>
          </div>

          <div class="row q-gutter-xs q-px-md q-mb-md">
            <q-btn color="negative" no-caps @click="enviar()" push>
              <q-icon name="bi-x-lg" class="q-mr-sm" size="xs"></q-icon>
              <div>Cancelar</div>
            </q-btn>

            <q-btn color="primary" no-caps @click="enviar()" push>
              <q-icon name="bi-gear" size="xs" class="q-mr-sm"></q-icon>
              <div>Asignar</div>
            </q-btn>

            <q-btn color="positive" no-caps @click="enviar()" push>
              <q-icon name="bi-check" size="xs" class="q-mr-sm"></q-icon>
              <div>Finalizar</div>
            </q-btn>

            <!-- <q-btn color="positive" no-caps @click="enviar()" push>
              <q-icon
                name="bi-clock-history"
                size="xs"
                class="q-mr-sm"
              ></q-icon>
              <div>Reagendar</div>
            </q-btn> -->
          </div>
        </q-expansion-item>

        <!-- Asignar técnicos de otros grupos -->
        <q-expansion-item
          class="overflow-hidden q-mb-md"
          style="border-radius: 8px; border: 1px solid #ddd"
          icon="bi-gear-wide-connected"
          label="Asignar técnicos de otros grupos"
          header-class="bg-grey-1"
        >
          <!-- Toggle -->
          <div class="row q-col-gutter-sm q-pa-md">
            <div class="col-12">
              <q-btn-toggle
                v-model="seleccionBusqueda"
                spread
                class="my-custom-toggle"
                no-caps
                rounded
                unelevated
                toggle-color="grey-7"
                color="white"
                text-color="grey-7"
                :options="[
                  { label: 'Buscar un técnico a la vez', value: 'por_tecnico' },
                  { label: 'Buscar por grupo', value: 'por_grupo' },
                ]"
              />
            </div>
          </div>

          <!-- Busqueda por tecnico -->
          <div
            v-if="seleccionBusqueda === 'por_tecnico'"
            class="row q-col-gutter-sm q-pa-md"
          >
            <!-- Busqueda -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Buscar</label>
              <q-input
                v-model="busqueda"
                placeholder="Nombres / Apellidos / Identificación"
                hint="Ingrese los datos del técnico y presione Enter"
                outlined
                dense
              ></q-input>
            </div>

            <!-- Tecnico seleccionado -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Técnico seleccionado</label>
              <q-input
                v-model="tecnicoSeleccionado"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <div class="col-12 col-md-3 q-pt-md">
              <br />
              <q-btn color="positive" no-caps class="full-width" push>
                <q-icon name="bi-plus" class="q-pr-sm" size="xs"></q-icon>
                <div>Agregar al listado</div>
              </q-btn>
            </div>
          </div>

          <!-- Busqueda por grupo -->
          <div v-else class="row q-col-gutter-sm q-pa-md">
            <!-- Grupo -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Grupo</label>
              <q-select
                v-model="busqueda"
                :options="grupos"
                hint="Seleccione un grupo y presione en Listar técnicos"
                options-dense
                dense
                outlined
              />
            </div>

            <div class="col-12 col-md-3 q-pt-md">
              <br />
              <q-btn color="positive" no-caps class="full-width" push>
                <div>Listar técnicos</div>
              </q-btn>
            </div>

            <!-- Tecnico seleccionado -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Técnico seleccionado</label>
              <q-input
                v-model="tecnicoSeleccionado"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <div class="col-12 col-md-3 q-pt-md">
              <br />
              <q-btn color="positive" no-caps class="full-width" push>
                <q-icon name="bi-plus" class="q-pr-sm" size="xs"></q-icon>
                <div>Agregar al listado</div>
              </q-btn>
            </div>
          </div>

          <!-- Listado -->
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Tecnicos temporales -->
            <div class="col-12">
              <essential-table
                titulo="Técnicos temporales de otros grupos"
                :configuracionColumnas="columnas"
                :datos="datos"
                :mostrarBotones="false"
                :permitirConsultar="false"
                :permitirEditar="false"
                :alto-fijo="false"
                :mostrar-header="false"
                :mostrar-footer="false"
                @eliminar="eliminarTecnico"
              >
              </essential-table>
            </div>
          </div>
        </q-expansion-item>

        <!-- Botones formulario -->
        <div class="row q-gutter-md justify-end">
          <q-btn color="primary" no-caps @click="enviar()" push>
            <q-icon name="bi-x-lg" size="xs" class="q-mr-sm"></q-icon>
            <div>Guardar cambios</div>
          </q-btn>
        </div>
      </q-form>
    </q-step>

    <q-step
      :name="2"
      title="2. Pausas realizadas"
      icon="bi-list-check"
      :done="done2"
    >
      <pausas-realizadas-content></pausas-realizadas-content>
    </q-step>

    <q-step
      :name="3"
      title="3. Control de avance"
      icon="bi-list-check"
      :done="done3"
    >
      <ControlAvanceContent></ControlAvanceContent>
    </q-step>

    <q-step
      :name="4"
      title="4. Imágenes adicionales"
      icon="bi-list-check"
      :done="done4"
    >
      <imagen-adicional-content></imagen-adicional-content>
    </q-step>

    <q-step
      :name="5"
      title="5. Información adicional"
      icon="bi-list-check"
      :done="done5"
    >
      <informacion-adicional-content></informacion-adicional-content>
    </q-step>
  </q-stepper>
  <!-- <modales-entidad :comportamiento="modalesSubtarea" /> -->
  <!-- </q-page> -->
</template>

<script src="./SubtareaPage.ts"></script>

<style lang="scss" scoped>
.my-custom-toggle {
  border: 1px solid #8d8d8d;
}
</style>
