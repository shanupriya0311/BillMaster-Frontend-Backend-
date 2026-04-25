package com.billmaster.analytics_report_service.service.impl;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.billmaster.analytics_report_service.dto.DailySalesReportDTO;
import com.billmaster.analytics_report_service.dto.LowStockProductDTO;
import com.billmaster.analytics_report_service.dto.TransactionCountDTO;
import com.billmaster.analytics_report_service.service.ReportService;

@Service
public class ReportServiceImpl implements ReportService {

    private final MongoTemplate mongoTemplate;

    public ReportServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    // ================= DAILY SALES =================

    @Override
    public DailySalesReportDTO getDailySales(LocalDate date) {

        Date start = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(date.plusDays(1)
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant());

        MatchOperation match =
                Aggregation.match(
                        Criteria.where("invoiceDate")
                                .gte(start)
                                .lt(end));

        GroupOperation group =
                Aggregation.group()
                        .sum("totalAmount").as("totalRevenue")
                        .count().as("totalOrders");

        Aggregation aggregation =
                Aggregation.newAggregation(match, group);

        AggregationResults<DailySalesAggResult> result =
                mongoTemplate.aggregate(
                        aggregation,
                        "invoices",
                        DailySalesAggResult.class);

        DailySalesAggResult data = result.getUniqueMappedResult();

        if (data == null) {
            return new DailySalesReportDTO(
                    date.toString(),
                    0.0,
                    0);
        }

        return new DailySalesReportDTO(
                date.toString(),
                data.getTotalRevenue(),
                data.getTotalOrders());
    }

    // ================= SALES BETWEEN =================

    @Override
    public List<DailySalesReportDTO> getSalesBetween(LocalDate startDate,
                                                     LocalDate endDate) {
        // You can implement range aggregation here later
        return List.of();
    }

    // ================= TRANSACTION COUNT =================

    @Override
    public TransactionCountDTO getTransactionCountForDate(LocalDate date) {

        Date start = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(date.plusDays(1)
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant());

        MatchOperation match =
                Aggregation.match(
                        Criteria.where("invoiceDate")
                                .gte(start)
                                .lt(end));

        GroupOperation group =
                Aggregation.group()
                        .count().as("count");

        Aggregation aggregation =
                Aggregation.newAggregation(match, group);

        AggregationResults<CountResult> result =
                mongoTemplate.aggregate(
                        aggregation,
                        "invoices",
                        CountResult.class);

        CountResult data = result.getUniqueMappedResult();

        long count = (data == null) ? 0 : data.getCount();

        return new TransactionCountDTO(date.toString(), count);
    }

    // ================= LOW STOCK =================

    @Override
    public List<LowStockProductDTO> getLowStockProducts(int threshold) {

        Query query = new Query(
                Criteria.where("stock").lt(threshold)
        );

        List<ProductStockView> products =
                mongoTemplate.find(
                        query,
                        ProductStockView.class,
                        "products");

        return products.stream()
                .map(p -> new LowStockProductDTO(
                        p.getId(),
                        p.getName(),
                        p.getStock()))
                .toList();
    }

    // ================= INTERNAL AGG CLASSES =================

    private static class DailySalesAggResult {

        private double totalRevenue;
        private int totalOrders;

        public double getTotalRevenue() {
            return totalRevenue;
        }

        public void setTotalRevenue(double totalRevenue) {
            this.totalRevenue = totalRevenue;
        }

        public int getTotalOrders() {
            return totalOrders;
        }

        public void setTotalOrders(int totalOrders) {
            this.totalOrders = totalOrders;
        }
    }

    private static class CountResult {

        private long count;

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    private static class ProductStockView {

        private String id;
        private String name;
        private int stock;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getStock() {
            return stock;
        }

        public void setStock(int stock) {
            this.stock = stock;
        }
    }
}