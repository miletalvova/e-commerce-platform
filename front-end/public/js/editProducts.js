const saveProductsButton = document.getElementById('saveProducts');
let productId;

document.querySelectorAll('.edit-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        productId = this.getAttribute('data-id');
        document.getElementById('productName').value = this.getAttribute('data-name');
        document.getElementById('productPrice').value = this.getAttribute('data-price');
        document.getElementById('productDescription').value = this.getAttribute('data-description');
        document.getElementById('productQuantity').value = this.getAttribute('data-quantity');
        const productCategory = this.getAttribute('data-category');
        const productBrand = this.getAttribute('data-brand');
        document.getElementById('productImageUrl').value = this.getAttribute('data-imgurl');
        const brandSelect = document.getElementById('productBrand');
        brandSelect.value = productBrand;
        const categorySelect = document.getElementById('productCategory');
        categorySelect.value = productCategory;
    });
});
    saveProductsButton.addEventListener('click', function() {
        const formData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value,
            quantity: document.getElementById('productQuantity').value,
            imgurl: document.getElementById('productImageUrl').value,
            brand: document.getElementById('productBrands').value,
            category: document.getElementById('productCategories').value
        };
        axios.put(`/products/edit/${productId}`, formData)
        .then(response => {
            if (response.data.success) {
                window.location.reload();
            } else {
                alert('Error updating product.');
            }
        })
        .catch(error => {
            alert('An error occurred: ' + error.message);
        });
    });