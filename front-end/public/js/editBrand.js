const saveBrandButton = document.getElementById('saveBrand');
let brandId;
document.querySelectorAll('.editbrand').forEach(function(button) {
    button.addEventListener('click', function() {
        brandId = this.getAttribute('brand-id');
        document.getElementById('brandName').value = this.getAttribute('brand-name');
    });
});
saveBrandButton.addEventListener('click', function() {
    const brandData = {
        brand: document.getElementById('brandName').value
    };
    axios.put(`/brands/${brandId}`, brandData)
    .then(response => {
        if (response.data.success) {
            window.location.reload();
        } else {
            alert('Error updating brand.');
        }
    })
    .catch(error => {
        alert('An error occurred: ' + error.message);
    });
});