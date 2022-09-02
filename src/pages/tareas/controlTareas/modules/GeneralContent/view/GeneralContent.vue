<template>
  <q-form @submit.prevent>
    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      icon="bi-paperclip"
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
            readonly
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
            outlined
            dense
            autofocus
          ></q-input>
        </div>

        <!-- Cliente -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Cliente</label>
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

        <!-- Solicitante -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Persona solicitante</label>
          <q-input
            v-model="tarea.solicitante"
            placeholder="Opcional"
            @update:model-value="(v) => (tarea.solicitante = v.toUpperCase())"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Correo -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Correo del solicitante</label>
          <q-input
            v-model="tarea.correo_solicitante"
            placeholder="Opcional"
            @update:model-value="
              (v) => (tarea.correo_solicitante = v.toUpperCase())
            "
            type="email"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Coordinador -->
        <div v-if="tarea.coordinador" class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordinador</label>
          <q-input
            v-model="tarea.coordinador"
            outlined
            dense
            readonly
          ></q-input>
        </div>

        <!-- Es proyecto -->
        <div class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="tarea.es_proyecto"
            label="Es proyecto"
            outlined
            dense
          ></q-checkbox>
        </div>

        <!-- Codigo de proyecto -->
        <div v-if="tarea.es_proyecto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de proyecto</label>
          <q-input
            v-model="tarea.codigo_proyecto"
            @update:model-value="
              (v) => (tarea.codigo_proyecto = v.toUpperCase())
            "
            outlined
            dense
          ></q-input>
        </div>

        <!-- Detalle -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Detalle / Proyecto</label>
          <q-input
            v-model="tarea.detalle"
            placeholder="Obligatorio"
            @update:model-value="(v) => (tarea.detalle = v.toUpperCase())"
            outlined
            dense
            autogrow
            type="textarea"
          ></q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      icon="phone"
      label="Información de contacto"
      header-class="bg-grey-1"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Nombre -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Nombres</label>
          <q-input
            v-model="tarea.nombre_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Apellidos -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Apellidos</label>
          <q-input
            v-model="tarea.apellidos_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Teléfono -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Teléfono</label>
          <q-input
            v-model="tarea.telefono_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Celular -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Celular</label>
          <q-input
            v-model="tarea.celular_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <div class="col-12">
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
        </div>
      </div></q-expansion-item
    >

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
  ></essential-selectable-table>
</template>

<script src="./GeneralContent.ts"></script>
