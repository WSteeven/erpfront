<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasSolicitudDescuento"
    :tabOptions="tabOptionsEstadosSolicitudDescuento"
    :filtrar="filtrarSolicitudes"
    :tabDefecto="tabActual"
    ajustar-celdas
    forzar-listar
    :mostrar-listado="!enRutaInspeccionIncidente"
    :permitir-editar="false"
    :permitir-cancelar="!enRutaInspeccionIncidente"
    :accion1="btnEstablecerPrecios"
    :accion2="btnConfirmarDescuento"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Titulo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Título</label>
            <q-input
              v-model="solicitud.titulo"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              autogrow
              outlined
              dense
              :error="!!v$.titulo.$errors.length"
              @blur="v$.titulo.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Descripcion -->
          <div class="col-12 col-md-9">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="solicitud.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              autogrow
              outlined
              dense
              :error="!!v$.descripcion.$errors.length"
              @blur="v$.descripcion.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Responsable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado solicitante</label>
            <q-input
              v-model="solicitud.empleado_solicitante"
              disable
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado involucrado</label>
            <q-select
              v-model="solicitud.empleado_involucrado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :disable="disabled || deshabilitarAgregarProductos"
              :error="!!v$.empleado_involucrado.$errors.length"
              @blur="v$.empleado_involucrado.$touch"
              @filter="filtrarEmpleados"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
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

              <template v-slot:error>
                <div
                  v-for="error of v$.empleado_involucrado.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div v-if="accion === acciones.consultar" class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <b>{{ solicitud.estado }}</b>
          </div>

          <div v-if="accion === acciones.consultar" class="col-12 col-md-3">
            <label class="q-mb-sm block">Incidente</label>
            <b>{{ solicitud.incidente }}</b>
          </div>

          <div
            v-if="accion === acciones.consultar"
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block">Fecha hora de solicitud</label>
            <b>{{ solicitud.created_at }}</b>
          </div>

          <!-- <div v-if="accion !== acciones.nuevo" class="col-12 col-md-3">
            <q-toggle
              class="q-mt-lg q-pt-md"
              v-model="solicitud.finalizado"
              label="¿Finalizado?"
              :disable="disabled"
              color="positive"
              outlined
              dense
            ></q-toggle>
          </div> -->

          <div
            v-if="solicitud.incidente"
            class="col-12 bg-solid q-pa-sm border-callout-info"
          >
            <q-icon
              name="bi-info-circle"
              color="grey-7"
              class="q-mr-sm"
            ></q-icon>
            {{
              'No es necesario adjuntar archivos. Los archivos de la incidencia se adjuntarán automáticamente en esta solicitud. Si aún asi desea hacerlo los archivos nuevos también se mostrarán al momento de consultar la solicitud.'
            }}
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12">
            <gestor-archivos
              ref="refArchivo"
              label="Adjuntar archivos"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idEntidad"
            />
          </div>

          <div class="col-12 q-mb-md">
            <seleccion-productos-usuario
              :mixin="mixin"
              :propietario="solicitud.empleado_involucrado"
              :disable="disabled"
              :deshabilitar-agregar-productos="deshabilitarAgregarProductos"
              :configuracion-columnas="columnas"
              :accion1="btnEditarPrecioUnitario"
              :accion2="btnEditarCantidad"
              :accion3="btnEliminar"
            />
          </div>

          <div class="col-12 row justify-end">
            <span class="column items-end q-gutter-sm">
              <span>Precio total a descontar</span>
              <b class="text-h3">{{ '$ ' + precioTotal }}</b>
            </span>
          </div>
        </div>
      </q-form>
    </template>

    <template #custom-buttons>
      <div v-if="accion === acciones.consultar" class="row q-col-gutter-x-xs">
        <q-btn
          v-if="
            [
              estadosSolicitudDescuento.CREADO,
              estadosSolicitudDescuento.PRECIOS_ESTABLECIDOS
            ].includes(solicitud.estado) &&
            authenticationStore.can(
              'puede.editar.precios_unitarios_solicitudes_descuentos'
            )
          "
          icon="bi-cash-coin"
          color="positive"
          label="Confirmar precios establecidos"
          @click="confirmarPreciosEstablecidos()"
          no-caps
          push
        ></q-btn>

        <q-btn
          v-if="
            solicitud.estado ===
              estadosSolicitudDescuento.PRECIOS_ESTABLECIDOS &&
            authenticationStore.can(
              'puede.confirmar.descuento_realizado_solicitudes_descuentos'
            )
          "
          icon="bi-check-circle"
          color="primary"
          label="Confirmar descuento realizado"
          @click="confirmarDescuentoRealizado()"
          unelevated
          no-caps
          square
        ></q-btn>
      </div>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./SolicitudDescuentoPage.ts"></script>
