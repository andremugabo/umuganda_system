package com.webtech.umuganda.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

        @Bean
        public OpenAPI umugandaOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("Umuganda Management API")
                                                .description("REST API for managing Umuganda activities, attendance, and notifications in Rwanda.")
                                                .version("v1.0")
                                                .contact(new Contact()
                                                                .name("Mugabo Andre")
                                                                .email("mugaboandre@gmail.com")
                                                                .url("https://andremugabo.rw"))
                                                .license(new License()
                                                                .name("Apache 2.0")
                                                                .url("https://springdoc.org")))
                                .externalDocs(new ExternalDocumentation()
                                                .description("Project Repository")
                                                .url("https://github.com/andremugabo/umuganda_system"))
                                .servers(List.of(
                                                new Server().url("http://localhost:9090").description("Local Server"),
                                                new Server().url("https://umuganda-backend-k32m.onrender.com")
                                                                .description("Render Server"),
                                                new Server().url("https://umuganda-backend-k32m.onrender.com/api")
                                                                .description("Production Server")));
        }
}
