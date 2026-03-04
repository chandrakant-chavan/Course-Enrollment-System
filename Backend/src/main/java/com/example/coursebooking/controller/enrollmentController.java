package com.example.coursebooking.controller;

import com.example.coursebooking.dto.ApiResponse;
import com.example.coursebooking.dto.BookingRequest;
import com.example.coursebooking.model.Enrollment;
import com.example.coursebooking.service.enrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class enrollmentController {
    @Autowired
    private enrollmentService enrollmentService;

    @PostMapping("/enroll")
    public ResponseEntity<ApiResponse<Enrollment>> enroll(@Valid @RequestBody BookingRequest request) {
        Enrollment Enrollment = enrollmentService.enrollStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student enrolled successfully", Enrollment));
    }

    @PostMapping("/cancel/{enrollmentId}")
    public ResponseEntity<ApiResponse<Enrollment>> cancel(@PathVariable String enrollmentId) {
        Enrollment cancelled = enrollmentService.cancelEnrollment(enrollmentId);
        return ResponseEntity.ok(ApiResponse.success("Enrollment cancelled successfully", cancelled));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getAll() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(ApiResponse.success("Fetched all enrollments", enrollments));
    }

    @GetMapping("/Student/{studentId}")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getBystudent(@PathVariable String studentId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsBystudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Fetched Student enrollments", enrollments));
    }

    @GetMapping("/stats/{courseId}")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getStats(@PathVariable String courseId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsBycourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Fetched Course Enrollment details", enrollments));
    }

    @GetMapping("/Course/{courseId}")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getByCourse(@PathVariable String courseId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsBycourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Fetched Course enrollments", enrollments));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Enrollment>> update(@PathVariable String id, @Valid @RequestBody Enrollment Enrollment) {
        Enrollment updated = enrollmentService.updateEnrollment(id, Enrollment);
        return ResponseEntity.ok(ApiResponse.success("Enrollment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Enrollment>> withdraw(@PathVariable String id) {
        Enrollment cancelled = enrollmentService.cancelEnrollment(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment withdrawn successfully", cancelled));
    }
}
