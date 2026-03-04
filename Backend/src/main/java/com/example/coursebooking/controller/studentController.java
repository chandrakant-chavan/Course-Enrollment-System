package com.example.coursebooking.controller;

import com.example.coursebooking.dto.ApiResponse;
import com.example.coursebooking.model.Student;
import com.example.coursebooking.service.studentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class studentController {
    @Autowired
    private studentService studentService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Student>> register(@Valid @RequestBody Student Student) {
        Student saved = studentService.registerstudent(Student);
        return ResponseEntity.ok(ApiResponse.success("Student registered successfully", saved));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Student>>> getAll() {
        List<Student> students = studentService.getAllstudents();
        return ResponseEntity.ok(ApiResponse.success("Fetched all students", students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getById(@PathVariable String id) {
        Student Student = studentService.getstudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched Student successfully", Student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> update(@PathVariable String id, @Valid @RequestBody Student Student) {
        Student updated = studentService.updatestudent(id, Student);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        studentService.deletestudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Student>>> search(@RequestParam String keyword) {
        List<Student> students = studentService.searchstudents(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search results", students));
    }
}