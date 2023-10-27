//verificación del login

document.addEventListener("DOMContentLoaded", function () {
  const userSes = getSessionData("username");

  if (!userSes) {
    alert("Por favor, registrate");
    window.location.href = "login.html";
  }
});

function getSessionData(usrname) {
  return localStorage.getItem(usrname);
}

//Usuario en la esquina superior derecha


document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("dataUsuario");
  const usuario = localStorage.getItem("username");

  container.textContent = usuario;
})

let cerrar = document.getElementById("cerrarsesion"); //borrar usuario al cerrar sesion
cerrar.addEventListener("click", function () {
  localStorage.removeItem("username");
});

//Modo Noche

function enableDarkMode() {
  var element = document.body;
  element.dataset.bsTheme = element.dataset.bsTheme == "light" ? "dark" : "light";

  localStorage.setItem('theme', element.dataset.bsTheme);
}

// Función para cargar el tema desde localStorage

function loadThemeFromLocalStorage() {
  var theme = localStorage.getItem('theme');
  if (theme === "dark") {
    enableDarkMode();
  }
}

// Cargar el tema desde localStorage al cargar la página

window.addEventListener('DOMContentLoaded', loadThemeFromLocalStorage);



//Mostrar producto precargado

document.addEventListener('DOMContentLoaded', function () {
  fetch('https://japceibal.github.io/emercado-api/user_cart/25801.json')
    .then(response => response.json())
    .then(data => {
      const productoElement = document.getElementById("producto");
      const productoData = data.articles[0];

      productoElement.innerHTML = `
        <td class="w-25"><img id="imagenProducto" src="${productoData.image}" alt="Imagen del Producto" class="img-fluid" style="max-width: 50%;"></td>
        <td>${productoData.name}</td>
        <td>USD${productoData.unitCost}</td>
        <td><div><input type="number" class="form-control product-amount" id="cantidadProducto" value="${productoData.count}" min="1" ></div></td>
        <td class="subtotalProducto">USD<span class="subtotalProductoPrecio">${(productoData.unitCost)}</span></td>
        <td><button class="btnEliminar" style= "cursor: pointer"><i class="fa-regular fa-trash-can fa-lg" style="color: #f55151;"></i></button></td>
      `;

    })
    .catch(error => {
      console.error('Error al obtener datos del carrito:', error);
    });
});


//Agregar prductos al carrito
const productosAdd = document.getElementById("productos-agregados");

document.addEventListener('DOMContentLoaded', function () {

  const shippings = document.getElementsByClassName('radio-shipping');

  /* Evento click de input radio */
  for (let shipping of shippings) {
    shipping.addEventListener('click', function (event) {
      const elem = event.target;
      imprimirPorcentajeDeEnvios(elem.value);
    });
  }

  var storedProducts = JSON.parse(localStorage.getItem('productosCompras'));

  for (const productAddedId of storedProducts) {

    fetch(PRODUCT_INFO_URL + productAddedId + ".json")
      .then(response => response.json())
      .then(data => {
        productosAdd.innerHTML += `
          <tr class="producto">
          <td onclick="localStorage.setItem('selectedProduct', ${data.id}); window.location='product-info.html';"style="cursor: pointer" class="w-25"><img src="${data.images[0]}" alt="Imagen del Producto" class="img-fluid" style="max-width: 50%;"></td>
          <td onclick=" localStorage.setItem('selectedProduct', ${data.id}); window.location='product-info.html';"style="cursor: pointer">${data.name}</td>
          <td>USD${data.cost}</td>
          <td><div><input type="number" class="form-control product-amount" value="1" min="1" ></div></td>
          <td class="subtotalProducto">USD<span class="subtotalProductoPrecio">${data.cost}</span></td>
          <td><button class="btnEliminar" onclick="removeProductFromCart('${data.id}')" style= "cursor: pointer"><i class="fa-regular fa-trash-can fa-lg" style="color: #f55151;"></i></button></td>
          </tr>
        `;
        subtotalFinal();
        shippings[0].click();
      })
      .catch(error => {
        console.error('Error al obtener datos del carrito:', error);
      });
  }
});


//Subtotal (costo del producto * cantidad)
productosAdd.addEventListener('input', function (event) {
  if (event.target.type === 'number') {
    const cantidadInput = event.target;
    const row = cantidadInput.closest('.producto');
    const precioUnitario = parseFloat(row.querySelector('td:nth-child(3)').textContent.replace('USD', ''));
    const cantidad = parseInt(cantidadInput.value);
    const nuevoSubtotal = precioUnitario * cantidad;
    const subtotal = row.querySelector('td:nth-child(5)');
    const subtotalPrecio = subtotal.querySelector('.subtotalProductoPrecio')
    subtotalPrecio.innerText = nuevoSubtotal;
    subtotalFinal();
  }
});

//Suma de Subtotales 
function subtotalFinal() {
  let sumaSubtotales = document.getElementsByClassName("subtotalProductoPrecio");
  let suma = 0;
  for (let i = 0; i < sumaSubtotales.length; i++) {
    sumaSubtotal = sumaSubtotales[i];
    suma += Number(sumaSubtotal.innerText);
  }
  document.getElementById('subtotalPrecioFinal').innerHTML = suma;
  calcularPorcentajeDeEnvios();
}

/* Porcentajes de envios */
function imprimirPorcentajeDeEnvios(porcentaje) {
  let sumaSubtotalFinal = document.getElementById('subtotalPrecioFinal');
  document.getElementById("costo-de-envio").innerText = Math.floor(Number(sumaSubtotalFinal.innerText) * porcentaje);
  precioTotalAPagar();
}

