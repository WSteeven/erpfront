<template>
  <tab-layout
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    :mostrar-button-submits="false"
    titulo-pagina="Solicitud de materiales a bodega"
  >
    <template #formulario>
      <q-card flat bordered class="q-mb-md">
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Fecha de solicitud -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="solicitud.fecha_solicitud"
              label="Fecha de solicitud"
              outlined
              dense
              readonly
            ></q-input>
          </div>

          <!-- Grupo solicitante -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="solicitud.grupo"
              label="Grupo solicitante"
              outlined
              dense
              readonly
            ></q-input>
          </div>

          <!-- Estado de la solicitud -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="solicitud.estado"
              label="Estado de la solicitud"
              outlined
              dense
              readonly
            ></q-input>
          </div>
        </div>
      </q-card>

      <div class="q-gutter-md column">
        <essential-table
          titulo="materiales solicitados"
          :configuracionColumnas="
            configuracionColumnasMaterialesSolicitadosAccion
          "
          :datos="materialesSolicitados"
          :permitirConsultar="false"
          @editar="editar"
          @eliminar="eliminar"
        ></essential-table>
        <!-- <q-btn color="primary" no-caps rounded flat>
          <div>Visualizar listado de materiales completo</div>
        </q-btn> -->

        <div class="row q-gutter-md justify-end">
          <q-btn color="primary" no-caps @click="aprobar()">
            <q-icon name="bi-check" class="q-mr-sm"></q-icon>
            <div>Aprobar</div>
          </q-btn>

          <q-btn color="negative" no-caps @click="rechazar()">
            <q-icon name="bi-x-lg" size="xs" class="q-mr-sm"></q-icon>
            <div>Rechazar</div>
          </q-btn>
        </div>
      </div>
    </template>
  </tab-layout>
</template>

<script src="./SolicitudMaterialesPage.ts"></script>
