<template>
  <div class="q-pa-md">
    <q-expansion-item
      class="overflow-hidden q-mb-md expansion"
      label="Información general"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Asunto -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Asunto</label>
          <q-input
            v-model="ticket.asunto"
            placeholder="Obligatorio"
            outlined
            disable
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <!-- Descripcion -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Descripción</label>
          <q-input
            v-model="ticket.descripcion"
            placeholder="Obligatorio"
            outlined
            disable
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <!-- Estado -->
        <div v-if="ticket.estado" class="col-12 col-md-3">
          <label class="q-mb-sm block">Estado actual</label>
          <estados-subtareas :propsTable="{ value: ticket.estado }" />
        </div>

        <!-- Motivo cancelado -->
        <div v-if="ticket.motivo_cancelado_ticket" class="col-12 col-md-3">
          <label class="q-mb-sm block">Motivo de cancelación del ticket</label>
          <q-input
            v-model="ticket.motivo_cancelado_ticket"
            disable
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Codigo -->
        <div v-if="ticket.codigo" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código del ticket</label>
          <q-input v-model="ticket.codigo" disable outlined dense> </q-input>
        </div>

        <!-- Solicitante-->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Solicitante</label>
          <q-input
            v-model="ticket.solicitante"
            outlined
            dense
            disable
            autogrow
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha y hora de solicitud</label>
          <q-input v-model="ticket.fecha_hora_solicitud" disable outlined dense>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Departamento responsable</label>
          <q-input
            v-model="ticket.departamento_responsable"
            outlined
            dense
            disable
            autogrow
          ></q-input>
        </div>

        <!-- Ticket interno -->
        <div class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="ticket.ticket_interno"
            label="Ticket interno"
            outlined
            disable
            @update:model-value="toggleTicketInterno()"
            dense
          ></q-checkbox>
        </div>

        <!-- Ticket para mi -->
        <div class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="ticket.ticket_para_mi"
            label="Ticket para mi"
            outlined
            disable
            @update:model-value="toggleTicketParaMi()"
            dense
          ></q-checkbox>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Responsable</label>
          <q-input
            v-model="ticket.responsable"
            outlined
            dense
            disable
            autogrow
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Categorías para tipo de ticket</label>
          <q-input
            v-model="ticket.categoria_tipo_ticket"
            outlined
            dense
            disable
            autogrow
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo de ticket</label>
          <q-input
            v-model="ticket.tipo_ticket"
            outlined
            dense
            disable
            autogrow
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Prioridad</label>
          <q-select
            v-model="ticket.prioridad"
            :options="tiposPrioridades"
            transition-show="scale"
            transition-hide="scale"
            hint="Obligatorio"
            options-dense
            dense
            outlined
            disable
            :option-label="(item) => item.label"
            :option-value="(item) => item.label"
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

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon name="bi-dot" :color="scope.opt.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- Fecha y hora limite -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha límite</label>
          <q-input
            v-model="fechaLimite"
            placeholder="Opcional"
            outlined
            disable
            type="datetime"
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="fechaLimite" :mask="maskFecha" today-btn>
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

        <!-- Establecer hora -->
        <div class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="ticket.establecer_hora_limite"
            label="Establecer hora límite"
            outlined
            disable
            dense
          ></q-checkbox>
        </div>

        <div v-if="ticket.establecer_hora_limite" class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora límite</label>
          <q-input
            v-model="horaLimite"
            type="time"
            step="1"
            disable
            stack-label
            outlined
            dense
          >
          </q-input>
        </div>

        <div class="col-12 q-mb-md">
          <archivo-seguimiento
            ref="refArchivoTicket"
            :mixin="mixinArchivoTicket"
            :endpoint="endpoint"
            :disable="true"
            :permitir-eliminar="false"
            :listar-al-guardar="false"
          ></archivo-seguimiento>
        </div>
      </div>
    </q-expansion-item>

    <q-card v-if="ticket.calificaciones.length" class="rounded-card q-mb-md">
      <q-card-section>
        <div class="text-bold q-mb-lg">
          <q-icon name="bi-stars"></q-icon>
          Calificaciones
        </div>
        <div
          v-for="item in ticket.calificaciones"
          :key="item.id"
          class="row q-col-gutter-sm q-mb-md"
        >
          <!-- Calificacion -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block"
              >Calificación del {{ item.solicitante_o_responsable }}</label
            >
            <q-chip color="grey-3">
              <q-icon
                v-for="index in item.calificacion"
                :key="index"
                name="bi-star-fill"
                color="yellow-7"
                class="q-mr-xs"
              ></q-icon>
              {{ obtenerTexto(item.calificacion) }}
            </q-chip>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-8">
            <label class="q-mb-sm block"
              >Observación del {{ item.solicitante_o_responsable }}</label
            >
            <q-input
              v-model="item.observacion"
              outlined
              disable
              dense
              autogrow
              type="textarea"
            >
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <essential-table
      v-if="pausas.length"
      titulo="Listado de pausas realizadas"
      :configuracionColumnas="columnasPausas"
      :datos="pausas"
      separador="cell"
      :alto-fijo="false"
      :permitir-buscar="false"
      :mostrar-footer="!pausas.length"
      estilos="margin-bottom: 16px;"
    ></essential-table>

    <essential-table
      v-if="rechazos.length"
      titulo="Listado de rechazos realizados"
      :configuracionColumnas="configuracionColumnasTicketRechazado"
      :datos="rechazos"
      separador="cell"
      :alto-fijo="false"
      :permitir-buscar="false"
      :mostrar-footer="!rechazos.length"
    ></essential-table>
  </div>

  <!-- <modales-entidad
    :comportamiento="modalesTicket"
    :mixin-modal="mixin"
    :accion="filtrarTickets"
    @guardado="guardado"
  /> -->
</template>

<script src="./DetalleCompletoTicket.ts"></script>
