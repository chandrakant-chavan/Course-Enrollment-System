package com.example.coursebooking.repository;

import com.example.coursebooking.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface enrollmentRepository extends MongoRepository<Enrollment, String> {
    List<Enrollment> findByStudentId(String studentId);
    List<Enrollment> findByCourseId(String courseId);
    List<Enrollment> findByStudentIdAndCourseId(String studentId, String courseId);
}
