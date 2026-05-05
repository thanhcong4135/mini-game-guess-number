package com.example.guessnumber.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record GuessRequest(
        @NotNull(message = "Number is required")
        @Min(value = 1, message = "Number must be from 1 to 5")
        @Max(value = 5, message = "Number must be from 1 to 5")
        Integer number
) {
}
