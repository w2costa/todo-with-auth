
function log(msg) {
    $('#console').append('<div>> ' + msg + '</div>');
}



// --- 3. Lógica de Logout ---
function fazerLogout() {
    $.ajax({
        url: '/perform_logout',
        type: 'POST', // Logout seguro deve ser POST para evitar ataques
        success: function () {
            log("Logout realizado. Sessão encerrada.");
            $('#area-logada').hide();
            $('#area-login').show();
        },
        error: function () {
            log("Erro ao tentar sair.");
        }
    });
}



$(function () {

    // --- 1. Configuração de Segurança (CSRF) ---
    function getCookie(name) {
        if (!document.cookie) return null;
        const xsrfCookies = document.cookie.split(';')
            .map(c => c.trim())
            .filter(c => c.startsWith(name + '='));
        if (xsrfCookies.length === 0) return null;
        return decodeURIComponent(xsrfCookies[0].substring(name.length + 1));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                const csrftoken = getCookie('XSRF-TOKEN');
                if (csrftoken) {
                    xhr.setRequestHeader("X-XSRF-TOKEN", csrftoken);
                }
            }
        }
    });

    // --- 2. Lógica de Login ---
    $('#formLogin').submit(function (e) {
        e.preventDefault(); // Impede o recarregamento da página

        // Spring Security espera parâmetros x-www-form-urlencoded por padrão no formLogin
        const dadosLogin = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: '/perform_login',
            type: 'POST',
            data: dadosLogin, // O jQuery serializa automaticamente para form-data
            success: function () {
                log("Login realizado com sucesso!");
                $('#area-login').hide();
                $('#area-logada').show();
                // Limpa campos
                $('#username').val('');
                $('#password').val('');
            },
            error: function () {
                log("Erro: Usuário ou senha inválidos.");
                alert("Login falhou!");
            }
        });
    });


    $('#btn-logout').click(fazerLogout);

});
