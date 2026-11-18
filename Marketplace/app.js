// ===============================
// 1. DATOS
// ===============================
const productos = [
  { id: 1, nombre: "Teclado mecánico", precio: 180000, categoria: "Periféricos", stock: 5 },
  { id: 2, nombre: "Mouse inalámbrico", precio: 60000, categoria: "Periféricos", stock: 8 },
  { id: 3, nombre: "Monitor 24 pulgadas", precio: 650000, categoria: "Monitores", stock: 3 },
  { id: 4, nombre: "Monitor curvo 27 pulgadas", precio: 980000, categoria: "Monitores", stock: 2 },
  { id: 5, nombre: "Audífonos con micrófono", precio: 120000, categoria: "Audio", stock: 6 },
  { id: 6, nombre: "Parlante bluetooth", precio: 150000, categoria: "Audio", stock: 4 },
  { id: 7, nombre: "Webcam HD", precio: 95000, categoria: "Periféricos", stock: 1 },
  { id: 8, nombre: "Barra de sonido", precio: 310000, categoria: "Audio", stock: 3 }
];

// El carrito guarda objetos { id, cantidad }
let carrito = [];
let categoriaActual = "Todas";

// ===============================
// 2. ELEMENTOS DEL DOM
// ===============================
const contenedorFiltros = document.getElementById("contenedor-filtros");
const contenedorCatalogo = document.getElementById("contenedor-catalogo");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const mensajeVacio = document.getElementById("mensaje-vacio");
const btnVaciar = document.getElementById("btn-vaciar");

const resumenArticulos = document.getElementById("resumen-articulos");
const resumenSubtotal = document.getElementById("resumen-subtotal");
const resumenDescuento = document.getElementById("resumen-descuento");
const resumenTotal = document.getElementById("resumen-total");

// Prodctos creados desde js
const textoContador = document.createElement("p");
textoContador.classList.add("contador-productos");
contenedorFiltros.parentNode.insertBefore(textoContador, contenedorCatalogo);

// ===============================
// 3. FUNCIONES AUXILIARES
// ===============================
function formatearDinero(valor) {
  return "$ " + valor.toLocaleString("es-CO");
}

function buscarEnCarrito(id) {
  return carrito.find(function (item) {
    return item.id === id;
  });
}

function buscarProducto(id) {
  return productos.find(function (producto) {
    return producto.id === id;
  });
}

// Unidades disponibles = stock - lo que ya está en el carrito
function obtenerDisponibles(producto) {
  const item = buscarEnCarrito(producto.id);
  if (item) {
    return producto.stock - item.cantidad;
  }
  return producto.stock;
}

// ===============================
// 4. FILTROS POR CATEGORÍA
// ===============================
function mostrarFiltros() {
  contenedorFiltros.innerHTML = "";

  // Categorías sin repetir
  const categorias = ["Todas"];
  productos.forEach(function (producto) {
    if (!categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria);
    }
  });

  categorias.forEach(function (categoria) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = categoria;
    boton.classList.add("btn-filtro");

    if (categoria === categoriaActual) {
      boton.classList.add("activo");
    }

    boton.addEventListener("click", function () {
      categoriaActual = categoria;
      mostrarFiltros();
      mostrarCatalogo();
    });

    contenedorFiltros.appendChild(boton);
  });
}

// ===============================
// 5. CATÁLOGO
// ===============================
function mostrarCatalogo() {
  contenedorCatalogo.innerHTML = "";

  let lista = productos;
  if (categoriaActual !== "Todas") {
    lista = productos.filter(function (producto) {
      return producto.categoria === categoriaActual;
    });
  }

  textoContador.textContent = "Mostrando " + lista.length + " productos";

  lista.forEach(function (producto) {
    const disponibles = obtenerDisponibles(producto);

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const categoria = document.createElement("p");
    categoria.textContent = producto.categoria;

    const precio = document.createElement("p");
    precio.textContent = formatearDinero(producto.precio);

    const stock = document.createElement("p");
    stock.textContent = "Disponibles: " + disponibles;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Agregar";
    boton.classList.add("btn-agregar");

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(categoria);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(stock);

    if (disponibles === 0) {
      tarjeta.classList.add("agotado");
      boton.disabled = true;

      const etiqueta = document.createElement("span");
      etiqueta.textContent = "Agotado";
      etiqueta.classList.add("etiqueta-agotado");
      tarjeta.appendChild(etiqueta);
    }

    boton.addEventListener("click", function () {
      agregarAlCarrito(producto.id);
    });

    tarjeta.appendChild(boton);
    contenedorCatalogo.appendChild(tarjeta);
  });
}

