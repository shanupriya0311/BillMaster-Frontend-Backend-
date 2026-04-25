package com.billmaster.auth.service;

import com.billmaster.auth.dto.AuthResponse;
import com.billmaster.auth.dto.LoginRequest;
import com.billmaster.auth.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
