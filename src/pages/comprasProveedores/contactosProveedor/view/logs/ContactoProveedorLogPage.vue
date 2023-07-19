<template>
    <q-card class="rounded-card custom-shadow">
      <div class="row q-col-gutter-sm q-pa-sm">
        <div class="q-px-lg q-py-md">
          <q-timeline color="secondary">
            <q-timeline-entry heading>
              Ultimos cambios de la tabla
              <strong>Contactos de Proveedores</strong>
            </q-timeline-entry>

            <q-timeline-entry
              v-for="l in listado"
              :key="l.id"
              :title="`Evento: ${l.event}`"
              :color="`${l.event == 'created'
                  ? 'green'
                  : l.event == 'updated'
                  ? 'orange'
                  : l.event == 'deleted'
                  ? 'red'
                  : 'gray'
              }`"
              :subtitle="`[${l.updated_at}], ${l.user_name} [${l.ip_address}] ${
                l.event == 'created'
                  ? 'ha creado un registro'
                  : l.event == 'updated'
                  ? 'ha actualizado un registro'
                  : l.event == 'deleted'
                  ? 'ha eliminado un registro'
                  : 'ha restaurado un registro'
              }`"
            >
            <p>Id de registro: {{l.auditable_id}}
            <br>Ingreso desde: {{l.user_agent}}</p>
              <div class="row q-col-gutter-sm q-pa-sm">
                <div class="col-12 col-md-12">
                  <q-card class="myCard" bordered>
                    <q-card-section horizontal>
                      <q-card-section v-if="l.event !== 'created'">
                        <q-item-label
                          ><strong>Antiguos valores</strong></q-item-label
                        >
                        <q-separator />
                        {{ l.old_values }}
                        <!-- Nombres: {{ l.old_values.nombres }} <br />
                        Apellidos: {{ l.old_values.apellidos }} <br />
                        Celular: {{ l.old_values.celular }} <br />
                        Telefono: {{ l.old_values.ext }} <br />
                        Correo: {{ l.old_values.correo }} <br />
                        Tipo de contacto: {{ l.old_values.tipo_contacto }}
                        <br />
                        Proveedor: {{ l.old_values.proveedor_id }} <br /> -->
                      </q-card-section>

                      <q-separator vertical />

                      <q-card-section>
                        <q-item-label
                          ><strong>Nuevos valores</strong></q-item-label
                        >
                        <q-separator />
                        {{ l.new_values }}
                      </q-card-section>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-timeline-entry>
          </q-timeline>
        </div>
      </div>
    </q-card>
</template>
<script src="./ContactoProveedorLogPage.ts"></script>
