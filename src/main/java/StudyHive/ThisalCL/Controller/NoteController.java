package StudyHive.ThisalCL.Controller;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class NoteController {

    @Autowired
    private GridFsTemplate notesGridFsTemplate;

    @Value("${huggingface.api.key}")
    private String huggingFaceAPIKey;

    @PostMapping("/notes/file-upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String email) {
        try {
            DBObject metaData = new BasicDBObject();
            metaData.put("type", file.getContentType());
            metaData.put("email", email);

            ObjectId fileId = notesGridFsTemplate.store(
                    file.getInputStream(),
                    file.getOriginalFilename(),
                    file.getContentType(),
                    metaData
            );

            return ResponseEntity.ok("File stored with ID: " + fileId.toHexString());

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/notes/get-note/{fileName}")
    public ResponseEntity<?> getNote(@PathVariable String fileName) throws IOException {
        GridFSFile file = notesGridFsTemplate.findOne(
                new org.springframework.data.mongodb.core.query.Query(
                        org.springframework.data.mongodb.core.query.Criteria.where("filename").is(fileName)
                )
        );

        if (file == null) {
            return ResponseEntity.status(404).body("File not found: " + fileName);
        }

        GridFsResource resource = notesGridFsTemplate.getResource(file);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resource.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(new InputStreamResource(resource.getInputStream()));
    }

    @GetMapping("/notes/get-note-by-email/{email}")
    public ResponseEntity<?> getFileNamesByEmail(@PathVariable String email) {
        List<GridFSFile> files = notesGridFsTemplate.find(
                new org.springframework.data.mongodb.core.query.Query(
                        org.springframework.data.mongodb.core.query.Criteria.where("metadata.email").is(email)
                )
        ).into(new ArrayList<>());

        if (files.isEmpty()) {
            return ResponseEntity.status(404).body("No files found for email: " + email);
        }

        // Create a simple list of filenames
        List<Map<String, String>> result = files.stream().map(file -> {
            Map<String, String> info = new HashMap<>();
            info.put("filename", file.getFilename());
            info.put("contentType", file.getMetadata().get("type").toString());
            return info;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/notes/summarise/{fileName}")
    public ResponseEntity<?> summariseNote(@PathVariable String fileName) {
        try {
            GridFSFile file = notesGridFsTemplate.findOne(
                    new org.springframework.data.mongodb.core.query.Query(
                            org.springframework.data.mongodb.core.query.Criteria.where("filename").is(fileName)
                    )
            );

            if (file == null) {
                return ResponseEntity.status(404).body("File not found: " + fileName);
            }

            GridFsResource resource = notesGridFsTemplate.getResource(file);
            String extractedText;

            try (PDDocument document = PDDocument.load(resource.getInputStream())) {
                PDFTextStripper stripper = new PDFTextStripper();
                extractedText = stripper.getText(document);
            }

            if (extractedText == null || extractedText.trim().isEmpty()) {
                return ResponseEntity.status(400).body("No extractable text in PDF.");
            }

            String summary = callHuggingFaceT5(extractedText);
            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private String callHuggingFaceT5(String content) {
        WebClient client = WebClient.builder()
                .baseUrl("https://api-inference.huggingface.co/models/facebook/bart-large-cnn")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + huggingFaceAPIKey)
                .build();

        String trimmedContent = content.length() > 2000 ? content.substring(0, 2000) : content;

        Map<String, Object> requestBody = Map.of(
                "inputs", trimmedContent,
                "parameters", Map.of(
                        "max_length", 300,
                        "min_length", 100,
                        "do_sample", false
                )
        );

        try {
            List<Map<String, Object>> response = client.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            System.out.println("Pegasus response: " + response);

            if (response != null && !response.isEmpty()) {
                return (String) response.get(0).get("summary_text");
            } else {
                return "No summary generated.";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Hugging Face Pegasus call failed: " + e.getMessage();
        }
    }

    @GetMapping("/notes/answer-question/{fileName}")
    public ResponseEntity<?> answerQuestion(
            @PathVariable String fileName,
            @RequestParam("question") String question) {
        try {
            // Find the file by filename
            GridFSFile file = notesGridFsTemplate.findOne(
                    new org.springframework.data.mongodb.core.query.Query(
                            org.springframework.data.mongodb.core.query.Criteria.where("filename").is(fileName)
                    )
            );

            if (file == null) {
                return ResponseEntity.status(404).body("File not found: " + fileName);
            }

            GridFsResource resource = notesGridFsTemplate.getResource(file);

            // Extract text from PDF
            String extractedText;
            try (PDDocument document = PDDocument.load(resource.getInputStream())) {
                PDFTextStripper stripper = new PDFTextStripper();
                extractedText = stripper.getText(document);
            }

            if (extractedText == null || extractedText.trim().isEmpty()) {
                return ResponseEntity.status(400).body("No extractable text in PDF.");
            }

            // Call HF QA model with question + context
            String answer = callHuggingFaceQA(question, extractedText);
            return ResponseEntity.ok(Map.of("question", question, "answer", answer));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private String cleanAnswer(String answer) {
        if (answer == null) return "";
        // Remove tabs, newlines, multiple spaces, and trim
        return answer.replaceAll("\\s+", " ").trim();
    }


    private String callHuggingFaceQA(String question, String context) {
        WebClient client = WebClient.builder()
                .baseUrl("https://api-inference.huggingface.co/models/deepset/roberta-base-squad2")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + huggingFaceAPIKey)
                .build();

        // Trim context if too long (API limit considerations)
        String trimmedContext = context.length() > 1500 ? context.substring(0, 1500) : context;

        Map<String, Object> requestBody = Map.of(
                "inputs", Map.of(
                        "question", question,
                        "context", trimmedContext
                )
        );

        try {
            Map<String, Object> response = client.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("answer")) {
                String rawAnswer = response.get("answer").toString();
                return cleanAnswer(rawAnswer);
            } else {
                return "No answer found.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Hugging Face QA call failed: " + e.getMessage();
        }
    }

}
