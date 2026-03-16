package com.fshsystems.cloudvendor.controller;

import com.fshsystems.cloudvendor.entity.Favorite;
import com.fshsystems.cloudvendor.repo.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestBody Favorite favorite){

        boolean exists = favoriteRepository.existsByUserIdAndProductId(
                favorite.getUserId(),
                favorite.getProductId()
        );

        if(exists){
            return ResponseEntity.ok("Already in favorites");
        }

        favoriteRepository.save(favorite);
        return ResponseEntity.ok("Added to favorites");
    }

    @GetMapping("/user/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId){
        return favoriteRepository.findByUserId(userId);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFavorite(@RequestParam Long userId,
                                            @RequestParam Long productId){

        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
        return ResponseEntity.ok("Removed from favorites");
    }
}