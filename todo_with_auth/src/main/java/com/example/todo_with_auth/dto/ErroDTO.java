package com.example.todo_with_auth.dto;

import java.time.LocalDateTime;

public class ErroDTO {
    private int status;
    private String mensagem;
    private LocalDateTime dataHora;

    public ErroDTO(int status, String mensagem) {
        this.status = status;
        this.mensagem = mensagem;
        this.dataHora = LocalDateTime.now();
    }

    // Getters
    public int getStatus() { return status; }
    public String getMensagem() { return mensagem; }
    public LocalDateTime getDataHora() { return dataHora; }
}