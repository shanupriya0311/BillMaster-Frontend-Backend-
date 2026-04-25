package com.billmaster.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "customers")
@Data
public class Customer {

    @Id
    private String id;

    private String name;
    private String phone;
    private String email;
    private String address;

    public Customer() {
    }

    public Customer(String name, String phone, String email, String address) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }

}
