<template>
  <div class="q-psa-md bg-solid">
    <q-separator color="primary"></q-separator>
    <div class="col-12 bg-blue-1 text-primary text-bold q-px-md q-py-sm">
      <q-icon name="bi-ticket-detailed" class="q-mr-sm"></q-icon>
      Detalles
    </div>
    <q-separator color="primary"></q-separator>
    <div class="row q-col-gutter-sm q-pa-md">
      <!-- Asunto -->
      <div class="col-12">
        <label class="q-mb-sm block">Asunto</label>
        <q-input
          v-model="ticket.asunto"
          placeholder="Obligatorio"
          outlined
          :disable="disabled"
          dense
          autogrow
          type="textarea"
          :error="!!v$.asunto.$errors.length"
          @blur="v$.asunto.$touch"
        >
          <template v-slot:error>
            <div v-for="error of v$.asunto.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Descripcion -->
      <div class="col-12">
        <div class="row justify-between">
          <label class="q-mb-sm block">Descripción</label>
          <b class="text-italic">*No enviar imágenes demasiado grandes</b>
        </div>
        <essential-editor v-model="ticket.descripcion" :disable="disabled">
        </essential-editor>
        <div
          v-for="error of v$.descripcion.$errors"
          :key="error.$uid"
          class="text-negative text-uppercase"
        >
          <small>{{ error.$message }}</small>
        </div>
        <!-- <q-input
                v-model="ticket.descripcion"
                placeholder="Obligatorio"
                outlined
                :disable="disabled"
                dense
                autogrow
                type="textarea"
                :error="!!v$.descripcion.$errors.length"
                @blur="v$.descripcion.$touch"
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.descripcion.$errors"
                    :key="error.$uid"
                  >
                    <div>{{ error.$message }}</div>
                  </div>
                </template>
              </q-input> -->
      </div>

      <!-- Departamento -->
      <!-- :class="{ 'col-12': ticket.departamento_responsable.length > 1, -->
      <!-- 'col-md-9': ticket.departamento_responsable.length <= 1, }" -->
      <div class="col-12">
        <label class="q-mb-sm block">Departamento(s) que atenderá(n)</label>
        <q-select
          v-model="ticket.departamento_responsable"
          :options="departamentos"
          @filter="filtrarDepartamentos"
          transition-show="scale"
          transition-hide="scale"
          hint="Obligatorio"
          options-dense
          dense
          outlined
          :disable="disabled || departamentoDeshabilitado"
          :option-label="item => item.nombre"
          :option-value="item => item.id"
          use-input
          input-debounce="0"
          emit-value
          map-options
          use-chips
          multiple
          @add="agregarDepartamento"
          @remove="quitarDepartamento"
          @update:model-value="ajustarResponsablesInterno()"
          :error="!!v$.departamento_responsable.$errors.length"
          @blur="v$.departamento_responsable.$touch"
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
              v-for="error of v$.departamento_responsable.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Responsable -->
      <div
        v-if="
          !ticket.ticket_interno &&
          !ticket.ticket_para_mi &&
          responsables.length
        "
        class="col-12"
      >
        <label class="q-mb-sm block">Responsable(s)</label>
        <div class="row bg-body border-grey rounded-field">
          <div
            v-for="responsable in responsables"
            :key="responsable"
            class="q-pa-sm full-width"
          >
            <q-icon name="bi-person-fill"></q-icon>
            <span class="q-mr-xs">{{ responsable.empleado }}</span>
            <b>{{ `| ${responsable.departamento}` }}</b>
          </div>
        </div>
      </div>

      <div v-if="ticket.ticket_interno || ticket.ticket_para_mi" class="col-12">
        <label class="q-mb-sm block">Responsable(s)</label>
        <q-select
          v-model="ticket.responsable"
          :options="empleados"
          @filter="filtrarEmpleados"
          transition-show="scale"
          transition-hide="scale"
          hint="Obligatorio"
          options-dense
          dense
          outlined
          :disable="disabled || responsableDeshabilitado"
          :option-label="item => `${item.nombres} ${item.apellidos}`"
          :option-value="item => item.id"
          use-input
          input-debounce="0"
          emit-value
          map-options
          use-chips
          multiple
          :error="!!v$.responsable.$errors.length"
          @blur="v$.responsable.$touch"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Seleccione un departamento
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:error>
            <div v-for="error of v$.responsable.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Estado -->
      <div v-if="ticket.estado" class="col-12">
        <label class="q-mb-sm block">Estado actual</label>
        <estados-subtareas :propsTable="{ value: ticket.estado }" />
      </div>

      <!-- Codigo -->
      <div v-if="ticket.codigo" class="col-12">
        <label class="q-mb-sm block">Código del ticket</label>
        <q-input v-model="ticket.codigo" disable outlined dense> </q-input>
      </div>

      <div v-if="ticket.tiempo_hasta_finalizar" class="col-12">
        <label class="q-mb-sm block">Tiempo hasta finalizar</label>
        <q-input v-model="ticket.tiempo_hasta_finalizar" disable outlined dense>
        </q-input>
      </div>

      <!-- Solicitante-->
      <div class="col-12">
        <label class="q-mb-sm block">Solicitante</label>
        <b class="q-pa-sm block">{{ nombreUsuario }}</b>
      </div>

      <div class="col-12">
        <label class="q-mb-sm block">Fecha y hora de solicitud</label>
        <b class="q-pa-sm block">{{ fechaHoraActual }} </b>
      </div>

      <!-- Ticket interno -->
      <div v-if="esResponsableDepartamento" class="col-12">
        <br />
        <q-checkbox
          v-model="ticket.ticket_interno"
          label="Ticket interno"
          outlined
          :disable="disabled"
          @update:model-value="toggleTicketInterno()"
          dense
        ></q-checkbox>
      </div>

      <!-- Ticket para mi -->
      <div class="col-12">
        <br />
        <q-checkbox
          v-model="ticket.ticket_para_mi"
          label="Ticket para mi"
          outlined
          :disable="disabled"
          @update:model-value="toggleTicketParaMi()"
          dense
        ></q-checkbox>
      </div>

      <div class="col-12">
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
          :disable="disabled"
          :option-label="item => item.label"
          :option-value="item => item.label"
          use-input
          input-debounce="0"
          emit-value
          map-options
          :error="!!v$.prioridad.$errors.length"
          @blur="v$.prioridad.$touch"
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

          <template v-slot:error>
            <div v-for="error of v$.prioridad.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Fecha y hora limite -->
      <div class="col-12">
        <label class="q-mb-sm block">Fecha límite</label>
        <q-input
          v-model="fechaLimite"
          placeholder="Opcional"
          outlined
          :disable="disabled"
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
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Establecer hora -->
      <div class="col-12">
        <br />
        <q-checkbox
          v-model="ticket.establecer_hora_limite"
          label="Establecer hora límite"
          outlined
          :disable="disabled"
          dense
        ></q-checkbox>
      </div>

      <div v-if="ticket.establecer_hora_limite" class="col-12">
        <label class="q-mb-sm block">Hora límite</label>
        <q-input
          v-model="horaLimite"
          type="time"
          step="1"
          :disable="disabled"
          stack-label
          outlined
          dense
        >
        </q-input>
      </div>
    </div>

    <q-separator v-if="destinatarios.length"></q-separator>
    <div
      v-if="destinatarios.length"
      class="col-12 text-primary bg-background-header-grey q-px-md q-py-sm q-mb-md"
    >
      <q-icon name="bi-view-list"></q-icon>
      Categorías y tipos
    </div>
    <div
      v-for="destinatario in destinatarios"
      :key="destinatario.departamento_id"
      class="row q-px-md q-col-gutter-sm q-mb-md"
    >
      <div class="col-12">
        <label class="q-mb-sm block">Departamento</label>
        <q-chip>{{ destinatario.departamento }}</q-chip>
      </div>

      <div class="col-12">
        <label class="q-mb-sm block">Categorías para tipo de ticket</label>
        <q-select
          v-model="destinatario.categoria_id"
          :options="destinatario.categorias"
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
          @update:model-value="
            () => {
              destinatario.tipo_ticket_id = null
              obtenerTiposTickets(
                destinatario.departamento_id,
                destinatario.categoria_id
              )
            }
          "
        >
          <!-- :error="!!v$.categoria_tipo_ticket.$errors.length"
                @blur="v$.categoria_tipo_ticket.$touch" -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Seleccione un departamento
              </q-item-section>
            </q-item>
          </template>

          <!-- <template v-slot:error>
                  <div
                    v-for="error of v$.categoria_tipo_ticket.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template> -->
        </q-select>
      </div>

      <!-- Tipo de ticket -->
      <div class="col-12">
        <label class="q-mb-sm block">Tipo de ticket</label>
        <q-select
          v-model="destinatario.tipo_ticket_id"
          :options="destinatario.tipos_tickets"
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
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Seleccione una categoría
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <q-separator color="primary"></q-separator>
    <div class="col-12 text-primary bg-blue-1 q-px-md q-py-sm text-bold">
      <q-icon name="bi-people" class="q-mr-sm"></q-icon>
      Añadir CC - Las personas especificadas aqui podrán agregar comentarios al
      ticket
    </div>
    <q-separator color="primary"></q-separator>

    <div class="row q-pa-md q-col-gutter-sm">
      <div class="col-12">
        <label class="q-mb-sm block">Cc</label>
        <q-select
          v-model="ticket.cc"
          :options="empleadosOrigen"
          @filter="filtrarEmpleadosOrigen"
          transition-show="scale"
          transition-hide="scale"
          hint="Opcional"
          options-dense
          dense
          outlined
          :disable="disabled"
          :option-label="item => `${item.nombres} ${item.apellidos}`"
          :option-value="item => item.id"
          use-input
          input-debounce="0"
          emit-value
          map-options
          use-chips
          multiple
        >
        </q-select>
      </div>
    </div>

    <q-separator color="primary"></q-separator>
    <div class="col-12 text-primary bg-blue-1 q-px-md q-py-sm text-bold">
      <q-icon name="bi-archive" class="q-mr-sm"></q-icon>
      Archivos
    </div>
    <q-separator color="primary"></q-separator>

    <div class="row q-px-md q-col-gutter-sm">
      <div class="col-12 q-mb-md">
        <archivo-seguimiento
          ref="refArchivoTicket"
          :mixin="mixinArchivoTicket"
          :endpoint="endpoint"
          :disable="disabled"
          :permitir-eliminar="false"
          :listar-al-guardar="false"
        ></archivo-seguimiento>
      </div>
    </div>

    <q-btn color="primary" class="full-width" square @click="guardar(ticket)">Guardar</q-btn>
  </div>

  <modales-entidad
    :comportamiento="modalesTicket"
    :mixin-modal="mixin"
    :accion="filtrarTickets"
    @guardado="guardado"
    :confirmar-cerrar="false"
    :persistente="false"
  />
</template>

<script src="./TicketPage.ts"></script>
