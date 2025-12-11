function onUsuarioDeleteClick() {
    $(this).parent('.usuario-item')
        .off("click")
        .hide("slow", function () {
            $this = $(this);

            // $.ajax({
            //     url: server + "/tarefas/" + $this.children(".tarefa-id").text(),
            //     method: "DELETE",
            //     dataType: "json",
            //     success: function (response) {
            //         // Tarefa deletada com sucesso
            //         console.log('Item deleted successfully:', response);
            //     }
            // });

            $(this).remove();
        });
}

function addUsuario(nome, id) {
    id = id || 0;

    var $usuario = $("<div />")
        .addClass("usuario-item")
        .append($("<div />")
            .addClass("usuario-id")
            .text(id))
        .append($("<div />")
            .addClass("usuario-text")
            .text(nome))
        .append($("<div />")
            .addClass("usuario-delete"))
        .append($("<div />")
            .addClass("clear"));

    $("#usuario-list").append($usuario);

    $(".usuario-delete").click(onUsuarioDeleteClick);

    // $(".usuario-item").click(onusuarioItemClick);

    if (id === 0) {
        var div = $($usuario.children(".usuario-id"));
        console.log("id", div);
        newusuario(text, $(div));
    }
}

function loadUsuarios() {
    $.ajax({
        url: '/api/usuarios',
        type: 'GET',
        success: function (data) {
            let lista = $('#usuario-list');
            lista.empty();
            data.forEach(function (usuario) {
                addUsuario(usuario.username, usuario.id);
                console.log(usuario.username);
            });
        },
        error: function (xhr) {
            if (xhr.responseJSON && xhr.responseJSON.mensagem) {
                // Mostra: "O login 'teste' já está em uso."
                alert("Erro: " + xhr.responseJSON.mensagem);
            } else {
                alert("Erro desconhecido: " + xhr.status);
            }
        }
    });
}

function criarUsuario(login, senha) {
    const novoUsuario = {
        username: login,
        password: senha
    };

    $.ajax({
        url: '/api/usuarios',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(novoUsuario),
        success: function (data) {
            alert("Usuário criado com ID: " + data.id);
        },
        error: function (xhr) {
            // O Spring agora devolve um JSON no formato ErroDTO
            // xhr.responseJSON é o objeto que o navegador montou do JSON recebido

            if (xhr.responseJSON && xhr.responseJSON.mensagem) {
                alert("Erro: " + xhr.responseJSON.mensagem);
            } else {
                alert("Erro desconhecido: " + xhr.status);
            }
        }
    });
}
$(function () {



  $(".usuario-delete").click(onUsuarioDeleteClick);


  loadUsuarios();
});
