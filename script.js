const loadProductsBtn = document.getElementById("load-btn");
const productsSection = document.getElementById("product-section");
const productList = document.getElementById("product-container");
const emptyStateSection = document.getElementById("empty-state");
const productsCounter = document.getElementById("product-count");
const errorBanner = document.getElementById("error-message");
const sortDropdown = document.getElementById("sort-select");

let productsData = [];

async function fetchProducts() {
  loadProductsBtn.textContent = "Loading...";
  loadProductsBtn.disabled = true;

  errorBanner.classList.add("hidden");
  productList.innerHTML = "";

  try {
    const response = await fetch(
      "https://interveiw-mock-api.vercel.app/api/getProducts"
    );
    const result = await response.json();

    productsData = result.data.map((item) => item.product);
    renderProducts(productsData);

    emptyStateSection.classList.add("hidden");
    productsSection.classList.remove("hidden");
  } catch (error) {
    console.error("Failed to load products:", error);
    productList.innerHTML = "<p>Error loading products.</p>";
    errorBanner.classList.remove("hidden");
  } finally {
    loadProductsBtn.textContent = "Load Products";
    loadProductsBtn.disabled = false;
  }
}

function renderProducts(products) {
  productList.innerHTML = "";
  productsCounter.textContent = `${products.length} Products`;

  products.forEach((product, index) => {
    const { title, vendor, image, variants } = product;
    const price = variants?.[0]?.price || "N/A";
    const imgSrc = image?.src || "";

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${imgSrc}" alt="${title}">
      <div class="product-info">
        <div class="product-description">
          <h2>${title}</h2>
         <div class="product-dis">
          <h3>Rs. ${price}</h3>
          <p>${vendor}</p>
         </div>

        </div>
        <button>ADD TO CART</button>
      </div>
    `;

    productList.appendChild(card);
    setTimeout(() => card.classList.add("show"), index * 100);
  });
}

sortDropdown.addEventListener("change", () => {
  if (!productsData.length) return;

  const sorted = [...productsData].sort((a, b) => {
    const priceAsc = parseFloat(a.variants?.[0]?.price || 0);
    const priceDesc = parseFloat(b.variants?.[0]?.price || 0);
    return sortDropdown.value === "asc"
      ? priceAsc - priceDesc
      : priceAsc - priceDesc;
  });

  renderProducts(sorted);
});

loadProductsBtn.addEventListener("click", fetchProducts);
