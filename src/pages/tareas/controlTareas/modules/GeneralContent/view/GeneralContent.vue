<template>
  <q-form @submit.prevent>
    <q-expansion-item
      class="overflow-hidden q-mb-md expansion"
      label="Información general"
      header-class="bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12">
          <q-btn-toggle
            v-model="tarea.destino"
            class="toggle-button"
            spread
            no-caps
            rounded
            toggle-color="positive"
            unelevated
            :options="[
              {
                label: 'Tarea para un proyecto',
                value: destinosTareas.paraProyecto,
              },
              {
                label: 'Tarea para cliente final',
                value: destinosTareas.paraClienteFinal,
              },
            ]"
          />
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
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de tarea cliente</label>
          <q-input
            v-model="tarea.codigo_tarea_cliente"
            placeholder="Obligatorio"
            hint="Ticket, OT, Tarea"
            :error="!!v$.codigo_tarea_cliente.$errors.length"
            @blur="v$.codigo_tarea_cliente.$touch"
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
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Cliente corporativo</label>
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
        <div v-if="paraClienteFinal" class="col-12 col-md-3">
          <label class="q-mb-sm block">Fiscalizador JPCONSTRUCRED</label>
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

        <!-- Coordinador -->
        <div v-if="paraClienteFinal" class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordinador</label>
          <q-select
            v-model="tarea.coordinador"
            :options="coordinadores"
            @filter="filtrarCoordinadores"
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
        <div v-if="paraClienteFinal" class="col-12 col-md-3">
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
        <div v-if="paraProyecto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de proyecto</label>
          <q-select
            v-model="tarea.proyecto"
            :options="proyectos"
            @filter="filtrarProyectos"
            @blur="v$.proyecto.$touch"
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
            :error="!!v$.proyecto.$errors.length"
            @update:modelValue="setCliente"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.proyecto.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <!-- Tiene subtareas -->
        <div class="col-12 col-md-3">
          <br />
          <q-toggle
            v-model="tarea.tiene_subtareas"
            checked-icon="check"
            label="Tiene subtareas"
            unchecked-icon="clear"
          />
        </div>

        <!-- Tipo trabajo -->
        <!--<div v-if="!tarea.tiene_subtareas" class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo de trabajo a realizar</label>
          <q-select
            v-model="tarea.tipo_trabajo"
            :options="tiposTrabajos"
            @filter="filtrarTiposTrabajos"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.descripcion"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.tipo_trabajo.$errors.length"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.tipo_trabajo.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div> -->

        <!-- Titulo -->
        <div class="col-12">
          <label class="q-mb-sm block">Título de la tarea</label>
          <q-input
            v-model="tarea.titulo"
            placeholder="Obligatorio"
            outlined
            dense
            :error="!!v$.titulo.$errors.length"
            @blur="v$.titulo.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Detalle -->
        <div class="col-12">
          <label class="q-mb-sm block">Detalle de la tarea</label>
          <q-input
            v-model="tarea.detalle"
            placeholder="Obligatorio"
            outlined
            dense
            autogrow
            type="textarea"
            :error="!!v$.detalle.$errors.length"
            @blur="v$.detalle.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.detalle.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Observacion -->
        <div class="col-12">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="tarea.observacion"
            placeholder="Opcional"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      v-if="paraClienteFinal"
      class="overflow-hidden q-mb-md expansion"
      label="Ubicación del trabajo para cliente final"
      header-class="bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Nombre -->
        <div class="col-12 col-md-6">
          <label-abrir-modal
            v-if="mostrarLabelModal"
            label="Cliente final"
            @click="modales.abrirModalEntidad('ClienteFinalPage')"
          />
          <label v-else class="q-mb-sm block">Cliente final</label>
          <q-select
            v-model="tarea.cliente_final"
            :options="clientesFinales"
            @filter="filtrarClientesFinales"
            hint="Primero seleccione al cliente principal"
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
          <label class="q-mb-sm block">ID de cliente final</label>
          <q-input
            v-model="clienteFinal.id_cliente_final"
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
          <label class="q-mb-sm block">Cantón</label>
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

        <!-- Referencia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Referencia</label>
          <q-input
            v-model="clienteFinal.referencia"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Coordenada latitud -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordenada latitud</label>
          <q-input
            v-model="clienteFinal.coordenada_latitud"
            disable
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Coordenada longitud -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordenada longitud</label>
          <q-input
            v-model="clienteFinal.coordenada_longitud"
            disable
            outlined
            dense
          >
          </q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-btn label="Descargar PDF" color="primary" @click="descargarPDF()" />

    <button-submits
      :accion="accion"
      @cancelar="reestablecer()"
      @editar="editar(tarea, false)"
      @eliminar="eliminar(tarea)"
      @guardar="guardar(tarea, false)"
    />
  </q-form>

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./GeneralContent.ts"></script>
