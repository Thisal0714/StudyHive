package StudyHive.ThisalCL.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "sessions")
public class Session {

    @Id
    private String sessionId;
    private String email;
    private LocalDateTime completedAt;

    private int duration; // ✅ Add this field

    public Session() {
        this.sessionId = UUID.randomUUID().toString();
        this.completedAt = LocalDateTime.now();
    }

    public Session(String email, int duration, LocalDateTime completedAt) {
        this.sessionId = UUID.randomUUID().toString();
        this.email = email;
        this.duration = duration;
        this.completedAt = completedAt != null ? completedAt : LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}
