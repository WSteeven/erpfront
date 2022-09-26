<template>
    <q-page padding>
        <div class="text-h6 q-mb-md">Tablero</div>

        <p class="q-mb-xl">Hola {{ store.nombreUsuario }}, bienvenido.</p>

        <div class="row q-col-gutter-xs">
            <!-- Usuarios registrados -->
            <div class="col-12 col-md-3 text-center">
                <div>Usuarios registrados</div>
                <q-knob v-model="tablero.usuarios" readonly show-value size="90px" color="lime" track-color="grey-3"
                    class="text-lime q-ma-md">
                    <template #default>{{ tablero.usuarios }}</template>
                </q-knob>
            </div>

            <!-- Usuarios conectados -->
            <div class="col-12 col-md-3 text-center">
                <div>Usuarios conectados</div>
                <q-knob v-model="tablero.usuariosConectados" readonly show-value size="90px" color="lime"
                    track-color="grey-3" class="text-lime q-ma-md">
                    <template #default>{{ tablero.usuariosConectados }}</template>
                </q-knob>
            </div>

            <!-- Usuarios conectados el dia de hoy -->
            <div class="col-12 col-md-3 text-center">
                <div>Usuarios conectados el dia de hoy</div>
                <q-knob v-model="tablero.usuariosConectadosDia" readonly show-value size="90px" color="lime"
                    track-color="grey-3" class="text-lime q-ma-md">
                    <template #default>{{ tablero.usuariosConectadosDia }}</template>
                </q-knob>
            </div>

            <!-- Usuarios conectados en el mes -->
            <div class="col-12 col-md-3 text-center">
                <div>Usuarios conectados en el mes</div>
                <q-knob v-model="tablero.usuariosConectadosMes" readonly show-value size="90px" color="lime"
                    track-color="grey-3" class="text-lime q-ma-md">
                    <template #default>{{ tablero.usuariosConectadosMes }}</template>
                </q-knob>
            </div>

            <!-- Facturación de planes pagados -->
            <div class="col-12 col-md-3 text-center">
                <div>Usuarios con facturación de planes (pagado)</div>
                <q-knob v-model="tablero.usuarioConPlanesPagados" readonly show-value size="90px" color="lime"
                    track-color="grey-3" class="text-lime q-ma-md">
                    <template #default>{{ tablero.usuarioConPlanesPagados }}</template>
                </q-knob>
            </div>

            <!-- Facturación de planes no pagados -->
            <div class="col-12 col-md-3 text-center">
                <div>Usuarios con facturación de planes (no pagado)</div>
                <q-knob v-model="tablero.usuarioConPlanesNoPagados" readonly show-value size="90px" color="lime"
                    track-color="grey-3" class="text-lime q-ma-md">
                    <template #default>{{ tablero.usuarioConPlanesNoPagados }}</template>
                </q-knob>
            </div>

            <!-- Servicios activos -->
            <div class="col-12 col-md-3 text-center">
                <div>Servicios activos</div>
                <q-knob v-model="tablero.serviciosActivos" readonly show-value size="90px" color="lime"
                    track-color="grey-3" class="text-lime q-ma-md">
                    <template #default>{{ tablero.serviciosActivos }}</template>
                </q-knob>
            </div>

            <!-- Planes activos -->
            <div class="col-12 col-md-3 text-center">
                <div>Planes activos</div>
                <q-knob v-model="tablero.planesActivos" readonly show-value size="90px" color="lime"
                    track-color="grey-3" class="text-lime q-ma-md">
                    <template #default>{{ tablero.planesActivos }}</template>
                </q-knob>
            </div>

            <!-- Pedidos de servicios por atender -->
            <div class="col-12 col-md-3 text-center">
                <div>Pedidos de servicios por atender</div>
                <q-knob v-model="tablero.pedidos" readonly show-value size="90px" color="lime" track-color="grey-3"
                    class="text-lime q-ma-md">
                    <template #default>{{ tablero.pedidos }}</template>
                </q-knob>
            </div>

            <!-- Reportes generados -->
            <div class="col-12 col-md-3 text-center">
                <div>Reportes generados</div>
                <q-knob v-model="tablero.pedidos" readonly show-value size="90px" color="lime" track-color="grey-3"
                    class="text-lime q-ma-md">
                    <template #default>{{ tablero.reportes }}</template>
                </q-knob>
            </div>
        </div>
    </q-page>
</template>
  
<script lang="ts">
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive, ref } from 'vue'
import { TableroController } from '../infraestructure/TableroController'
import { Tablero } from '../domain/Tablero'

export default defineComponent({
    setup() {
        const store = useAuthenticationStore()
        const controller = new TableroController()
        const tablero = reactive(new Tablero())
        const usuarios = 20

        async function index() {
            const { response } = await controller.listar()
            tablero.hydrate(response.data.modelo)
        }

        index()

        return { tablero, store, usuarios }
    },
})
</script>