package com.example.guessnumber.service;

import com.example.guessnumber.dto.response.GuessResponse;
import com.example.guessnumber.dto.response.LeaderboardResponse;
import com.example.guessnumber.dto.response.MeResponse;
import com.example.guessnumber.dto.response.TurnsResponse;
import com.example.guessnumber.entity.User;
import com.example.guessnumber.exception.ApiException;
import com.example.guessnumber.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class GameService {
    private static final int MIN_NUMBER = 1;
    private static final int MAX_NUMBER = 5;
    private static final int BUY_TURNS_AMOUNT = 5;
    private static final double WIN_RATE = 0.5;

    private final UserRepository userRepository;
    private final SecureRandom random = new SecureRandom();

    public GameService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public GuessResponse guess(String username, int guessedNumber) {
        User user = userRepository.findByUsernameForUpdate(username)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getTurns() <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No turns remaining. Please buy more turns.");
        }

        user.useTurn();

        // Keep the effective win probability at exactly about 5%, regardless of the guessed number.
        boolean win = random.nextDouble() < WIN_RATE;
        int serverNumber = win ? guessedNumber : randomNumberExcept(guessedNumber);

        if (win) {
            user.addScore(1);
        }

        return new GuessResponse(
                guessedNumber,
                serverNumber,
                win,
                user.getScore(),
                user.getTurns(),
                win ? "You won! Score +1." : "Not this time. Try again."
        );
    }

    @Transactional
    public TurnsResponse buyTurns(String username) {
        User user = userRepository.findByUsernameForUpdate(username)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        user.addTurns(BUY_TURNS_AMOUNT);
        return new TurnsResponse(user.getTurns(), "Added 5 turns.");
    }

    @Transactional(readOnly = true)
    public MeResponse getMe(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return new MeResponse(user.getUsername(), user.getScore(), user.getTurns());
    }

    @Transactional(readOnly = true)
    public List<LeaderboardResponse> getLeaderboard() {
        List<User> users = userRepository.findAllByOrderByScoreDescUsernameAsc(PageRequest.of(0, 10));
        return IntStream.range(0, users.size())
                .mapToObj(index -> new LeaderboardResponse(
                        index + 1,
                        users.get(index).getUsername(),
                        users.get(index).getScore()))
                .toList();
    }

    private int randomNumberExcept(int excludedNumber) {
        int number = random.nextInt(MAX_NUMBER - MIN_NUMBER) + MIN_NUMBER;
        return number >= excludedNumber ? number + 1 : number;
    }
}
