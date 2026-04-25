package com.taskmanager.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter — the GATEKEEPER of our application.
 *
 * This filter runs ONCE for every incoming HTTP request (OncePerRequestFilter).
 * It checks for a JWT token in the "Authorization" header and, if valid,
 * sets the authenticated user in Spring's SecurityContext.
 *
 * Flow:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  1. Extract "Authorization: Bearer <token>" header              │
 * │  2. If no token → skip this filter, let Spring Security handle  │
 * │  3. Extract email from token                                    │
 * │  4. Load user from database                                     │
 * │  5. Validate token (signature + expiry)                         │
 * │  6. If valid → set user in SecurityContext                      │
 * │  7. Continue to the next filter / controller                    │
 * └──────────────────────────────────────────────────────────────────┘
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Step 1: Get the Authorization header
        final String authHeader = request.getHeader("Authorization");

        // Step 2: Check if header exists and starts with "Bearer "
        // If not, this request doesn't have a JWT — skip and let Spring Security decide
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3: Extract the token (everything after "Bearer ")
        final String jwt = authHeader.substring(7);
        final String userEmail = jwtUtil.extractUsername(jwt);

        // Step 4: If we got an email AND the user isn't already authenticated
        // (SecurityContextHolder.getContext().getAuthentication() == null means no one is logged in yet)
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Step 5: Load user from database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Step 6: Validate the token
            if (jwtUtil.isTokenValid(jwt, userDetails)) {

                // Step 7: Create an authentication token and set it in the SecurityContext
                // This tells Spring Security: "This user is authenticated, let them through"
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null, // No credentials needed (already validated via JWT)
                                userDetails.getAuthorities()
                        );

                // Attach request details (IP address, session ID, etc.)
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // SET the authenticated user in the SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue to the next filter in the chain (eventually reaches the controller)
        filterChain.doFilter(request, response);
    }
}
