// Toggle between login and signup forms
document.getElementById('showSignup').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
});

document.getElementById('showLogin').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
});

// Handle Login form submission
document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault();
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;
    
    alert(`Login attempt for ${loginEmail}`);
    // Add actual login processing logic here (e.g., send data to backend)
    const respone = await fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: loginEmail,
            password: loginPassword
        })
    })

    const data = await respone.json();

    if (!data.status === "200") {
        alert(data.message);
    }

    const token = data.token;
    localStorage.setItem('token', token);

    alert(`Login successful for ${loginEmail}`);

    window.location.href = 'localhost:3000/dashboard.html';
});

// Handle Signup form submission
document.getElementById('signup').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    alert(`Signup attempt for Name: ${name}, Email: ${email}`);
    // Add actual signup logic here (e.g., send data to backend)
    const respone = fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })  
    })
    const data = await respone.json();

    if (!data.status === "201") {
        alert(data.message);
    }

    alert(`Signup successful for Name: ${name}, Email: ${email}`);  

    window.location.href = 'localhost:3000/login.html';
});
