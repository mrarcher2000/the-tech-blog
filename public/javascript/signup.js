async function signupFormHandler(event) {

    event.preventDefault();

    const username = document.querySelector('#signup-username');
    const email = document.querySelector('#signup-email');
    const password = document.querySelector('#signup-password');

    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username, 
                email,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
            console.log('User creation successful!');
            document.location.replace('/home');
        } else {
            alert(response.statusText);
        }
    }
}


document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);