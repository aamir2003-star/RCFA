import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * Generates a high-fidelity PDF report from a DOM element with professional branding.
 * Uses html-to-image (instead of html2canvas) for full modern CSS support (oklch, oklab, etc.)
 */
export const generateVisualReport = async (elementId, fileName = 'Report') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;
    }

    try {
        // Hide no-print elements before capture
        const noPrintElements = element.querySelectorAll('.no-print, button, input');
        const hiddenStates = [];
        noPrintElements.forEach(el => {
            hiddenStates.push({ el, display: el.style.display });
            el.style.display = 'none';
        });

        // Capture the element as a PNG using html-to-image (handles modern CSS natively)
        const imgData = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: getComputedStyle(document.documentElement)
                .getPropertyValue('background') || '#ffffff',
        });

        // Restore no-print elements
        hiddenStates.forEach(({ el, display }) => {
            el.style.display = display;
        });

        // Build the PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // --- HEADER (Page 1) ---
        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, pdfWidth, 25, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SpectraAI', 15, 17);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Enterprise Conflict Audit Report', pdfWidth - 15, 12, { align: 'right' });
        pdf.text(
            new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }),
            pdfWidth - 15, 18, { align: 'right' }
        );

        // --- IMAGE LAYOUT ---
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth - 30;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let position = 30;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 15, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 40);

        while (heightLeft >= 0) {
            pdf.addPage();
            pdf.setFillColor(0, 0, 0);
            pdf.rect(0, 0, pdfWidth, 25, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(18);
            pdf.text('SpectraAI', 15, 17);

            position = heightLeft - imgHeight + 30;
            pdf.addImage(imgData, 'PNG', 15, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - 30);
        }

        // --- FOOTER ---
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`Page ${i} of ${totalPages}`, pdfWidth / 2, pageHeight - 10, { align: 'center' });
            pdf.text('SpectraAI Proprietary Audit Document - Confidential', 15, pageHeight - 10);
        }

        pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error('PDF Export failed', error);
        throw error;
    }
};
