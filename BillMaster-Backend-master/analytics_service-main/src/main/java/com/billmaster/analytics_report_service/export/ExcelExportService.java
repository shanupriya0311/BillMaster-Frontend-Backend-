package com.billmaster.analytics_report_service.export;
import com.billmaster.analytics_report_service.dto.DailySalesReportDTO;

import java.util.List;


public interface ExcelExportService {
    byte[] generateSalesExcel(List<DailySalesReportDTO> reports);
}
