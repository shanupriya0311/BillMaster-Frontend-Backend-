package com.billmaster.product.controller;

import com.billmaster.product.dto.LowStock;
import com.billmaster.product.dto.ProductRequest;
import com.billmaster.product.dto.ProductResponse;
import com.billmaster.product.service.ProductService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
  @PostMapping(consumes = "multipart/form-data")
public ResponseEntity<ProductResponse> createProductWithImage(
        @RequestParam String sku,
        @RequestParam String name,
        @RequestParam String category,
        @RequestParam double price,
        @RequestParam int stock,
        @RequestParam("image") MultipartFile image) throws Exception {

    return ResponseEntity.ok(
            productService.createProductWithImage(sku, name, category, price, stock, image)
    );
}
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductResponse> getBySku(@PathVariable String sku) {
        return ResponseEntity.ok(productService.getProductBySku(sku));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/lowstock")
    public ResponseEntity<List<LowStock>> lowstock(){
        return ResponseEntity.ok(productService.getLowStocks());
    }
    @GetMapping("/export/pdf")
    public void exportProductsToPDF(HttpServletResponse response) throws Exception {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=products.pdf");

        productService.exportProductsToPDF(response);
    }
    @PostMapping("/import/csv")
    public ResponseEntity<String> importCSV(@RequestParam("file") MultipartFile file) {

        String message = productService.importProductsFromCSV(file);

        return ResponseEntity.ok(message);
    }
    @PutMapping("/{id}")
public ResponseEntity<ProductResponse> updateProduct(
        @PathVariable String id,
        @RequestBody ProductRequest request) {

    return ResponseEntity.ok(
            productService.updateProduct(id, request)
    );
}
@PostMapping("/{id}/upload")
public ResponseEntity<String> uploadImage(
        @PathVariable String id,
        @RequestParam("file") MultipartFile file) throws Exception {

    String uploadDir = "uploads/";
    java.io.File dir = new java.io.File(uploadDir);
    if (!dir.exists()) dir.mkdirs();

    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + fileName);
    java.nio.file.Files.write(path, file.getBytes());

    productService.saveImage(id, "/uploads/" + fileName);

    return ResponseEntity.ok("Image uploaded");
}

}