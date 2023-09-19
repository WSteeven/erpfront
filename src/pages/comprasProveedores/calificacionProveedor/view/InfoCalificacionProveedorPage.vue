<template>
  <div class="q-pa-md">
    <q-expansion-item
      class="overflow-hidden q-mb-md expansion"
      label="Información del proveedor"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-sm">
        <!-- razon social -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Razón social</label>
          <q-input
            disable
            autogrow
            dense
            outlined
            v-model:model-value="proveedor.razon_social"
          />
        </div>
        <!-- sucursal -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Sucursal</label>
          <q-input
            disable
            dense
            outlined
            v-model:model-value="proveedor.sucursal"
          />
        </div>
        <!-- direccion -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            disable
            dense
            autogrow
            outlined
            v-model:model-value="proveedor.direccion"
          />
        </div>
        <!-- tipos que ofrece -->
        <div class="col-sm-6 col-md-3 col-xs-12">
          <label class="q-mb-sm block">Ofrece</label>
          <q-select
            disable
            dense
            outlined
            v-model="proveedor.tipos_ofrece"
            :options="ofertas"
            multiple
            use-chips
            :option-label="(v) => v.nombre"
            :option-value="(v) => v.id"
            map-options
          />
        </div>
      </div>
    </q-expansion-item>
    <q-expansion-item
      v-for="departamento in calificacionesDepartamentos"
      :key="departamento.id"
      class="overflow-hidden q-mb-md expansion"
      v-bind:label="
        'Calificaciones del departamento ' + departamento[0].departamento
      "
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-sm">
        <!-- tabla de criterios de bienes -->
        <div
          class="col-12 col-md-12"
          v-if="listadoFiltrado(departamento[1], 'bienes').length > 0"
        >
          <essential-table
            titulo="Criterios de bienes"
            :configuracionColumnas="[...columnasCriteriosConCalificacion]"
            :datos="listadoFiltrado(departamento[1], 'bienes')"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :permitirBuscar="false"
            :mostrarCantidadElementos="false"
            :mostrarFooter="false"
            :altoFijo="false"
          >
          </essential-table>
        </div>
        <div
          class="col-12 col-md-12"
          v-if="listadoFiltrado(departamento[1], 'servicios').length > 0"
        >
          <essential-table
            titulo="Criterios de servicios"
            :configuracionColumnas="[...columnasCriteriosConCalificacion]"
            :datos="listadoFiltrado(departamento[1], 'servicios')"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :permitirBuscar="false"
            :mostrarCantidadElementos="false"
            :mostrarFooter="false"
            :altoFijo="false"
          >
          </essential-table>
        </div>

        <div class="col-12 col-md-12">
          <q-card flat bordered>
            <q-card-section>
                <div class="text-h5">
                  Empleado: {{ departamento[0].empleado }}
                </div>
              </q-card-section>
            <q-card-section>
              <div class="text-h6">
                Calificación: {{ departamento[0].calificacion }}/100
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text">
                Fecha de calificación:
                <strong>{{ departamento[0].fecha_calificacion }}</strong>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-expansion-item>
    <!-- carga de archivos de soporte -->
    <div class="col-12 q-mb-md">
          <gestor-archivos
            ref="refArchivo"
            :mixin="mixinArchivos"
            :permitir-subir="false"
            :permitir-eliminar="false"
            :idModelo="idDetalleDepartamentoProveedor"
            >
            <!-- @inicializado="cargarArchivos(departamento[0].id)" -->
            <template #boton-subir>
              <q-btn
                v-if="mostrarBotonSubir"
                color="positive"
                push
                no-caps
                class="full-width q-mb-lg"
                @click="subirArchivos()"
              >
                <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                Subir archivos seleccionados</q-btn
              >
            </template>
          </gestor-archivos>
        </div>
  </div>
</template>
<script src="./InfoCalificacionProveedorPage.ts" />
