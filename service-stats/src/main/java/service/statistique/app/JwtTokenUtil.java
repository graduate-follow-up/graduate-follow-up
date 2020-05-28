package service.statistique.app;

import io.jsonwebtoken.*;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;

import javax.crypto.spec.SecretKeySpec;

/*
Source
https://github.com/oktadeveloper/okta-java-jwt-example/blob/432856c45877169527d3885ee70fc13f18bd774b/src/main/java/com/okta/createverifytokens/JWTDemo.java
 */

public class JwtTokenUtil {

    private final static String keyString = System.getenv("JWT_ACCESS_TOKEN_SECRET");
    private final static Key SECRET_KEY = new SecretKeySpec(keyString.getBytes(),0,keyString.getBytes().length, SignatureAlgorithm.HS256.getJcaName());

    //Sample method to construct a JWT
    public static String createServiceJWT() {

        //The JWT signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", "stats");
        claims.put("username", "stats");
        claims.put("role", "service");

        //Let's set the JWT Claims
        JwtBuilder builder = Jwts.builder()
                .setIssuedAt(now)
                .setSubject("stats")
                .setClaims(claims)
                .signWith(SECRET_KEY);

        //Builds the JWT and serializes it to a compact, URL-safe string
        return builder.compact();
    }

    private static Claims decodeJWT(String jwt) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwt).getBody();
        return claims;
    }

    public static boolean isValidToken(String jwt) {
        try {
            Claims claims = decodeJWT(jwt);
            String role = (String) claims.get("role");
            return "administrateur".equals(role) || "respo-option".equals(role) || "prof".equals(role);
        } catch (Exception e) {
            return false;
        }
    }
}