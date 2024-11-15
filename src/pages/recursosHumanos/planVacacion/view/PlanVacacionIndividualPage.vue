<template>
  <simple-layout :mixin="mixin" :mostrar-button-submits="false">
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md expansion"
        label="Información del Empleado"
        header-class="text-bold bg-header-collapse"
        default-opened
      >
        <template v-slot:header="scope">
          <div class="row full-width q-col-gutter-sm q-pt-md">
            {{
              !scope.expanded
                ? 'Empleado: ' + empleado.nombres + ' ' + empleado.apellidos
                : 'Información del Empleado'
            }}
          </div>
        </template>
        <div class="row q-pa-sm">
          <empleado-info-page alto="200px" />
        </div>
      </q-expansion-item>
      <div v-if="vacaciones.length != 0">
        <q-expansion-item
          v-for="(vacacion, index) of vacaciones"
          :key="vacacion.id"
          class="overflow-hidden q-mb-md expansion"
          :label="'Período ' + vacacion.periodo"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-pa-sm" v-if="mostrarPlanVacacion">
            <div>
              <label>Plan de Vacaciones para este período &nbsp;</label>
              <q-btn
                dense
                outline
                color="secondary"
                @click="() => (habilitarBotones = !habilitarBotones)"
                v-if="obtenerAccion(vacacion.periodo) == acciones.editar"
              >
                <q-tooltip class="bg-dark">Editar</q-tooltip>
                <q-icon class="bi-pencil-square" size="xs" />
              </q-btn>
            </div>
            <!--            <div class="col-12 border-grey rounded-8" v-if="!vacacion.opto_pago">-->
            <div class="col-12 border-grey rounded-8" v-if="!vacacion.completadas">
              <formulario-plan-vacaciones
                :habilitar-botones="
                  habilitarBotones ||
                  obtenerAccion(vacacion.periodo) == acciones.nuevo
                "
                :dias-disponibles="vacacion.dias_disponibles"
                :empleado="empleadoStore.idEmpleado"
                :identificador="index"
                @cancelar="cancelar"
                @guardado="obtenerPlanesVacaciones"
                :accion="obtenerAccion(vacacion.periodo)"
                :plan="planes_vacaciones[index]"
                :periodo="vacacion.periodo_id"
              />
            </div>

            <div class="col-12">
              <br>
              <label class="q-mt-xl q-pt-xl" v-if="vacacion.dias_tomados > 0"><strong>Registro de Vacaciones </strong>&nbsp;</label>
            </div>
            <div class="col-12 border-grey rounded-8">
              <div class="row q-pa-sm col-12" v-if="vacacion.dias_tomados > 0">
                <div
                  class="col-12 col-md-12 rounded-card q-py-sm text-center text-info bg-blue-2"
                  v-if="vacacion.opto_pago"
                >
                  <q-icon
                    name="bi-info-circle-fill"
                    class="q-mr-sm"
                    size="1em"
                  ></q-icon>
                  <b>&nbsp; Información</b>
                  <div>
                    Estas vacaciones ya fueron tomadas por el empleado, en este
                    caso optó por pago de sus días de vacaciones
                  </div>
                </div>
                <div class="col-12 ">
                  <VacacionLitePage :vacacion="vacacion" />
                </div>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </div>
      <div v-else>
        <p>
          <strong style="color: red">*</strong>
          Este empleado aún no ha cumplido su primer año de labores.
        </p>
        <div class="row q-pa-sm" v-if="mostrarPlanVacacion">
          <div>
            <label>Plan de Vacaciones para este período &nbsp;</label>
            <q-btn
              dense
              outline
              color="secondary"
              @click="() => (habilitarBotones = !habilitarBotones)"
              v-if="
                obtenerAccion(planes_vacaciones[0]?.periodo) == acciones.editar
              "
            >
              <q-tooltip class="bg-dark">Editar</q-tooltip>
              <q-icon class="bi-pencil-square" size="xs" />
            </q-btn>
          </div>
          <div class="col-12 border-grey rounded-8">
            <formulario-plan-vacaciones
              :habilitar-botones="
                habilitarBotones ||
                obtenerAccion(planes_vacaciones[0]?.periodo) == acciones.nuevo
              "
              :dias-disponibles="15"
              :empleado="empleadoStore.idEmpleado"
              @cancelar="cancelar"
              @guardado="obtenerPlanesVacaciones"
              :accion="obtenerAccion(planes_vacaciones[0]?.periodo)"
              :plan="planes_vacaciones[0]"
            />
          </div>
        </div>
        <!--        <formulario-plan-vacaciones-->
        <!--          v-else-->
        <!--          :habilitar-botones="false"-->
        <!--          :periodo="2"-->
        <!--          :empleado="empleadoStore.idEmpleado"-->
        <!--          :accion="acciones.editar"-->
        <!--          :dias-disponibles="15"-->
        <!--          :plan="planes_vacaciones[0]"-->
        <!--        />-->
      </div>

      <!--      <div class="row q-col-gutter-sm q-pa-md" v-if="false">-->
      <!--        <div class="col-12 col-md-3">-->
      <!--          <p>Aqui va el plan de vacaciones</p>-->
      <!--          {{ plan }}-->
      <!--        </div>-->
      <!--      </div>-->
    </template>
  </simple-layout>
</template>

<script src="./PlanVacacionIndividualPage.ts" />
