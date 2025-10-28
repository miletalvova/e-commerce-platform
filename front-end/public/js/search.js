document.getElementById('search').addEventListener('click', async function() {
  const name = document.getElementById('search-input').value;
  const category = document.getElementById('select-categories').value;
  const brand = document.getElementById('select-brands').value;
  try {
      const response = await axios.post('/products/search', {
          name, brand, category
      });
      const products = response.data.data.result;
      console.log("PRODUCTS", products)
      updateProductTable(products);
  } catch (error) {
      console.error('Error while fetching products:', error);
  }
});

document.getElementById('clear').addEventListener('click', function() {
  window.location.reload();
});

function updateProductTable(products) {
  const tableBody = document.querySelector('#products tbody');
  tableBody.innerHTML = '';

  products.forEach(product => {
      const row = `<tr>
          <td>${product.id }</td>
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.quantity}</td>
          <td>${product.price}</td>
          <td>${product.brand}</td>
          <td>${product.category}</td>
          <td>${product.imgurl}</td>
          <td><img class="resize" src="${product.imgurl}" alt="Product Image"></td>
          <td><div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                        ${product.isDeleted ? 'checked' : ''}>
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </td>
          <td>${product.date_added}</td>
          <td>
          <form action="/products/delete/${product.id}" method="POST" style="display:inline-block">
            <button type="submit" class="btn btn-danger"><i class="bi bi-trash3-fill"></i></button>
          </form>
          <button type="button" class="btn btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editProductModal"
            data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" 
            data-description="${product.description}" data-quantity="${product.quantity}" 
            data-imgurl="${product.imgurl}" data-brand="${product.brand}" data-category="${product.category}">
            <i class="bi bi-pencil"></i>
          </button>
        </td>
      </tr>`;
      tableBody.insertAdjacentHTML('beforeend', row);
  });
}