<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTicket"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :tabOptions="tabOptionsEstadosTickets"
    :filtrar="filtrarTickets"
    :tabDefecto="tabActual"
    :forzarListar="true"
    :accion1="btnAsignar"
    :accion2="btnReasignar"
    :accion3="btnSeguimiento"
    :accion4="btnCancelar"
    :accion5="btnCalificarSolicitante"
    :accion6="btnPausarRecurrente"
    subtitulo-pagina="Módulo de Tickets"
  >
    <template #formulario>
      <div class="q-pa-md">
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información general"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
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
              <essential-editor
                v-model="ticket.descripcion"
                :disable="disabled"
              >
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
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block"
                >Departamento(s) que atenderá(n)
                <small class="text-primary text-italic"
                  >*Crea una copia del ticket para cada departamento</small
                ></label
              >
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
              class="col-12 col-md-6"
            >
              <label class="q-mb-sm block">Responsable(s)</label>
              <div class="row bg-body border-grey rounded-field">
                <div
                  v-for="responsable in responsables"
                  :key="responsable"
                  class="q-pa-sm full-width"
                >
                  <q-icon
                    name="bi-person-fill"
                    class="q-mr-sm"
                    color="primary"
                  ></q-icon>
                  <span class="q-mr-xs">{{ responsable.empleado }}</span>
                  <b>{{ `| ${responsable.departamento}` }}</b>
                </div>
              </div>
            </div>

            <div
              v-if="ticket.ticket_interno || ticket.ticket_para_mi"
              class="col-12 col-md-6"
            >
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
                  <div
                    v-for="error of v$.responsable.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Estado -->
            <div v-if="ticket.estado" class="col-12 col-md-3">
              <label class="q-mb-sm block">Estado actual</label>
              <estados-subtareas :propsTable="{ value: ticket.estado }" />
            </div>

            <!-- Codigo -->
            <div v-if="ticket.codigo" class="col-12 col-md-3">
              <label class="q-mb-sm block">Código del ticket</label>
              <q-input v-model="ticket.codigo" disable outlined dense>
              </q-input>
            </div>

            <div v-if="ticket.tiempo_hasta_finalizar" class="col-12 col-md-3">
              <label class="q-mb-sm block">Tiempo hasta finalizar</label>
              <q-input
                v-model="ticket.tiempo_hasta_finalizar"
                disable
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Solicitante-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Solicitante</label>
              <b class="q-pa-sm block">{{ nombreUsuario }}</b>
            </div>

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora de solicitud</label>
              <b class="q-pa-sm block">{{ fechaHoraActual }} </b>
            </div>

            <!-- Ticket interno -->
            <div v-if="esResponsableDepartamento" class="col-12 col-md-3">
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
            <div class="col-12 col-md-3">
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
            <div class="col-12 col-md-3">
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
                :disable="disabled"
                dense
              ></q-checkbox>
            </div>

            <div v-if="ticket.establecer_hora_limite" class="col-12 col-md-3">
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

          <!-- <q-separator v-if="destinatarios.length"></q-separator> -->
          <!-- <div
            v-if="destinatarios.length"
            class="col-12 text-primary bg-background-header-grey q-px-md q-py-sm q-mb-md"
          >
            <q-icon name="bi-view-list"></q-icon>
            Categorías y tipos
          </div> -->
          <q-separator color="primary"></q-separator>
          <div
            id="step1"
            class="col-12 text-primary bg-blue-1 q-px-md q-py-sm text-bold"
          >
            <q-icon name="bi-view-list" class="q-mr-sm"></q-icon>
            Categorías y tipos
          </div>
          <q-separator color="primary" class="q-mb-lg"></q-separator>

          <div
            v-for="destinatario in destinatarios"
            :key="destinatario.departamento_id"
            class="row q-px-md q-col-gutter-sm q-mb-md"
          >
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Departamento</label>
              <q-chip>{{ destinatario.departamento }}</q-chip>
            </div>

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Categorías para tipo de ticket</label
              >
              <q-select
                v-model="destinatario.categoria_id"
                :options="destinatario.categorias_filter"
                transition-show="scale"
                transition-hide="scale"
                @filter="
                  (val, update) =>
                    (destinatario.categorias_filter =
                      filtrarCategoriasTiposTickets(val, update, destinatario))
                "
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
              </q-select>
            </div>

            <!-- Tipo de ticket -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de ticket</label>
              <q-select
                v-model="destinatario.tipo_ticket_id"
                :options="destinatario.tipos_tickets_filter"
                transition-show="scale"
                transition-hide="scale"
                hint="Obligatorio"
                @filter="
                  (val, update) =>
                    (destinatario.tipos_tickets_filter = filtrarTiposTickets(
                      val,
                      update,
                      destinatario
                    ))
                "
                options-dense
                dense
                outlined
                :disable="disabled"
                :option-label="item => item.nombre"
                :option-value="item => item.id"
                @update:model-value="
                  establecerIdDestinatarioAutomatico(destinatario)
                "
                use-input
                input-debounce="0"
                emit-value
                map-options
              >
                <!-- :error="!!v$.tipo_ticket.$errors.length"
                @blur="v$.tipo_ticket.$touch" -->
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Seleccione una categoría
                    </q-item-section>
                  </q-item>
                </template>

                <!-- <template v-slot:error>
                  <div
                    v-for="error of v$.tipo_ticket.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template> -->
              </q-select>
            </div>

            <div
              v-if="
                obtenerDestinatarioAutomatico(destinatario.tipo_ticket_id) &&
                !ticket.ticket_interno
              "
              class="col-12 col-md-3"
            >
              <label class="q-mb-sm block">Destinatario automático</label>
              <q-input
                :model-value="
                  obtenerDestinatarioAutomatico(destinatario.tipo_ticket_id)
                "
                outlined
                disable
                dense
                autogrow
              />
            </div>
          </div>

          <q-separator color="primary"></q-separator>
          <div class="col-12 text-primary bg-blue-1 q-px-md q-py-sm text-bold">
            <q-icon name="bi-people" class="q-mr-sm"></q-icon>
            Añadir CC - Las personas especificadas aqui podrán agregar y leer
            comentarios en el seguimiento del ticket
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
          <div
            id="step2"
            class="col-12 text-primary bg-blue-1 q-px-md q-py-sm text-bold"
          >
            <q-icon name="bi-repeat" class="q-mr-sm"></q-icon>
            Crear mismo ticket periódicamente
          </div>
          <q-separator color="primary"></q-separator>

          <div class="row q-pa-md">
            <div class="col-12 col-md-3">
              <q-toggle
                ref="step3"
                v-model="ticket.is_recurring"
                label="¿Es recurrente?"
                :disable="disabled"
              />
            </div>

            <div
              id="step4"
              v-show="ticket.is_recurring"
              class="col-12 col-md-4"
            >
              <q-btn-toggle
                v-model="ticket.recurrence_active"
                class="toggle-button-primary"
                :disable="disabled"
                spread
                no-caps
                rounded
                toggle-color="primary"
                unelevated
                :options="[
                  {
                    label: 'Activar',
                    value: true,
                    icon: 'bi-play-fill'
                  },
                  {
                    label: 'Pausar',
                    value: false,
                    icon: 'bi-pause-fill'
                  }
                ]"
              />
            </div>
          </div>

          <div
            id="step5"
            v-show="ticket.is_recurring"
            class="row q-gutter-md q-pa-md"
          >
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Frecuencia</label>
              <q-select
                v-model="ticket.recurrence_frequency"
                :options="frequencyOptions"
                :disable="disabled"
                dense
                outlined
                options-dense
                :option-label="item => item.label"
                :option-value="item => item.value"
                :error="!!v$.recurrence_frequency.$errors.length"
                @blur="v$.recurrence_frequency.$touch"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.recurrence_frequency.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Hora</label>
              <q-input
                v-model="ticket.recurrence_time"
                readonly
                dense
                outlined
              />
            </div>

            <div
              v-if="ticket.recurrence_frequency === 'WEEKLY'"
              class="col-12 col-md-3"
            >
              <label class="q-mb-sm block">Día de la semana</label>
              <q-select
                v-model="ticket.recurrence_day_of_week"
                :options="daysOfWeekOptions"
                :rules="[val => val !== null || 'Selecciona un día']"
                :disable="disabled"
                dense
                outlined
                options-dense
                emit-value
                map-options
              />
            </div>

            <div
              v-if="ticket.recurrence_frequency === 'MONTHLY'"
              class="col-12 col-md-3"
            >
              <label class="q-mb-sm block">Día del mes</label>
              <q-input
                v-model="ticket.recurrence_day_of_month"
                :disable="disabled"
                type="number"
                dense
                outlined
                :rules="[
                  val => !!val || 'El día es requerido',
                  val => (val >= 1 && val <= 31) || 'Día entre 1 y 31'
                ]"
              />
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
        </q-expansion-item>

        <q-card
          v-if="ticket.calificaciones.length"
          class="rounded-card q-mb-md"
        >
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
    </template>
  </tab-layout-filter-tabs2>

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
