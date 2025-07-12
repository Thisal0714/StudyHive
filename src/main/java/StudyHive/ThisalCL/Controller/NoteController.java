package StudyHive.ThisalCL.Controller;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import reactor.core.publisher.Mono;
import org.springframework.data.mongodb.core.query.Query;
import java.io.IOException;
import java.util.*;

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
    public ResponseEntity<?> summariseNote(@PathVariable String fileName,
                                           @RequestParam(defaultValue = "medium") String length) {
        try {
            // 1. Load file & extract text
            GridFSFile file = notesGridFsTemplate.findOne(new Query(Criteria.where("filename").is(fileName)));
            if (file == null) return ResponseEntity.status(404).body("File not found");

            GridFsResource resource = notesGridFsTemplate.getResource(file);
            String rawText;
            try (PDDocument doc = PDDocument.load(resource.getInputStream())) {
                PDFTextStripper stripper = new PDFTextStripper();
                rawText = stripper.getText(doc);
            }
            if (rawText == null || rawText.trim().isEmpty())
                return ResponseEntity.badRequest().body("No extractable text");

            // 2. Clean & preprocess
            String cleaned = preprocessText(rawText);

            // 3. Smart chunking + filtering
            List<String> chunks = splitIntoChunks(cleaned, 1000);
            List<String> filtered = filterHighSignalChunks(chunks);

            // 4. Summarize each chunk & combine
            StringBuilder summaryBuilder = new StringBuilder();
            for (String chunk : filtered) {
                summaryBuilder.append(callSummarizer(chunk, length)).append("\n\n");
            }
            String combinedSummary = summaryBuilder.toString().trim();

            // 5. Optional: re-summarize combined if too long
            if (combinedSummary.length() > 3000) {
                combinedSummary = callSummarizer(combinedSummary, length);
            }

            return ResponseEntity.ok(combinedSummary);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private String preprocessText(String rawText) {
        return rawText
                .replaceAll("(?i)(\\b\\w+\\b(?:\\s+\\1\\b){2,})", "")          // repeated words 3+ times
                .replaceAll("(up and down\\.?\\s*){2,}", "")                   // repetitive "up and down"
                .replaceAll("(?i)(and\\s+on\\s*){3,}", "")                     // repetitive "and on and on"
                .replaceAll("\\.{3,}", ".")                                    // collapse ellipses
                .replaceAll("\\s{2,}", " ")                                    // collapse multiple spaces/newlines
                .trim();
    }

    private List<String> splitIntoChunks(String text, int maxChunkSize) {
        List<String> chunks = new ArrayList<>();
        String[] paragraphs = text.split("\\n\\s*\\n");
        StringBuilder currentChunk = new StringBuilder();
        for (String para : paragraphs) {
            if (currentChunk.length() + para.length() < maxChunkSize) {
                currentChunk.append(para).append("\n\n");
            } else {
                chunks.add(currentChunk.toString());
                currentChunk = new StringBuilder(para).append("\n\n");
            }
        }
        if (currentChunk.length() > 0) {
            chunks.add(currentChunk.toString());
        }
        return chunks;
    }

    private List<String> filterHighSignalChunks(List<String> chunks) {
        return chunks.stream()
                .filter(chunk -> {
                    int wordCount = chunk.split("\\s+").length;
                    return wordCount > 30 &&
                            !chunk.toLowerCase().contains("and up and down") &&
                            !chunk.matches(".*\\b(it\\.?\\s*stays\\.?){2,}.*");
                })
                .toList();
    }

    private String callSummarizer(String text, String length) {
        int maxLen = switch (length.toLowerCase()) {
            case "short" -> 200;
            case "long" -> 1000;
            default -> 500;
        };

        // Hugging Face API has input limits. Trim input string to be safe.
        if (text.length() > 1500) {
            text = text.substring(0, 1500);
        }

        System.out.println("📘 Summarizing with input length: " + text.length());

        WebClient client = WebClient.builder()
                .baseUrl("https://api-inference.huggingface.co/models/facebook/bart-large-cnn")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + huggingFaceAPIKey)
                .build();

        Map<String, Object> body = Map.of(
                "inputs", text,
                "parameters", Map.of(
                        "max_length", maxLen,
                        "min_length", maxLen / 3,
                        "do_sample", false
                )
        );

        try {
            List<Map<String, Object>> res = client.post()
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, clientResponse ->
                            clientResponse.bodyToMono(String.class).flatMap(error -> {
                                System.err.println("❌ Hugging Face error: " + error);
                                return Mono.error(new RuntimeException("API error: " + error));
                            })
                    )
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();

            if (res != null && !res.isEmpty()) {
                return (String) res.get(0).get("summary_text");
            }

            return "No summary generated.";
        } catch (Exception ex) {
            ex.printStackTrace();
            return "Summarizer call failed: " + ex.getMessage();
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