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
          <q-input
            v-model="criterioBusquedaCliente"
            placeholder="Obligatorio"
            @update:model-value="
              (v) => (criterioBusquedaCliente = v.toUpperCase())
            "
            hint="Presiona Enter para seleccionar un cliente"
            @keydown.enter="listarClientes()"
            @blur="criterioBusquedaCliente === '' ? limpiarCliente() : null"
            outlined
            dense
          >
            <!-- :error="!!v$.cliente.$errors.length" -->
            <!--  <template v-slot:error>
              <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template> -->
          </q-input>
        </div>

        <!-- Fecha y hora de solicitud -->
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
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora de solicitud</label>
          <flat-pickr
            v-model="tarea.hora_solicitud"
            :config="{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'H:i',
            }"
          />
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

        <!-- Coordinador -->
        <div v-if="tarea.coordinador" class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordinador</label>
          <q-input v-model="tarea.coordinador" outlined dense disable></q-input>
        </div>

        <!-- Supervisor -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Supervisor</label>
          <q-input
            v-model="tarea.supervisor"
            @update:model-value="(v) => (tarea.supervisor = v.toUpperCase())"
            outlined
            dense
          ></q-input>
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
          <q-input
            v-model="tarea.contacto"
            placeholder="Opcional"
            hint="Presiona Enter para seleccionar un cliente"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Id de cliente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">ID Cliente</label>
          <q-input
            v-model="tarea.id_cliente"
            @update:model-value="(v) => (tarea.id_cliente = v.toUpperCase())"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Celular -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Celular</label>
          <q-input v-model="tarea.celular" outlined dense disable></q-input>
        </div>

        <!-- <div class="col-12">
          <div class="row justify-end q-gutter-sm">
            <q-btn color="positive" no-caps rounded push>
              <q-icon name="bi-collection" size="xs" class="q-pr-sm"></q-icon>
              <div>Seleccionar contacto</div>
            </q-btn>

            <q-btn color="positive" no-caps rounded push>
              <q-icon name="bi-plus" class="q-pr-sm"></q-icon>
              <div>Registrar nuevo contacto</div>
            </q-btn>
          </div>
        </div> -->

        <!-- Provincia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Provincias</label>
          <q-select
            v-model="tarea.provincia"
            :options="provincias"
            options-dense
            dense
            outlined
          />
        </div>

        <!-- Ciudad -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Ciudades</label>
          <q-select
            outlined
            v-model="tarea.ciudad"
            :options="ciudades"
            options-dense
            dense
          />
        </div>

        <!-- Parroquia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Parroquia/Barrio</label>
          <q-input
            v-model="tarea.parroquia"
            placeholder="Opcional"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Direccion -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="tarea.direccion"
            placeholder="Opcional"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Referencias -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Referencias</label>
          <q-input
            v-model="tarea.referencias"
            placeholder="Opcional"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Coordenadas -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordenadas</label>
          <q-input
            v-model="tarea.coordenadas"
            placeholder="Opcional"
            outlined
            dense
          >
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
</template>

<script src="./GeneralContent.ts"></script>
