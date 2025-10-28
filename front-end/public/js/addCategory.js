const saveCategory = document.getElementById('saveAddCategory');
document.querySelectorAll('#addcategory').forEach(function(button) {
    button.addEventListener('click', function() {
        document.getElementById('addName').value = '';
    });
});
saveCategory.addEventListener('click', function() {
    const formData = {
        category: document.getElementById('addName').value
    };
    axios.post(`/categories`, formData)
    .then(response => {
        if (response.data.success) {
            window.location.reload();
        } else {
            alert('Error creating category.');
        }
    })
    .catch(error => {
        alert('An error occurred: ' + error.message);
    });
});