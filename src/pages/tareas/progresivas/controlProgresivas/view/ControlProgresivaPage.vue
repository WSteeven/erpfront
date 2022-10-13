<template>
  <!--<tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTiposTareas"
    :datos="datos"
    tituloPagina="Control de progresivas"
  >
    <template #formulario> -->
  <q-page padding>
    <div class="text-bold">Control de tendidos</div>
    <q-form @submit.prevent="enviar()">
      <div class="row q-col-gutter-sm q-py-md">
        <!-- Subtarea JP -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de subtarea</label>
          <q-input
            v-model="progresiva.codigo_subtarea_jp"
            placeholder="Obligatorio"
            outlined
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-9">
          <label class="q-mb-sm block"
            >Detalle / Ruta / Enlace / Proyecto</label
          >
          <q-input
            v-model="progresiva.nombre_proyecto"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Grupo -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Grupo</label>
          <q-input v-model="progresiva.grupo" disable outlined dense></q-input>
        </div>

        <!-- Tecnico responsable -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tecnico responsable</label>
          <q-input
            v-model="progresiva.tecnico_responsable"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Fecha de instalación -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de instalación</label>
          <q-input v-model="progresiva.fecha" outlined dense mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="progresiva.fecha">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- Codigo bobina -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de bobina</label>
          <q-input
            v-model="progresiva.codigo_bobina"
            placeholder="Obligatorio"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Marca inicial -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Cantidad de hilos</label>
          <q-input
            v-model="progresiva.cantidad_hilos"
            placeholder="Obligatorio"
            hint="Bobina seleccionada"
            outlined
            disable
            dense
          ></q-input>
        </div>

        <!-- Cantidad postes -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Cantidad de postes</label>
          <q-input
            v-model="progresiva.cantidad_postes"
            placeholder="Obligatorio"
            hint="Calculado automáticamente de acuerdo al registro de progresivas"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Cantidad pozos -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Cantidad de pozos</label>
          <q-input
            v-model="progresiva.cantidad_pozos"
            placeholder="Obligatorio"
            hint="Calculado automáticamente de acuerdo al registro de progresivas"
            outlined
            disable
            dense
          ></q-input>
        </div>

        <!-- Sistema de coordenadas -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Sistema de coordenadas</label>
          <q-input
            v-model="progresiva.sistema_coordenadas"
            placeholder="Obligatorio"
            hint="Esto afectará a todas las filas del registro de progresivas actual."
            outlined
            disable
            dense
          ></q-input>
        </div>

        <!-- Marca inicial -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Progresiva de inicio</label>
          <q-input
            v-model="progresiva.progresiva_inicio"
            placeholder="Obligatorio"
            hint="Calculado automáticamente de acuerdo al registro de progresivas"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Marca final -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Progresiva de fin</label>
          <q-input
            v-model="progresiva.progresiva_fin"
            placeholder="Opcional"
            hint="Calculado automáticamente de acuerdo al registro de progresivas"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Metraje del tendido -->
        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Metraje del tendido</label>
          <q-input
            v-model="progresiva.metraje_tendido"
            placeholder="Opcional"
            hint="Calculado automáticamente de acuerdo al registro de progresivas"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <div class="col-12">
          <essential-table
            titulo="Registro de progresivas"
            :configuracionColumnas="[
              ...configuracionColumnasControlProgresivas,
              accionesTabla,
            ]"
            :datos="progresivas"
            :alto-fijo="false"
            :permitirConsultar="false"
            :mostrar-footer="false"
            :agregarElemento="agregarProgresiva"
            @eliminar="eliminar"
            @editar="editar"
          ></essential-table>
        </div>
      </div>
    </q-form>
  </q-page>
  <!--</template>

    <template #modales>
      <modales-entidad :comportamiento="modalesProgresiva" />
    </template> -->
  <!--</tab-layout> -->
</template>

<script src="./ControlProgresivaPage.ts"></script>
