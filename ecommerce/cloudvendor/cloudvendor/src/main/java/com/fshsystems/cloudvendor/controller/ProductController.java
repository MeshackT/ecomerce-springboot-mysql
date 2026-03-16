//package com.fshsystems.cloudvendor.controller;
//
//import com.fshsystems.cloudvendor.entity.Product;
//import com.fshsystems.cloudvendor.repo.ProductRepository;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.nio.file.*;
//import java.io.IOException;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/products")
//public class ProductController {
//
//    @Autowired
//    private ProductRepository productRepository;
//
//    @GetMapping
//    public List<Product> getAllProducts() {
//        return productRepository.findAll();
//    }
//
////    add a product
//    @PostMapping
//    public Product addProduct(@RequestBody Product product) {
//        return productRepository.save(product);
//    }
//
//    // NEW IMAGE UPLOAD ENDPOINT
//    @PostMapping("/upload")
//    public Product uploadProduct(
//            @RequestParam String name,
//            @RequestParam String description,
//            @RequestParam Double price,
//            @RequestParam Integer quantity,
//            @RequestParam("image") MultipartFile file
//    ) throws IOException {
//
//        String uploadDir = "uploads/products/";
//
//        Path uploadPath = Paths.get(uploadDir);
//
//        if (!Files.exists(uploadPath)) {
//            Files.createDirectories(uploadPath);
//        }
//
//        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//
//        Path filePath = uploadPath.resolve(fileName);
//
//        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//        Product product = new Product();
//        product.setName(name);
//        product.setDescription(description);
//        product.setPrice(price);
//        product.setQuantity(quantity);
//
//        product.setImageUrl("/uploads/products/" + fileName);
//
//        return productRepository.save(product);
//    }
//
////    update the product / add
//    @PutMapping("/{id}")
//    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
//        product.setId(id);
//        return productRepository.save(product);
//    }
//
////    Delete a product
//    @DeleteMapping("/{id}")
//    public void deleteProduct(@PathVariable Long id) {
//        productRepository.deleteById(id);
//    }
//}

package com.fshsystems.cloudvendor.controller;

import com.fshsystems.cloudvendor.entity.Product;
import com.fshsystems.cloudvendor.repo.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // ==========================
    // Fetch all products
    // ==========================
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ==========================
    // Add product (JSON only)
    // ==========================
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        if (product.getIsActive() == null) product.setIsActive(true);
        if (product.getOnSale() == null) product.setOnSale(false);
        return productRepository.save(product);
    }

    // ==========================
    // Upload product with image
    // ==========================
    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("image") MultipartFile file) throws IOException {

        String uploadDir = "uploads/products/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/products/" + fileName;
    }

    @PostMapping("/upload")
    public Product uploadProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer quantity,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "discountPrice", required = false) Double discountPrice,
            @RequestParam(value = "onSale", required = false) Boolean onSale,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam("image") MultipartFile file
    ) throws IOException {

        // Save the file
        String uploadDir = "uploads/products/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create new product
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setSku(sku);
        product.setCategory(category);
        product.setBrand(brand);
        product.setDiscountPrice(discountPrice);
        product.setOnSale(onSale != null ? onSale : false);
        product.setTags(tags);
        product.setImageUrl("/uploads/products/" + fileName);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setIsActive(true);

        return productRepository.save(product);
    }

    // ==========================
    // Update product
    // ==========================
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    // ==========================
    // Delete product
    // ==========================
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    // ProductController.java

    // ==========================
// Fetch products by gender or category
// ==========================
    @GetMapping("/filter")
    public List<Product> getProductsByFilter(
            @RequestParam(value = "category", required = false) String category
    ) {
       if (category != null) {
            return productRepository.findByCategoryIgnoreCase(category);
        } else {
            return productRepository.findAll(); // fallback: return all products
        }
    }
}