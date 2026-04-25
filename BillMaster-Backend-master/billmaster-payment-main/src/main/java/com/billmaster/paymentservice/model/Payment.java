package com.billmaster.paymentservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    private String id;

    private String invoiceNumber;

    private String orderId;
    private String paymentId;
    private String productName;

    private double amount;
    private String paymentMethod;
      private String cashierName; 
    private String status;         
    private LocalDateTime paymentDate;
}