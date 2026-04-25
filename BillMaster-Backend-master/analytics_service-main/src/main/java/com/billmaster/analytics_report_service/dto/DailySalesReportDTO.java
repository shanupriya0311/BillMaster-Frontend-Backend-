package com.billmaster.analytics_report_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailySalesReportDTO {

    private String date;
    private double totalRevenue;
    private int totalOrders;
}

     