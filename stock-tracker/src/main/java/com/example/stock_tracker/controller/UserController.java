package com.example.stock_tracker.controller;

import com.example.stock_tracker.model.User;
import com.example.stock_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// Centralized CORS configuration in your CorsConfig, so you can remove this annotation if needed
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser); // Return 201 CREATED for successful signup
        } catch (IllegalArgumentException e) { // Example of a specific exception
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                createErrorResponse("Invalid user data: " + e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                createErrorResponse("An unexpected error occurred: " + e.getMessage())
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user); // Return 200 OK with user details
        } catch (IllegalArgumentException e) { // Example of a specific exception
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                createErrorResponse("Invalid login data: " + e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                createErrorResponse("Invalid credentials: " + e.getMessage())
            );
        }
    }

    // Helper method to create a structured error response
    // Helper method to create a structured error response
private static ResponseEntity<String> createErrorResponse(String message) {
    return ResponseEntity.badRequest().body(message);
}

}
