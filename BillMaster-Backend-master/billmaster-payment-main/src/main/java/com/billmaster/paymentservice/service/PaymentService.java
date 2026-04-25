package com.billmaster.paymentservice.service;

import com.billmaster.paymentservice.model.Payment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface PaymentService {

    Map<String, Object> createOrder(int amount);


    Payment verifyAndSavePayment(String orderId,
                                 String paymentId,
                                 String signature,
                                 double amount,
                                 String productName,
                                 String paymentMethod,
                                 String cashierName);

    List<Payment> getAllPayments();

    List<Payment> getPaymentsByInvoice(String invoiceNumber);

    List<Payment> getPaymentsByDateRange(LocalDateTime start,
                                         LocalDateTime end);

    List<Payment> getPaymentsByInvoiceAndDate(String invoiceNumber,
                                              LocalDateTime start,
                                              LocalDateTime end);
}