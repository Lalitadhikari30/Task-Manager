package com.taskmanager.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Master Security Configuration — controls WHO can access WHAT.
 *
 * Key concepts:
 *
 * 1. STATELESS sessions: We don't use server-side sessions (no cookies).
 *    Every request must carry its own JWT token. This is the REST API standard.
 *
 * 2. CSRF disabled: CSRF protection is for browser-based apps with cookies.
 *    Since we use JWT (not cookies), CSRF is unnecessary.
 *
 * 3. Filter chain: Our JwtAuthenticationFilter runs BEFORE Spring's default
 *    UsernamePasswordAuthenticationFilter, so JWT auth takes priority.
 *
 * 4. BCrypt: Industry-standard password hashing. Even if the database is
 *    compromised, passwords can't be reversed.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    /**
     * The SecurityFilterChain defines the security rules for the application.
     * Think of it as a series of checkpoints every request must pass through.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (not needed for stateless JWT auth)
                .csrf(csrf -> csrf.disable())

                // Enable CORS (allows frontend on different domain to call our API)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Define URL-level access rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints — no authentication needed
                        .requestMatchers("/api/auth/**").permitAll()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // STATELESS session — don't create HTTP sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Use our custom authentication provider (BCrypt + UserDetailsService)
                .authenticationProvider(authenticationProvider())

                // Add our JWT filter BEFORE the default username/password filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS (Cross-Origin Resource Sharing) configuration.
     * Allows the frontend (running on a different port/domain) to call our API.
     *
     * Without this, browsers block requests from http://localhost:3000 (frontend)
     * to http://localhost:8080 (backend) due to the same-origin policy.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * DaoAuthenticationProvider combines:
     * 1. Our CustomUserDetailsService (loads user from DB)
     * 2. BCryptPasswordEncoder (compares hashed passwords)
     *
     * When a user logs in, Spring Security:
     *   - Loads user via userDetailsService.loadUserByUsername(email)
     *   - Compares the provided password with the stored BCrypt hash
     *   - If match → authentication succeeds
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * AuthenticationManager — the entry point for authentication.
     * Our AuthService will use this to authenticate login requests.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * BCrypt password encoder.
     * - Hashing: "password123" → "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
     * - Each hash is unique (includes a random salt)
     * - One-way: you can't reverse the hash back to the original password
     * - Comparison: BCrypt can verify a plain password against a hash
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
