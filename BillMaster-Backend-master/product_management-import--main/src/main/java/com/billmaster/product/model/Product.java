package com.billmaster.product.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {


    @Id
    private String id;
    private String name;
    private double price;
    private int stock;
    private String barcode;
    private int quantity;
    private String sku;
    private String imageUrl;
    private String category;
    public Product() {
    }
    
public Product(String id, String sku,String name, double price, int stock, String category) {
    this.id = id;
    this.sku=sku;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;

}

    public Product(String name, double price,String sku, int stock, String category,int quantity) {
        this.name = name;
        this.sku=sku;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.quantity=quantity;
    }

    public String getId() {
        return id;
    }
       public String getSku() {
        return sku;
    }
     public void setSku(String sku) {
        this.sku = sku;
    }
    public String getImageUrl() {
    return imageUrl;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
    public String getBarcode() {
    return barcode;
}

public void setBarcode(String barcode) {
    this.barcode = barcode;
}

public int getQuantity() {
    return quantity;
}

public void setQuantity(int quantity) {
    this.quantity = quantity;
}
}
