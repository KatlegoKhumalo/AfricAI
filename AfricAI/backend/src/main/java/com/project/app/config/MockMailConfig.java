package com.project.app.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import jakarta.mail.internet.MimeMessage;
import java.io.InputStream;

@Configuration
@ConditionalOnProperty(name = "app.use-mock-data", havingValue = "true")
public class MockMailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        return new JavaMailSender() {
            @Override
            public MimeMessage createMimeMessage() {
                return null;
            }

            @Override
            public MimeMessage createMimeMessage(InputStream contentStream) {
                return null;
            }

            @Override
            public void send(MimeMessage mimeMessage) {
                // Do nothing
            }

            @Override
            public void send(MimeMessage... mimeMessages) {
                // Do nothing
            }

            @Override
            public void send(MimeMessagePreparator mimeMessagePreparator) {
                // Do nothing
            }

            @Override
            public void send(MimeMessagePreparator... mimeMessagePreparators) {
                // Do nothing
            }

            @Override
            public void send(SimpleMailMessage simpleMessage) {
                // Do nothing
            }

            @Override
            public void send(SimpleMailMessage... simpleMessages) {
                // Do nothing
            }
        };
    }
}
