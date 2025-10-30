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
                                .name("WebTech Rwanda")
                                .email("support@webtech.rw")
                                .url("https://webtech.rw"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Repository")
                        .url("https://github.com/your-repo/umuganda-system"))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Server"),
                        new Server().url("https://api.umuganda.rw").description("Production Server")
                ));
    }
}