function calcularPorcentajeDeEnvios() {
  const shippings = document.getElementsByClassName('radio-shipping');
  for (let shipping of shippings) {
    if (shipping.checked) {
      imprimirPorcentajeDeEnvios(shipping.value);
    }
  }
}
/* Total a pagar */
function precioTotalAPagar() {
  let costoSubtotal = document.getElementById('subtotalPrecioFinal');
  let costoEnvio = document.getElementById('costo-de-envio');
  document.getElementById('total').innerText = Number(costoSubtotal.innerText) + Number(costoEnvio.innerText);
}

//seleccion para pagar

var seleccion = document.getElementById("seleccion");
var tarjeta = document.getElementById("tarjeta");
var transferencia = document.getElementById("transferencia");

tarjeta.addEventListener("change", actualizarSeleccion);
transferencia.addEventListener("change", actualizarSeleccion);

function actualizarSeleccion() {
  if (tarjeta.checked) {
    seleccion.textContent = "Tarjeta de credito";
  } else if (transferencia.checked) {
    seleccion.textContent = "Transferencia bancaria";
  } else {
    seleccion.textContent = "no ha seleccionado";
  }
}

//bloquear campos del otro radio cuando ya hay uno seleccionado

const tarjetaRadio = document.getElementById('tarjeta');
const transferenciaRadio = document.getElementById('transferencia');
const numerotarjeta = document.getElementById('numerotarjeta');
const codigoSeguridad = document.getElementById('codigoSeguridad');
const fechaVencimiento = document.getElementById('fechaVencimiento');
const numerocuenta = document.getElementById('numerocuenta');


tarjeta.addEventListener("change", bloquearotroradio);
transferencia.addEventListener("change", bloquearotroradio);


function bloquearotroradio() {
  if (tarjeta.checked) {
    numerotarjeta.disabled = false;
    numerocuenta.disabled = true;
    codigoSeguridad.disabled = false;
    fechaVencimiento.disabled = false;
  }
  if (transferencia.checked) {
    numerotarjeta.disabled = true;
    codigoSeguridad.disabled = true;
    fechaVencimiento.disabled = true;
    numerocuenta.disabled = false;
  }
  //Eliminamos las clases de control de validity en caso de que se cambia el metodo de pago
  var inputs = document.querySelectorAll('#form_tarjeta .form-control');
  inputs.forEach((input) => { input.classList.remove('is-invalid', 'is-valid') });
  //Ocultamos el invalid-feedback si se cambia de metodo de pago ya que tiene que validarse de nuevo
  const feedback = document.querySelector('#payment-feedback');
  feedback.classList.add('invalid-feedback');
}

const finalizarCompra = document.getElementById("comprar");
const forms = document.querySelectorAll('.needs-validation');
const alertSuccess = document.getElementById("compraExitosa");


//Validación campos de formulario//
(function validarForm() {

  finalizarCompra.addEventListener('click', event => {
    const todo_correcto = validacionDeProductos() && validacionDireccion() && validacionDePago();

    if (todo_correcto) {
      alertSuccess.style.display = 'block';
      setTimeout(() => {
        alertSuccess.style.display = 'none';
      }, 3000);
    }
  }, false)
})()

function validacionDireccion() {
  let validado = true;
  const inputs = document.querySelectorAll('#formDireccion input');
  inputs.forEach((input) => {
    if (input.checkValidity()) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    }
    else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    validado = validado && input.checkValidity();
  });
  return validado;
}

function validacionDeProductos() {
  const productos = document.querySelectorAll('.product-amount');
  let validado = true;
  productos.forEach((product) => {
    if (product.checkValidity()) {
      product.classList.add('is-valid');
      product.classList.remove('is-invalid');
    }
    else {
      product.classList.add('is-invalid');
      product.classList.remove('is-valid');
    }
    validado = validado && product.checkValidity();
  });
  return validado;
}

function validacionDePago() {
  const tarjeta = document.getElementById("tarjeta");
  const transferencia = document.getElementById("transferencia");
  const feedback = document.querySelector('#payment-feedback');
  feedback.classList.add('invalid-feedback');
  if (!tarjeta.checked && !transferencia.checked) {
    feedback.classList.remove('invalid-feedback');
    return false;
  }
  let pagoValidado = true;
  if (tarjeta.checked) {
    const inputs = document.querySelectorAll('.credit-card.wrapper input');
    inputs.forEach((i) => {
      if (i.checkValidity()) {
        i.classList.add('is-valid');
        i.classList.remove('is-invalid');
      }
      else {
        i.classList.add('is-invalid');
        i.classList.remove('is-valid');
      }
      pagoValidado = pagoValidado && i.checkValidity();
    });
  }

  if (transferencia.checked) {
    const inputs = document.querySelectorAll('.transfer.wrapper input');
    inputs.forEach((i) => {
      if (i.checkValidity()) {
        i.classList.add('is-valid');
        i.classList.remove('is-invalid');
      }
      else {
        i.classList.add('is-invalid');
        i.classList.remove('is-valid');
      }
      pagoValidado = pagoValidado && i.checkValidity();
    });
  }

  if (!pagoValidado) {
    feedback.classList.remove('invalid-feedback');
  }
  return pagoValidado;
}

//Elimina el producto del carrito
productosAdd.addEventListener('click', function (event) {
  if (event.target.classList.contains('btnEliminar')) {
    const row = event.target.closest('.producto');
    row.remove();
    subtotalFinal();
  }
});

//Borra ID del localStorage del producto eliminado
function removeProductFromCart(productId) {
  var storedProducts = JSON.parse(localStorage.getItem('productosCompras')) || [];
  var updatedProducts = storedProducts.filter(function (item) {
    return item !== productId;
});
localStorage.setItem('productosCompras', JSON.stringify(updatedProducts));
}