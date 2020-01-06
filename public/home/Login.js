import Component from '../Component.js';

class Login extends Component {
    onRender(form) {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const formData = new FormData(event.target);

            const user = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })

            .then(res => res.json())
            .then(user => {
                if(user._id) {
                    window.location.href = '../activity.html';
                } else {
                    alert('Invalid email/password');
                }
            });
        });
    }

    renderHTML() {
        return /*html*/`
        <form class="auth-form standard">
        <p>
        <label for="login-username">Username</label>
        <input id="login-username" type="username" name="username" required placeholder="Your Username">
        </p>

        <p>
        <label for="login-password">Password</label>
        <input id="login-password" type="password" name="password" required>
        </p>

        <p>
        <button>Sign In</button>
        </p>

        </form>
        `;
    }
}