package com.fshsystems.cloudvendor.controller;


import com.fshsystems.cloudvendor.entity.Admin;
import com.fshsystems.cloudvendor.repo.AdminRepository;
import com.fshsystems.cloudvendor.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register") //register the user by getting the data from the model/entity class
    public ResponseEntity<?> register(@RequestBody Admin admin) {

//        create a method that gets the data from a model by accepting the Model constructor data
        if (adminRepository.findByUsername(admin.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Admin already exists"));
        }

        // Ensure role is "user" if not provided
        if (admin.getRole() == null || admin.getRole().isEmpty()) {
            admin.setRole("user")   ;
        }
//        save the registered user
        Admin savedAdmin = adminRepository.save(admin);

//        return a response after the user register
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Admin registered successfully",
                        "adminId", savedAdmin.getId()
                )
        );
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {

        return adminRepository.findByUsername(admin.getUsername())
                .filter(a -> a.getPassword().equals(admin.getPassword()))
                .map(a -> {

                    String token = jwtUtil.generateToken(a.getUsername(), a.getRole());

                    return ResponseEntity.ok(
                            Map.of(
                                    "success", true,
                                    "message", "Login successful",
                                    "token", token,
                                    "username", a.getUsername(),
                                    "role", a.getRole()
                            )
                    );
                })
                .orElse(ResponseEntity.status(401).body(
                        Map.of("success", false, "message", "Invalid username or password")
                ));
    }}