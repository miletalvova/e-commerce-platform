const saveProducts = document.getElementById('save');
document.querySelectorAll('.add-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        document.getElementById('name').value = ''; 
        document.getElementById('price').value = '';
        document.getElementById('description').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('date').value = '';
        document.getElementById('category').value = '';
        document.getElementById('brand').value = '';;
        document.getElementById('imageUrl').value = '';
        console.log({brand: document.getElementById('brand').value})
    });
});
saveProducts.addEventListener('click', function() {
    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value,
        date_added: document.getElementById('date').value,
        imgurl: document.getElementById('imageUrl').value,
        brand: document.getElementById('brand').value,
        category: document.getElementById('category').value
    };
    console.log(formData)
    axios.post(`/products/add`, formData)
    .then(response => {
        if (response.data.success) {
            window.location.reload();
        } else {
            alert('Error adding product.');
        }
    })
    .catch(error => {
        alert('An error occurred: ' + error.message);
    });
});