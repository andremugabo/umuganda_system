package com.webtech.umuganda.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webtech.umuganda.core.user.dto.LoginRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void unauthenticatedRequest_shouldReturn403() throws Exception {
        // Attempting to access an endpoint that requires authentication without a token
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void adminLogin_shouldReturnJwtToken() throws Exception {
        // The DataSeeder provisions an Admin with these credentials
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("mugaboandre@gmail.com");
        loginRequest.setPassword("123456");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    public void nonAdminShouldBeDeniedAdminAccess() throws Exception {
        // 1. Authenticate as a non-admin (VILLAGE_CHEF seeded in DataSeeder)
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("jdamascene@umuganda.rw");
        loginRequest.setPassword("123456");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseString = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseString).get("token").asText();

        // 2. Attempt to access an ADMIN-only endpoint (like /api/audit-logs)
        mockMvc.perform(get("/api/audit-logs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                // Note: The GlobalExceptionHandler formats this message
                .andExpect(jsonPath("$.message").value("You do not have permission to access this resource."));
    }
}
