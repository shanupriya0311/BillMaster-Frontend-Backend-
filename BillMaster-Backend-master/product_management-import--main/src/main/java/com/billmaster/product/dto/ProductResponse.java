package com.billmaster.product.dto;

public class ProductResponse {

    private String id;
    private String name;
    private double price;
    private int stock;
    private String sku;
    private String category;
    private String imageUrl;

    public ProductResponse() {}

  public ProductResponse(String id, String sku, String name, double price, int stock, String category, String imageUrl) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.imageUrl = imageUrl;
}
public String getImageUrl() {
    return imageUrl;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}
     public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }
    public String getId() {
        return id;
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
}
