package StudyHive.ThisalCL.Config;

import com.mongodb.client.MongoDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;

@Configuration
public class GridFsConfig {

    @Autowired
    private MongoDatabaseFactory mongoDbFactory;

    @Autowired
    private MongoConverter mongoConverter;

    @Bean
    public GridFsTemplate notesGridFsTemplate() throws Exception {
        return new GridFsTemplate(mongoDbFactory, mongoConverter, "notes");
    }
}
