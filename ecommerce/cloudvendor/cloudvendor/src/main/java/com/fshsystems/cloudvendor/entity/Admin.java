package com.fshsystems.cloudvendor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto generated ID for a user
    private Long id;

    @Column(nullable = false) //user type can't be null
    private String role = "user"; // default role is "user"

    @Column(nullable = false, unique = true) //username cant be null and must be unique
    private String username;

    @Column(nullable = false) //password cant be null
    private String password;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; } //get and set the ID from auto generated ID
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; } //get the default role from the variable


}