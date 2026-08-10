// =====================================================
// Configuracion declarativa de los 14 recursos del backend.
// El motor CRUD generico (vistas/componentes) se arma a
// partir de aqui. Los campos coinciden 1:1 con los DTO de
// NestJS (whitelist + forbidNonWhitelisted activos).
//
//  columnas[]  -> lo que se muestra en la tabla
//  campos[]    -> lo que se muestra en el formulario
//
//  tipos de columna:  texto | numero | moneda | booleano | fecha | fk
//  tipos de campo:    texto | password | entero | numero | moneda |
//                     booleano | fecha | select
// =====================================================

export const recursos = {
  roles: {
    ruta: 'roles',
    etiqueta: 'Roles',
    singular: 'Rol',
    grupo: 'Catalogos',
    icono: 'escudo',
    pk: 'id_rol',
    campoEtiqueta: 'nombre_rol',
    columnas: [
      { campo: 'id_rol', titulo: 'ID', tipo: 'numero' },
      { campo: 'nombre_rol', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'estado_rol', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'nombre_rol', etiqueta: 'Nombre del rol', tipo: 'texto', obligatorio: true, max: 50 },
      { campo: 'estado_rol', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  usuarios: {
    ruta: 'usuarios',
    etiqueta: 'Usuarios',
    singular: 'Usuario',
    grupo: 'Catalogos',
    icono: 'usuario',
    pk: 'id_usuario',
    campoEtiqueta: 'nombre_usuario',
    columnas: [
      { campo: 'id_usuario', titulo: 'ID', tipo: 'numero' },
      { campo: 'usuario', titulo: 'Usuario', tipo: 'texto' },
      { campo: 'nombre_usuario', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'correo_usuario', titulo: 'Correo', tipo: 'texto' },
      { campo: 'id_rol', titulo: 'Rol', tipo: 'fk', referencia: 'roles' },
      { campo: 'estado_usuario', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'usuario', etiqueta: 'Usuario', tipo: 'texto', obligatorio: true, max: 50 },
      { campo: 'password', etiqueta: 'Contrasena', tipo: 'password', obligatorio: true, max: 255, soloCrear: true },
      { campo: 'nombre_usuario', etiqueta: 'Nombre completo', tipo: 'texto', obligatorio: true, max: 100 },
      { campo: 'telefono_usuario', etiqueta: 'Telefono', tipo: 'texto', max: 20 },
      { campo: 'correo_usuario', etiqueta: 'Correo', tipo: 'texto', max: 120 },
      { campo: 'dpi_usuario', etiqueta: 'DPI', tipo: 'texto', max: 20 },
      { campo: 'id_rol', etiqueta: 'Rol', tipo: 'select', referencia: 'roles', obligatorio: true },
      { campo: 'estado_usuario', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  clientes: {
    ruta: 'clientes',
    etiqueta: 'Clientes',
    singular: 'Cliente',
    grupo: 'Catalogos',
    icono: 'personas',
    pk: 'id_cliente',
    campoEtiqueta: 'nombre_cliente',
    columnas: [
      { campo: 'id_cliente', titulo: 'ID', tipo: 'numero' },
      { campo: 'nombre_cliente', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'nit_cliente', titulo: 'NIT', tipo: 'texto' },
      { campo: 'estado_cliente', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'nombre_cliente', etiqueta: 'Nombre', tipo: 'texto', obligatorio: true, max: 150 },
      { campo: 'nit_cliente', etiqueta: 'NIT', tipo: 'texto', obligatorio: true, max: 20, valorInicial: 'CF' },
      { campo: 'estado_cliente', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  'casas-medicas': {
    ruta: 'casas-medicas',
    etiqueta: 'Casas medicas',
    singular: 'Casa medica',
    grupo: 'Catalogos',
    icono: 'edificio',
    pk: 'id_casa_medica',
    campoEtiqueta: 'nombre_casa_medica',
    columnas: [
      { campo: 'id_casa_medica', titulo: 'ID', tipo: 'numero' },
      { campo: 'nombre_casa_medica', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'estado_casa_medica', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'nombre_casa_medica', etiqueta: 'Nombre', tipo: 'texto', obligatorio: true, max: 150 },
      { campo: 'estado_casa_medica', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  proveedores: {
    ruta: 'proveedores',
    etiqueta: 'Proveedores',
    singular: 'Proveedor',
    grupo: 'Catalogos',
    icono: 'camion',
    pk: 'id_proveedor',
    campoEtiqueta: 'nombre_proveedor',
    columnas: [
      { campo: 'id_proveedor', titulo: 'ID', tipo: 'numero' },
      { campo: 'nombre_proveedor', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'id_casa_medica', titulo: 'Casa medica', tipo: 'fk', referencia: 'casas-medicas' },
      { campo: 'telefono_proveedor', titulo: 'Telefono', tipo: 'texto' },
      { campo: 'correo_proveedor', titulo: 'Correo', tipo: 'texto' },
      { campo: 'estado_proveedor', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_casa_medica', etiqueta: 'Casa medica', tipo: 'select', referencia: 'casas-medicas', obligatorio: true },
      { campo: 'nombre_proveedor', etiqueta: 'Nombre', tipo: 'texto', obligatorio: true, max: 150 },
      { campo: 'telefono_proveedor', etiqueta: 'Telefono', tipo: 'texto', max: 20 },
      { campo: 'direccion_proveedor', etiqueta: 'Direccion', tipo: 'texto', max: 255 },
      { campo: 'correo_proveedor', etiqueta: 'Correo', tipo: 'texto', max: 120 },
      { campo: 'total_adquirido_proveedor', etiqueta: 'Total adquirido', tipo: 'moneda' },
      { campo: 'cantidad_adquirido_proveedor', etiqueta: 'Cantidad adquirida', tipo: 'entero' },
      { campo: 'estado_proveedor', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  presentaciones: {
    ruta: 'presentaciones',
    etiqueta: 'Presentaciones',
    singular: 'Presentacion',
    grupo: 'Catalogos',
    icono: 'caja',
    pk: 'id_presentacion',
    campoEtiqueta: 'nombre_presentacion',
    columnas: [
      { campo: 'id_presentacion', titulo: 'ID', tipo: 'numero' },
      { campo: 'nombre_presentacion', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'estado_presentacion', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'nombre_presentacion', etiqueta: 'Nombre', tipo: 'texto', obligatorio: true, max: 100 },
      { campo: 'estado_presentacion', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  'metodos-pago': {
    ruta: 'metodos-pago',
    etiqueta: 'Metodos de pago',
    singular: 'Metodo de pago',
    grupo: 'Catalogos',
    icono: 'tarjeta',
    pk: 'id_metodo_pago',
    campoEtiqueta: 'nombre_metodo_pago',
    columnas: [
      { campo: 'id_metodo_pago', titulo: 'ID', tipo: 'numero' },
      { campo: 'nombre_metodo_pago', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'cuenta_metodo_pago', titulo: 'Cuenta', tipo: 'texto' },
      { campo: 'estado_metodo_pago', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'nombre_metodo_pago', etiqueta: 'Nombre', tipo: 'texto', obligatorio: true, max: 80 },
      { campo: 'cuenta_metodo_pago', etiqueta: 'Cuenta', tipo: 'texto', max: 50 },
      { campo: 'estado_metodo_pago', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  medicamentos: {
    ruta: 'medicamentos',
    etiqueta: 'Medicamentos',
    singular: 'Medicamento',
    grupo: 'Inventario',
    icono: 'pastilla',
    pk: 'id_medicamento',
    campoEtiqueta: 'nombre_medicamento',
    columnas: [
      { campo: 'id_medicamento', titulo: 'ID', tipo: 'numero' },
      { campo: 'nombre_medicamento', titulo: 'Nombre', tipo: 'texto' },
      { campo: 'id_presentacion', titulo: 'Presentacion', tipo: 'fk', referencia: 'presentaciones' },
      { campo: 'precio_venta', titulo: 'Precio venta', tipo: 'moneda' },
      { campo: 'existencia_total_medicamento', titulo: 'Existencia', tipo: 'numero' },
      { campo: 'estado_medicamento', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_presentacion', etiqueta: 'Presentacion', tipo: 'select', referencia: 'presentaciones', obligatorio: true },
      { campo: 'codigo_barras_medicamento', etiqueta: 'Codigo de barras', tipo: 'texto', max: 50 },
      { campo: 'nombre_medicamento', etiqueta: 'Nombre', tipo: 'texto', obligatorio: true, max: 150 },
      { campo: 'cantidad_por_paquete', etiqueta: 'Cantidad por paquete', tipo: 'entero', valorInicial: 1 },
      { campo: 'precio_mayorista', etiqueta: 'Precio mayorista', tipo: 'moneda' },
      { campo: 'precio_minimo', etiqueta: 'Precio minimo', tipo: 'moneda' },
      { campo: 'precio_venta', etiqueta: 'Precio de venta', tipo: 'moneda' },
      { campo: 'componente_activo', etiqueta: 'Componente activo', tipo: 'texto', max: 255 },
      { campo: 'venta_libre', etiqueta: 'Venta libre', tipo: 'booleano', valorInicial: true },
      { campo: 'existencia_total_medicamento', etiqueta: 'Existencia total', tipo: 'entero' },
      { campo: 'estado_medicamento', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  lotes: {
    ruta: 'lotes',
    etiqueta: 'Lotes',
    singular: 'Lote',
    grupo: 'Inventario',
    icono: 'capas',
    pk: 'id_lote',
    campoEtiqueta: null, // se muestra como "#id"
    columnas: [
      { campo: 'id_lote', titulo: 'ID', tipo: 'numero' },
      { campo: 'id_medicamento', titulo: 'Medicamento', tipo: 'fk', referencia: 'medicamentos' },
      { campo: 'fecha_vencimiento', titulo: 'Vence', tipo: 'fecha' },
      { campo: 'existencia_lote', titulo: 'Existencia', tipo: 'numero' },
      { campo: 'precio_lote', titulo: 'Precio', tipo: 'moneda' },
      { campo: 'estado_lote', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_medicamento', etiqueta: 'Medicamento', tipo: 'select', referencia: 'medicamentos', obligatorio: true },
      { campo: 'fecha_vencimiento', etiqueta: 'Fecha de vencimiento', tipo: 'fecha', obligatorio: true },
      { campo: 'fecha_produccion', etiqueta: 'Fecha de produccion', tipo: 'fecha' },
      { campo: 'precio_lote', etiqueta: 'Precio del lote', tipo: 'moneda' },
      { campo: 'existencia_lote', etiqueta: 'Existencia', tipo: 'entero' },
      { campo: 'estado_lote', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  compras: {
    ruta: 'compras',
    etiqueta: 'Compras',
    singular: 'Compra',
    grupo: 'Compras',
    icono: 'carrito',
    pk: 'id_compra',
    campoEtiqueta: null,
    columnas: [
      { campo: 'id_compra', titulo: 'ID', tipo: 'numero' },
      { campo: 'id_proveedor', titulo: 'Proveedor', tipo: 'fk', referencia: 'proveedores' },
      { campo: 'fecha_compra', titulo: 'Fecha', tipo: 'fecha' },
      { campo: 'total_compra', titulo: 'Total', tipo: 'moneda' },
      { campo: 'estado_compra', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_proveedor', etiqueta: 'Proveedor', tipo: 'select', referencia: 'proveedores', obligatorio: true },
      { campo: 'fecha_compra', etiqueta: 'Fecha de compra', tipo: 'fecha' },
      { campo: 'total_compra', etiqueta: 'Total', tipo: 'moneda' },
      { campo: 'estado_compra', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  'detalles-compra': {
    ruta: 'detalles-compra',
    etiqueta: 'Detalles de compra',
    singular: 'Detalle de compra',
    grupo: 'Compras',
    icono: 'lista',
    pk: 'id_detalle_compra',
    campoEtiqueta: null,
    columnas: [
      { campo: 'id_detalle_compra', titulo: 'ID', tipo: 'numero' },
      { campo: 'id_compra', titulo: 'Compra', tipo: 'fk', referencia: 'compras' },
      { campo: 'id_medicamento', titulo: 'Medicamento', tipo: 'fk', referencia: 'medicamentos' },
      { campo: 'cantidad_compra', titulo: 'Cantidad', tipo: 'numero' },
      { campo: 'subtotal_compra', titulo: 'Subtotal', tipo: 'moneda' },
      { campo: 'estado_compra', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_compra', etiqueta: 'Compra', tipo: 'select', referencia: 'compras', obligatorio: true },
      { campo: 'id_proveedor', etiqueta: 'Proveedor', tipo: 'select', referencia: 'proveedores', obligatorio: true },
      { campo: 'id_medicamento', etiqueta: 'Medicamento', tipo: 'select', referencia: 'medicamentos', obligatorio: true },
      { campo: 'id_lote', etiqueta: 'Lote', tipo: 'select', referencia: 'lotes' },
      { campo: 'cantidad_compra', etiqueta: 'Cantidad', tipo: 'entero', obligatorio: true },
      { campo: 'subtotal_compra', etiqueta: 'Subtotal', tipo: 'moneda' },
      { campo: 'estado_compra', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  ventas: {
    ruta: 'ventas',
    etiqueta: 'Ventas',
    singular: 'Venta',
    grupo: 'Ventas',
    icono: 'recibo',
    pk: 'id_venta',
    campoEtiqueta: null,
    columnas: [
      { campo: 'id_venta', titulo: 'ID', tipo: 'numero' },
      { campo: 'id_usuario', titulo: 'Usuario', tipo: 'fk', referencia: 'usuarios' },
      { campo: 'id_cliente', titulo: 'Cliente', tipo: 'fk', referencia: 'clientes' },
      { campo: 'fecha_venta', titulo: 'Fecha', tipo: 'fecha' },
      { campo: 'total_venta', titulo: 'Total', tipo: 'moneda' },
      { campo: 'estado_venta', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_usuario', etiqueta: 'Usuario', tipo: 'select', referencia: 'usuarios', obligatorio: true },
      { campo: 'id_cliente', etiqueta: 'Cliente', tipo: 'select', referencia: 'clientes', obligatorio: true },
      { campo: 'fecha_venta', etiqueta: 'Fecha de venta', tipo: 'fecha' },
      { campo: 'total_venta', etiqueta: 'Total', tipo: 'moneda' },
      { campo: 'estado_venta', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  'detalles-venta': {
    ruta: 'detalles-venta',
    etiqueta: 'Detalles de venta',
    singular: 'Detalle de venta',
    grupo: 'Ventas',
    icono: 'lista',
    pk: 'id_detalle_venta',
    campoEtiqueta: null,
    columnas: [
      { campo: 'id_detalle_venta', titulo: 'ID', tipo: 'numero' },
      { campo: 'id_venta', titulo: 'Venta', tipo: 'fk', referencia: 'ventas' },
      { campo: 'id_medicamento', titulo: 'Medicamento', tipo: 'fk', referencia: 'medicamentos' },
      { campo: 'cantidad_detalle_venta', titulo: 'Cantidad', tipo: 'numero' },
      { campo: 'subtotal_detalle_venta', titulo: 'Subtotal', tipo: 'moneda' },
      { campo: 'estado_detalle_venta', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_venta', etiqueta: 'Venta', tipo: 'select', referencia: 'ventas', obligatorio: true },
      { campo: 'id_medicamento', etiqueta: 'Medicamento', tipo: 'select', referencia: 'medicamentos', obligatorio: true },
      { campo: 'id_lote', etiqueta: 'Lote', tipo: 'select', referencia: 'lotes' },
      { campo: 'cantidad_detalle_venta', etiqueta: 'Cantidad', tipo: 'entero', obligatorio: true },
      { campo: 'subtotal_detalle_venta', etiqueta: 'Subtotal', tipo: 'moneda' },
      { campo: 'estado_detalle_venta', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },

  'detalles-metodos-pago': {
    ruta: 'detalles-metodos-pago',
    etiqueta: 'Detalles de metodos de pago',
    singular: 'Detalle de metodo de pago',
    grupo: 'Ventas',
    icono: 'billete',
    pk: 'id_detalle_metodos_pago',
    campoEtiqueta: null,
    columnas: [
      { campo: 'id_detalle_metodos_pago', titulo: 'ID', tipo: 'numero' },
      { campo: 'id_venta', titulo: 'Venta', tipo: 'fk', referencia: 'ventas' },
      { campo: 'id_metodo_pago', titulo: 'Metodo', tipo: 'fk', referencia: 'metodos-pago' },
      { campo: 'cantidad_detalle_metodos_pago', titulo: 'Monto', tipo: 'moneda' },
      { campo: 'estado_detalle_metodos_pago', titulo: 'Estado', tipo: 'booleano' },
    ],
    campos: [
      { campo: 'id_venta', etiqueta: 'Venta', tipo: 'select', referencia: 'ventas', obligatorio: true },
      { campo: 'id_metodo_pago', etiqueta: 'Metodo de pago', tipo: 'select', referencia: 'metodos-pago', obligatorio: true },
      { campo: 'cantidad_detalle_metodos_pago', etiqueta: 'Monto', tipo: 'moneda', obligatorio: true },
      { campo: 'estado_detalle_metodos_pago', etiqueta: 'Activo', tipo: 'booleano', valorInicial: true },
    ],
  },
};

// Orden de los grupos en la barra lateral.
export const grupos = ['Catalogos', 'Inventario', 'Compras', 'Ventas'];

// Devuelve la lista de recursos como arreglo con su clave incluida.
export function listaRecursos() {
  return Object.entries(recursos).map(([clave, def]) => ({ clave, ...def }));
}
