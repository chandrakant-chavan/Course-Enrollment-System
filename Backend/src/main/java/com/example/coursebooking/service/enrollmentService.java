package com.example.coursebooking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.coursebooking.dto.BookingRequest;
import com.example.coursebooking.exception.InsufficientSeatsException;
import com.example.coursebooking.exception.ResourceNotFoundException;
import com.example.coursebooking.model.Course;
import com.example.coursebooking.model.Enrollment;
import com.example.coursebooking.model.Student;
import com.example.coursebooking.repository.enrollmentRepository;

@Service
public class enrollmentService {
    @Autowired
    private enrollmentRepository enrollmentRepository;
    @Autowired
    private courseService courseService;
    @Autowired
    private studentService studentService;

    public Enrollment enrollStudent(BookingRequest request) {
        Student Student = studentService.getstudentById(request.getstudentId());
        Course Course = courseService.getcourseByNumber(request.getcourseNumber());

        // Check for duplicate Enrollment
        List<Enrollment> existingEnrollments = enrollmentRepository.findByStudentIdAndCourseId(
                Student.getId(), Course.getId());
        for (Enrollment e : existingEnrollments) {
            if ("CONFIRMED".equals(e.getStatus())) {
                throw new RuntimeException("Student is already enrolled in this Course");
            }
        }

        if (Course.getAvailableSeats() <= 0) {
            throw new InsufficientSeatsException("No seats available for Course: " + Course.getcourseNumber());
        }

        // Calculate seat number
        int seatNum = Course.getTotalSeats() - Course.getAvailableSeats() + 1;

        // Create Enrollment
        Enrollment Enrollment = new Enrollment();
        Enrollment.setstudentId(Student.getId());
        Enrollment.setcourseId(Course.getId());
        Enrollment.setcourseNumber(Course.getcourseNumber());
        Enrollment.setSeatNumber("S-" + seatNum);
        Enrollment.setEnrollmentTime(LocalDateTime.now());
        Enrollment.setStatus("CONFIRMED");
        Enrollment.setTotalAmount(Course.getPrice());
        Enrollment.setStudentName(request.getPassengerName());

        // Update seats
        courseService.updateAvailableSeats(Course.getId(), -1);

        return enrollmentRepository.save(Enrollment);
    }

    public Enrollment cancelEnrollment(String enrollmentId) {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("Enrollment ID cannot be null");
        }
        Enrollment Enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found: " + enrollmentId));

        if ("CANCELLED".equals(Enrollment.getStatus())) {
            throw new RuntimeException("Enrollment is already cancelled");
        }

        Enrollment.setStatus("CANCELLED");
        // Free seat
        courseService.updateAvailableSeats(Enrollment.getcourseId(), 1);

        return enrollmentRepository.save(Enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getEnrollmentsBystudent(String studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsBycourse(String courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public Enrollment updateEnrollment(String id, Enrollment updatedEnrollment) {
        if (id == null) {
            throw new IllegalArgumentException("Enrollment ID cannot be null");
        }
        if (updatedEnrollment == null) {
            throw new IllegalArgumentException("Updated Enrollment cannot be null");
        }
        Enrollment existing = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found: " + id));
        
        if (existing == null) {
            throw new ResourceNotFoundException("Enrollment not found: " + id);
        }
        
        // Update allowed fields
        if (updatedEnrollment.getStudentName() != null) {
            existing.setStudentName(updatedEnrollment.getStudentName());
        }
        if (updatedEnrollment.getSeatNumber() != null) {
            existing.setSeatNumber(updatedEnrollment.getSeatNumber());
        }
        
        return enrollmentRepository.save(existing);
    }
}
