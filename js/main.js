var cart = [];


function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    item.quantity = 1;
    cart.push(item);
  }

  renderCart();
  calculateTotalAmount();
}

function removeCartItem(itemId) {
  const itemIndex = cart.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
    renderCart();
    calculateTotalAmount();
  }
}

function renderCart() {
  const cartItemsList = document.getElementById("cartItems");
  cartItemsList.innerHTML = "";

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    const itemNamePrice = document.createElement("div");
    const itemQuantity = document.createElement("span");
    itemQuantity.className = "badge badge-primary badge-pill ml-2";
    itemQuantity.textContent = item.quantity;

    itemNamePrice.innerHTML = `
      <div>
        <h5>${item.name}</h5>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
      </div>`;

    listItem.appendChild(itemNamePrice);
    listItem.appendChild(itemQuantity);

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-danger";
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    removeButton.onclick = () => removeCartItem(item.id);
    listItem.appendChild(removeButton);

    cartItemsList.appendChild(listItem);
  });
}

function calculateTotalAmount() {
  const totalAmountElement = document.getElementById("totalAmount");
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  totalAmountElement.textContent = "$" + totalAmount.toFixed(2);
}



function generateProductHtml(id, product) {
  return `<div id="${id}" class="col-md-4 m-3 p-3 text-center" style="padding:10px;">
    <div class="card " style="height:400px;"> 
      <img src="${product.thumbnail}" class="card-img-top" alt="" style="height:40%;">
      <div class="card-body">
        <h3 class="card-title">${product.title}</h3>
        <p class="card-text">${product.description}</p>
        <p class="card-text">$${product.price.toFixed(2)}</p>
        <button onclick="addToCart({id:'${id}',name:'${product.title}',price:${product.price}})" class="btn btn-primary center">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

const productsPerPage = 6;
let currentPage = 1;
let filteredProducts = [];




function renderProducts() {
  const startIdx = (currentPage - 1) * productsPerPage;
  const endIdx = startIdx + productsPerPage;
  const productsDiv = document.getElementById("new-products");
  productsDiv.innerHTML = "";

  for (let i = startIdx; i < endIdx && i < filteredProducts.length; i++) {
    const id = "product-" + uuid.v4();
    let productHtml = generateProductHtml(id, filteredProducts[i]);
    productsDiv.innerHTML += productHtml;
  }

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    const a = document.createElement("a");
    a.classList.add("page-link");
    a.textContent = i;
    a.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });
    li.appendChild(a);
    pagination.appendChild(li);
  }
}
function loadCategories() {
  fetch('https://dummyjson.com/products/categories')
    .then((response) => response.json())
    .then((categories) => {
      const categorySelect = document.getElementById('categorySelect');

      // Clear existing options
      categorySelect.innerHTML = '';

      // Create and add "All Categories" option
      const allCategoriesOption = document.createElement('option');
      allCategoriesOption.value = '';
      allCategoriesOption.textContent = 'All Categories';
      categorySelect.appendChild(allCategoriesOption);

      // Create and add options for each category
      categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
loadCategories();

function loadCategoryProducts(category) {
  fetch(`https://dummyjson.com/products/category/${category}?limit=50`)
    .then((response) => response.json())
    .then((data) => {
      const products = data.products;
      filteredProducts = products;
      renderProducts();
    })
    .catch((error) => {
      console.log(error);
    });
}

document.getElementById('categorySelect').addEventListener('change', function () {
  selectedCategory = this.value;
  if (selectedCategory) {
    loadCategoryProducts(selectedCategory);
  } else {
    loadProducts(); // Load all products if no category is selected
  }
});

// Add event listener to search button
document.getElementById('searchButton').addEventListener('click', function () {
  const searchKeyword = document.getElementById('searchBar').value;
  performSearch(searchKeyword);
});

// Function to perform search
function performSearch(keyword) {
  // Filter products based on the search keyword
  const filteredBySearch = products.filter(product => product.title.toLowerCase().includes(keyword.toLowerCase()));
  filteredProducts = filteredBySearch;
  renderProducts();
}


function loadProducts() {
  fetch("https://dummyjson.com/products?limit=100")
    .then((response) => response.json())
    .then((json) => {
      products = json.products;
      filteredProducts = products;
      renderProducts();
    })
    .catch((error) => {
      console.log(error);
    });
}

loadProducts();