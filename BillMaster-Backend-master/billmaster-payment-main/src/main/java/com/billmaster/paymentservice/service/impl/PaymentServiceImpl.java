package com.billmaster.paymentservice.service.impl;

import com.billmaster.paymentservice.model.Payment;
import com.billmaster.paymentservice.repository.PaymentRepository;
import com.billmaster.paymentservice.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
 @Override
public Map<String, Object> createOrder(int amount) {

    try {
        RazorpayClient razorpay =
                new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");
        options.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(options);

        Map<String, Object> response = new HashMap<>();

        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("key", keyId);

        return response;

    } catch (Exception e) {
        throw new RuntimeException("Order creation failed");
    }
}

    @Override
    public Payment verifyAndSavePayment(String orderId,
                                        String paymentId,
                                        String signature,
                                        double amount,
                                        String productName,
                                        String paymentMethod,
                                        String cashierName) {

        try {
            String payload = orderId + "|" + paymentId;

            boolean isValid = Utils.verifySignature(
                    payload,
                    signature,
                    keySecret
            );

            if (isValid) {

                Payment payment = new Payment();
                payment.setOrderId(orderId);
                payment.setPaymentId(paymentId);
                payment.setAmount(amount);String invoice = "INV-" + System.currentTimeMillis();
               payment.setInvoiceNumber(invoice);

                payment.setProductName(productName);
                payment.setPaymentMethod(paymentMethod);
                payment.setCashierName(cashierName);
                payment.setStatus("SUCCESS");
                payment.setPaymentDate(LocalDateTime.now());

                Payment saved=paymentRepository.save(payment);
                return saved;
            } else {
                throw new RuntimeException("Invalid payment signature");
            }

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed");
        }
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public List<Payment> getPaymentsByInvoice(String invoiceNumber) {
        return paymentRepository.findByInvoiceNumber(invoiceNumber);
    }

    @Override
    public List<Payment> getPaymentsByDateRange(LocalDateTime start,
                                                LocalDateTime end) {
        return paymentRepository.findByPaymentDateBetween(start, end);
    }

    @Override
    public List<Payment> getPaymentsByInvoiceAndDate(String invoiceNumber,
                                                     LocalDateTime start,
                                                     LocalDateTime end) {
        return paymentRepository
                .findByInvoiceNumberAndPaymentDateBetween(
                        invoiceNumber,
                        start,
                        end
                );
    }
}