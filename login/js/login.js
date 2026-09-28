document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const EMAIL_CORRETO = "admin@sautec.com";
    const SENHA_CORRETA = "123456";
    
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const emailDigitado = emailInput ? emailInput.value.trim() : '';
            const senhaDigitada = passwordInput ? passwordInput.value : '';

            const users = JSON.parse(localStorage.getItem('sautec_users')) || [];
            const usuarioCadastrado = users.find(u => u.email === emailDigitado && u.senha === senhaDigitada);

            if ((emailDigitado === EMAIL_CORRETO && senhaDigitada === SENHA_CORRETA) || usuarioCadastrado) {
                
                const usuarioLogado = usuarioCadastrado || { nome: "Administrador", email: EMAIL_CORRETO };
                localStorage.setItem('sautec_logged_user', JSON.stringify(usuarioLogado));

                window.location.href = '../sistema/index.html';

            } else {
                alert('E-mail ou senha incorretos! Por favor, verifique seus dados.');
            }
        });
    }
});