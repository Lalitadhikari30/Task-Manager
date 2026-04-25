package com.taskmanager.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for JWT (JSON Web Token) operations.
 *
 * A JWT has 3 parts separated by dots: HEADER.PAYLOAD.SIGNATURE
 *
 * HEADER:    Algorithm used (HS256) + token type (JWT)
 * PAYLOAD:   Claims — data stored in the token (email, issued time, expiry)
 * SIGNATURE: HMAC-SHA256(header + payload, secret_key) — prevents tampering
 *
 * The secret key is stored in application.yml and injected via @Value.
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Extract the username (email) from a JWT token.
     * The "subject" claim stores the user's email.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract any specific claim from the token.
     * Uses a Function<Claims, T> to allow extracting any claim type.
     *
     * Example: extractClaim(token, Claims::getExpiration) → gets expiry date
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generate a JWT token for a given user.
     * Stores the email as the "subject" claim.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generate a JWT token with extra claims (e.g., role, permissions).
     *
     * The token contains:
     *   - Extra claims (any custom data you want to embed)
     *   - Subject: the user's email
     *   - Issued At: current timestamp
     *   - Expiration: current time + 24 hours
     *   - Signature: signed with our secret key using HMAC-SHA256
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())  // email
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validate a token:
     * 1. Extract the email from the token
     * 2. Check it matches the given UserDetails
     * 3. Check the token hasn't expired
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Check if the token's expiration date is before the current time.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Parse the token and extract all claims (payload data).
     * This also verifies the signature — if someone tampered with
     * the token, this will throw a SignatureException.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Convert the secret key string into a SecretKey object
     * that can be used for HMAC-SHA256 signing.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
