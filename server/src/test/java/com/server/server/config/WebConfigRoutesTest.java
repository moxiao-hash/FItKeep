package com.server.server.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WebConfigRoutesTest {
    @Autowired
    private MockMvc mvc;

    @Test
    void userAndAdminDirectoryEntriesResolve() throws Exception {
        mvc.perform(get("/user"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/user/"));
        mvc.perform(get("/user/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/user/index.html"));
        mvc.perform(get("/admin"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/"));
        mvc.perform(get("/admin/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/admin/index.html"));
    }
}
