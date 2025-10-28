const saveUserButton = document.getElementById('saveUser');
let userId;

document.querySelectorAll('.myClass').forEach(function(button) {
    button.addEventListener('click', function() {
        userId = this.getAttribute('data-userid');
        document.getElementById('username').value = this.getAttribute('data-username');
        document.getElementById('firstname').value = this.getAttribute('data-firstname');
        document.getElementById('lastname').value = this.getAttribute('data-lastname');
        document.getElementById('email').value = this.getAttribute('data-email');
        document.getElementById('address').value = this.getAttribute('data-address');
        document.getElementById('telephone').value = this.getAttribute('data-telephone');
        document.getElementById('userRole').value = this.getAttribute('data-role');
        document.getElementById('membership').value = this.getAttribute('data-membership');
    });
});
saveUserButton.addEventListener('click', function() {
    const userData = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('telephone').value,
        role: document.getElementById('userRole').value,
        membership: document.getElementById('membership').value        
    };
    axios.put(`/users/${userId}`, userData)
    .then(response => {
        if (response.data.success) {
            window.location.reload();
        } else {
            alert('Error updating user.');
        }
    })
    .catch(error => {
        alert('An error occurred: ' + error.message);
    });
});