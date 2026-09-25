package com.example.TodoList.service;

import com.example.TodoList.dto.TodoCreateRequest;
import com.example.TodoList.dto.TodoUpdateRequest;
import com.example.TodoList.exception.ResourceNotFoundException;
import com.example.TodoList.model.Todo;
import com.example.TodoList.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    public List<Todo> getAllTodos(String userId) {
        return todoRepository.findAllByUserId(userId);
    }

    public Todo getTodoById(String id, String userId) {
        return todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
    }

    public Todo createTodo(TodoCreateRequest request, String userId) {
        LocalDateTime now = LocalDateTime.now();
        Todo todo = Todo.builder()
                .userId(userId)
                .title(request.getTitle().trim())
                .description(request.getDescription() == null ? "" : request.getDescription().trim())
                .dueDate(request.getDueDate())
                .priority(request.getPriority())
                .status(request.getStatus())
                .createdAt(now)
                .updatedAt(now)
                .build();
        return todoRepository.save(todo);
    }

    public Todo updateTodo(String id, TodoUpdateRequest request, String userId) {
        Todo existing = getTodoById(id, userId);

        if (request.getTitle() != null) {
            existing.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription().trim());
        }
        if (request.getDueDate() != null) {
            existing.setDueDate(request.getDueDate());
        }
        if (request.getPriority() != null) {
            existing.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }
        existing.setUpdatedAt(LocalDateTime.now());

        return todoRepository.save(existing);
    }

    public void deleteTodo(String id, String userId) {
        Todo existing = getTodoById(id, userId);
        todoRepository.delete(existing);
    }
}