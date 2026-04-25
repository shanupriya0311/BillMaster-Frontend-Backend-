package com.billmaster.analytics_report_service.export;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.stereotype.Service;

import com.billmaster.analytics_report_service.dto.DailySalesReportDTO;
import com.billmaster.analytics_report_service.dto.LowStockProductDTO;
import com.billmaster.analytics_report_service.dto.TransactionCountDTO;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;

import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.properties.TextAlignment;

@Service
public class PdfExportService {

    public byte[] generateManagerReport(
            DailySalesReportDTO daily,
            TransactionCountDTO transactions,
            List<LowStockProductDTO> lowStock) {

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // ---------- HEADER ----------
            Table header = new Table(2).useAllAvailableWidth();
            header.setBackgroundColor(ColorConstants.BLACK);

            header.addCell(new Cell()
                    .add(new Paragraph("BillMaster")
                            .setFontColor(ColorConstants.WHITE)
                            .setBold()
                            .setFontSize(16))
                    .setBorder(Border.NO_BORDER));

            header.addCell(new Cell()
                    .add(new Paragraph(daily.getDate().toString())
                            .setFontColor(ColorConstants.WHITE))
                    .setBorder(Border.NO_BORDER)
                    .setTextAlignment(TextAlignment.RIGHT));

            document.add(header);
            document.add(new Paragraph("\n"));

            // ---------- TITLE ----------
            document.add(new Paragraph("Report Summary").setBold().setFontSize(14));
            document.add(new Paragraph("Daily Sales Report\n"));

            // ---------- CARDS ----------
            Table cards = new Table(3).useAllAvailableWidth();

            cards.addCell(card("Total Revenue", "₹" + daily.getTotalRevenue()));
            cards.addCell(card("Total Orders", String.valueOf(daily.getTotalOrders())));
            cards.addCell(card("Transactions Today", String.valueOf(transactions.getTotalTransactions())));

            document.add(cards);
            document.add(new Paragraph("\n"));

            // ---------- TRANSACTION SUMMARY ----------
            document.add(sectionTitle("Transaction Summary"));

            Table txn = new Table(2).useAllAvailableWidth();

            txn.addCell(simpleCell("Total Transactions"));
            txn.addCell(simpleCell(String.valueOf(transactions.getTotalTransactions())));

            document.add(txn);
            document.add(new Paragraph("\n"));

            // ---------- LOW STOCK ----------
            document.add(sectionTitle("Low Stock Products"));

            if (lowStock.isEmpty()) {
                document.add(new Paragraph("No low stock products."));
            } else {
                for (LowStockProductDTO p : lowStock) {
                    document.add(new Paragraph(p.getName() + " - Stock: " + p.getStock()));
                }
            }

            document.add(new Paragraph("\nGenerated on " + daily.getDate()));

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }

    // ---------- HELPERS ----------

    private Cell card(String title, String value) {
        return new Cell()
                .add(new Paragraph(title))
                .add(new Paragraph(value).setBold().setFontSize(13))
                .setBorder(new SolidBorder(1))
                .setPadding(10)
                .setTextAlignment(TextAlignment.CENTER);
    }

    private Paragraph sectionTitle(String text) {
        return new Paragraph(text)
                .setBold()
                .setFontSize(12);
    }

    private Cell simpleCell(String text) {
        return new Cell()
                .add(new Paragraph(text))
                .setBorder(new SolidBorder(0.5f))
                .setPadding(6);
    }
}