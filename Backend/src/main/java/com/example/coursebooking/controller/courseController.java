package com.example.coursebooking.controller;

import com.example.coursebooking.dto.ApiResponse;
import com.example.coursebooking.model.Course;
import com.example.coursebooking.service.courseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class courseController {
    @Autowired
    private courseService courseService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Course>> add(@Valid @RequestBody Course Course) {
        Course saved = courseService.addcourse(Course);
        return ResponseEntity.ok(ApiResponse.success("Course added successfully", saved));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Course>>> getAll() {
        List<Course> courses = courseService.getAllcourses();
        return ResponseEntity.ok(ApiResponse.success("Fetched all courses", courses));
    }

    @GetMapping("/{courseNumber}")
    public ResponseEntity<ApiResponse<Course>> getByNumber(@PathVariable String courseNumber) {
        Course Course = courseService.getcourseByNumber(courseNumber);
        return ResponseEntity.ok(ApiResponse.success("Fetched Course successfully", Course));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ApiResponse<Course>> getById(@PathVariable String id) {
        Course Course = courseService.getcourseById(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched Course successfully", Course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> update(@PathVariable String id, @Valid @RequestBody Course Course) {
        Course updated = courseService.updatecourse(id, Course);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Course>>> search(@RequestParam String keyword) {
        List<Course> courses = courseService.searchcourses(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search results", courses));
    }
}