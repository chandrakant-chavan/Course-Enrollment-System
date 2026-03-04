package com.example.coursebooking.repository;

import com.example.coursebooking.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface studentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByEmail(String email);
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String firstName, String lastName, String email);
}
