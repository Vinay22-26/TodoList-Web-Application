package com.example.TodoList.dto;

import com.example.TodoList.model.TodoPriority;
import com.example.TodoList.model.TodoStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TodoUpdateRequest {

    @Size(max = 120, message = "Title must be 120 characters or fewer")
    private String title;

    @Size(max = 1000, message = "Description must be 1000 characters or fewer")
    private String description;

    private LocalDate dueDate;

    private TodoPriority priority;

    private TodoStatus status;
}