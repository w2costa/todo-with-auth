package com.example.todo_with_auth.config;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.todo_with_auth.dto.ErroDTO;
import com.example.todo_with_auth.exception.RegraNegocioException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Trata nossa exceção de Regra de Negócio (ex: usuário duplicado)
    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroDTO> handleRegraNegocio(RegraNegocioException ex) {
        ErroDTO erro = new ErroDTO(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    // 2. Trata exceção de "Elemento não encontrado" (ex: buscar Tarefa por ID que
    // não existe)
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErroDTO> handleNoSuchElementException(NoSuchElementException ex) {
        // Logar o erro no servidor para o dev ver (ex.printStackTrace())
        ex.printStackTrace();

        // Retornar mensagem genérica para o usuário (Segurança: não mostre detalhes
        // técnicos)
        ErroDTO erro = new ErroDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Ocorreu um erro interno no servidor. Contate o suporte.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    // 3. Trata erros genéricos inesperados (NullPointer, Banco fora do ar, etc)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroDTO> handleExceptionGenerica(Exception ex) {
        // Logar o erro no servidor para o dev ver (ex.printStackTrace())
        ex.printStackTrace();

        // Retornar mensagem genérica para o usuário (Segurança: não mostre detalhes
        // técnicos)
        ErroDTO erro = new ErroDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Ocorreu um erro interno no servidor. Contate o suporte.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}