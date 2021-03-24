const getMenuFrontEnd = ( role = 'USER_ROLE' ) => {

  const menu = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Inicio', icono: 'mdi mdi-gauge', url: '/' },
        { titulo: 'Nosotros', icono: 'mdi mdi-account-group', url: 'nosotros' },
        { titulo: 'Contáctenos', icono: 'mdi mdi-cellphone-message', url: 'contactenos' },
      ]
    },
    {
      titulo: 'Mantenimiento',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Ofertas', icono: 'mdi mdi-cart-arrow-down', url: 'ofertas' },
        { titulo: 'Productos', icono: 'mdi mdi-shape', url: 'productos' },
        { titulo: 'Proveedores', icono: 'mdi mdi-human-baby-changing-table', url: 'proveedores' },
        // { titulo: 'Usuarios', icono: 'mdi mdi-badge-account-horizontal-outline', url: 'usuarios' },
        { titulo: 'Reseñas', icono: 'mdi mdi-script-outline', url: 'resenas' },
        { titulo: 'Rubros', icono: 'mdi mdi-rhombus-split-outline', url: 'rubros' },
      ]
    }
  ];


  if( role === 'ADMIN_ROLE' ){
      menu[1].submenu.unshift(
        { titulo: 'Usuarios', icono: 'mdi mdi-badge-account-horizontal-outline', url: 'usuarios' },
        // { titulo: 'Noticias', url: 'noticias' },
      )
  }

  
  return menu;
}

module.exports = {
    getMenuFrontEnd
}