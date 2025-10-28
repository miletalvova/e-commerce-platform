    const saveBrand = document.getElementById('save');
    document.querySelectorAll('.addbrand').forEach(function(button) {
        button.addEventListener('click', function() {
            document.getElementById('brandAdd').value = '';
            console.log({brand: document.getElementById('brandAdd').value})
        });
    });
    saveBrand.addEventListener('click', function() {
        const formData = {
            brand: document.getElementById('brandAdd').value
        };
        axios.post(`/brands`, formData)
        .then(response => {
            if (response.data.success) {
                window.location.reload();
            } else {
                alert('Error creating brand.');
            }
        })
        .catch(error => {
            alert('An error occurred: ' + error.message);
        });
    });