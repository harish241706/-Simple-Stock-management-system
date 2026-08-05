
let stockList = JSON.parse(localStorage.getItem('stockList')) || [];


const stockForm = document.getElementById('stockForm');
const searchInput = document.getElementById('searchInput');
const cancelBtn = document.getElementById('cancelBtn');


stockForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('keyup', filterStock);
cancelBtn.addEventListener('click', resetForm);


function saveToLocalStorage() {
    localStorage.setItem('stockList', JSON.stringify(stockList));
}


function renderStock(data = stockList) {
    const tableBody = document.getElementById('stockTableBody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">No products found.</td></tr>`;
        updateStats();
        return;
    }

    data.forEach((item) => {
        let qtyBadgeClass = item.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        
        let row = `
            <tr>
                <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900 font-semibold">${item.name}</p>
                </td>
                <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <span class="relative inline-block px-3 py-1 font-semibold text-gray-700 leading-tight">
                        <span aria-hidden class="absolute inset-0 bg-gray-200 opacity-50 rounded-full"></span>
                        <span class="relative">${item.category}</span>
                    </span>
                </td>
                <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <span class="px-2 py-1 font-semibold text-xs rounded-full ${qtyBadgeClass}">${item.quantity}</span>
                </td>
                <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900">$${Number(item.price).toFixed(2)}</p>
                </td>
                <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm text-center">
                    <button onclick="editProduct('${item.id}')" class="text-blue-600 hover:text-blue-900 mr-3"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct('${item.id}')" class="text-red-600 hover:text-red-900"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    updateStats();
}


function updateStats() {
    document.getElementById('totalProducts').innerText = stockList.length;
    
    let totalVal = stockList.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    document.getElementById('totalValue').innerText = `$${totalVal.toFixed(2)}`;

    let lowStock = stockList.filter(item => item.quantity < 5).length;
    document.getElementById('lowStockCount').innerText = lowStock;
}


function handleFormSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const price = parseFloat(document.getElementById('productPrice').value);

    if (id) {
        stockList = stockList.map(item => item.id === id ? { id, name, category, quantity, price } : item);
    } else {
        const newItem = {
            id: Date.now().toString(),
            name,
            category,
            quantity,
            price
        };
        stockList.push(newItem);
    }

    saveToLocalStorage();
    renderStock();
    resetForm();
}


function editProduct(id) {
    const item = stockList.find(prod => prod.id === id);
    if (item) {
        document.getElementById('productId').value = item.id;
        document.getElementById('productName').value = item.name;
        document.getElementById('productCategory').value = item.category;
        document.getElementById('productQuantity').value = item.quantity;
        document.getElementById('productPrice').value = item.price;

        document.getElementById('formTitle').innerText = "Edit Product";
        document.getElementById('submitBtn').innerText = "Update Product";
        cancelBtn.classList.remove('hidden');
    }
}


function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        stockList = stockList.filter(item => item.id !== id);
        saveToLocalStorage();
        renderStock();
    }
}


function resetForm() {
    stockForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').innerText = "Add New Product";
    document.getElementById('submitBtn').innerText = "Add Product";
    cancelBtn.classList.add('hidden');
}


function filterStock() {
    const query = searchInput.value.toLowerCase();
    const filtered = stockList.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
    renderStock(filtered);
}


renderStock();