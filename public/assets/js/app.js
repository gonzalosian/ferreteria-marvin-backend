// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners(){
    // Cuando agregar un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);
    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);
    // Muestra los cursos del LocalStorage
    document.addEventListener('DOMContentLoaded', () =>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });

    // Cuando "Vaciar carrito"
    // vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        sincronizarStorage();
        limpiarHTML();
    });
}

// Funciones
function agregarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains('agregar-carrito')){
        const cursoSelect = e.target.parentElement.parentElement;
        console.log('Agregando al carrito');
        // console.log( e.target.parentElement.parentElement );
        leerDatosCurso(cursoSelect);
    }
}

// Elimina cursos del carrito
function eliminarCurso(e){
    console.log(e.target.classList);

    if(e.target.classList.contains('borrar-curso')){
        // console.log(e.target.getAttribute('data-id'))
        const cursoId = e.target.getAttribute('data-id');
        // Eliminar del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );
        console.log(articulosCarrito);

        carritoHTML(); // Volvemos a iterar sobre el carrito y mostrar su HTML
    }
}

// function vaciarCarrito(){
//     // console.log('vaciando carrito')
//     articulosCarrito = [];
//     carritoHTML();
// }

// Lee el contenido del HTML al que le dimos click y extrae la información del curso.activo
function leerDatosCurso(curso){
    // console.log(curso);

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    // console.log(infoCurso);

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe){
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }else{
                return curso;
            }
        } );
        articulosCarrito = [...cursos];
    }else{
        // Agregar elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    
    // console.log(articulosCarrito);

    carritoHTML();
}

// Muestra el carrito de compras en el html
function carritoHTML(){

    // Lipiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        console.log(curso);
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}" > X </a>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    } );

    // Agregar el carrito de compra al Storage
    sincronizarStorage();
}

// Limpiar los cursos del tbody
function limpiarHTML(){
    // forma lenta de limpiar
    // contenedorCarrito.innerHTML = '';

    // Forma optimizada de limpiar. Revisa si hay hijo, y limpia. Si ya no hay, termina.
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}