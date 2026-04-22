package com.webtech.umuganda.security;

import com.webtech.umuganda.core.audit.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Field;
import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLoggingAspect {

    private final AuditLogService auditLogService;

    // Define pointcuts for create, update, delete operations across all services in core package
    @Pointcut("execution(* com.webtech.umuganda.core..*Service.create*(..)) || execution(* com.webtech.umuganda.core..*Service.register*(..))")
    public void createOperation() {}

    @Pointcut("execution(* com.webtech.umuganda.core..*Service.update*(..))")
    public void updateOperation() {}

    @Pointcut("execution(* com.webtech.umuganda.core..*Service.delete*(..))")
    public void deleteOperation() {}

    @AfterReturning(pointcut = "createOperation()", returning = "result")
    public void logCreateActivity(JoinPoint joinPoint, Object result) {
        logActivity("CREATE", joinPoint, result);
    }

    @AfterReturning(pointcut = "updateOperation()", returning = "result")
    public void logUpdateActivity(JoinPoint joinPoint, Object result) {
        logActivity("UPDATE", joinPoint, result);
    }

    @AfterReturning(pointcut = "deleteOperation()")
    public void logDeleteActivity(JoinPoint joinPoint) {
        // For delete, we might not have a returned object, so we log from input args
        logActivity("DELETE", joinPoint, null);
    }

    private void logActivity(String action, JoinPoint joinPoint, Object result) {
        try {
            String performedBy = getAuthenticatedUser();
            String ipAddress = getClientIp();
            
            String entityName = extractEntityName(joinPoint);
            String entityId = extractEntityId(result, joinPoint);
            String details = String.format("Method executed: %s", joinPoint.getSignature().getName());

            auditLogService.log(action, entityName, entityId, performedBy, details, ipAddress);
        } catch (Exception e) {
            log.error("Failed to log audit activity: {}", e.getMessage());
        }
    }

    private String getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
            return authentication.getName();
        }
        return "SYSTEM";
    }

    private String getClientIp() {
        if (RequestContextHolder.getRequestAttributes() == null) {
            return "system-internal";
        }
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private String extractEntityName(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        // Fallback: Remove 'ServiceImpl' or 'Service'
        return className.replace("ServiceImpl", "").replace("Service", "").toUpperCase();
    }

    private String extractEntityId(Object result, JoinPoint joinPoint) {
        if (result != null) {
            try {
                // Try to get 'id' field from returned DTO or Entity
                Field idField = result.getClass().getDeclaredField("id");
                idField.setAccessible(true);
                Object idValue = idField.get(result);
                if (idValue != null) {
                    return idValue.toString();
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                // Ignored, fallback to args
            }
        }
        
        // Fallback to checking method arguments (usually UUID id is passed in update/delete)
        for (Object arg : joinPoint.getArgs()) {
            if (arg instanceof UUID) {
                return arg.toString();
            }
        }
        
        return "N/A";
    }
}
