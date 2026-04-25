package com.billmaster.product.service.ServiceImpl;

import com.billmaster.product.dto.LowStock;
import com.billmaster.product.dto.ProductRequest;
import com.billmaster.product.dto.ProductResponse;
import com.billmaster.product.model.Product;
import com.billmaster.product.repository.ProductRepository;
import com.billmaster.product.service.ProductService;
import com.billmaster.product.model.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.io.InputStream;
import jakarta.servlet.http.HttpServletResponse;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.PdfPTable;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

  
@Override
public ProductResponse createProductWithImage(
        String sku,
        String name,
        String category,
        double price,
        int stock,
        MultipartFile image) throws Exception {

    String uploadDir = "uploads/";
    java.io.File dir = new java.io.File(uploadDir);
    if (!dir.exists()) dir.mkdirs();

    String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
    java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + fileName);
    java.nio.file.Files.write(path, image.getBytes());

    Product product = new Product(
            null,
            sku,
            name,
            price,
            stock,
            category
    );

    product.setImageUrl("/uploads/" + fileName);

    Product saved = productRepository.save(product);

    return mapToResponse(saved);
}
    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
   @Override
public List<LowStock> getLowStocks() {
    List<Product> products = productRepository.findAll();
    List<LowStock> lowStocks = new ArrayList<>();
    for (Product product : products) {
        if (product.getStock() <= 5) {

            LowStock lowStock = new LowStock();
            lowStock.setName(product.getName());
            lowStock.setSku(product.getSku());
            lowStock.setStock(String.valueOf(product.getStock()));

            lowStocks.add(lowStock);
        }
    }

    return lowStocks;
}
@Override
    public ProductResponse getProductBySku(String sku) {

        Product product = productRepository.findBySku(sku)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        return mapToResponse(product);
    }

    @Override
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    @Override
    public void exportProducts(PrintWriter writer) {

        List<Product> products = productRepository.findAll();

        writer.println("Name,Price,Barcode,Quantity,Category");

        for (Product product : products) {
            writer.println(
                    product.getName() + "," +
                    product.getPrice() + "," +
                    product.getBarcode() + "," +
                    product.getQuantity() + "," +
                    product.getCategory()
            );
        }
    }
 @Override
public ProductResponse updateProduct(String id,
                                     ProductRequest request) {

    Product product = productRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Product not found"));

    product.setName(request.getName());
    product.setPrice(request.getPrice());
    product.setStock(request.getStock());
    product.setCategory(request.getCategory());
    product.setSku(request.getSku());

    Product updated = productRepository.save(product);

    return mapToResponse(updated);
}
   
    @Override
    public void exportProductsToPDF(HttpServletResponse response) throws Exception {

        List<Product> products = productRepository.findAll();

        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        document.add(new Paragraph("Product List"));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(5);
        table.addCell("Name");
        table.addCell("Price");
        table.addCell("Barcode");
        table.addCell("Quantity");
        table.addCell("Category");

        for (Product product : products) {
            table.addCell(product.getName());
            table.addCell(String.valueOf(product.getPrice()));
            table.addCell(product.getBarcode());
            table.addCell(String.valueOf(product.getQuantity()));
            table.addCell(product.getCategory());
        }

        document.add(table);
        document.close();
    }


    @Override
    public String importProductsFromCSV(MultipartFile file) {

        int count = 0;

        try (BufferedReader reader =
                     new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {

              
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] data = line.split(",");

                if (data.length < 5) continue;

                String sku = data[0].trim();
                String name = data[1].trim();
                String category = data[2].trim();
                double price = Double.parseDouble(data[3].trim());
                int stock = Integer.parseInt(data[4].trim());

                if (productRepository.existsBySku(sku)) {
                    continue;
                }

                Product product = new Product(
                        null,
                        sku,
                        name,
                        price,
                        stock,
                        category
                );

                productRepository.save(product);
                count++;
            }

        } catch (Exception e) {
            return "Error importing CSV: " + e.getMessage();
        }

        return count + " products imported successfully!";
    }


    private ProductResponse mapToResponse(Product product) {

      return new ProductResponse(
        product.getId(),
        product.getSku(),
        product.getName(),
        product.getPrice(),
        product.getStock(),
        product.getCategory(),
        product.getImageUrl()
);
    }
    @Override
public void saveImage(String id, String imageUrl) {

    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    product.setImageUrl(imageUrl);
    productRepository.save(product);
}
}