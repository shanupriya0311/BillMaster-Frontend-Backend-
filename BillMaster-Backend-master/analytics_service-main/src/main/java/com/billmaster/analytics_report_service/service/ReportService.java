package com.billmaster.analytics_report_service.service;
import java.time.LocalDate;
import java.util.List;

import com.billmaster.analytics_report_service.dto.DailySalesReportDTO;
import com.billmaster.analytics_report_service.dto.LowStockProductDTO;
import com.billmaster.analytics_report_service.dto.TransactionCountDTO;

public interface ReportService {

    DailySalesReportDTO getDailySales(LocalDate date);
    List<DailySalesReportDTO> getSalesBetween(LocalDate start, LocalDate end);
    TransactionCountDTO getTransactionCountForDate(LocalDate date);
    List<LowStockProductDTO> getLowStockProducts(int threshold);

}

