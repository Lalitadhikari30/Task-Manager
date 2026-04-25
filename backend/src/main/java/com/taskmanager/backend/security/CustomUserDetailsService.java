package com.taskmanager.backend.security;

import com.taskmanager.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom implementation of Spring Security's UserDetailsService.
 *
 * Spring Security needs to load user details during authentication.
 * By default, it doesn't know about our User entity or our database.
 * This class bridges the gap:
 *
 *   Spring Security → "I need user details for email X"
 *   CustomUserDetailsService → queries UserRepository → returns User (which implements UserDetails)
 *   Spring Security → uses it for password comparison and authority checks
 *
 * @RequiredArgsConstructor (Lombok) generates a constructor for all 'final' fields,
 * which is how Spring injects the UserRepository dependency.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Load user by their "username" — in our app, the username IS the email.
     * Called internally by Spring Security during authentication.
     *
     * @param username the email address
     * @return UserDetails (our User entity implements this interface)
     * @throws UsernameNotFoundException if no user exists with that email
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + username
                ));
    }
}
