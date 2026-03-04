package com.example.coursebooking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.coursebooking.model.Course;

public interface courseRepository extends MongoRepository<Course, String> {
    Optional<Course> findByCourseCode(String courseCode);
    Optional<Course> findBycourseNumber(String courseNumber);
    List<Course> findByOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(String origin, String destination);
    List<Course> findByCourseNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String courseName, String description);
}
