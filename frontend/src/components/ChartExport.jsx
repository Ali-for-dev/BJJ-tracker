import React from 'react';
import { Download } from 'lucide-react';

const ChartExport = ({ chartRef, chartTitle }) => {
    const exportToPNG = () => {
        if (!chartRef || !chartRef.current) {
            alert('Chart not ready for export');
            return;
        }

        try {
            const canvas = chartRef.current.canvas;
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${chartTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
            link.href = url;
            link.click();
        } catch (error) {
            console.error('Error exporting chart:', error);
            alert('Erreur lors de l\'export du graphique');
        }
    };

    return (
        <button
            className="chart-export-btn"
            onClick={exportToPNG}
            title="Exporter en PNG"
        >
            <Download size={18} />
            <span>Export PNG</span>
        </button>
    );
};

export default ChartExport;
