<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <div class="text-center bg-primary q-pb-md q-pt-sm">
        <q-btn
          class="bg-white text-primary"
          push
          no-caps
          @click="agregarRegistro()"
        >
          <q-icon name="bi-plus-circle-fill" size="xs" class="q-mr-sm"></q-icon>
          Nuevo registro</q-btn
        >
      </div>

      <!-- Tabs -->
      <q-tabs
        v-model="tabRegistro"
        vertical
        indicator-color="transparent"
        class="bg-primary text-white q-px-xs alto-tabla"
        active-bg-color="white"
        active-class="text-black bg-desenfoque border-grey text-bold"
        :style="'height:' + altoTabla"
      >
        <q-tab
          v-for="registro in registros"
          :key="registro.id"
          :name="registro.id"
          class="q-mb-xs"
          :class="{ 'bg-blue': tabRegistro !== registro.id }"
          no-caps
          @click="seleccionarRegistro(registro)"
        >
          <q-icon
            name="bi-person"
            size="xs"
            class="q-mb-xs"
            :class="{ 'text-primary': tabRegistro === registro.id }"
          ></q-icon>
          <span>Registro # {{ registro.numero_registro }}</span>
        </q-tab>
      </q-tabs>
    </template>

    <template v-slot:after>
      <q-tab-panels
        v-model="tabRegistro"
        animated
        transition-prev="scale"
        transition-next="scale"
        helpalive
      >
        <q-tab-panel
          v-for="registro in registros"
          :key="registro.id"
          :name="registro.id"
          class="text-primary bg-grey-4 q-pa-none"
        >
          <div class="row q-pa-md">
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block"> Fecha y hora de registro </label>
              <div class="text-bold">{{ registro.created_at }}</div>
            </div>

            <div class="col-12 col-md-6 q-mb-md">
              <label class="q-mb-sm block"> Observación </label>
              <div class="text-bold">{{ registro.observacion }}</div>
            </div>

            <q-btn
              class="col-12 q-mb-sm bg-white text-black"
              no-caps
              push
              @click="abrirFichaAptitud()"
            >
              <q-icon
                name="bi-table"
                class="q-mr-sm"
                color="positive"
                size="xs"
              ></q-icon>
              {{ textoFichaAptitud }}
            </q-btn>

            <q-btn
              v-if="mostrarFichaPreocupacional"
              class="col-12 bg-white text-dark"
              no-caps
              push
              @click="abrirFichaPeriodicaProcupacional()"
            >
              <q-icon
                name="bi-table"
                class="q-mr-sm"
                color="primary"
                size="xs"
              ></q-icon>
              {{ textoFichaPeriodicaPreocupacional }}
            </q-btn>

            <q-btn
              v-if="mostrarFichaRetiro"
              class="col-12 bg-white text-dark"
              no-caps
              push
              @click="abrirFichaRetiro()"
            >
              <q-icon
                name="bi-table"
                class="q-mr-sm"
                color="primary"
                size="xs"
              ></q-icon>
              {{ textoFichaRetiro }}
            </q-btn>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <div v-if="tabRegistro" class="q-px-sm">
        <q-tabs
          v-model="tabEstadoExamen"
          align="justify"
          active-color="primary"
          indicator-color="primary"
          active-bg-color="blue-1"
          active-class="tab-active"
          class="border-bottom-grey-5"
          dense
        >
          <q-tab
            :name="estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value"
            :label="estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.label"
            :class="{
              'tab-inactive':
                tabEstadoExamen !==
                estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value,
            }"
            no-caps
            :icon="estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.icono"
            @click="filtrarEstadoExamen(tabEstadoExamen)"
          />
          <q-tab
            :name="estadosSolicitudesExamenes.SOLICITADO.value"
            :label="estadosSolicitudesExamenes.SOLICITADO.label"
            :class="{
              'tab-inactive':
                tabEstadoExamen !== estadosSolicitudesExamenes.SOLICITADO.value,
            }"
            no-caps
            :icon="estadosSolicitudesExamenes.SOLICITADO.icono"
            @click="filtrarEstadoExamen(tabEstadoExamen)"
          />
          <!-- <q-tab
            :name="estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value"
            :label="estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.label"
            :class="{
              'tab-inactive':
                tabEstadoExamen !==
                estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value,
            }"
            class="q-pt-sm"
            no-caps
            :icon="estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.icono"
            @click="filtrarEstadoExamen(tabEstadoExamen)"
          /> -->
        </q-tabs>

        <q-tab-panels
          v-model="tabEstadoExamen"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="q-mb-md"
          helpalive
        >
          <q-tab-panel
            :name="estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value"
            class="q-pa-none"
          >
            <essential-table
              ref="refTablaExamenes"
              titulo="Examenes comúnes"
              :configuracionColumnas="[
                ...configuracionColumnasExamenes,
                accionesTabla,
              ]"
              :datos="examenes"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :accion1Header="btnSeleccionarVariosExamenes"
              :accion2Header="btnCancelarSeleccionarVariosExamenes"
              :accion3Header="btnSolicitarExamenesSeleccionados"
              :accion1="btnSolicitarExamenIndividual"
              :tipo-seleccion="tipoSeleccion"
              @selected="seleccionarExamen"
              :alto-fijo="false"
              :permitir-editar-celdas="true"
            ></essential-table>
          </q-tab-panel>

          <q-tab-panel
            :name="estadosSolicitudesExamenes.SOLICITADO.value"
            class="q-pa-none"
          >
            <essential-table
              titulo="Solicitudes de exámenes"
              :configuracionColumnas="[
                ...configuracionColumnasSolicitudExamen,
                accionesTabla,
              ]"
              :datos="solicitudesExamenes"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :accion1Header="btnResultados"
              :accion2Header="btnCitaMedica"
              :accion1="btnConsultarEstadoSolicitudExamen"
              :accion2="btnSubirResultadosExamenes"
              :alto-fijo="false"
            ></essential-table>
          </q-tab-panel>

          <!-- <q-tab-panel
            :name="estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value"
            class="q-pa-none"
          >
            <essential-table
              titulo="Solicitudes de exámenes aprobadas"
              :configuracionColumnas="[
                ...configuracionColumnasSolicitudExamen,
                accionesTabla,
              ]"
              :datos="solicitudesExamenes"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :accion1="btnConsultarEstadoSolicitudExamen"
              :accion1Header="btnResultados"
              :accion2Header="btnCitaMedica"
              :alto-fijo="false"
            ></essential-table>
          </q-tab-panel> -->
        </q-tab-panels>
      </div>

      <div
        v-else
        class="row text-primary h-100 q-py-xl items-center justify-center"
      >
        Crea un registro y luego seleccionalo
      </div>

      <modales-entidad
        :comportamiento="modales"
        :mixin-modal="mixin"
        :confirmar-cerrar="false"
        :persistente="false"
        @guardado="actualizarListadoExamenes"
      />
    </template>
  </q-splitter>
</template>

<script src="./PanelTipoProceso.ts"></script>
