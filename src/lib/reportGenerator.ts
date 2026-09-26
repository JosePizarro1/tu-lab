import jsPDF from 'jspdf';
import { Paciente, PruebaClinica, Sede } from '@/services/db';
import { getExamenByIdOrName, ExamenDefinicion, ParametroExamen } from './catalogExamenes';

export interface ReportData {
  paciente: Partial<Paciente>;
  prueba: PruebaClinica;
  sede?: Sede | string;
  valoresResultados: Record<string, string>;
  observaciones?: string;
  medicoFirmante?: string;
}

export function parseResultadosMap(resultadoRaw?: string): Record<string, string> {
  if (!resultadoRaw) return {};
  try {
    const parsed = JSON.parse(resultadoRaw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (e) {
    return { default_val: resultadoRaw };
  }
  return { default_val: resultadoRaw };
}

// Cargar imagen como Data URL para jsPDF
async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
}

export async function generateReportPDF(data: ReportData): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginX = 20;

  // 1. Fondo de la Hoja Membretada Oficial de UNIDOSLAB
  const bgDataUrl = await loadImageAsDataUrl('/plantilla-membrete-oficial.png');
  if (bgDataUrl) {
    doc.addImage(bgDataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
  }

  // 2. Datos del Paciente (Arriba izquierda, con dos puntos)
  const nombreCompleto = `${data.paciente.nombre || ''} ${data.paciente.apellido || ''}`.trim() || (data.prueba.pacienteDni || 'NO ESPECIFICADO');
  const fechaDoc = data.prueba.fecha || new Date().toISOString().split('T')[0];

  let startY = 48;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  doc.text('PACIENTE', marginX, startY);
  doc.text(':', marginX + 28, startY);
  doc.text(nombreCompleto.toUpperCase(), marginX + 32, startY);

  startY += 5;
  doc.text('EDAD', marginX, startY);
  doc.text(':', marginX + 28, startY);
  doc.setFont('helvetica', 'normal');
  doc.text('ADULTO', marginX + 32, startY);

  startY += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('INDICACIÓN', marginX, startY);
  doc.text(':', marginX + 28, startY);
  doc.setFont('helvetica', 'normal');
  doc.text('PARTICULAR', marginX + 32, startY);

  startY += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('FECHA', marginX, startY);
  doc.text(':', marginX + 28, startY);
  doc.setFont('helvetica', 'normal');
  doc.text(fechaDoc, marginX + 32, startY);

  // 3. Título Centrado Subrayado
  startY += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  const title = 'INFORME DE LABORATORIO';
  doc.text(title, pageWidth / 2, startY, { align: 'center' });
  const titleWidth = doc.getTextWidth(title);
  doc.setLineWidth(0.4);
  doc.line((pageWidth - titleWidth) / 2, startY + 0.8, (pageWidth + titleWidth) / 2, startY + 0.8);

  // 4. Área Médica Subrayada
  const examenDef = getExamenByIdOrName(data.prueba.examen);
  const categoria = examenDef?.categoria || 'HEMATOLOGÍA';

  startY += 9;
  doc.setFontSize(9.5);
  doc.text(categoria, marginX, startY);
  const catWidth = doc.getTextWidth(categoria);
  doc.line(marginX, startY + 0.8, marginX + catWidth, startY + 0.8);

  // 5. Cabecera de Columnas Subrayadas
  startY += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  // Análisis
  doc.text('Análisis', marginX, startY);
  const anWidth = doc.getTextWidth('Análisis');
  doc.line(marginX, startY + 0.6, marginX + anWidth, startY + 0.6);

  // Resultado
  doc.text('Resultado', marginX + 75, startY, { align: 'center' });
  const resWidth = doc.getTextWidth('Resultado');
  doc.line(marginX + 75 - resWidth / 2, startY + 0.6, marginX + 75 + resWidth / 2, startY + 0.6);

  // Valores Normales
  doc.text('Valores Normales', pageWidth - marginX, startY, { align: 'right' });
  const valWidth = doc.getTextWidth('Valores Normales');
  doc.line(pageWidth - marginX - valWidth, startY + 0.6, pageWidth - marginX, startY + 0.6);

  startY += 7;

  // 6. Filas de Resultados
  const parametros: ParametroExamen[] = examenDef?.parametros || [
    { id: 'default_val', nombre: data.prueba.examen, unidad: '', valorReferencial: 'Dentro de límites normales' },
  ];

  doc.setFontSize(8.5);

  parametros.forEach((param, index) => {
    const rawVal = data.valoresResultados[param.id] || (index === 0 && data.valoresResultados['default_val']) || '-';
    const isNested = param.nombre.startsWith('N.º') || param.nombre.startsWith('Nº') || 
      param.nombre === 'Eosinófilos' || param.nombre === 'Basófilos' || 
      param.nombre === 'Monocitos' || param.nombre === 'Linfocitos';

    const paramX = isNested ? marginX + 6 : marginX;

    // Nombre
    doc.setFont('helvetica', isNested ? 'normal' : 'bold');
    doc.text(param.nombre, paramX, startY);
    doc.text(':', marginX + 58, startY);

    // Resultado
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const resText = param.unidad ? `${rawVal} ${param.unidad}` : String(rawVal);
    doc.text(resText, marginX + 75, startY, { align: 'center' });

    // Valores Normales
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(param.valorReferencial, pageWidth - marginX, startY, { align: 'right' });

    startY += 5.5;
  });

  // 7. Sello y Firma Oficial
  const stampDataUrl = await loadImageAsDataUrl('/sello-firma-oficial.png');
  if (stampDataUrl) {
    const stampWidth = 45;
    const stampHeight = 35;
    const stampX = pageWidth - marginX - stampWidth - 5;
    const stampY = pageHeight - 75;
    doc.addImage(stampDataUrl, 'PNG', stampX, stampY, stampWidth, stampHeight);
  }

  return doc;
}

export async function downloadReportPDF(data: ReportData, filename?: string) {
  const doc = await generateReportPDF(data);
  const cleanDni = data.paciente.dni || data.prueba.pacienteDni || 'PACIENTE';
  const cleanExamen = data.prueba.examen.replace(/\s+/g, '_');
  const name = filename || `INFORME_${cleanDni}_${cleanExamen}.pdf`;
  doc.save(name);
}

export function downloadReportWord(data: ReportData, filename?: string) {
  const examenDef = getExamenByIdOrName(data.prueba.examen);
  const categoria = examenDef?.categoria || 'HEMATOLOGÍA';
  const nombreCompleto = `${data.paciente.nombre || ''} ${data.paciente.apellido || ''}`.trim() || (data.prueba.pacienteDni || 'NO ESPECIFICADO');
  const fechaDoc = data.prueba.fecha || new Date().toISOString().split('T')[0];

  const parametros: ParametroExamen[] = examenDef?.parametros || [
    { id: 'default_val', nombre: data.prueba.examen, unidad: '', valorReferencial: 'Dentro de límites normales' },
  ];

  let rowsHtml = '';
  parametros.forEach((param, index) => {
    const rawVal = data.valoresResultados[param.id] || (index === 0 && data.valoresResultados['default_val']) || '-';
    const isNested = param.nombre.startsWith('N.º') || param.nombre.startsWith('Nº') || 
      param.nombre === 'Eosinófilos' || param.nombre === 'Basófilos' || 
      param.nombre === 'Monocitos' || param.nombre === 'Linfocitos';
    
    rowsHtml += `
      <tr>
        <td style="padding: 4px 8px; ${isNested ? 'padding-left: 24px;' : 'font-weight: bold;'}">${param.nombre} :</td>
        <td style="padding: 4px 8px; text-align: center; font-weight: bold;">${rawVal} ${param.unidad || ''}</td>
        <td style="padding: 4px 8px; text-align: right;">${param.valorReferencial}</td>
      </tr>
    `;
  });

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Informe Clínico UNIDOSLAB</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #0f172a; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { font-size: 16pt; color: #09283c; margin: 0; }
        .header p { font-size: 9pt; color: #fb5962; font-weight: bold; margin: 2px 0 0 0; }
        .meta-box { margin-bottom: 15px; font-size: 10pt; }
        .meta-box table { width: 100%; }
        .title { text-align: center; font-weight: bold; text-decoration: underline; font-size: 13pt; margin: 15px 0; }
        .area { font-weight: bold; text-decoration: underline; font-size: 11pt; margin: 10px 0; }
        .results-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .results-table th { border-bottom: 2px solid #000; text-align: left; padding: 6px 8px; font-size: 10pt; }
        .results-table td { font-size: 10pt; }
        .footer { margin-top: 40px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>UNIDOSLAB</h1>
        <p>LABORATORIO CLÍNICO & BIOLOGÍA MOLECULAR</p>
      </div>
      <div class="meta-box">
        <table>
          <tr><td style="width: 120px; font-weight: bold;">PACIENTE</td><td style="width: 10px;">:</td><td>${nombreCompleto.toUpperCase()}</td></tr>
          <tr><td style="font-weight: bold;">EDAD</td><td>:</td><td>ADULTO</td></tr>
          <tr><td style="font-weight: bold;">INDICACIÓN</td><td>:</td><td>PARTICULAR</td></tr>
          <tr><td style="font-weight: bold;">FECHA</td><td>:</td><td>${fechaDoc}</td></tr>
        </table>
      </div>
      <div class="title">INFORME DE LABORATORIO</div>
      <div class="area">${categoria}</div>
      <table class="results-table">
        <thead>
          <tr>
            <th style="width: 50%;">Análisis</th>
            <th style="width: 25%; text-align: center;">Resultado</th>
            <th style="width: 25%; text-align: right;">Valores Normales</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <div class="footer">
        <p style="font-weight: bold; margin: 0;">VALIDADO POR LABORATORIO</p>
        <p style="font-size: 9pt; color: #64748b; margin: 2px 0;">Lic. Biólogo / C.B.P. 16809</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });

  const cleanDni = data.paciente.dni || data.prueba.pacienteDni || 'PACIENTE';
  const cleanExamen = data.prueba.examen.replace(/\s+/g, '_');
  const name = filename || `INFORME_${cleanDni}_${cleanExamen}.doc`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
