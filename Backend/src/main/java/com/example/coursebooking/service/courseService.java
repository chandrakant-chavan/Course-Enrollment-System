package com.example.coursebooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.coursebooking.exception.DuplicateResourceException;
import com.example.coursebooking.exception.ResourceNotFoundException;
import com.example.coursebooking.model.Course;
import com.example.coursebooking.repository.courseRepository;

@Service
public class courseService {
    @Autowired
    private courseRepository courseRepository;

    public Course addcourse(Course Course) {
        if (courseRepository.findBycourseNumber(Course.getcourseNumber()).isPresent()) {
            throw new DuplicateResourceException("Course " + Course.getcourseNumber() + " already exists");
        }
        Course.setAvailableSeats(Course.getTotalSeats());
        return courseRepository.save(Course);
    }

    public List<Course> getAllcourses() {
        return courseRepository.findAll();
    }

    public Course getcourseByNumber(String courseNumber) {
        return courseRepository.findBycourseNumber(courseNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseNumber));
    }

    public Course updateAvailableSeats(String id, int change) {
        if (id == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        Course Course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        Course.setAvailableSeats(Course.getAvailableSeats() + change);
        return courseRepository.save(Course);
    }

    public void deleteCourse(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        Course Course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        // Check if Course has enrollments
        int enrolledStudents = Course.getTotalSeats() - Course.getAvailableSeats();
        if (enrolledStudents > 0) {
            throw new RuntimeException("Cannot delete Course with enrolled students. Please withdraw all students first.");
        }
        
        courseRepository.delete(Course);
    }

    public Course updatecourse(String id, Course updatedCourse) {
        if (id == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        // Check if Course number is being changed and if it already exists
        if (!existing.getcourseNumber().equals(updatedCourse.getcourseNumber())) {
            if (courseRepository.findBycourseNumber(updatedCourse.getcourseNumber()).isPresent()) {
                throw new DuplicateResourceException("Course " + updatedCourse.getcourseNumber() + " already exists");
            }
        }
        
        existing.setcourseNumber(updatedCourse.getcourseNumber());
        existing.setOrigin(updatedCourse.getOrigin());
        existing.setDestination(updatedCourse.getDestination());
        existing.setDepartureTime(updatedCourse.getDepartureTime());
        existing.setPrice(updatedCourse.getPrice());
        
        // Only update total seats if no students enrolled
        int enrolledStudents = existing.getTotalSeats() - existing.getAvailableSeats();
        if (enrolledStudents == 0) {
            existing.setTotalSeats(updatedCourse.getTotalSeats());
            existing.setAvailableSeats(updatedCourse.getTotalSeats());
        }
        
        return courseRepository.save(existing);
    }

    public Course getcourseById(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    public List<Course> searchcourses(String keyword) {
        return courseRepository.findByOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(keyword, keyword);
    }
}
