<template>
  <q-page padding>
    <div class="text-bold q-mb-md">Subtarea seleccionada</div>
    <q-form @submit.prevent="enviar()">
      <!-- Datos de la subtarea -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
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
            <!--<q-input
              v-model="subtarea.grupo"
              placeholder="Obligatorio"
              outlined
              dense
            ></q-input> -->
            <q-select
              v-model="subtarea.grupo"
              :options="grupos"
              @filter="filtrarGrupos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="obtenerResponsable(subtarea.grupo)"
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

          <!-- Técnico responsable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Técnico responsable</label>
            <q-input
              v-model="subtarea.tecnico_responsable"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Tipo trabajo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo de trabajo</label>
            <q-select
              v-model="subtarea.tipo_trabajo"
              :options="tiposTrabajos"
              @filter="filtrarTiposTrabajos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
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

          <!-- Fecha de creacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de creación</label>
            <q-input v-model="subtarea.fecha_creacion" outlined dense disable>
            </q-input>
          </div>

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
            <label class="q-mb-sm block">Subtarea de la que depende</label>
            <!--<q-input
              v-model="subtarea.subtarea_dependiente"
              @update:model-value="
                (v) => (subtarea.subtarea_dependiente = v.toUpperCase())
              "
              hint="Presione Enter para filtrar"
              outlined
              dense
            ></q-input> -->
            <q-select
              v-model="subtarea.subtarea_dependiente"
              :options="subtareas"
              @filter="filtrarSubtareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.codigo_subtarea"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_subtarea }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.detalle }}
                    </q-item-label>
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

          <!-- Es ventana -->
          <div class="col-12 col-md-3">
            <br />
            <q-checkbox
              v-model="subtarea.es_ventana"
              label="Es ventana de trabajo"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Hora inicio de ventana -->
          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora inicio de ventana</label>
            <flat-pickr
              v-model="subtarea.hora_inicio_ventana"
              :config="{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
              }"
            />
          </div>

          <!-- Hora fin de ventana -->
          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora fin de ventana</label>
            <flat-pickr
              v-model="subtarea.hora_fin_ventana"
              :config="{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
              }"
            />
          </div>

          <!-- Descripción completa del trabajo a realizar -->
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

          <!-- Técnicos del grupo principal -->
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
        </div>
      </q-expansion-item>

      <!-- Asignar técnicos de otros grupos -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Asignar técnicos de otros grupos"
        header-class="bg-grey-1"
        default-opened
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
  </q-page>
</template>

<script src="./SubtareaPage.ts"></script>

<style lang="scss" scoped>
.my-custom-toggle {
  border: 1px solid #8d8d8d;
}
</style>
