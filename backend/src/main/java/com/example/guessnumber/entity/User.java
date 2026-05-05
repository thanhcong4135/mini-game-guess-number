package com.example.guessnumber.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_users_username", columnList = "username", unique = true),
                @Index(name = "idx_users_score_username", columnList = "score DESC, username ASC")
        }
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            unique = true,
            length = 100,
            columnDefinition = "varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin"
    )
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private int score = 0;

    @Column(nullable = false)
    private int turns = 0;

    protected User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public int getScore() {
        return score;
    }

    public int getTurns() {
        return turns;
    }

    public void addScore(int amount) {
        this.score += amount;
    }

    public void addTurns(int amount) {
        this.turns += amount;
    }

    public void useTurn() {
        this.turns -= 1;
    }
}
