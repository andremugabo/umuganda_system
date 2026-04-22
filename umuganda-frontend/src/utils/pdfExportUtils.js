import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


/**
 * Generates a branded PDF report for Umuganda system data.
 * @param {Array} data - The data array to export
 * @param {String} title - Document title
 * @param {Array} columns - Table headers
 * @param {String} filename - Output filename
 */
export const generatePDFReport = (data, title, columns, filename = 'report.pdf') => {
    const doc = jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Branding Colors (Rwanda Theme)
    const blue = [0, 163, 224];
    const green = [0, 122, 51];
    const yellow = [250, 210, 1];

    // Header Branding Line
    doc.setDrawColor(blue[0], blue[1], blue[2]);
    doc.setLineWidth(1.5);
    doc.line(15, 15, 195, 15);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(33, 33, 33);
    doc.text('UMUGANDA MANAGEMENT SYSTEM', 15, 25);

    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(title.toUpperCase(), 15, 30);

    // Date & Generation Info
    doc.setFontSize(8);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, 145, 30);

    // Summary Section
    doc.setDrawColor(240, 240, 240);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, 35, 180, 20, 3, 3, 'FD');
    
    doc.setFontSize(9);
    doc.setTextColor(33, 33, 33);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT SUMMARY', 20, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(`This document contains a comprehensive record of ${data.length} entries related to the Umuganda community program.`, 20, 48);

    // Table Generation
    autoTable(doc, {
        startY: 60,
        head: [columns],
        body: data,
        theme: 'striped',
        headStyles: {
            fillColor: blue,
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'left',
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        margin: { left: 15, right: 15 },
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
    });


    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 195 / 2, 285, { align: 'center' });
        doc.text('Muraho System © 2026 - Twese Hamwe, Buri Kigero', 15, 285);
    }

    // Save
    doc.save(filename);
};
