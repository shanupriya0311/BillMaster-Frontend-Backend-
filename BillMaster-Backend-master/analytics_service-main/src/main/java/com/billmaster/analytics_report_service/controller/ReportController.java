package com.billmaster.analytics_report_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.billmaster.analytics_report_service.dto.DailySalesReportDTO;
import com.billmaster.analytics_report_service.dto.LowStockProductDTO;
import com.billmaster.analytics_report_service.dto.TransactionCountDTO;
import com.billmaster.analytics_report_service.export.PdfExportService;
import com.billmaster.analytics_report_service.service.ReportService;
@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final PdfExportService pdfExportService;

    public ReportController(ReportService reportService,
                            PdfExportService pdfExportService) {
        this.reportService = reportService;
        this.pdfExportService = pdfExportService;
    }

    @GetMapping("/daily")
    public DailySalesReportDTO dailyReport(@RequestParam String date) {
        return reportService.getDailySales(LocalDate.parse(date));
    }
    @GetMapping("/range")
    public List<DailySalesReportDTO> rangeReport(@RequestParam String start,
                                                 @RequestParam String end) {

        return reportService.getSalesBetween(
                LocalDate.parse(start),
                LocalDate.parse(end));
    }

    @GetMapping("/dashboard/transactions")
    public TransactionCountDTO transactions(@RequestParam String date) {

        return reportService.getTransactionCountForDate(
                LocalDate.parse(date));
    }
    @GetMapping("/dashboard/low-stock")
    public List<LowStockProductDTO> lowStock(
            @RequestParam(defaultValue = "10") int threshold) {

        return reportService.getLowStockProducts(threshold);
    }
    @GetMapping("/manager-summary/pdf")
    public ResponseEntity<byte[]> managerSummary() {

        DailySalesReportDTO daily =
                reportService.getDailySales(LocalDate.now());

        TransactionCountDTO transactions =
                reportService.getTransactionCountForDate(LocalDate.now());

        List<LowStockProductDTO> lowStock =
                reportService.getLowStockProducts(10);

        byte[] pdf = pdfExportService.generateManagerReport(
                daily, transactions, lowStock);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=manager-summary.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}