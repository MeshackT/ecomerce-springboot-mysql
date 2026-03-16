const apiUrl = "http://localhost:8080/api/products";
const uploadUrl = "http://localhost:8080/api/products/uploads";
console.log("JS Loaded");

// Get token from localStorage
const token = localStorage.getItem("token");

console.log("My Token:", token);

const role = localStorage.getItem("role");
console.log("My Role:", role);

// Ensure user is logged in
window.addEventListener("load", function() {
    if (!token) {
        alert("You must login first!");
        window.location.href = "login.html";
    } else {
        fetchProducts();
    }
    
    if (!token || role !== "admin") {
        window.location.href = "login.html";
    }
});

// ==========================
// Event Delegation
// ==========================
document.addEventListener("click", (e) => {

    // Add Product button
    if (e.target.matches(".btn-add")) {
        addProduct();
    }

    // Update Product buttons (inside table)
    if (e.target.matches(".btn-update")) {
        const id = e.target.dataset.id;
        updateProduct(id);
    }

    // Delete Product buttons (inside table)
    if (e.target.matches(".btn-delete")) {
        const id = e.target.dataset.id;
        deleteProduct(id);
    }
});

function fetchProducts() {
    console.log("Fetching products from:", apiUrl);
    fetch(apiUrl , {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
        }
    })
    .then(res => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
.then(products => {

    const tbody = document.getElementById("products");

    if (!tbody) {
        console.warn("Table body with id 'products' not found.");
        return;
    }

    tbody.innerHTML = "";

    products.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            <td>
                <img src="http://localhost:8080${p.imageUrl}"
                     width="40" height="40"
                     style="object-fit:cover;border-radius:6px;">
            </td>
            <td>
                <button class="btn btn-outline-primary btn-sm"
                    onclick='openEditModal(${JSON.stringify(p)})'>
                    ✏ Edit
                </button>

                <button class="btn btn-outline-danger btn-sm btn-delete"
                    data-id="${p.id}">
                    🗑 Delete
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
})
    .catch(err => console.error("Error fetching products:", err));
}

