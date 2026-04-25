package com.billmaster.analytics_report_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LowStockProductDTO {

    private String productId;
    private String name;
    private int stock;
}
