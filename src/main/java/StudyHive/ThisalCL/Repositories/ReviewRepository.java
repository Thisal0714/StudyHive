package StudyHive.ThisalCL.Repositories;


import StudyHive.ThisalCL.Entity.Reviews;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Reviews, String> {
}
