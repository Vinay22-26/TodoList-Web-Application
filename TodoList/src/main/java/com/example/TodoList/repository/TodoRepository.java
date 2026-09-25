package com.example.TodoList.repository;

import com.example.TodoList.model.Todo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends MongoRepository<Todo, String> {

    List<Todo> findAllByUserId(String userId);

    Optional<Todo> findByIdAndUserId(String id, String userId);
}