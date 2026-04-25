package com.billmaster.auth.dto;

public class RegisterRequest {

    private String username;
    private String password;
    private String role;
    private String email;
    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
    public String getEmail() {
    return email;
}

public void setEmail(String email) {
    this.email = email;
}
}
