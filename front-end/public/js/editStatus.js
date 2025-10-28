const saveStatus = document.getElementById('saveStatus');
let orderId;
document.querySelectorAll('.editStatus').forEach(function(button) {
    button.addEventListener('click', function() {
        orderId = this.getAttribute('order-id');
        document.getElementById('orderstatus').value = this.getAttribute('order-status');
    });
});
saveStatus.addEventListener('click', function() {
    const statuses = {
        OrderStatus: document.getElementById('orderstatus').value
    };
    axios.put(`/orders/${orderId}`, statuses)
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