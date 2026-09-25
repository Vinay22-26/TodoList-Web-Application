package com.example.TodoList.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    private String id;

    private String userId;

    private String title;

    private String description;

    private LocalDate dueDate;

    private TodoPriority priority;

    private TodoStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}