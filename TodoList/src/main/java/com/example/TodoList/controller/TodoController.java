package com.example.TodoList.controller;

import com.example.TodoList.dto.TodoCreateRequest;
import com.example.TodoList.dto.TodoResponse;
import com.example.TodoList.dto.TodoUpdateRequest;
import com.example.TodoList.model.Todo;
import com.example.TodoList.security.AuthenticatedUser;
import com.example.TodoList.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        List<TodoResponse> todos = todoService.getAllTodos(currentUser.id()).stream()
                .map(TodoResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        Todo todo = todoService.getTodoById(id, currentUser.id());
        return ResponseEntity.ok(TodoResponse.fromEntity(todo));
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoCreateRequest request, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        Todo created = todoService.createTodo(request, currentUser.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(TodoResponse.fromEntity(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(@PathVariable String id, @Valid @RequestBody TodoUpdateRequest request, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        Todo updated = todoService.updateTodo(id, request, currentUser.id());
        return ResponseEntity.ok(TodoResponse.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        todoService.deleteTodo(id, currentUser.id());
        return ResponseEntity.noContent().build();
    }
}