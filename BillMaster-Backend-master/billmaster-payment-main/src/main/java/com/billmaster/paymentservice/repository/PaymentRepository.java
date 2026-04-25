package com.billmaster.paymentservice.repository;

import com.billmaster.paymentservice.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByInvoiceNumber(String invoiceNumber);

    List<Payment> findByPaymentDateBetween(LocalDateTime start,
                                           LocalDateTime end);

    List<Payment> findByInvoiceNumberAndPaymentDateBetween(
            String invoiceNumber,
            LocalDateTime start,
            LocalDateTime end
    );
}