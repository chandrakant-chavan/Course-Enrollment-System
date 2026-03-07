package com.example.coursebooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.coursebooking.dto.AuthRequest;
import com.example.coursebooking.dto.AuthResponse;
import com.example.coursebooking.exception.DuplicateResourceException;
import com.example.coursebooking.model.User;
import com.example.coursebooking.repository.UserRepository;
import com.example.coursebooking.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider("LOCAL");

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(user.getId(), user.getName(), user.getEmail());

        return new AuthResponse(token, userDTO);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(user.getId(), user.getName(), user.getEmail());

        return new AuthResponse(token, userDTO);
    }
}
