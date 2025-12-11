// --- 2. Lógica de Logout ---
function fazerLogout() {
    $('#tarefa-list').empty();
    $.ajax({
        url: '/perform_logout',
        type: 'POST', // Logout seguro deve ser POST para evitar ataques
        success: function () {
            console.log("Logout realizado. Sessão encerrada.");
            $('#area-logada').hide();
            $('#area-login').show();
        },
        error: function () {
            console.log("Erro ao tentar sair.");
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


    // --- 3. Lógica de Tarefas ---
    var server = "http://localhost:8080";

    var $lastClicked;

    function updateTarefa(text, id) {
        var tarefaData = { texto: text };
        $.ajax({
            url: server + "/tarefas/" + id,
            method: "PUT",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(tarefaData),
            dataType: "json",
            success: function (response) {
                // Tarefa atualizada com sucesso
                console.log('Tarefa atualizada com sucesso:', response);
            },
            error: function (xhr, status, error) {
                // Handle errors during the deletion process
                console.error('Erro atualizando tarefa:', error);
                console.error('Status:', status);
                console.error('Response Text:', xhr.responseText);
            }

        });

    }

    function newTarefa(text, $div) {
        var tarefaData = { texto: text };
        $.ajax({
            url: server + "/tarefas",
            method: "POST",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(tarefaData),
            dataType: "json",
            success: function (data) {
                $div.text(data.id);
                console.log('Tarefa criada com sucesso:', data);
            },
            error: function (xhr, status, error) {
                // Handle errors during the deletion process
                console.error('Erro criando nova tarefa:', error);
                console.error('Status:', status);
                console.error('Response Text:', xhr.responseText);
            }
        });
    }

    function onTarefaDeleteClick() {
        $(this).parent('.tarefa-item')
            .off("click")
            .hide("slow", function () {
                $this = $(this);
                $.ajax({
                    url: server + "/tarefas/" + $this.children(".tarefa-id").text(),
                    method: "DELETE",
                    success: function (response) {
                        // Tarefa deletada com sucesso
                        console.log('Tarefa deletada com successo:', response);
                    },
                    error: function (xhr, status, error) {
                        // Handle errors during the deletion process
                        console.error('Erro deletando tarefa:', error);
                        console.error('Status:', status);
                        console.error('Response Text:', xhr.responseText);
                    }
                });

                $(this).remove();
            });
    }

    function addTarefa(text, id) {
        id = id || 0;

        var $tarefa = $("<div />")
            .addClass("tarefa-item")
            .append($("<div />")
                .addClass("tarefa-id")
                .text(id))
            .append($("<div />")
                .addClass("tarefa-text")
                .text(text))
            .append($("<div />")
                .addClass("tarefa-delete"))
            .append($("<div />")
                .addClass("clear"));

        $("#tarefa-list").append($tarefa);

        $(".tarefa-delete").click(onTarefaDeleteClick);

        $(".tarefa-item").click(onTarefaItemClick);

        if (id === 0) {
            var div = $($tarefa.children(".tarefa-id"));
            console.log("id", div);
            newTarefa(text, $(div));
        }
    }

    function onTarefaKeydown(event) {
        if (event.which === 13) {
            addTarefa($("#tarefa").val());
            $("#tarefa").val("");
        }
    }

    function onTarefaEditKeydown(event) {
        if (event.which === 13) {
            savePendingEdition($lastClicked);
            $lastClicked = undefined;
        }
    }

    function onTarefaItemClick() {
        if (!$(this).is($lastClicked)) {
            if ($lastClicked !== undefined) {
                savePendingEdition($lastClicked);
            }

            $lastClicked = $(this);

            var text = $lastClicked.children('.tarefa-text').text();
            var id = $lastClicked.children('.tarefa-id').text();

            var content = "<div class='tarefa-id'>" + id + "</div>" +
                "<input type='text' class='tarefa-edit' value='" +
                text + "'>";

            $lastClicked.html(content);

            $(".tarefa-edit").keydown(onTarefaEditKeydown);
        }
    }

    function savePendingEdition($tarefa) {
        var text = $tarefa.children('.tarefa-edit').val();
        var id = $tarefa.children('.tarefa-id').text();
        $tarefa.empty();
        $tarefa.append("<div class='tarefa-id'>" + id + "</div>")
            .append("<div class='tarefa-text'>" + text + "</div>")
            .append("<div class='tarefa-delete'></div>")
            .append("<div class='clear'></div>");

        updateTarefa(text, id);

        $(".tarefa-delete").click(onTarefaDeleteClick);

        $tarefa.click(onTarefaItemClick);
    }

    $(".tarefa-delete").click(onTarefaDeleteClick);

    $(".tarefa-item").click(onTarefaItemClick);

    $("#tarefa").keydown(onTarefaKeydown);

    function loadTarefas() {
        $("#tarefa").empty();

        $.getJSON(server + "/tarefas")
            .done(function (data) {
                for (var tarefa = 0; tarefa < data.length; tarefa++) {
                    addTarefa(data[tarefa].texto, data[tarefa].id);
                }
            });
    }


    loadTarefas();

    $('#btn-logout').click(fazerLogout);
});
