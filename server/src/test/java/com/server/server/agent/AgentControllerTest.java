package com.server.server.agent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class AgentControllerTest {
    private HttpServer server;
    private AgentController agent;
    private final AtomicInteger modelCalls = new AtomicInteger();
    private final AtomicInteger checkinCalls = new AtomicInteger();

    @BeforeEach
    void start() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/model", exchange -> {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            int call = modelCalls.incrementAndGet();
            String response;
            if (body.contains("我要打卡")) {
                response = "{\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":null,\"tool_calls\":[{\"id\":\"call1\",\"type\":\"function\",\"function\":{\"name\":\"request_checkin\",\"arguments\":\"{\\\"content\\\":\\\"跑步\\\",\\\"duration\\\":30}\"}}]}}]}";
            } else if (body.contains("未知工具") && call == 1) {
                response = "{\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":null,\"tool_calls\":[{\"id\":\"call1\",\"type\":\"function\",\"function\":{\"name\":\"delete_account\",\"arguments\":\"{}\"}}]}}]}";
            } else if (call == 1) {
                response = "{\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":null,\"tool_calls\":[{\"id\":\"call1\",\"type\":\"function\",\"function\":{\"name\":\"checkin_status\",\"arguments\":\"{}\"}}]}}]}";
            } else {
                assertTrue(body.contains("checkedToday") || body.contains("未知工具"));
                response = "{\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":\"你今天已经打卡。\"}}]}";
            }
            respond(exchange, response);
        });
        server.createContext("/api/checkin/status", exchange -> {
            assertEquals("Bearer user-token", exchange.getRequestHeaders().getFirst("Authorization"));
            respond(exchange, "{\"code\":200,\"data\":{\"checkedToday\":true,\"totalDays\":7}}");
        });
        server.createContext("/api/checkin/do", exchange -> {
            checkinCalls.incrementAndGet();
            assertEquals("Bearer user-token", exchange.getRequestHeaders().getFirst("Authorization"));
            assertTrue(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8).contains("跑步"));
            respond(exchange, "{\"code\":200,\"data\":{}}");
        });
        server.start();
        agent = new AgentController(new ObjectMapper());
        ReflectionTestUtils.setField(agent, "providerUrl", "http://127.0.0.1:" + server.getAddress().getPort() + "/model");
        ReflectionTestUtils.setField(agent, "providerKey", "test-key");
        ReflectionTestUtils.setField(agent, "model", "test-model");
        ReflectionTestUtils.setField(agent, "serverPort", server.getAddress().getPort());
        ReflectionTestUtils.setField(agent, "signingSecret", "keepAppSecretKey2024VeryLongSecretKeyForJWTSigning");
    }

    @AfterEach
    void stop() {
        server.stop(0);
    }

    @Test
    void readsProjectDataThroughAuthenticatedApi() {
        var result = agent.chat(new AgentController.ChatRequest("今天打卡了吗", null, null), request(), auth(12L));
        assertEquals(200, result.getCode());
        assertEquals("你今天已经打卡。", result.getData().reply());
        assertEquals(2, modelCalls.get());
        assertEquals(0, checkinCalls.get());
    }

    @Test
    void requiresUserBoundConfirmationBeforeCheckin() {
        var preview = agent.chat(new AgentController.ChatRequest("我要打卡", null, null), request(), auth(12L));
        assertEquals(200, preview.getCode());
        assertEquals("跑步", preview.getData().pendingAction().content());
        assertEquals(0, checkinCalls.get());
        String token = preview.getData().confirmationToken();
        var wrongUser = agent.chat(new AgentController.ChatRequest(null, null, token), request(), auth(13L));
        assertEquals(400, wrongUser.getCode());
        assertEquals(0, checkinCalls.get());
        var confirmed = agent.chat(new AgentController.ChatRequest(null, null, token), request(), auth(12L));
        assertEquals(200, confirmed.getCode());
        assertEquals(1, checkinCalls.get());
        assertEquals(1, modelCalls.get());
    }

    @Test
    void rejectsUnlistedModelToolWithoutCallingProjectApi() {
        var result = agent.chat(new AgentController.ChatRequest("未知工具", null, null), request(), auth(12L));
        assertEquals(200, result.getCode());
        assertEquals(0, checkinCalls.get());
        assertEquals(2, modelCalls.get());
    }

    @Test
    void rejectsNullRequest() {
        assertEquals(400, agent.chat(null, request(), auth(12L)).getCode());
    }

    private MockHttpServletRequest request() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer user-token");
        return request;
    }

    private UsernamePasswordAuthenticationToken auth(Long id) {
        return new UsernamePasswordAuthenticationToken(id, null);
    }

    private void respond(com.sun.net.httpserver.HttpExchange exchange, String body) throws java.io.IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, bytes.length);
        try (var output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }
}
