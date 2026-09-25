package com.example.TodoList.service;

import com.example.TodoList.dto.AuthResponse;
import com.example.TodoList.dto.LoginRequest;
import com.example.TodoList.dto.RegisterRequest;
import com.example.TodoList.dto.UserResponse;
import com.example.TodoList.exception.DuplicateUsernameException;
import com.example.TodoList.exception.InvalidCredentialsException;
import com.example.TodoList.model.Session;
import com.example.TodoList.model.User;
import com.example.TodoList.repository.SessionRepository;
import com.example.TodoList.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final long SESSION_DURATION_HOURS = 24 * 7;

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new DuplicateUsernameException("This username is already taken.");
        }

        User user = User.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        Session session = createSession(saved.getId());

        return AuthResponse.builder()
                .token(session.getToken())
                .user(UserResponse.fromEntity(saved))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String username = request.getUsername().trim();

        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username or password.");
        }

        Session session = createSession(user.getId());

        return AuthResponse.builder()
                .token(session.getToken())
                .user(UserResponse.fromEntity(user))
                .build();
    }

    public void logout(String token) {
        sessionRepository.deleteById(token);
    }

    private Session createSession(String userId) {
        LocalDateTime now = LocalDateTime.now();
        Session session = Session.builder()
                .token(UUID.randomUUID().toString())
                .userId(userId)
                .createdAt(now)
                .expiresAt(now.plusHours(SESSION_DURATION_HOURS))
                .build();
        return sessionRepository.save(session);
    }
}