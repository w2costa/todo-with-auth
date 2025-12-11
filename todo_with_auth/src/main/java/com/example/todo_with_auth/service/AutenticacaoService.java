package com.example.todo_with_auth.service;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.todo_with_auth.dto.UsuarioLogado;
import com.example.todo_with_auth.model.Usuario;
import com.example.todo_with_auth.repository.UsuarioRepository;

@Service
public class AutenticacaoService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public AutenticacaoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Busca no banco
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        // 2. Converte nossa entidade 'Usuario' para o 'UserDetails' do Spring Security
        return new UsuarioLogado(
                usuario.getUsername(),
                usuario.getPassword(),
                AuthorityUtils.createAuthorityList("ROLE_" + usuario.getRole()), // Utilitário do Spring para criar
                                                                                 // lista de roles
                usuario.getId() // <--- Passamos o ID do banco para a sessão em memória
        );
    }

}
