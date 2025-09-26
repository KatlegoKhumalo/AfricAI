package com.project.app.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class LiveKitService {

    @Value("${LIVEKIT_API_KEY:}")
    private String apiKey;

    @Value("${LIVEKIT_API_SECRET:}")
    private String apiSecret;

    @Value("${LIVEKIT_WS_URL:}")
    private String livekitUrl;

    public Map<String, String> generateAccessToken(String room, String participant) {
        validateConfig();

        Algorithm algorithm = Algorithm.HMAC256(apiSecret);
        Instant now = Instant.now();

        // Build LiveKit-compatible JWT:
        // - iss: API key
        // - sub: participant identity
        // - aud: "livekit" (required by LiveKit Cloud)
        // - exp/iat standard timestamps
        // - video claim contains room grants
        String token = JWT.create()
                .withIssuer(apiKey)
                .withSubject(participant)
                .withAudience("livekit")
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plusSeconds(60 * 60))) // 1 hour
                .withClaim("video", Map.of(
                        "room", room,
                        "roomJoin", true,
                        "canPublish", true,
                        "canSubscribe", true,
                        "canPublishData", true
                ))
                .sign(algorithm);

        Map<String, String> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("url", livekitUrl);
        return resp;
    }

    private void validateConfig() {
        if (isNullOrEmpty(apiKey) || isNullOrEmpty(apiSecret) || isNullOrEmpty(livekitUrl)) {
            throw new IllegalStateException("LiveKit configuration is missing. Please set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_WS_URL");
        }
    }

    private boolean isNullOrEmpty(String v) {
        return v == null || v.isBlank();
    }
}
