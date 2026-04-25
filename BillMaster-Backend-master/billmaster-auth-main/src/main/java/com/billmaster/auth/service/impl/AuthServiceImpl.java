package com.billmaster.auth.service.impl;

import com.billmaster.auth.dto.AuthResponse;
import com.billmaster.auth.dto.LoginRequest;
import com.billmaster.auth.dto.RegisterRequest;
import com.billmaster.auth.entity.Role;
import com.billmaster.auth.entity.User;
import com.billmaster.auth.exception.CustomException;
import com.billmaster.auth.repository.RoleRepository;
import com.billmaster.auth.repository.UserRepository;
import com.billmaster.auth.security.JwtUtil;
import com.billmaster.auth.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

   @Override
public String register(RegisterRequest request) {

    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
        throw new CustomException("Username already exists");
    }

    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new CustomException("Email already exists");
    }

    Role role = roleRepository.findByName(request.getRole())
            .orElseThrow(() -> new CustomException("Role not found"));

    Set<Role> roles = new HashSet<>();
    roles.add(role);

    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());   
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRoles(roles);

    userRepository.save(user);

    return "User registered successfully";
}
@Override
public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new CustomException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new CustomException("Invalid credentials");
    }
    System.out.println("EMAIL = " + request.getEmail());
System.out.println("PASSWORD = " + request.getPassword());


    String token = jwtUtil.generateToken(user.getEmail());   // ⭐ CHANGE IS HERE

    return new AuthResponse(
            token,
            user.getUsername(),
            user.getRoles().iterator().next().getName()
    );
}


}