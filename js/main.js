// Global variables
const closeBtn = document.getElementById("close");
const cartIcon = document.getElementById("cart");
const hiddenCart = document.getElementById("cart-list");
const spreadOverlay = document.getElementById("spread-overlay");
const items = document.querySelector(".item-wrap");
const cartListItems = document.getElementById("list-cart-items");
const sumTotal = document.getElementById("sum-total");
const shopNow = document.querySelector("#shop-now");
const clearCart = document.getElementById("clear-cart");
var totalCart = 0;

// Display Cart-items onload
if (!isStorageEmpty()) {
  var output = displayCartItems();
  cartListItems.innerHTML = output;
  var products = JSON.parse(localStorage.getItem("products"));
  products.forEach((prod) => {
    // Updates total-cart-item no.s
    totalCart += prod.count;
    updateTotalCartItem();
  });
  calcTotalPrice();
} else {
  cartListItems.innerHTML = `<p class="text-center text-primary">Your cart is empty!!</p>`;
}

// Checks localStarage
function isStorageEmpty() {
  var products = JSON.parse(localStorage.getItem("products"));
  if (products && products.length != 0) {
    return false;
  } else {
    return true;
  }
}

// Event-listeners
cartIcon.addEventListener("click", showCartList);

closeBtn.addEventListener("click", hideCartList);
spreadOverlay.addEventListener("click", hideCartList);

clearCart.addEventListener("click", clearCartItems);

// Display products
shopNow.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "#showcase-items";
});

// Adds and Displays Cart
items.addEventListener("click", (e) => {
  e.preventDefault();
  var target = "";
  var checked = false;
  if (e.target.classList.contains("image-wrap")) {
    target = e.target.nextElementSibling.children[0].innerText;
    checked = true;
  }

  if (e.target.classList.contains("cart-info")) {
    target = e.target.parentElement.nextElementSibling.children[0].innerText;
    checked = true;
  }

  if (checked) {
    fetchCartItem(target);
    showCartList();
  }
});

// Updates cart-items
cartListItems.addEventListener("click", (e) => {
  var num = 0;
  var del = 0;
  var products = JSON.parse(localStorage.getItem("products"));
  var which = "";
  // Increase number
  if (e.target.classList.contains("inc")) {
    num = parseInt(e.target.nextElementSibling.innerText);
    num++;
    totalCart++;
    updateTotalCartItem();
    which = e.target.parentElement.previousElementSibling.children[0].innerText;
    products.forEach((prod) => {
      if (prod.name == which) {
        prod.count = num;
        e.target.nextElementSibling.innerText = prod.count;
      }
    });
    localStorage.setItem("products", JSON.stringify(products));
  }
  // Decrease number
  else if (e.target.classList.contains("desc")) {
    num = parseInt(e.target.previousElementSibling.innerText);
    num--;
    if (num == 0) {
      return;
    }
    totalCart--;
    updateTotalCartItem();
    which = e.target.parentElement.previousElementSibling.children[0].innerText;
    products.forEach((prod) => {
      if (prod.name == which) {
        prod.count = num;
        e.target.previousElementSibling.innerText = prod.count;
      }
    });
    localStorage.setItem("products", JSON.stringify(products));
  }
  // Remove specific cart item
  else if (e.target.classList.contains("remove-prod")) {
    if (confirm("Are you sure, you want to remove this item from your cart?")) {
      del = parseInt(
        e.target.parentElement.nextElementSibling.children[1].innerText
      );
      totalCart -= del;
      updateTotalCartItem();
      which = e.target.parentElement.children[0].innerText;
      products.forEach((prod, index) => {
        if (prod.name == which) {
          prod.status = `<i class="fas fa-shopping-cart"></i>
          &nbsp; ADD TO CART`;
          updateCartStatus(prod.name, prod.status);
          products.splice(index, 1);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
      e.target.parentElement.parentElement.remove();
      if (isStorageEmpty()) {
        cartListItems.innerHTML = `<p class="text-center text-primary">Your cart is empty!!</p>`;
      }
    }
  } else;
  calcTotalPrice();
  return;
});

// Displays cart
function showCartList() {
  hiddenCart.className = "overlay";
  spreadOverlay.className = "spread-overlay";
}

// Hides cart
function hideCartList() {
  hiddenCart.className = "";
  spreadOverlay.className = "remove-overlay";
}

// Updates Total Cart
function updateTotalCartItem() {
  cartIcon.children[1].innerText = totalCart;
}

// Updates Cart Status
function updateCartStatus(name, status) {
  var len = items.children.length;
  for (var i = 0; i < len; i++) {
    if (items.children[i].children[1].children[0].innerText == name) {
      // Sets status
      items.children[i].children[0].children[0].innerHTML = status;
    }
  }
  return;
}

// Finds Cart from json
function fetchCartItem(item) {
  // Fetch items from json
  fetch("js/products.json")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        if (product.name === item) {
          addCartItem(product);
        }
      });
    })
    .catch((err) => console.log(err));
}