// ==========================
// search for product
// ==========================
function searchProducts() {

    const searchInput = document.getElementById("searchProduct");
    const filter = searchInput.value.toLowerCase();

    const table = document.getElementById("productTable");
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach(function(row) {

        const text = row.innerText.toLowerCase();

        if (text.includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}



// ==========================
// Add new product
// ==========================
function addProduct() {
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const sku = document.getElementById("sku").value.trim();
    const category = document.getElementById("category").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const discountPrice = parseFloat(document.getElementById("discountPrice").value);
    const onSale = document.getElementById("onSale").value === "true";
    const tags = document.getElementById("tags").value.trim();

    const fileInput = document.getElementById("imageUrl");
    const file = fileInput.files[0];

    if (!name || isNaN(price) || isNaN(quantity) || !file) {
        alert("Please fill in all required fields and select an image!");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("sku", sku);
    formData.append("category", category);
    formData.append("brand", brand);
    if (!isNaN(discountPrice)) formData.append("discountPrice", discountPrice);
    formData.append("onSale", onSale);

    if (tags) formData.append("tags", tags);
    formData.append("image", file);

    fetch("http://localhost:8080/api/products/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(() => {
        fetchProducts();
        clearAddForm();
        document.getElementById("imagePreview").style.display = "none"; // reset preview
    })
    .catch(err => console.error("Error adding product:", err));
}

// ==========================   
// Preview image before upload
// ==========================


function previewImage() {
    const fileInput = document.getElementById("imageUrl");
    const imagePreview = document.getElementById("imagePreview");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        }       
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = "";
        imagePreview.style.display = "none";
    }   
}


function openEditModal(product) {

    console.log("Selected product:", product);

    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-name').value = product.name || "";
    document.getElementById('edit-desc').value = product.description || "";

    document.getElementById('edit-price').value = product.price ?? 0;
    document.getElementById('edit-qty').value = product.quantity ?? 0;

    document.getElementById('edit-sku').value = product.sku || "";
    document.getElementById('edit-category').value = product.category || "";
    document.getElementById('edit-brand').value = product.brand || "";

    document.getElementById('edit-discountPrice').value = product.discountPrice ?? 0;

    document.getElementById('edit-onSale').value = product.onSale ? "true" : "false";

    document.getElementById('edit-tags').value = product.tags || "";

   // Show current image in preview
    const preview = document.getElementById("edit-imagePreview");

    if (product.imageUrl) {
        const baseUrl = "http://localhost:8080";
        preview.src = baseUrl + product.imageUrl;
        preview.style.display = "block";

        // store current image path for update
        document.getElementById("edit-imageUrl").dataset.current = product.imageUrl;
    } else {
        preview.style.display = "none";
    }
        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
}
async function saveProduct() {
    const id = document.getElementById('edit-id').value;

    const name = document.getElementById('edit-name').value.trim();
    const description = document.getElementById('edit-desc').value.trim();
    const price = parseFloat(document.getElementById('edit-price').value);
    const quantity = parseInt(document.getElementById('edit-qty').value);
    const sku = document.getElementById('edit-sku').value.trim();
    const category = document.getElementById('edit-category').value.trim();
    const brand = document.getElementById('edit-brand').value.trim();
    const discountPrice = parseFloat(document.getElementById('edit-discountPrice').value);
    const onSale = document.getElementById('edit-onSale').value === "true";
    const tags = document.getElementById('edit-tags').value.trim();

const fileInput = document.getElementById("edit-imageUrl");
let imageUrl = fileInput.dataset.current || "";

if (fileInput.files && fileInput.files[0]) {

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const uploadRes = await fetch("http://localhost:8080/api/products/upload-image", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    if (!uploadRes.ok) {
        throw new Error("Image upload failed");
    }

    imageUrl = await uploadRes.text(); 
}

    const updatedProduct = {
        name,
        description,
        price,
        quantity,
        sku,
        category,
        brand,
        discountPrice,
        onSale,
        tags,
        imageUrl
    };

    // Send PUT request to update product
    try {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedProduct)
        });

        if (!res.ok) throw new Error(`Product update failed with status ${res.status}`);

        await fetchProducts(); // Refresh table
        alert("Product updated successfully!");
    } catch (err) {
        console.error("Error updating product:", err);
        alert("Failed to update product. Check console for details.");
    }
}
// **********************************
// Preview image before upload in Edit Modal
// **********************************
function previewEditImage() {
    const fileInput = document.getElementById("edit-imageUrl");
    const preview = document.getElementById("edit-imagePreview");

    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };

        reader.readAsDataURL(file);
    }
}
function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(() => fetchProducts())
    .catch(err => console.error("Error deleting product:", err));
}

// ==========================
// Clear Add Product form
// ==========================
function clearAddForm() {
    const ids = ["name", "description", "price", "quantity", "imageUrl",
                 "sku", "category", "brand", "discountPrice", "onSale", "tags"];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === "SELECT") el.selectedIndex = 0;
            else el.value = "";
        }
    });
}
// ==========================
// Logout
// ==========================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

