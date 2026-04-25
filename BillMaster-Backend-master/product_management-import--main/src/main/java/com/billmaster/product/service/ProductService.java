package com.billmaster.product.service;

import com.billmaster.product.dto.LowStock;
import com.billmaster.product.dto.ProductRequest;
import com.billmaster.product.dto.ProductResponse;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import java.io.PrintWriter;
import java.util.List;

public interface ProductService {

  ProductResponse createProductWithImage(
        String sku,
        String name,
        String category,
        double price,
        int stock,
        MultipartFile image) throws Exception;

    List<ProductResponse> getAllProducts();
    List<LowStock> getLowStocks();
    ProductResponse getProductBySku(String sku);

    void deleteProduct(String id);

    void exportProducts(PrintWriter writer);

    void exportProductsToPDF(HttpServletResponse response) throws Exception;
    void saveImage(String id, String imageUrl);
    ProductResponse updateProduct(String id, ProductRequest request);
    String importProductsFromCSV(MultipartFile file);

}