package com.example.guessnumber.service;

import com.example.guessnumber.dto.request.AuthRequest;
import com.example.guessnumber.dto.response.AuthResponse;
import com.example.guessnumber.dto.response.MeResponse;
import com.example.guessnumber.entity.User;
import com.example.guessnumber.exception.ApiException;
import com.example.guessnumber.repository.UserRepository;
import com.example.guessnumber.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public MeResponse register(AuthRequest request) {
        String username = request.username().trim();
        if (userRepository.existsByUsername(username)) {
            throw new ApiException(HttpStatus.CONFLICT, "Username already exists");
        }

        User user = new User(username, passwordEncoder.encode(request.password()));
        User saved = userRepository.save(user);
        return new MeResponse(saved.getUsername(), saved.getScore(), saved.getTurns());
    }

    public AuthResponse login(AuthRequest request) {
        String username = request.username().trim();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, request.password()));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return new AuthResponse(jwtService.generateToken(user.getUsername()), "Bearer");
    }
}
