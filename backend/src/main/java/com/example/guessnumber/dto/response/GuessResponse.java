package com.example.guessnumber.dto.response;

public record GuessResponse(
        int guessedNumber,
        int serverNumber,
        boolean win,
        int currentScore,
        int remainingTurns,
        String message
) {
}
