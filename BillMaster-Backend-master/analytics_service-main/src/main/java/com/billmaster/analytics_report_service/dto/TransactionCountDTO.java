package com.billmaster.analytics_report_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TransactionCountDTO {

    private String date;
    private long totalTransactions;
}
