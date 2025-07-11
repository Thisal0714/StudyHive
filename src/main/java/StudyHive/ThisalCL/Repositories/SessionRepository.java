package StudyHive.ThisalCL.Repositories;

import StudyHive.ThisalCL.Entity.Session;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SessionRepository extends MongoRepository<Session, String> {
    List<Session> findAllByEmail(String email);
    long countByEmail(String email);
}