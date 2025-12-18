package com.example.todo_with_auth.dto;

public class TarefaRequestDTO {
    private String texto;

    // Getters e Setters (Obrigatórios para o Jackson ler o JSON)
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
}