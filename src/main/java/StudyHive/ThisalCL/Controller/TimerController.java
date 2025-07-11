package StudyHive.ThisalCL.Controller;

import StudyHive.ThisalCL.Entity.Session;
import StudyHive.ThisalCL.Repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/session")
public class TimerController {

    @Autowired
    private SessionRepository sessionRepository;

    // Accept full session data from frontend
    @PostMapping("/submit")
    public String submitSession(@RequestBody Session session) {
        if (session.getEmail() == null || session.getEmail().isEmpty()) {
            return "Email is required";
        }

        sessionRepository.save(session);
        return "Session saved for " + session.getEmail();
    }

    // Count sessions by email
    @GetMapping("/count")
    public long getSessionCount(@RequestParam String email) {
        return sessionRepository.countByEmail(email);
    }

    // Get all sessions by email
    @GetMapping("/all")
    public List<Session> getAllSessions(@RequestParam String email) {
        return sessionRepository.findAllByEmail(email);
    }
}