// ==========================
// Display category-wise products (Men & Women)
// ==========================
async function loadProducts() {
    const menContainer = document.getElementById('male-products');
    const womenContainer = document.getElementById('female-products');

    // Exit only if both containers are missing
    if (!menContainer && !womenContainer) {
        console.error("No product containers found.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) throw new Error(`Failed to fetch products`);

        const products = await response.json();
        const baseUrl = "http://localhost:8080";

        if (menContainer) menContainer.innerHTML = '';
        if (womenContainer) womenContainer.innerHTML = '';

        products.forEach(product => {
            const category = product.category?.toLowerCase();
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';

            col.innerHTML = `
                <div class="item">
                    <div class="thumb">
                        <div class="hover-content">
                            <ul>
                                <li><a href="single-product.html?id=${product.id}"><i class="fa fa-eye"></i></a></li>
                                <li><a href="#"><i class="fa fa-heart"></i></a></li>
                                <li><a href="#"><i class="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <img src="${product.imageUrl ? baseUrl + product.imageUrl : 'assets/images/placeholder.png'}"
                             alt="${product.name}">
                    </div>
                    <div class="down-content">
                        <h4>${product.name}</h4>
                        <span>$${Number(product.price).toFixed(2)}</span>
                    </div>
                </div>
            `;

              if ((category === 'male' || category === 'men') && menContainer) {
                menContainer.appendChild(col);
            } else if ((category === 'female' || category === 'women') && womenContainer) {
                womenContainer.appendChild(col);
            }
        });

        

    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

// Call it after DOM is ready
document.addEventListener("DOMContentLoaded", loadProducts);




// ==========================
// Load 4 products for each category on page load
// ==========================

async function display4Products() {

    // NEW container IDs
    const menContainer = document.getElementById('male-products-4');
    const womenContainer = document.getElementById('female-products-4');

    if (!menContainer || !womenContainer) {
        console.error("Product containers not found.");
        return;
    }

    try {

        const response = await fetch('http://localhost:8080/api/products');

        if (!response.ok) throw new Error(`Failed to fetch products`);

        const products = await response.json();
        const baseUrl = "http://localhost:8080";

        menContainer.innerHTML = '';
        womenContainer.innerHTML = '';

        let menCount = 0;
        let womenCount = 0;

        products.forEach(product => {

            const category = product.category?.toLowerCase();

            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';

            col.innerHTML = `
            <div class="item">

                <div class="thumb">

                    <div class="hover-content">
                        <ul>
                            <li><a href="single-product.html?id=${product.id}"><i class="fa fa-eye"></i></a></li>
                            <li><a href="#"><i class="fa fa-star"></i></a></li>
                            <li><a href="#"><i class="fa fa-shopping-cart"></i></a></li>
                        </ul>
                    </div>

                    <img src="${product.imageUrl ? baseUrl + product.imageUrl : 'assets/images/placeholder.png'}"
                         alt="${product.name}">

                </div>

                <div class="down-content">
                    <h4>${product.name}</h4>
                    <span>$${Number(product.price).toFixed(2)}</span>
                </div>

            </div>
            `;

            if ((category === 'male' || category === 'men') && menCount < 4) {
                menContainer.appendChild(col);
                menCount++;
            }
            else if ((category === 'female' || category === 'women') && womenCount < 4) {
                womenContainer.appendChild(col);
                womenCount++;
            }

        });

    } catch (err) {
        console.error("Error fetching products:", err);
    }
}
document.addEventListener("DOMContentLoaded", display4Products);

// filter products by price range
async function loadProductsFiltered(minPrice = 0, maxPrice = Infinity) {
    const menContainer = document.getElementById('male-products');
    const womenContainer = document.getElementById('female-products');

    if (!menContainer && !womenContainer) {
        console.error("No product containers found.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) throw new Error(`Failed to fetch products`);

        const products = await response.json();
        const baseUrl = "http://localhost:8080";

        if (menContainer) menContainer.innerHTML = '';
        if (womenContainer) womenContainer.innerHTML = '';

        products
        .filter(p => p.price >= minPrice && p.price <= maxPrice) // <-- filter by price
        .forEach(product => {
            const category = product.category?.toLowerCase();
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';

            col.innerHTML = `
                <div class="item">
                    <div class="thumb">
                        <div class="hover-content">
                            <ul>
                                <li><a href="single-product.html?id=${product.id}"><i class="fa fa-eye"></i></a></li>
                                <li><a href="#"><i class="fa fa-star"></i></a></li>
                                <li><a href="#"><i class="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <img src="${product.imageUrl ? baseUrl + product.imageUrl : 'assets/images/placeholder.png'}"
                             alt="${product.name}">
                    </div>
                    <div class="down-content">
                        <h4>${product.name}</h4>
                        <span>$${Number(product.price).toFixed(2)}</span>
                    </div>
                </div>
            `;

            if ((category === 'male' || category === 'men') && menContainer) {
                menContainer.appendChild(col);
            } else if ((category === 'female' || category === 'women') && womenContainer) {
                womenContainer.appendChild(col);
            }
        });

    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadProductsFiltered(); // call without filter to show all
});
document.getElementById("filterPriceBtn").addEventListener("click", () => {
    const min = parseFloat(document.getElementById("minPrice").value) || 0;
    const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    loadProductsFiltered(min, max);
});
// Reset button
document.getElementById("resetPriceBtn").addEventListener("click", () => {
    document.getElementById("minPrice").value = '';
    document.getElementById("maxPrice").value = '';
    loadProductsFiltered(); // reload all
});

