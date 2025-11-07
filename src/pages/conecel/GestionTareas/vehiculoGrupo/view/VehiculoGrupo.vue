<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section class="q-py-xs">
        <div class="row items-center no-wrap justify-between">
          <!-- Callout ocupa todo el espacio restante -->
          <div class="col">
            <callout-component
                mensaje="Empareja cada cuadrilla con su respectivo vehículo para un correcto seguimiento en el mapa de actividades"
                tipo="info"
            />
          </div>

          <!-- Botones alineados a la derecha -->
          <div class="row q-gutter-xs items-center justify-end col-auto">
            <q-btn
                v-if="accion === acciones.consultar"
                outline dense
                @click="() => (accion = acciones.editar)"
                color="secondary"
                size="sm"
            >
              <q-icon name="bi-pencil-square" size="xs" />
              <q-tooltip class="bg-dark">Editar</q-tooltip>
            </q-btn>

            <q-btn
                v-if="accion === acciones.editar"
                outline dense
                @click="() => (accion = acciones.consultar)"
                color="red"
                size="sm"
            >
              <q-icon name="bi-x" size="xs" />
              <q-tooltip class="bg-dark">Cancelar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-x-sm" v-for="grupo in grupos" :key="grupo.id">
          <!-- Grupo -->
          <div class="col-12 col-md-6 q-mb-md col-sm-6">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="grupo.id"
              :options="grupos"
              transition-show="jump-up"
              transition-hide="jump-down"
              disable
              options-dense
              dense
              outlined
              @filter="filtrarGrupos"
              @popup-show="ordenarLista(grupos, 'nombre_alternativo')"
              :option-value="v => v.id"
              :option-label="v => v.nombre_alternativo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="nombre_alternativo" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Vehiculo -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="grupo.vehiculo"
              :options="vehiculos"
              hint="Contactesé con el Administrador para agregar más vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              @update:model-value="chequearVehiculosRepetidos"
              :option-label="item => item.placa"
              :option-value="item => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.marca + ' ' + scope.opt.modelo }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">

          <ButtonSubmits v-if="accion==acciones.editar"
              :accion="accion"
              @editar="guardarGruposVehiculos"
              @cancelar="reestablecer"
          />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script src="./VehiculoGrupo.ts" />
