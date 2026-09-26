export type CategoriaExamen = 
  | 'HEMATOLOGÍA' 
  | 'BIOQUÍMICA' 
  | 'MICROBIOLOGÍA' 
  | 'INMUNOLOGÍA' 
  | 'LIFOTRONIC';

export interface ParametroExamen {
  id: string;
  nombre: string;
  unidad?: string;
  valorReferencial: string;
  tipo?: 'number' | 'text' | 'select';
  opciones?: string[];
  valorPorDefecto?: string;
}

export interface ExamenDefinicion {
  id: string;
  nombre: string;
  categoria: CategoriaExamen;
  metodo?: string;
  muestra?: string;
  parametros: ParametroExamen[];
}

export const CATALOGO_EXAMENES: ExamenDefinicion[] = [
  // ==========================================
  // 1. HEMATOLOGÍA
  // ==========================================
  {
    id: 'HEMOGRAMA_AUTO',
    nombre: 'Hemograma Automatizado',
    categoria: 'HEMATOLOGÍA',
    metodo: 'Citometría de Flujo / Automatizado',
    muestra: 'Sangre Total (EDTA)',
    parametros: [
      { id: 'hematies', nombre: 'Hematíes (Glóbulos Rojos)', unidad: '10^6/uL', valorReferencial: '3.8 – 6.0 x10^6/uL' },
      { id: 'hemoglobina', nombre: 'Hemoglobina', unidad: 'g/dL', valorReferencial: 'Varón: 13.0 - 18.0 | Mujer: 11.5 - 16.5' },
      { id: 'hematocrito', nombre: 'Hematocrito', unidad: '%', valorReferencial: 'Varón: 36 - 51% | Mujer: 35 - 45%' },
      { id: 'vcm', nombre: 'Volumen Corpuscular Medio (VCM)', unidad: 'fL', valorReferencial: '82.0 – 95.0 fL' },
      { id: 'hcm', nombre: 'Hemoglobina Corpuscular Media (HCM)', unidad: 'pg', valorReferencial: '27.0 – 33.0 pg' },
      { id: 'chcm', nombre: 'Concentración de Hb Corpuscular (CHCM)', unidad: 'g/dL', valorReferencial: '32.0 – 36.0 g/dL' },
      { id: 'rdw', nombre: 'Índice de Anisocitosis (RDW)', unidad: '%', valorReferencial: '11.5 – 15.0 %' },
      { id: 'leucocitos', nombre: 'Leucocitos Totales', unidad: '/mm3', valorReferencial: '5,000 – 10,000 /mm3' },
      { id: 'abastonados', nombre: 'Nº Abastonados', unidad: '%', valorReferencial: '0 – 5 %' },
      { id: 'segmentados', nombre: 'Nº Segmentados', unidad: '%', valorReferencial: '32 – 72 %' },
      { id: 'eosinofilos', nombre: 'Eosinófilos', unidad: '%', valorReferencial: '0 – 5 %' },
      { id: 'basofilos', nombre: 'Basófilos', unidad: '%', valorReferencial: '0 – 1 %' },
      { id: 'monocitos', nombre: 'Monocitos', unidad: '%', valorReferencial: '0 – 10 %' },
      { id: 'linfocitos', nombre: 'Linfocitos', unidad: '%', valorReferencial: '20 – 51 %' },
      { id: 'plaquetas', nombre: 'Recuento de Plaquetas', unidad: '/mm3', valorReferencial: '150,000 – 450,000 /mm3' },
    ],
  },
  {
    id: 'COAGULACION_PERFIL',
    nombre: 'Perfil de Coagulación (TP, INR, TTPA)',
    categoria: 'HEMATOLOGÍA',
    metodo: 'Coagulometría Óptica',
    muestra: 'Plasma Citratado',
    parametros: [
      { id: 'tp', nombre: 'Tiempo de Protrombina (TP)', unidad: 'seg', valorReferencial: '10.0 – 14.0 seg' },
      { id: 'inr', nombre: 'INR', unidad: '', valorReferencial: '0.8 – 1.2 (Normal)' },
      { id: 'ttpa', nombre: 'Tiempo de Tromboplastina (TTPA)', unidad: 'seg', valorReferencial: '25.0 – 35.0 seg' },
      { id: 'tiempo_coagulacion', nombre: 'Tiempo de Coagulación', unidad: 'min', valorReferencial: '5 – 10 min' },
      { id: 'tiempo_sangria', nombre: 'Tiempo de Sangría', unidad: 'min', valorReferencial: '2 – 5 min' },
    ],
  },
  {
    id: 'GRUPO_FACTOR',
    nombre: 'Grupo Sanguíneo y Factor Rh',
    categoria: 'HEMATOLOGÍA',
    metodo: 'Aglutinación en Tubo / Placa',
    muestra: 'Sangre Total',
    parametros: [
      { id: 'grupo', nombre: 'Grupo Sanguíneo', tipo: 'select', opciones: ['O', 'A', 'B', 'AB'], valorReferencial: 'O / A / B / AB' },
      { id: 'factor_rh', nombre: 'Factor Rh', tipo: 'select', opciones: ['POSITIVO (+)', 'NEGATIVO (-)'], valorReferencial: 'Positivo / Negativo' },
    ],
  },

  // ==========================================
  // 2. BIOQUÍMICA CLÍNICA
  // ==========================================
  {
    id: 'GLUCOSA_AYUNAS',
    nombre: 'Glucosa en Ayunas',
    categoria: 'BIOQUÍMICA',
    metodo: 'Enzimático Colorimétrico (GOD-PAP)',
    muestra: 'Suero / Plasma Fluorurado',
    parametros: [
      { id: 'glucosa', nombre: 'Glucosa Basal', unidad: 'mg/dL', valorReferencial: '65 – 110 mg/dL' },
    ],
  },
  {
    id: 'HBA1C',
    nombre: 'Hemoglobina Glicosilada (HbA1c)',
    categoria: 'BIOQUÍMICA',
    metodo: 'Inmunoensayo Turbidimétrico',
    muestra: 'Sangre Total (EDTA)',
    parametros: [
      { id: 'hba1c', nombre: 'HbA1c', unidad: '%', valorReferencial: 'Normal: 4.2 – 6.2% | Control aceptable: 6.3 – 7.0%' },
    ],
  },
  {
    id: 'PERFIL_LIPIDICO',
    nombre: 'Perfil Lipídico Completo',
    categoria: 'BIOQUÍMICA',
    metodo: 'Espectrofotometría Enzimática',
    muestra: 'Suero',
    parametros: [
      { id: 'colesterol_total', nombre: 'Colesterol Total', unidad: 'mg/dL', valorReferencial: 'Deseable: < 200 mg/dL' },
      { id: 'trigliceridos', nombre: 'Triglicéridos', unidad: 'mg/dL', valorReferencial: 'Normal: < 150 mg/dL' },
      { id: 'hdl', nombre: 'Colesterol HDL (Bueno)', unidad: 'mg/dL', valorReferencial: 'Varón: > 40 | Mujer: > 50 mg/dL' },
      { id: 'ldl', nombre: 'Colesterol LDL (Malo)', unidad: 'mg/dL', valorReferencial: 'Óptimo: < 100 mg/dL' },
      { id: 'vldl', nombre: 'Colesterol VLDL', unidad: 'mg/dL', valorReferencial: 'Normal: 2 – 30 mg/dL' },
    ],
  },
  {
    id: 'PERFIL_RENAL',
    nombre: 'Perfil Renal (Urea, Creatinina, Ácido Úrico)',
    categoria: 'BIOQUÍMICA',
    metodo: 'Cinético Enzimático',
    muestra: 'Suero',
    parametros: [
      { id: 'urea', nombre: 'Urea', unidad: 'mg/dL', valorReferencial: '15 – 45 mg/dL' },
      { id: 'creatinina', nombre: 'Creatinina Sérica', unidad: 'mg/dL', valorReferencial: 'Varón: 0.7 – 1.3 | Mujer: 0.6 – 1.1' },
      { id: 'acido_urico', nombre: 'Ácido Úrico', unidad: 'mg/dL', valorReferencial: 'Varón: 3.5 – 7.2 | Mujer: 2.6 – 6.0' },
    ],
  },
  {
    id: 'PERFIL_HEPATICO',
    nombre: 'Perfil Hepático (Transaminasas, Bilirrubinas, FA)',
    categoria: 'BIOQUÍMICA',
    metodo: 'Cinético UV / Colorimétrico',
    muestra: 'Suero',
    parametros: [
      { id: 'tgo', nombre: 'Transaminasa TGO (AST)', unidad: 'U/L', valorReferencial: 'Hasta 38 U/L' },
      { id: 'tgp', nombre: 'Transaminasa TGP (ALT)', unidad: 'U/L', valorReferencial: 'Hasta 41 U/L' },
      { id: 'bilirrubina_total', nombre: 'Bilirrubina Total', unidad: 'mg/dL', valorReferencial: '0.2 – 1.0 mg/dL' },
      { id: 'bilirrubina_directa', nombre: 'Bilirrubina Directa', unidad: 'mg/dL', valorReferencial: '0.0 – 0.2 mg/dL' },
      { id: 'bilirrubina_indirecta', nombre: 'Bilirrubina Indirecta', unidad: 'mg/dL', valorReferencial: '0.2 – 0.8 mg/dL' },
      { id: 'fosfatasa_alcalina', nombre: 'Fosfatasa Alcalina', unidad: 'U/L', valorReferencial: '65 – 300 U/L' },
    ],
  },
  {
    id: 'ELECTROLITOS',
    nombre: 'Electrólitos Plasmáticos (Na, K, Cl)',
    categoria: 'BIOQUÍMICA',
    metodo: 'Electrodo Selectivo de Iones (ISE)',
    muestra: 'Suero',
    parametros: [
      { id: 'sodio', nombre: 'Sodio (Na+)', unidad: 'mEq/L', valorReferencial: '135 – 148 mEq/L' },
      { id: 'potasio', nombre: 'Potasio (K+)', unidad: 'mEq/L', valorReferencial: '3.5 – 5.3 mEq/L' },
      { id: 'cloro', nombre: 'Cloro (Cl-)', unidad: 'mEq/L', valorReferencial: '98 – 107 mEq/L' },
    ],
  },

  // ==========================================
  // 3. MICROBIOLOGÍA Y PARASITOLOGÍA
  // ==========================================
  {
    id: 'ORINA_COMPLETO',
    nombre: 'Examen Completo de Orina',
    categoria: 'MICROBIOLOGÍA',
    metodo: 'Físico-Químico y Microscopía de Sedimento',
    muestra: 'Primera Orina de la Mañana',
    parametros: [
      { id: 'color', nombre: 'Color', tipo: 'text', valorReferencial: 'Amarillo ámbar' },
      { id: 'aspecto', nombre: 'Aspecto', tipo: 'text', valorReferencial: 'Límpido / Transparente' },
      { id: 'densidad', nombre: 'Densidad', unidad: '', valorReferencial: '1.010 – 1.030' },
      { id: 'ph', nombre: 'pH', unidad: '', valorReferencial: '5.0 – 7.0' },
      { id: 'leucocitos_tira', nombre: 'Leucocitos (Tira)', tipo: 'select', opciones: ['NEGATIVO', 'Trazas', '25 Leu/uL', '75 Leu/uL', '500 Leu/uL'], valorReferencial: 'NEGATIVO' },
      { id: 'nitritos', nombre: 'Nitritos', tipo: 'select', opciones: ['NEGATIVO', 'POSITIVO'], valorReferencial: 'NEGATIVO' },
      { id: 'proteinas', nombre: 'Proteínas', tipo: 'select', opciones: ['NEGATIVO', 'Trazas', '30 mg/dL', '100 mg/dL', '300 mg/dL'], valorReferencial: 'NEGATIVO' },
      { id: 'glucosa_orina', nombre: 'Glucosa', tipo: 'select', opciones: ['NORMAL', '50 mg/dL', '100 mg/dL', '250 mg/dL', '500 mg/dL'], valorReferencial: 'NORMAL' },
      { id: 'sangre_tira', nombre: 'Sangre / Hemoglobina', tipo: 'select', opciones: ['NEGATIVO', 'Trazas', '10 Ery/uL', '50 Ery/uL', '250 Ery/uL'], valorReferencial: 'NEGATIVO' },
      { id: 'leucocitos_campo', nombre: 'Leucocitos (Microscopio)', unidad: '/campo', valorReferencial: '0 – 2 por campo' },
      { id: 'hematies_campo', nombre: 'Hematíes (Microscopio)', unidad: '/campo', valorReferencial: '0 – 1 por campo' },
      { id: 'celulas_epiteliales', nombre: 'Células Epiteliales', tipo: 'text', valorReferencial: 'Escasas' },
      { id: 'cristales', nombre: 'Cristales', tipo: 'text', valorReferencial: 'No se observan' },
      { id: 'germenes', nombre: 'Gérmenes / Bacterias', tipo: 'select', opciones: ['No se observan', 'Escasos (+)', 'Moderados (++)', 'Abundantes (+++)'], valorReferencial: 'Escasos / No se observan' },
    ],
  },
  {
    id: 'UROCULTIVO',
    nombre: 'Urocultivo + Antibiograma',
    categoria: 'MICROBIOLOGÍA',
    metodo: 'Siembra en Medios Diferenciales',
    muestra: 'Orina Chorro Medio',
    parametros: [
      { id: 'recuento_colonias', nombre: 'Recuento de Colonias (UFC)', unidad: 'UFC/mL', valorReferencial: '< 10,000 UFC/mL (Sin desarrollo significativo)' },
      { id: 'microorganismo', nombre: 'Aislamiento Microbiano', tipo: 'text', valorReferencial: 'Negativo a las 48 horas de incubación' },
      { id: 'antibiograma_sensibles', nombre: 'Antibióticos SENSIBLES', tipo: 'text', valorReferencial: 'Informado según cepa aislada' },
      { id: 'antibiograma_resistentes', nombre: 'Antibióticos RESISTENTES', tipo: 'text', valorReferencial: 'Informado según cepa aislada' },
    ],
  },
  {
    id: 'HECES_PARASITOLOGICO',
    nombre: 'Examen Coprológico / Thevenon (Sangre Oculta)',
    categoria: 'MICROBIOLOGÍA',
    metodo: 'Microscopía directa y Reacción Guayaco',
    muestra: 'Heces Frescas',
    parametros: [
      { id: 'thevenon', nombre: 'Thevenon (Sangre Oculta en Heces)', tipo: 'select', opciones: ['NEGATIVO', 'POSITIVO (+)'], valorReferencial: 'NEGATIVO' },
      { id: 'test_graham', nombre: 'Test de Graham (Oxiuros)', tipo: 'select', opciones: ['NEGATIVO', 'POSITIVO (+)'], valorReferencial: 'NEGATIVO' },
      { id: 'parasitologico_directo', nombre: 'Examen Parasitológico Directo', tipo: 'text', valorReferencial: 'No se observan quistes ni trofozoitos' },
    ],
  },

  // ==========================================
  // 4. INMUNOLOGÍA Y SEROLOGÍA
  // ==========================================
  {
    id: 'PRUEBAS_SEROLOGICAS',
    nombre: 'Descarte Serológico (HIV, Sífilis, Hepatitis B y C)',
    categoria: 'INMUNOLOGÍA',
    metodo: 'Inmunocromatografía / Aglutinación',
    muestra: 'Suero / Sangre Total',
    parametros: [
      { id: 'hiv', nombre: 'VIH 1 & 2 (Antígeno p24 / Anticuerpos)', tipo: 'select', opciones: ['NO REACTIVO', 'REACTIVO'], valorReferencial: 'NO REACTIVO' },
      { id: 'sifilis_vdrl', nombre: 'Sífilis (VDRL / RPR)', tipo: 'select', opciones: ['NO REACTIVO', 'REACTIVO (1:2)', 'REACTIVO (1:4)', 'REACTIVO (1:8)', 'REACTIVO (>1:16)'], valorReferencial: 'NO REACTIVO' },
      { id: 'hepatitis_b', nombre: 'Hepatitis B (HBsAg Antígeno de Superficie)', tipo: 'select', opciones: ['NO REACTIVO', 'REACTIVO'], valorReferencial: 'NO REACTIVO' },
      { id: 'hepatitis_c', nombre: 'Hepatitis C (Anti-HCV)', tipo: 'select', opciones: ['NO REACTIVO', 'REACTIVO'], valorReferencial: 'NO REACTIVO' },
    ],
  },
  {
    id: 'TOXICOLOGICO_ORINA',
    nombre: 'Examen Toxicológico en Orina (Cocaína / THC)',
    categoria: 'INMUNOLOGÍA',
    metodo: 'Inmunoensayo Competitivo Rápido',
    muestra: 'Orina Reciente',
    parametros: [
      { id: 'cocaina', nombre: 'Cocaína (COC - Corte: 300 ng/mL)', tipo: 'select', opciones: ['NEGATIVO', 'POSITIVO'], valorReferencial: 'NEGATIVO' },
      { id: 'thc', nombre: 'Marihuana (THC - Corte: 50 ng/mL)', tipo: 'select', opciones: ['NEGATIVO', 'POSITIVO'], valorReferencial: 'NEGATIVO' },
    ],
  },
  {
    id: 'HELICOBACTER_PYLORI',
    nombre: 'Helicobacter Pylori (Antígeno / Anticuerpos)',
    categoria: 'INMUNOLOGÍA',
    metodo: 'Inmunocromatografía',
    muestra: 'Suero / Heces',
    parametros: [
      { id: 'hp_resultado', nombre: 'Helicobacter Pylori', tipo: 'select', opciones: ['NEGATIVO', 'POSITIVO (+)'], valorReferencial: 'NEGATIVO' },
    ],
  },

  // ==========================================
  // 5. LIFOTRONIC ECL8000 (INMUNOENSAYO / MARCADORES)
  // ==========================================
  {
    id: 'TPSA',
    nombre: 'TPSA (Antígeno Prostático Específico Total)',
    categoria: 'LIFOTRONIC',
    metodo: 'Electroquimioluminiscencia (eCL8000)',
    muestra: 'Suero',
    parametros: [
      { id: 'tpsa_val', nombre: 'PSA Total', unidad: 'ng/mL', valorReferencial: '< 4.0 ng/mL' },
    ],
  },
  {
    id: 'FPSA',
    nombre: 'FPSA (Antígeno Prostático Libre)',
    categoria: 'LIFOTRONIC',
    metodo: 'Electroquimioluminiscencia (eCL8000)',
    muestra: 'Suero',
    parametros: [
      { id: 'fpsa_val', nombre: 'PSA Libre', unidad: 'ng/mL', valorReferencial: '0.00 – 0.93 ng/mL' },
      { id: 'ratio_psa', nombre: 'Relación Libre/Total (Ratio)', unidad: '%', valorReferencial: '> 18 % (Bajo riesgo)' },
    ],
  },
  {
    id: 'CEA',
    nombre: 'CEA (Antígeno Carcinoembrionario)',
    categoria: 'LIFOTRONIC',
    metodo: 'Electroquimioluminiscencia (eCL8000)',
    muestra: 'Suero',
    parametros: [
      { id: 'cea_val', nombre: 'CEA', unidad: 'ng/mL', valorReferencial: 'No fumadores: < 3.8 | Fumadores: < 5.5' },
    ],
  },
  {
    id: 'CA125',
    nombre: 'CA 125 (Marcador Ovárico)',
    categoria: 'LIFOTRONIC',
    metodo: 'Electroquimioluminiscencia (eCL8000)',
    muestra: 'Suero',
    parametros: [
      { id: 'ca125_val', nombre: 'CA 125', unidad: 'U/mL', valorReferencial: '< 35.0 U/mL' },
    ],
  },
  {
    id: 'CA19_9',
    nombre: 'CA 19-9 (Marcador Gastrointestinal / Páncreas)',
    categoria: 'LIFOTRONIC',
    metodo: 'Electroquimioluminiscencia (eCL8000)',
    muestra: 'Suero',
    parametros: [
      { id: 'ca19_9_val', nombre: 'CA 19-9', unidad: 'U/mL', valorReferencial: '< 37.0 U/mL' },
    ],
  },
  {
    id: 'AFP',
    nombre: 'AFP (Alfa-Fetoproteína)',
    categoria: 'LIFOTRONIC',
    metodo: 'Electroquimioluminiscencia (eCL8000)',
    muestra: 'Suero',
    parametros: [
      { id: 'afp_val', nombre: 'AFP', unidad: 'IU/mL', valorReferencial: '< 5.8 IU/mL' },
    ],
  },
];

export function getExamenByIdOrName(query: string): ExamenDefinicion | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();
  return CATALOGO_EXAMENES.find(
    (e) => e.id.toLowerCase() === q || e.nombre.toLowerCase() === q || q.includes(e.nombre.toLowerCase()) || e.nombre.toLowerCase().includes(q)
  );
}
