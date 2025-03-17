<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasTipoTicket"
    :permitir-eliminar="false"
    :permitir-editar="true"
    :permitir-consultar="false"
    :accion1="btnToggleActivar"
    subtitulo-pagina="Módulo de Tickets"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Departamento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione un departamento</label>
            <q-select
              v-model="tipoTicket.departamento"
              :options="departamentos"
              @filter="filtrarDepartamentos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="tipoTicket.categoria_tipo_ticket = null"
              :error="!!v$.departamento.$errors.length"
              @blur="v$.departamento.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.departamento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Categoria -->
          <!-- @filter="filtrarCategoriasTiposTickets" -->
          <div v-if="tipoTicket.departamento" class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione una categoría</label>
            <q-select
              v-model="tipoTicket.categoria_tipo_ticket"
              :options="categoriasTiposTickets"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.categoria_tipo_ticket.$errors.length"
              @blur="v$.categoria_tipo_ticket.$touch"
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
                  v-for="error of v$.categoria_tipo_ticket.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div v-if="tipoTicket.categoria_tipo_ticket" class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del tipo de ticket</label>
            <q-input
              v-model="tipoTicket.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div v-if="tipoTicket.categoria_tipo_ticket" class="col-12 col-md-3">
            <label class="q-mb-sm block">Destinatario</label>
            <q-input
              v-model="criterioBusquedaDestinatario"
              placeholder="Escriba y presione enter para buscar"
              hint="Puede buscar por nombre, apellido o identificación"
              :disable="disabled"
              @keydown.enter="
                listarDestinatario({ departamento_id: tipoTicket.departamento, estado: 1 })
              "
              @blur="resetearDestinatario()"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="
                    tipoTicket.destinatario
                      ? 'bi-check-circle-fill'
                      : 'bi-check-circle'
                  "
                  :color="tipoTicket.destinatario ? 'positive' : 'grey-6'"
                  size="xs"
                ></q-icon>
              </template>

              <template #after>
                <q-btn
                  color="positive"
                  :icon="iconos.buscar"
                  @click="listarDestinatario"
                  unelevated
                  dense
                >
                  <q-tooltip>Recargar empleados</q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>

          <div v-if="tipoTicket.categoria_tipo_ticket" class="col-12 col-md-3">
            <br />
            <q-toggle
              v-model="tipoTicket.activo"
              checked-icon="check"
              :disable="disabled"
              label="Activo"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>

    <template #modales>
      <essential-selectable-table
        ref="refListadoSeleccionableDestinatario"
        :configuracion-columnas="configuracionColumnasEmpleadosLite"
        :datos="listadoDestinatario"
        @selected="seleccionarDestinatario"
        tipo-seleccion="single"
      ></essential-selectable-table>
    </template>
  </tab-layout>
</template>

<script src="./TipoTicketPage.ts"></script>
