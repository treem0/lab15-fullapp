import Component from '../Component.js';

class Signup extends Component {
    onRender(form) {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const formData = new FormData(event.target);

            const user = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            fetch('/api/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(user => {
                if(user._id) {
                    window.location.href = '../activities.html';
                } else {
                    const error = document.createElement('div');
                    error.innerHTML = '<p>Invalid username or password.</p>';
                    form.appendChild(error);
                    if(form.children.length > 2) form.removeChild(form.lastChild);
                }
            });
        });
    }

    renderHTML() {
        return /*html*/`
        <form class="auth-form standard">
        <p>
        <label for="username">Username</label>
        <input id="username" name="username" required placeholder="Your Username">
        </p>

        <p>
        <label for="password">Password</label>
        <input id="password" name="password" required>
        </p>

        <p>
        <button>Sign Up</button>
        </p>

        </form>
        `;
    }
}

export default Signup;