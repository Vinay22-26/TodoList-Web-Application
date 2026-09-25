package com.example.TodoList.security;

import com.example.TodoList.model.Session;
import com.example.TodoList.model.User;
import com.example.TodoList.repository.SessionRepository;
import com.example.TodoList.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public TokenAuthenticationFilter(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            authenticate(token);
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(String token) {
        Optional<Session> sessionOpt = sessionRepository.findById(token);
        if (sessionOpt.isEmpty()) {
            return;
        }

        Session session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            sessionRepository.deleteById(token);
            return;
        }

        Optional<User> userOpt = userRepository.findById(session.getUserId());
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();
        AuthenticatedUser principal = new AuthenticatedUser(user.getId(), user.getUsername());

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());

        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}