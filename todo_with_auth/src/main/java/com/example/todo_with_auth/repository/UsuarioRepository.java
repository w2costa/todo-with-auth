package com.example.todo_with_auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todo_with_auth.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método mágico para buscar pelo nome
    Optional<Usuario> findByUsername(String username);
}
