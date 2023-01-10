<template>
  <q-form @submit.prevent>
    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="Información general"
      header-class="bg-grey-1"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!--<div class="col-12">
          <q-btn-toggle
            v-model="model"
            class="my-custom-toggle"
            spread
            no-caps
            toggle-color="positive"
            rounded
            unelevated
            :options="[
              { label: 'Pertenece a un proyecto', value: 'pertenece_proyecto' },
              { label: 'Trabajo para cliente final', value: 'cliente_final' },
            ]"
          />
        </div> -->

        <div v-show="!tarea.tiene_cliente_final" class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="tarea.pertenece_a_proyecto"
            label="Pertenece a un proyecto"
            outlined
            dense
          ></q-checkbox>
        </div>

        <div v-show="!tarea.pertenece_a_proyecto" class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="tarea.tiene_cliente_final"
            label="Trabajo para cliente final"
            @blur="
              () =>
                !tarea.tiene_cliente_final
                  ? (tarea.pertenece_a_proyecto = true)
                  : null
            "
            outlined
            dense
          ></q-checkbox>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Codigo tarea JP -->
        <div v-if="tarea.codigo_tarea" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de tarea</label>
          <q-input
            v-model="tarea.codigo_tarea"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Numero tarea cliente -->
        <div v-if="!tarea.pertenece_a_proyecto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de tarea cliente</label>
          <q-input
            v-model="tarea.codigo_tarea_cliente"
            placeholder="Obligatorio"
            hint="Ticket, OT, Tarea"
            :error="!!v$.codigo_tarea_cliente.$errors.length"
            outlined
            dense
            autofocus
          >
            <template v-slot:error>
              <div
                v-for="error of v$.codigo_tarea_cliente.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Cliente principal -->
        <div v-if="!tarea.pertenece_a_proyecto" class="col-12 col-md-6">
          <label class="q-mb-sm block">Cliente principal</label>
          <q-select
            v-model="tarea.cliente"
            :options="clientes"
            @filter="filtrarClientes"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.razon_social"
            :option-value="(item) => item.id"
            :option-disable="(item) => (item.id === 1 ? true : false)"
            use-input
            input-debounce="0"
            emit-value
            map-options
            @update:model-value="establecerCliente()"
            :error="!!v$.cliente.$errors.length"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <!-- Supervisor -->
        <div v-if="!tarea.pertenece_a_proyecto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Supervisor JP</label>
          <q-select
            v-model="tarea.supervisor"
            :options="supervisores"
            @filter="filtrarSupervisores"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            clearable
            outlined
            :option-label="(item) => item.nombres + ' ' + item.apellidos"
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

        <!-- Fecha de solicitud -->
        <div v-if="!tarea.pertenece_a_proyecto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de solicitud del cliente</label>
          <q-input v-model="tarea.fecha_solicitud" outlined dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="tarea.fecha_solicitud"
                    mask="DD-MM-YYYY"
                    today-btn
                  >
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

        <!-- Codigo de proyecto -->
        <div v-if="tarea.pertenece_a_proyecto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de proyecto</label>
          <q-select
            v-model="tarea.codigo_proyecto"
            :options="proyectos"
            @filter="filtrarProyectos"
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

        <!-- Detalle -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Detalle de la tarea</label>
          <q-input
            v-model="tarea.detalle"
            placeholder="Obligatorio"
            @update:model-value="(v) => (tarea.detalle = v.toUpperCase())"
            outlined
            dense
            autogrow
            type="textarea"
            :error="!!v$.detalle.$errors.length"
          >
            <template v-slot:error>
              <div v-for="error of v$.detalle.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      v-if="!tarea.pertenece_a_proyecto && tarea.tiene_cliente_final"
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="Ubicación de trabajo"
      header-class="bg-grey-1"
      default-opened
    >
      <!-- Toggle -->
      <!-- <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12">
          <q-btn-toggle
            v-model="tipoUbicacionTrabajo"
            spread
            class="my-custom-toggle"
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="primary"
            :options="[
              { label: 'Trabajo para cliente final', value: 'cliente_final' },
            ]"
          />
        </div>
      </div> -->
      <!-- {
                label: 'Ubicación',
                value: 'ubicacion_manual',
              }, -->
      <!--
      <div
        v-if="tipoUbicacionTrabajo === 'ubicacion_manual'"
        class="row q-col-gutter-sm q-pa-md"
      >
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Provincias</label>
          <q-select
            v-model="tarea.ubicacion_tarea.provincia"
            :options="provincias"
            @filter="filtrarProvincias"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.provincia"
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

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Canton</label>
          <q-select
            v-model="tarea.ubicacion_tarea.canton"
            :options="cantonesPorProvincia"
            @filter="filtrarCantones"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.canton"
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

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Parroquia/Barrio</label>
          <q-input
            v-model="tarea.ubicacion_tarea.parroquia"
            @update:model-value="
              (v) => (tarea.ubicacion_tarea.parroquia = v.toUpperCase())
            "
            outlined
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="tarea.ubicacion_tarea.direccion"
            @update:model-value="
              (v) => (tarea.ubicacion_tarea.direccion = v.toUpperCase())
            "
            outlined
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Referencias</label>
          <q-input
            v-model="tarea.ubicacion_tarea.referencias"
            @update:model-value="
              (v) => (tarea.ubicacion_tarea.referencias = v.toUpperCase())
            "
            outlined
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordenadas</label>
          <q-input
            v-model="tarea.ubicacion_tarea.coordenadas"
            @update:model-value="
              (v) => (tarea.ubicacion_tarea.coordenadas = v.toUpperCase())
            "
            outlined
            dense
          >
          </q-input>
        </div>
      </div>
    -->
      <div
        v-if="tipoUbicacionTrabajo === 'cliente_final'"
        class="row q-col-gutter-sm q-pa-md"
      >
        <!-- Nombre -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Cliente final</label>
          <q-select
            v-model="tarea.cliente_final"
            :options="clientesFinales"
            @filter="filtrarClientesFinales"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.nombres + ' ' + item.apellidos"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            @update:model-value="
              (v) => obtenerClienteFinal(tarea.cliente_final)
            "
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

        <!-- Id de cliente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">ID Cliente</label>
          <q-input
            v-model="clienteFinal.id_cliente"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Celular -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Celular</label>
          <q-input
            v-model="clienteFinal.celular"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Provincia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Provincias</label>
          <q-select
            v-model="clienteFinal.provincia"
            :options="listadosAuxiliares.provincias"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            disable
            :option-label="(item) => item.provincia"
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

        <!-- Ciudad -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Canton</label>
          <q-select
            v-model="clienteFinal.canton"
            :options="listadosAuxiliares.cantones"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            disable
            :option-label="(item) => item.canton"
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

        <!-- Parroquia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Parroquia/Barrio</label>
          <q-input
            v-model="clienteFinal.parroquia"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Direccion -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="clienteFinal.direccion"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Referencias -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Referencias</label>
          <q-input
            v-model="clienteFinal.referencias"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Coordenadas -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordenadas</label>
          <q-input v-model="clienteFinal.coordenadas" disable outlined dense>
          </q-input>
        </div>
      </div>
    </q-expansion-item>

    <button-submits
      :accion="accion"
      @cancelar="reestablecer()"
      @editar="editar(tarea, false)"
      @eliminar="eliminar(tarea)"
      @guardar="guardar(tarea, false)"
    />
  </q-form>

  <!-- <essential-selectable-table
    ref="refListadoSeleccionableClientes"
    :configuracion-columnas="configuracionColumnasClientes"
    :datos="listadoClientes"
    @selected="seleccionarCliente"
  >
  </essential-selectable-table> -->

  <!--<modales-entidad :comportamiento="modalesTarea" /> -->
</template>

<script src="./GeneralContent.ts"></script>
