package com.billmaster.paymentservice.controller;

import com.billmaster.paymentservice.model.Payment;
import com.billmaster.paymentservice.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

   @PostMapping("/create-order")
public Map<String, Object> createOrder(@RequestParam int amount) {
    return paymentService.createOrder(amount);
}

   @PostMapping("/verify")
public Payment verifyPayment(@RequestParam String orderId,
                             @RequestParam String paymentId,
                             @RequestParam String signature,
                             @RequestParam double amount,
                             @RequestParam String productName,
                             @RequestParam String paymentMethod,
                             @RequestParam String cashierName) {

    return paymentService.verifyAndSavePayment(
            orderId,
            paymentId,
            signature,
            amount,
            productName,
            paymentMethod,
            cashierName
    );
}

    @GetMapping("/history")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }
    @GetMapping("/history/invoice/{invoiceNumber}")
    public List<Payment> getByInvoice(@PathVariable String invoiceNumber) {
        return paymentService.getPaymentsByInvoice(invoiceNumber);
    }

    @GetMapping("/history/date")
    public List<Payment> getByDateRange(@RequestParam String start,
                                        @RequestParam String end) {

        LocalDateTime startDate =
                LocalDate.parse(start).atStartOfDay();

        LocalDateTime endDate =
                LocalDate.parse(end).atTime(23, 59, 59);

        return paymentService.getPaymentsByDateRange(startDate, endDate);
    }


    @GetMapping("/history/filter")
    public List<Payment> getByInvoiceAndDate(@RequestParam String invoiceNumber,
                                             @RequestParam String start,
                                             @RequestParam String end) {

        LocalDateTime startDate =
                LocalDate.parse(start).atStartOfDay();

        LocalDateTime endDate =
                LocalDate.parse(end).atTime(23, 59, 59);

        return paymentService.getPaymentsByInvoiceAndDate(
                invoiceNumber,
                startDate,
                endDate
        );
    }
}