// ===============================
// 6. LÓGICA DEL CARRITO
// ===============================
function agregarAlCarrito(id) {
  const producto = buscarProducto(id);
  const item = buscarEnCarrito(id);

  if (item) {
    // No superar el stock
    if (item.cantidad < producto.stock) {
      item.cantidad++;
    }
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }

  actualizarTodo();
}

function aumentarCantidad(id) {
  const producto = buscarProducto(id);
  const item = buscarEnCarrito(id);

  if (item.cantidad < producto.stock) {
    item.cantidad++;
  }

  actualizarTodo();
}

function disminuirCantidad(id) {
  const item = buscarEnCarrito(id);
  item.cantidad--;

  // Si llega a 0 sale del carrito
  if (item.cantidad === 0) {
    eliminarDelCarrito(id);
    return;
  }

  actualizarTodo();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(function (item) {
    return item.id !== id;
  });

  actualizarTodo();
}

function vaciarCarrito() {
  carrito = [];
  actualizarTodo();
}

// ===============================
// 7. MOSTRAR CARRITO
// ===============================
function mostrarCarrito() {
  contenedorCarrito.innerHTML = "";

  // Mensaje de carrito vacío: visible solo si no hay productos
  if (carrito.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  }

  mensajeVacio.style.display = "none";

  carrito.forEach(function (item) {
    const producto = buscarProducto(item.id);

    const fila = document.createElement("div");
    fila.classList.add("fila-carrito");

    const nombre = document.createElement("span");
    nombre.textContent = producto.nombre;
    nombre.classList.add("carrito-nombre");

    const precio = document.createElement("span");
    precio.textContent = formatearDinero(producto.precio);

    const btnMenos = document.createElement("button");
    btnMenos.type = "button";
    btnMenos.textContent = "−";
    btnMenos.addEventListener("click", function () {
      disminuirCantidad(item.id);
    });

    const cantidad = document.createElement("span");
    cantidad.textContent = item.cantidad;

    const btnMas = document.createElement("button");
    btnMas.type = "button";
    btnMas.textContent = "+";
    if (item.cantidad >= producto.stock) {
      btnMas.disabled = true;
    }
    btnMas.addEventListener("click", function () {
      aumentarCantidad(item.id);
    });

    const subtotal = document.createElement("span");
    subtotal.textContent = formatearDinero(producto.precio * item.cantidad);

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      eliminarDelCarrito(item.id);
    });

    fila.appendChild(nombre);
    fila.appendChild(precio);
    fila.appendChild(btnMenos);
    fila.appendChild(cantidad);
    fila.appendChild(btnMas);
    fila.appendChild(subtotal);
    fila.appendChild(btnEliminar);

    contenedorCarrito.appendChild(fila);
  });
}

// ===============================
// 8. RESUMEN DE LA COMPRA
// ===============================
function mostrarResumen() {
  let articulos = 0;
  let subtotal = 0;

  carrito.forEach(function (item) {
    const producto = buscarProducto(item.id);
    articulos += item.cantidad;
    subtotal += producto.precio * item.cantidad;
  });

  let descuento = 0;
  if (subtotal >= 300000) {
    descuento = subtotal * 0.1;
  }

  const total = subtotal - descuento;

  resumenArticulos.textContent = articulos;
  resumenSubtotal.textContent = formatearDinero(subtotal);

  if (descuento > 0) {
    resumenDescuento.textContent = "-" + formatearDinero(descuento);
  } else {
    resumenDescuento.textContent = formatearDinero(0);
  }

  resumenTotal.textContent = formatearDinero(total);
}

// ===============================
// 9. ACTUALIZAR TODO
// ===============================
function actualizarTodo() {
  mostrarCatalogo();
  mostrarCarrito();
  mostrarResumen();
}

// ===============================
// 10. EVENTOS
// ===============================
btnVaciar.addEventListener("click", vaciarCarrito);

mostrarFiltros();
actualizarTodo();