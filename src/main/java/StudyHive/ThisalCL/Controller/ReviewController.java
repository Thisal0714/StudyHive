package StudyHive.ThisalCL.Controller;


import StudyHive.ThisalCL.Entity.Reviews;
import StudyHive.ThisalCL.Repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*") 
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Reviews> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    public Reviews addReview(@RequestBody Reviews review) {
        review.setDate(java.time.LocalDate.now().toString());
        review.setHelpful(0);
        return reviewRepository.save(review);
    }

    @PutMapping("/{id}/helpful")
    public Reviews incrementHelpful(@PathVariable String id) {
        Reviews review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setHelpful(review.getHelpful() + 1);
        return reviewRepository.save(review);
    }
}
