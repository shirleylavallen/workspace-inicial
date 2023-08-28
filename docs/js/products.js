const DATA_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

const container = document.getElementById("products-list");
const categoryTitle = document.getElementById('category-title')

const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_PRICE = "Precio";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;

function showCategoryName(name){
    categoryTitle.innerText = name;
}

function showProducts(products) {
  let htmlContentToAppend = "";
  for (let i = 0; i < currentProductsArray.length; i++) {
    let product = currentProductsArray[i];

    if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
        ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {
      htmlContentToAppend += `
        <div class="col-4">
           <div class="card">
             <img src="${product.image}" class="card-img-top" alt="Foto ${product.name}">
             <div class="card-body">
               <h5 class="card-title">${product.name}  USD${product.cost}</h5>
               <p class="card-text">${product.description}</p>
               <p class="soldCount">Vendidos ${product.soldCount}</p>
               <a href="#" class="btn btn-primary">Ver Detalles</a>
             </div>
           </div>
        </div>`;
    }
  }
  container.innerHTML = htmlContentToAppend;
} 


fetch(DATA_URL)
  .then(response => response.json())
  .then(data => {
    currentProductsArray = data.products; // Guarda los productos en la variable
    showCategoryName(data.catName); 
    showProducts(); // Llama a la función para mostrar los productos
  })
  .catch(error => {
    console.error("Error:", error);
  });

// ...

  document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minPrice = undefined;
    maxPrice = undefined;

    showProducts();
});

  document.getElementById("rangeFilterPrice").addEventListener("click", function(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    //de productos por categoría.
    minPrice = document.getElementById("rangeFilterPriceMin").value;
    maxPrice = document.getElementById("rangeFilterPriceMax").value;

    if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
        minPrice = parseInt(minPrice);
    }
    else{
        minPrice = undefined;
    }

    if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
        maxPrice = parseInt(maxPrice);
    }
    else{
        maxPrice = undefined;
    }

    showProducts();
});



//verificación del login
document.addEventListener("DOMContentLoaded", function () {
  const userSes = getSessionData("username");

  if (!userSes) {
    alert("Por favor, registrate");
    window.location.href = "login.html";
  }
});

function getSessionData(usrname) {
  return sessionStorage.getItem(usrname);
} 