// Calculates total price
function calcTotalPrice() {
  var len = cartListItems.children.length;
  var total = 0.0;
  var price = 0.0;
  var multiplier = 0;
  if (isStorageEmpty()) {
    sumTotal.innerText = total.toString();
    return;
  }
  for (var i = 0; i < len; i++) {
    price = parseFloat(
      cartListItems.children[i].children[1].children[1].innerText.substring(1)
    );
    multiplier = parseFloat(
      cartListItems.children[i].children[2].children[1].innerText
    );
    total += price * multiplier;
  }
  total = Math.round(total * 100) / 100;
  sumTotal.innerText = total.toString();
  return;
}

// Adds Cart to Storage
function addCartItem(item) {
  var current = {
    name: item.name,
    url: item.url,
    price: item.price,
    count: 1,
    status: "IN CART",
  };

  var products = JSON.parse(localStorage.getItem("products"));
  var isExisting = false;
  // If item exists in Storage
  if (products && products != null) {
    products.forEach((prod) => {
      if (prod.name == current.name) {
        // Item match
        isExisting = true;
      }
    });
    // If no match found
    if (!isExisting) {
      products.push(current);
      localStorage.setItem("products", JSON.stringify(products));
    } else {
      return;
    }
  } else {
    var itemStorage = [];
    itemStorage.push(current);
    // Create new storage item
    localStorage.setItem("products", JSON.stringify(itemStorage));
  }

  // Gets output
  var output = displayCartItems();
  // Update total cart no.s
  totalCart++;
  updateTotalCartItem();
  // Displays output
  cartListItems.innerHTML = output;
  // Display total price
  calcTotalPrice();
}

// Returns output
function displayCartItems() {
  var products = JSON.parse(localStorage.getItem("products"));
  var output = "";
  products.forEach((prod) => {
    output += `<li class="list-cart">
    <div class="img">
      <img src="img/${prod.url}" width="100%" />
    </div>
    <div class="collection-data">
      <h4>${prod.name}</h4>
      <h4>$${prod.price}</h4>
      <a href="#" class="remove-prod">remove</a>
    </div>
    <div class="updation">
      <i class="fas fa-chevron-up text-primary inc"></i>
      <h4 class="update text-center">${prod.count}</h4>
      <i class="fas fa-chevron-down text-primary desc"></i>
    </div>
  </li>`;
    updateCartStatus(prod.name, prod.status);
  });
  return output;
}

// Clear Cart Items
function clearCartItems() {
  var products = JSON.parse(localStorage.getItem("products"));
  if (isStorageEmpty()) {
    alert("You have no cart items to be cleared!");
    return;
  }
  if (confirm("Are you sure? You want to clear all cart items?")) {
    products.forEach((prod) => {
      prod.status = `<i class="fas fa-shopping-cart"></i>&nbsp; ADD TO CART`;
      updateCartStatus(prod.name, prod.status);
    });
    localStorage.clear();
    cartListItems.innerHTML = `<p class="text-center text-primary">Your cart is empty!!</p>`;
    totalCart = 0;
    updateTotalCartItem();
    calcTotalPrice();
  }
}
