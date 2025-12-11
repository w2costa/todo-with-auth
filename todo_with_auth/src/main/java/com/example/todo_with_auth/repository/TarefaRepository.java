package com.example.todo_with_auth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todo_with_auth.model.Tarefa;
import com.example.todo_with_auth.model.Usuario;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    // O Spring entende: "Busque tarefas onde o campo 'usuario' seja igual ao parâmetro"
    List<Tarefa> findByUsuario(Usuario usuario);

    Optional<Tarefa> findByIdAndUsuario(Long id, Usuario usuario);
}
