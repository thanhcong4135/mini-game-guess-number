package com.example.guessnumber.controller;

import com.example.guessnumber.dto.request.GuessRequest;
import com.example.guessnumber.dto.response.GuessResponse;
import com.example.guessnumber.dto.response.LeaderboardResponse;
import com.example.guessnumber.dto.response.MeResponse;
import com.example.guessnumber.dto.response.TurnsResponse;
import com.example.guessnumber.service.GameService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/guess")
    public GuessResponse guess(@Valid @RequestBody GuessRequest request, Authentication authentication) {
        return gameService.guess(authentication.getName(), request.number());
    }

    @PostMapping("/buy-turns")
    public TurnsResponse buyTurns(Authentication authentication) {
        return gameService.buyTurns(authentication.getName());
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardResponse> leaderboard() {
        return gameService.getLeaderboard();
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        return gameService.getMe(authentication.getName());
    }
}
