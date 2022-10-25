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
        <!-- Codigo tarea JP -->
        <div v-if="tarea.codigo_tarea_jp" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de tarea JP</label>
          <q-input
            v-model="tarea.codigo_tarea_jp"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Numero tarea cliente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de tarea Cliente</label>
          <q-input
            v-model="tarea.codigo_tarea_cliente"
            placeholder="Opcional"
            @update:model-value="
              (v) => (tarea.codigo_tarea_cliente = v.toUpperCase())
            "
            hint="Ticket, OT, Tarea"
            outlined
            dense
            autofocus
          ></q-input>
        </div>

        <!-- Cliente principal -->
        <div class="col-12 col-md-6">
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
            use-input
            input-debounce="0"
            emit-value
            map-options
          >
            <!-- @update:model-value="obtenerResponsable(subtarea.grupo)" -->
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
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de solicitud</label>
          <q-input v-model="tarea.fecha_solicitud" outlined dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="tarea.fecha_solicitud" mask="DD-MM-YYYY">
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

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora de solicitud</label>
          <q-input v-model="tarea.hora_solicitud" mask="time" outlined dense>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="tarea.hora_solicitud" format24h now-btn>
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
          >
          </q-input>
        </div>

        <!-- Supervisor -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Supervisor</label>
          <q-select
            v-model="tarea.supervisor"
            :options="supervisores"
            @filter="filtrarSupervisores"
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
      </div>
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      label="Cliente final"
      header-class="bg-grey-1"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Nombre -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Contacto</label>
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

    <!-- Botones formulario -->
    <!-- <div class="row q-gutter-md justify-end">
      <q-btn color="primary" no-caps @click="enviar()" push>
        <q-icon name="bi-save" class="q-mr-sm" size="xs"></q-icon>
        <div>Guardar</div>
      </q-btn>

      <q-btn color="negative" no-caps @click="enviar()" push>
        <q-icon name="bi-x-lg" size="xs" class="q-mr-sm"></q-icon>
        <div>Cancelar</div>
      </q-btn>
    </div> -->
    <button-submits
      :accion="tareaStore.accion"
      @cancelar="reestablecer()"
      @editar="editar(tarea)"
      @eliminar="eliminar(tarea)"
      @guardar="guardar(tarea)"
    />
  </q-form>

  <essential-selectable-table
    ref="refListadoSeleccionableClientes"
    :configuracion-columnas="configuracionColumnasClientes"
    :datos="listadoClientes"
    @selected="seleccionarCliente"
  >
  </essential-selectable-table>

  <modales-entidad :comportamiento="modalesTarea" />
</template>

<script src="./GeneralContent.ts"></script>
