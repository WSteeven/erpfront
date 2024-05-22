<template>
  <q-page padding>
    <essential-table-tabs
      :titulo="
        'Tienes ' + fichasGeneral.length + ' subtarea(s) en estado ' + tabActual
      "
      :configuracionColumnas="[
        ...configuracionColumnasFichaMedica,
        accionesTabla,
      ]"
      :datos="fichasGeneral"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirBuscar="false"
      :mostrar-botones="false"
      :tab-options="tabOptionsTiposFichasMedicas"
      @tab-seleccionado="consultarFichasAptitudPendientesFirmar"
      :tab-defecto="tabActual"
      :accion1="botonFirmarPaciente"
    ></essential-table-tabs>

    <modales-entidad
      :comportamiento="modales"
      :confirmar-cerrar="false"
      :persistente="false"
    />
  </q-page>
</template>

<script src="./FirmarFichaMedicaPage.ts"></script>
