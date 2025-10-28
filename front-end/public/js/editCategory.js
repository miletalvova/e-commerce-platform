const saveCategoryButton = document.getElementById('saveCategory');
let categoryId;

document.querySelectorAll('#editcategory').forEach(function(button) {
    button.addEventListener('click', function() {
        categoryId = this.getAttribute('category-id');
        document.getElementById('categoryName').value = this.getAttribute('category-name');
    });
});
saveCategoryButton.addEventListener('click', function() {
    const categoryData = {
        category: document.getElementById('categoryName').value
    };
    axios.put(`/categories/${categoryId}`, categoryData)
    .then(response => {
        if (response.data.success) {
            window.location.reload();
        } else {
            alert('Error updating category.');
        }
    })
    .catch(error => {
        alert('An error occurred: ' + error.message);
    });
});