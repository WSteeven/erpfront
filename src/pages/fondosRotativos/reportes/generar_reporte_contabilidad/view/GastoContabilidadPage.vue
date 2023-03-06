<template>
<essential-table
titulo="Reporte de Contabilidad"
    :configuracionColumnas="configuracionColumnasGastoContabilidad"
    :datos="listado"
    :permitirConsultar="true"
    :permitirEditar="false"
    :permitirEliminar="false"
></essential-table>
</template>
<script src="./GastoContabilidadPage.ts"></script>
