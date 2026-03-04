package com.example.coursebooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.coursebooking.exception.DuplicateResourceException;
import com.example.coursebooking.exception.ResourceNotFoundException;
import com.example.coursebooking.model.Student;
import com.example.coursebooking.repository.studentRepository;

@Service
public class studentService {
    @Autowired
    private studentRepository studentRepository;

    public Student registerstudent(Student Student) {
        if (Student == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }
        if (studentRepository.findByEmail(Student.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Student with email " + Student.getEmail() + " already exists");
        }
        return studentRepository.save(Student);
    }

    public List<Student> getAllstudents() {
        return studentRepository.findAll();
    }

    public Student getstudentById(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student updatestudent(String id, Student updatedStudent) {
        if (id == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (updatedStudent == null) {
            throw new IllegalArgumentException("Updated Student cannot be null");
        }
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!existing.getEmail().equals(updatedStudent.getEmail())) {
            if (studentRepository.findByEmail(updatedStudent.getEmail()).isPresent()) {
                throw new DuplicateResourceException("Student with email " + updatedStudent.getEmail() + " already exists");
            }
        }
        
        existing.setName(updatedStudent.getName());
        existing.setEmail(updatedStudent.getEmail());
        existing.setPhone(updatedStudent.getPhone());
        return studentRepository.save(existing);
    }

    public void deletestudent(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        Student foundStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        if (foundStudent != null) {
            studentRepository.delete(foundStudent);
        }
    }

    public List<Student> searchstudents(String keyword) {
        return studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, keyword);
    }
}
