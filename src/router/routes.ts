import { RouteRecordRaw } from 'vue-router'
import rutasMedico from './rutasMedico'
import rutasTareas from './rutasTareas'
import rutasTickets from './rutasTickets'
import rutasRecursosHumanos from './rrhh/rutasRecursosHumanos'
import rutasActivosFijos from './rutasActivosFijos'
import rutasSSO from './rutasSSO'
import rutasControlPersonal from './rutasControlPersonal'

/* const JPCONSTRUCRED = process.env.VUE_APP_ID == empresas.JPCONSTRUCRED
const JPCUSTODY = process.env.VUE_APP_ID == empresas.JPCUSTODY
const CCLEDARE = process.env.VUE_APP_ID == empresas.CCLEDARE */
import rutasFondosRotativos from './rutasFondosRotativos'
import rutasVehiculos from './rutasVehiculos'
import rutasSeguridad from './rutasSeguridad'
import rutasComprasProveedores from './rutasComprasProveedores'
import rutasVentasClaro from './rutasVentasClaro'
import rutasAppenate from './rutasAppenate'
import rutasBodega from './rutasBodega'
import rutasConecel from './conecel/rutasConecel'

console.log(process.env.VUE_APP_ID)
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'tablero_personal',
        component: () =>
          import('pages/tableroPersonal/view/TableroPersonalPage.vue'),
        meta: { requiresAuth: true, permissionRequired: false }
      },
      {
        path: 'auditorias',
        name: 'auditorias',
        component: () =>
          import('pages/sistema/auditorias/view/AuditoriaPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'configuracion',
        name: 'configuracion_general',
        component: () =>
          import('pages/sistema/configuracion/view/ConfiguracionPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'plantillas-base',
        name: 'plantillas_base',
        component: () =>
          import('sistema/plantillasBase/view/PlantillaBasePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'plantillas-capacitaciones',
        name: 'plantillas_capacitaciones',
        component: () =>
          import(
            'sistema/plantillasCapacitaciones/view/PlantillaCapacitacionPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      /**
       *  Módulo de FONDOS ROTATIVOS
       */
      ...rutasFondosRotativos,

      /*******************
       * Módulo de RRHH
       *******************/
      ...rutasRecursosHumanos,

      /*******************
       * Módulo de tareas
       *******************/
      ...rutasTareas,

      /********************
       * Modulo de tickets
       ********************/
      ...rutasTickets,

      /********
       * Otros
       ********/
      {
        path: '/perfil',
        name: 'perfil',
        component: () => import('pages/perfil/view/PerfilPage.vue'),
        meta: { requiresAuth: true, permissionRequired: false }
      },

      /**
       * RUTAS PARA GEOGRAFIA (PROVINCIAS, CANTONES, PARROQUIAS)
       */
      // {
      //   path: '/provincias',
      //   name: 'provincias',
      //   component: () => import('pages/sistema/provincia'),
      //   meta: { requiresAuth: false },
      // },
      // {
      //   path: '/cantones',
      //   name: 'cantones',
      //   component: () => import('pages/sistema/ciudad'),
      //   meta: { requiresAuth: false },
      // },
      {
        path: '/parroquias',
        name: 'parroquias',
        component: () =>
          import('pages/sistema/parroquia/view/ParroquiaPage.vue'),
        meta: { requiresAuth: true }
      },
      //Routes for permissions
      {
        path: '/roles',
        name: 'roles',
        component: () => import('pages/administracion/roles/view/RolPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/permisos',
        name: 'permisos',
        component: () =>
          import('pages/permisos/modules/todosPermisos/view/PermisoPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/permisos-roles',
        name: 'permisos_roles',
        component: () => import('pages/permisos/view/PermisoPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/permisos-usuarios',
        name: 'permisos_usuarios',
        component: () =>
          import(
            'pages/permisos/modules/permisosUsuarios/view/PermisosUsuarioPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      /**************************************
       * Routes for bodega
       *************************************/
      ...rutasBodega,

      {
        path: '/notificaciones',
        name: 'notificaciones',
        component: () =>
          import(
            'pages/administracion/notificaciones/view/NotificacionPage.vue'
          ),
        meta: { requiresAuth: true, permissionRequired: false }
      },

      //Routes for administracion
      {
        path: '/autorizaciones',
        name: 'autorizaciones',
        component: () =>
          import(
            'pages/administracion/autorizaciones/view/AutorizacionPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/codigos-clientes',
        name: 'codigos_clientes',
        component: () =>
          import(
            'pages/administracion/codigos_clientes_productos/view/CodigoClientePage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/condiciones',
        name: 'condiciones',
        component: () =>
          import('pages/administracion/condiciones/view/CondicionPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clientes',
        name: 'clientes',
        component: () => import('pages/sistema/clientes/view/ClientePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/cuentas-bancarias',
        name: 'cuentas_bancarias',
        component: () =>
          import(
            'pages/administracion/cuentasBancarias/view/CuentaBancariaPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/estados-transacciones',
        name: 'estados_transacciones',
        component: () =>
          import(
            'pages/administracion/estados_transacciones/view/EstadosTransaccionPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/hilos',
        name: 'hilos',
        component: () => import('pages/administracion/hilos/view/HiloPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/sucursales',
        name: 'sucursales',
        component: () =>
          import('pages/administracion/sucursales/view/SucursalPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/tipos-fibras',
        name: 'tipos_fibras',
        component: () =>
          import('pages/administracion/tipos_fibras/view/TipoFibraPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/tipos-transacciones',
        name: 'tipos_transacciones',
        component: () =>
          import(
            'pages/administracion/tipos_transacciones/view/TipoTransaccionPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/motivos',
        name: 'motivos',
        component: () =>
          import('pages/administracion/motivos/view/MotivoPage.vue'),
        meta: { requiresAuth: true }
      },

      {
        path: '/subtarea-asignada',
        name: 'subtarea_asignada',
        component: () =>
          import(
            'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
          ),
        meta: { requiresAuth: true }
      },

      //Fondos Rotativos
      {
        path: '/ajustes-saldos',
        name: 'ajustes_saldos',
        component: () =>
          import('pages/fondosRotativos/ajusteSaldo/view/AjusteSaldoPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/gasto',
        name: 'gasto',
        component: () =>
          import('pages/fondosRotativos/gasto/view/GastoPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/anular-gasto',
        name: 'anular_gasto',
        component: () =>
          import('pages/fondosRotativos/anularGasto/view/AnularGastoPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/gasto-coordinador',
        name: 'gasto_coordinador',
        component: () =>
          import(
            'pages/fondosRotativos/gastoCoordinador/view/GastoCoordinadorPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/autorizar-gasto',
        name: 'autorizar_gasto',
        component: () =>
          import(
            'pages/fondosRotativos/autorizarGasto/view/AutorizarGastoPage.vue'
          ),
        meta: { requiresAuth: false }
      },
      {
        path: '/umbral-fondos-rotativos',
        name: 'umbral_fondos_rotativos',
        component: () =>
          import('pages/fondosRotativos/umbral/view/UmbralPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/acreditacion-semana',
        name: 'acreditacion_semana',
        component: () =>
          import(
            'pages/fondosRotativos/acreditacionSemana/view/Acreditacion_semanaPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/autorizar-transferencia',
        name: 'autorizar_transferencia',
        component: () =>
          import(
            'pages/fondosRotativos/autorizarTransferencia/view/AutorizarTransferenciaPage.vue'
          ),
        meta: { requiresAuth: false }
      },

      {
        path: '/detalle_fondo',
        name: 'detalle_fondo',
        component: () =>
          import(
            'pages/fondosRotativos/detalleFondo/view/DetalleFondoPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/sub_detalle_fondo',
        name: 'sub_detalle_fondo',
        component: () =>
          import(
            'pages/fondosRotativos/subDetalleFondo/view/SubDetalleFondoPage.vue'
          ),
        meta: { requiresAuth: true }
      },

      {
        path: '/acreditacion',
        name: 'acreditacion',
        component: () =>
          import(
            'pages/fondosRotativos/saldos/acreditacion/view/AcreditacionPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/transferencia',
        name: 'transferencia',
        component: () =>
          import(
            'pages/fondosRotativos/transferencias/view/TransferenciaPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/motivo-gasto',
        name: 'motivo_gasto',
        component: () =>
          import('pages/fondosRotativos/MotivoGasto/view/MotivoGastoPage.vue'),
        meta: { requiresAuth: true }
      },

      {
        path: '/reporte-valores-fondos',
        name: 'reporte_valores_fondos',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/reporteValoresEmpleados/view/ValoresFondosEmpleadoPage.vue'
          ),
        meta: { requiresAuth: false }
      },
      {
        path: '/reporte-fondo-fecha',
        name: 'reporte_fondo_fecha',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/fondo_rotativo_fecha/view/FondoRotativoFechaPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/reporte-saldo-actual',
        name: 'reporte_saldo_actual',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/reporteSaldoActual/view/Reporte_saldo_actualPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/reporte-autorizaciones',
        name: 'reporte_autorizaciones',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/fondo_rotativo_autorizaciones_fecha/view/Reporte_autorizaciones_fechaPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/reporte-consolidado',
        name: 'reporte_consolidado',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/consolidado/view/Reporte_consolidadoPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/reporte-consolidado-filtrado',
        name: 'reporte_consolidado_filtrado',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/consolidado_filtrado/view/Reporte_consolidado_filtradoPage.vue'
          ),
        //cambiar a true cuando este listo
        meta: { requiresAuth: true }
      },
      {
        path: '/reporte-contabilidad',
        name: 'reporte_contabilidad',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/fondo_rotativo_contabilidad/view/Reporte_contabilidadPage.vue'
          ),
        //cambiar a true cuando este listo
        meta: { requiresAuth: false }
      },
      {
        path: '/reporte-solicitud-fondo',
        name: 'reporte_solicitud_fondo',
        component: () =>
          import(
            'pages/fondosRotativos/reportes/reporte_solicitud_fondos/view/Reporte_solicitud_fondoPage.vue'
          ),
        meta: { requiresAuth: true }
      },

      // otras rutas
      {
        path: '/asignar-alimentaciones',
        name: 'asignar_alimentaciones',
        component: () =>
          import(
            'pages/recursosHumanos/alimentacion/asignarAlimentacion/view/AsignarAlimentacion.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/alimentaciones',
        name: 'alimentaciones',
        component: () =>
          import(
            'pages/recursosHumanos/alimentacion/alimentacion/views/AlimentacionPage.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: '/generador-cash',
        name: 'generador_cash',
        component: () =>
          import(
            'src/pages/comprasProveedores/generadorCash/view/GeneradorCashPage.vue'
          ),
        meta: { requiresAuth: true }
      }
    ]
  },

  {
    path: '/login',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () =>
          import('pages/sistema/authentication/login/view/LoginPage.vue')
      }
    ]
  },
  {
    path: '/login-success',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'login_success',
        component: () =>
          import('pages/sistema/authentication/login/view/LoginSuccessPage.vue')
      }
    ]
  },
  {
    path: '/error-login',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'error_login',
        component: () =>
          import('pages/sistema/authentication/login/view/ErrorLoginPage.vue')
      }
    ]
  },
  /************************************************************************************************
   * MODULO DE SELECCION Y CONTRATACION PERSONAL
   * Aquí se lista all referente a este modulo y la parte del login del postulantes para el personal externo.
   ***********************************************************************************************/
  /*{
    path: '/login-postulante',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'LoginPostulante',
        component: () =>
          import('pages/recursosHumanos/seleccion_contratacion_personal/login-postulante/view/LoginPostulantePage.vue'),
      },
    ],
  },
  {
    path: '/registro-postulante',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'RegistroPostulante',
        component: () =>
          import('pages/recursosHumanos/seleccion_contratacion_personal/postulante/view/PostulanteRegistroPage.vue'),
      },
    ],
  },
  {
    path: '/puestos-disponibles',
    component: () => import('layouts/PostulanteLayout.vue'),
    children: [
      {
        path: '',
        name: 'puestos_disponibles',
        component: () =>
          import(
            'pages/recursosHumanos/SeleccionContratacionPersonal/vacantesDisponibles/view/PuestoDisponiblePage.vue'
          ),
        meta: { requiresAuth: false, permissionRequired: false }
      },
      {
        path: '/puestos-aplicados',
        name: 'puestos_aplicados',
        component: () =>
          import(
            'pages/recursosHumanos/SeleccionContratacionPersonal/vacantesAplicadas/view/PuestoAplicadoPage.vue'
          ),
        meta: { requiresAuth: true, permissionRequired: false }
      },
      {
        path: '/perfil-usuario-externo',
        name: 'perfil_usuario_externo',
        component: () => import('pages/perfil/view/PerfilExternoPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/test-personalidad/:token',
        name: 'test_personalidad',
        component: () => import('seleccionContratacion/postulacionVacante/modules/testPersonalidad/view/TestPersonalidadPage.vue'),
        meta: { requiresAuth: true, permissionRequired: false }
      },
    ],
  },
  {
    path: '/vacantes',
    component: () => import('layouts/PostulanteLayout.vue'),
    children: [
      {
        path: '/favoritas',
        name: 'favoritas',
        component: () => import('seleccionContratacion/vacantesFavoritas/view/VacanteFavoritaPage.vue'),
        meta: { requiresAuth: true, permissionRequired: false }
      },
      {
        path: '/postulacion-vacante/:id',
        name: 'postulacion_vacante',
        component: () =>
          import(
            'pages/recursosHumanos/SeleccionContratacionPersonal/postulacionVacante/view/PostulacionVacantePage.vue'
          ),
        meta: { requiresAuth: true, permissionRequired: false }
      },]
  },*/
  {
    path: '/recuperar-contrasena',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'RecuperarContrasena',
        component: () =>
          import(
            'pages/sistema/authentication/forgotPassword/view/forgotPassword.page.vue'
          )
      }
    ]
  },
  {
    path: '/resetear-contrasena',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'ResetearContrasena',
        component: () =>
          import(
            'pages/sistema/authentication/resetPassword/view/resetPassword.page.vue'
          )
      }
    ]
  },
  {
    path: '/cuestionarios-publicos/:identificador',
    component: () => import('layouts/FullLayout.vue'),
    children: [
      {
        path: '',
        name: 'cuestionarios_publicos',
        component: () =>
          import(
            'medico/cuestionariosPublicos/view/CuestionarioPublicoPage.vue'
          )
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
