"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconSearch, 
  IconX, 
  IconBrandWhatsapp, 
  IconMicroscope, 
  IconActivity, 
  IconHomeHeart, 
  IconStethoscope,
  IconChevronRight,
  IconClock,
  IconDroplet,
  IconShieldCheck,
  IconSparkles,
  IconInfoCircle,
  IconSend
} from '@tabler/icons-react';

export interface ExamItem {
  id: string;
  name: string;
  category: 'Hematología' | 'Bioquímica' | 'Orina y Heces' | 'Hormonas y Tiroides' | 'Infecciosas' | 'Ecografías' | 'Servicio a Domicilio';
  subCategory?: string;
  summary: string;
  sampleType: string;
  deliveryTime: string;
  popular?: boolean;
}

const EXAMS_CATALOG: ExamItem[] = [
  // 1. ECOGRAFÍAS
  {
    id: 'eco-completa',
    name: 'Ecografía Abdominal Completa & Órganos',
    category: 'Ecografías',
    subCategory: 'Imágenes Diagnósticas',
    summary: 'Evaluación integral: Hígado, Vesícula Biliar, Páncreas, Bazo, Anillo Gástrico, Riñones y Vejiga.',
    sampleType: 'Ultrasonido de alta resolución',
    deliveryTime: 'Entrega Inmediata con informe e imágenes',
    popular: true
  },
  {
    id: 'eco-pelvica-utero',
    name: 'Ecografía Pélvica / Ginecológica (Útero y Ovarios)',
    category: 'Ecografías',
    subCategory: 'Salud de la Mujer',
    summary: 'Estudio de útero y ovarios para descarte de miomas, quistes y control ginecológico.',
    sampleType: 'Ultrasonido ginecológico',
    deliveryTime: 'Entrega Inmediata',
    popular: true
  },
  {
    id: 'eco-prostatica-vias',
    name: 'Ecografía Prostática y Vías Urinarias (Varones)',
    category: 'Ecografías',
    subCategory: 'Salud del Varón',
    summary: 'Evaluación de próstata, vejiga y residuo post-miccional para control preventivo en varones.',
    sampleType: 'Ultrasonido urológico',
    deliveryTime: 'Entrega Inmediata'
  },

  // 2. HEMATOLOGÍA
  {
    id: 'hemograma-completo',
    name: 'Hemograma Completo Automatizado',
    category: 'Hematología',
    subCategory: 'Perfil Sanguíneo',
    summary: 'Evalúa glóbulos rojos, blancos, plaquetas, hemoglobina y hematocrito. Diagnostica anemia e infecciones.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día (2 a 4 horas)',
    popular: true
  },
  {
    id: 'grupo-factor-rh',
    name: 'Grupo Sanguíneo y Factor RH',
    category: 'Hematología',
    subCategory: 'Tipificación',
    summary: 'Determina tu grupo sanguíneo (A, B, AB, O) y factor Rh (+ o -). Carnet oficial.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Entrega en 2 horas'
  },
  {
    id: 'coagulacion-sangria',
    name: 'Tiempo de Coagulación y Sangría (Pre-quirúrgico)',
    category: 'Hematología',
    subCategory: 'Hemostasia',
    summary: 'Evaluación de coagulación indispensable para cirugías, cesáreas y extracciones dentales.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día'
  },

  // 3. BIOQUÍMICA
  {
    id: 'glucosa',
    name: 'Glucosa en Sangre (Glicemia Basal)',
    category: 'Bioquímica',
    subCategory: 'Metabolismo',
    summary: 'Medición de azúcar en sangre para descarte y control de diabetes y resistencia a la insulina.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día (2 a 4 horas)',
    popular: true
  },
  {
    id: 'hba1c-glicosilada',
    name: 'Hemoglobina Glicosilada (HbA1c - Control Diabetes)',
    category: 'Bioquímica',
    subCategory: 'Control Metabólico',
    summary: 'Promedio de tus niveles de glucosa de los últimos 3 meses para control diabético de alta precisión.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día',
    popular: true
  },
  {
    id: 'perfil-lipidico',
    name: 'Perfil Lipídico Completo (Colesterol Total, HDL, LDL, Triglicéridos)',
    category: 'Bioquímica',
    subCategory: 'Riesgo Cardiovascular',
    summary: 'Control de grasas en sangre para prevención de infartos, hipertensión y salud del corazón.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día',
    popular: true
  },
  {
    id: 'perfil-hepatico',
    name: 'Perfil Hepático (TGO, TGP, Bilirrubinas, Fosfatasa)',
    category: 'Bioquímica',
    subCategory: 'Función Hepática',
    summary: 'Evaluación del hígado, vías biliares y descarte de hígado graso o alteraciones enzimáticas.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día'
  },
  {
    id: 'perfil-renal',
    name: 'Perfil Renal (Creatinina, Urea, Ácido Úrico)',
    category: 'Bioquímica',
    subCategory: 'Función Renal',
    summary: 'Valora la función y filtración de los riñones y descarte de ácido úrico alto (gota).',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día'
  },

  // 4. ORINA Y HECES
  {
    id: 'examen-orina',
    name: 'Examen de Orina Completo (Físico, Químico y Sedimento)',
    category: 'Orina y Heces',
    subCategory: 'Urianálisis',
    summary: 'Detecta infecciones urinarias (ITU), bacterias, cristales y alteraciones de las vías urinarias.',
    sampleType: 'Muestra de Orina (Frasco estéril)',
    deliveryTime: 'Mismo día (2 a 3 horas)',
    popular: true
  },
  {
    id: 'examen-heces-graham',
    name: 'Examen de Heces / Test de Graham (Parásitos)',
    category: 'Orina y Heces',
    subCategory: 'Parasitología',
    summary: 'Detección de parásitos y oxiuros. Muy solicitado para niños, escolares y chequeo digestivo.',
    sampleType: 'Muestra de Heces / Cinta Graham',
    deliveryTime: 'Mismo día (24 horas)',
    popular: true
  },
  {
    id: 'urocultivo-antibiograma',
    name: 'Urocultivo + Antibiograma Automatizado',
    category: 'Orina y Heces',
    subCategory: 'Microbiología',
    summary: 'Identifica la bacteria de la infección urinaria e indica el antibiótico exacto para curarla.',
    sampleType: 'Muestra de Orina estéril',
    deliveryTime: '48 a 72 horas (Cultivo bacteriano)'
  },

  // 5. HORMONAS Y PERFIL TIROIDEO
  {
    id: 'perfil-tiroideo',
    name: 'Perfil Tiroideo Completo (TSH, T3, T4 Libre)',
    category: 'Hormonas y Tiroides',
    subCategory: 'Endocrinología',
    summary: 'Diagnostica problemas de tiroides (hipotiroidismo, hipertiroidismo), fatiga y cambios de peso.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: '24 horas',
    popular: true
  },
  {
    id: 'beta-hcg-embarazo',
    name: 'Beta HCG (Prueba de Embarazo en Sangre 100% Certera)',
    category: 'Hormonas y Tiroides',
    subCategory: 'Salud Reproductiva',
    summary: 'Confirmación de embarazo en sangre de máxima exactitud desde los primeros días de retraso.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Entrega en 1 a 2 horas',
    popular: true
  },

  // 6. INFECCIOSAS Y DESPISTAJE
  {
    id: 'hiv-prueba-rapida',
    name: 'HIV / SIDA (Prueba Rápida de 4ta Generación)',
    category: 'Infecciosas',
    subCategory: 'Inmunoserología',
    summary: 'Detección de anticuerpos y antígeno p24 de VIH con absoluta confidencialidad y reserva.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: '1 a 2 horas (Confidencial)'
  },
  {
    id: 'vdrl-rpr-sifilis',
    name: 'VDRL / RPR (Despistaje de Sífilis)',
    category: 'Infecciosas',
    subCategory: 'Serología',
    summary: 'Prueba serológica de descarte rápido para gestantes, controles prenupciales y chequeos.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día'
  },
  {
    id: 'hepatitis-b-c',
    name: 'Perfil Hepatitis Viral B y C (HBsAg / Anti-HCV)',
    category: 'Infecciosas',
    subCategory: 'Marcadores Virales',
    summary: 'Descarte y control de Hepatitis B y C para protección y salud del hígado.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: '24 horas'
  },
  {
    id: 'helicobacter-pylori',
    name: 'Helicobacter Pylori (Prueba de Aliento C-14 / Sangre)',
    category: 'Infecciosas',
    subCategory: 'Gastroenterología',
    summary: 'Detección de la bacteria causante de gastritis, ardor y acidez. Prueba de aliento no invasiva.',
    sampleType: 'Prueba de Aliento C-14 / Sangre',
    deliveryTime: 'Mismo día',
    popular: true
  },

  // 7. SERVICIO A DOMICILIO
  {
    id: 'toma-domicilio-tacna',
    name: 'Toma de Muestras a Domicilio (Todo Tacna)',
    category: 'Servicio a Domicilio',
    subCategory: 'Atención en Casa',
    summary: 'Enfermería calificada acude a tu casa para extraer muestras de sangre, orina y cultivos sin colas.',
    sampleType: 'Atención en tu hogar',
    deliveryTime: 'Resultados digitales directos en WhatsApp',
    popular: true
  }
];

const CATEGORIES_LIST = [
  'Todos',
  'Hematología',
  'Bioquímica',
  'Orina y Heces',
  'Hormonas y Tiroides',
  'Infecciosas',
  'Ecografías',
  'Servicio a Domicilio'
];

// Íconos SVG vectoriales clínicos para los 9 órganos de ecografía
const ECOGRAFIA_ORGANS = [
  { 
    name: 'Hígado', 
    desc: 'Hígado graso y control',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Hígado en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10c0-3.5 3-6 7-6 5 0 9 3 9 7.5 0 3.5-3.5 6.5-8 6.5-4.5 0-8-3.5-8-8z" />
        <path d="M12 4v14" />
        <path d="M16 11c-1 2-3 3-4 3" />
      </svg>
    )
  },
  { 
    name: 'Vesícula', 
    desc: 'Cálculos y pólipos',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Vesícula en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-2.5 0-4.5 2-4.5 4.5 0 2 1.5 4.5 4.5 8.5 3-4 4.5-6.5 4.5-8.5C16.5 5 14.5 3 12 3z" />
        <path d="M10 18l2 3 2-3" />
        <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  { 
    name: 'Páncreas', 
    desc: 'Pancreatitis y tejido',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Páncreas en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14c3-6 8-6 12-4s6 4 6 1-3-4-8-4-8 4-10 7z" />
        <path d="M7 11c2-1 4-1 7 1" />
      </svg>
    )
  },
  { 
    name: 'Bazo', 
    desc: 'Estructura esplénica',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Bazo en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8c2-4 7-5 11-3s6 7 4 11-6 5-10 3-6-7-5-11z" />
        <path d="M10 8c1 2 2 4 1 7" />
      </svg>
    )
  },
  { 
    name: 'Anillo Gástrico', 
    desc: 'Control post-bariátrico',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Anillo Gástrico en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    )
  },
  { 
    name: 'Próstata (Varones)', 
    desc: 'Control prostático y vías',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Próstata en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  { 
    name: 'Útero (Mujeres)', 
    desc: 'Útero, ovarios y miomas',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Útero y Ovarios en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18v-8" />
        <path d="M12 10c-3 0-5-2-5-4s2-3 4-2c1 .5 1 2 1 2s0-1.5 1-2c2-1 4 0 4 2s-2 4-5 4z" />
        <path d="M9 18h6" />
        <path d="M12 18c-2 2-3 3-3 4h6c0-1-1-2-3-4z" />
      </svg>
    )
  },
  { 
    name: 'Riñones', 
    desc: 'Descarte de cálculos y quistes',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía Renal (Riñones) en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10c0-3 2-5 4.5-5S14 7 13 10c-1 3-3 4-3 7 0 2.5-1.5 4-3.5 4S3 18 3 14c0-2 1.5-3 3-4z" />
        <path d="M18 10c0-3-2-5-4.5-5S10 7 11 10c1 3 3 4 3 7 0 2.5 1.5 4 3.5 4s3.5-3 3.5-7c0-2-1.5-3-3-4z" />
      </svg>
    )
  },
  { 
    name: 'Vejiga', 
    desc: 'Paredes y residuo urinario',
    whatsappText: 'Hola UNIDOSLAB, deseo consultar precio y disponibilidad para la Ecografía de Vejiga en Tacna.',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3" />
        <path d="M8 6h8" />
        <path d="M8 6c-3 3-3 8 0 11s7 3 8 0 3-8 0-11" />
        <path d="M12 17v4" />
      </svg>
    )
  },
];

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeModalExam, setActiveModalExam] = useState<ExamItem | null>(null);

  const filteredExams = useMemo(() => {
    return EXAMS_CATALOG.filter(exam => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        exam.name.toLowerCase().includes(term) || 
        exam.summary.toLowerCase().includes(term) ||
        (exam.subCategory && exam.subCategory.toLowerCase().includes(term));
      
      const matchesCategory = selectedCategory === 'Todos' || exam.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getWhatsappUrl = (examName: string) => {
    const text = encodeURIComponent(`Hola UNIDOSLAB, deseo consultar precio y disponibilidad para el servicio: *${examName}* en Tacna.`);
    return `https://api.whatsapp.com/send/?phone=51952920616&text=${text}`;
  };

  const getCategoryCount = (catName: string) => {
    if (catName === 'Todos') return EXAMS_CATALOG.length;
    return EXAMS_CATALOG.filter(e => e.category === catName).length;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/40 pt-24 sm:pt-28 pb-16 font-plex">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* 1. HERO HEADER DE SERVICIOS */}
        <section className="relative bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-900/5 border border-slate-200/80 mb-8 overflow-hidden">
          
          {/* Acentos sutiles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500/8 via-rose-300/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-400/5 via-slate-100/50 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-50 text-[#FF5A5F] text-[11px] font-extrabold uppercase tracking-widest border border-red-100/80">
                <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-pulse"></span>
                <span>Laboratorio Clínico · Tacna, Perú</span>
              </div>

              <h1 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A4C] tracking-tight leading-[1.15]">
                Catálogo de Exámenes <br className="hidden sm:block" />
                <span className="text-[#FF5A5F]">y Servicios Médicos.</span>
              </h1>

              <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
                Resultados precisos, confidenciales y con entrega digital inmediata. Consulta y cotiza cualquiera de nuestros análisis clínicos o ecografías directamente por WhatsApp.
              </p>

              {/* 3 Badges de Valor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-[#FF5A5F] flex items-center justify-center shrink-0">
                    <IconClock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1E3A4C]">Resultados en el Día</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-[#FF5A5F] flex items-center justify-center shrink-0">
                    <IconShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1E3A4C]">Doble Control de Calidad</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <IconHomeHeart className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1E3A4C]">Atención a Domicilio</span>
                </div>
              </div>
            </div>

            {/* CTA Lateral WhatsApp */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 border border-slate-200/90 shadow-lg text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto shadow-inner">
                  <IconBrandWhatsapp className="w-7 h-7" />
                </div>
                <h2 className="font-jakarta text-base font-bold text-[#1E3A4C]">
                  ¿Buscas un examen específico?
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Escríbenos directamente y te brindamos precio, preparación y turno al instante.
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20consultar%20por%20un%20examen%20cl%C3%ADnico%20en%20Tacna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <IconBrandWhatsapp className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </motion.a>
              </div>
            </div>

          </div>
        </section>

        {/* 2. SECCIÓN ESPECIAL DESTACADA: ECOGRAFÍAS CON ÍCONOS SVG Y ACCIÓN DIRECTA */}
        <section className="bg-gradient-to-br from-white via-red-50/25 to-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-red-200/80 shadow-xl shadow-red-500/5 mb-8 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-red-100/80">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/70 text-[#FF5A5F] text-[10px] font-extrabold uppercase tracking-widest">
                <IconSparkles className="w-3.5 h-3.5" />
                <span>Servicio de Ecografías en Tacna</span>
              </div>
              <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#1E3A4C] tracking-tight">
                Ecografías Especializadas
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl">
                Diagnóstico por ultrasonido de alta resolución. Toca cualquier órgano para cotizar directamente por WhatsApp:
              </p>
            </div>

            <motion.a
              whileTap={{ scale: 0.97 }}
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20consultar%20por%20el%20servicio%20de%20Ecograf%C3%ADas%20en%20Tacna"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 self-start md:self-auto cursor-pointer transition-all flex items-center gap-1.5"
            >
              <IconBrandWhatsapp className="w-4 h-4" />
              <span>Cotizar Ecografías</span>
            </motion.a>
          </div>

          {/* Grilla de Órganos con Íconos SVG Médicos y Enlace Directo a WhatsApp */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3">
              Órganos y Zonas Evaluadas (Clic para consultar):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
              {ECOGRAFIA_ORGANS.map((organ, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  href={`https://api.whatsapp.com/send/?phone=51952920616&text=${encodeURIComponent(organ.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-white rounded-2xl border border-red-100/90 shadow-xs hover:shadow-md hover:border-red-300 transition-all flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#FF5A5F] group-hover:bg-[#FF5A5F] group-hover:text-white transition-colors flex items-center justify-center mb-2 shadow-xs">
                    {organ.iconSvg}
                  </div>
                  <span className="text-xs font-extrabold text-[#1E3A4C] leading-tight group-hover:text-[#FF5A5F] transition-colors">
                    {organ.name}
                  </span>
                  <span className="text-[9.5px] text-slate-400 mt-1 font-medium leading-tight">
                    {organ.desc}
                  </span>
                  <span className="mt-2 text-[9px] text-[#25D366] font-bold uppercase tracking-wider flex items-center gap-0.5">
                    <span>Consultar</span>
                    <IconChevronRight className="w-2.5 h-2.5" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. BUSCADOR Y FILTROS POR CATEGORÍAS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 border border-slate-200/80 mb-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0 border border-red-100">
                <IconSearch className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-jakarta text-lg sm:text-xl font-extrabold text-[#1E3A4C]">
                  Explora nuestros exámenes de laboratorio
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Selecciona una categoría o escribe el nombre del análisis que necesitas.
                </p>
              </div>
            </div>

            {/* Input Buscador */}
            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar glucosa, hemograma, orina..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium text-xs sm:text-sm focus:outline-none focus:border-[#FF5A5F] focus:bg-white transition-all"
              />
              <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pills de Categorías con Conteo */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
            {CATEGORIES_LIST.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 ${
                    isSelected 
                      ? 'bg-[#FF5A5F] text-white shadow-md shadow-red-500/20' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. LISTADO DE TARJETAS DE EXÁMENES CON BOTÓN DE WHATSAPP DIRECTO */}
        <section className="space-y-4">
          
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E3A4C]">
              Mostrando {filteredExams.length} análisis disponible(s)
            </span>
            {selectedCategory !== 'Todos' && (
              <button 
                onClick={() => setSelectedCategory('Todos')}
                className="text-xs font-bold text-[#FF5A5F] hover:underline cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>

          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExams.map((exam) => (
                <motion.div
                  key={exam.id}
                  layout
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200/80 hover:border-red-200/90 shadow-md shadow-slate-900/5 hover:shadow-xl hover:shadow-red-500/5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Header de la tarjeta */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#FF5A5F] border border-red-100 text-[10px] font-extrabold uppercase tracking-wider">
                        {exam.category}
                      </span>
                      {exam.popular && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ★ Muy Solicitado
                        </span>
                      )}
                    </div>

                    {/* Título y Resumen directo */}
                    <div>
                      <h4 className="font-jakarta text-base sm:text-lg font-extrabold text-[#1E3A4C] leading-snug">
                        {exam.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-medium">
                        {exam.summary}
                      </p>
                    </div>

                    {/* Metadatos rápidos */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
                        <IconDroplet className="w-3 h-3 text-[#FF5A5F]" />
                        <span>{exam.sampleType}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
                        <IconClock className="w-3 h-3 text-slate-400" />
                        <span>{exam.deliveryTime}</span>
                      </span>
                    </div>

                  </div>

                  {/* Botón Principal Directo a WhatsApp */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <motion.a
                      whileTap={{ scale: 0.97 }}
                      href={getWhatsappUrl(exam.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <IconBrandWhatsapp className="w-4 h-4 shrink-0" />
                      <span>Consultar por WhatsApp</span>
                    </motion.a>

                    <button
                      onClick={() => setActiveModalExam(exam)}
                      title="Ver información completa"
                      className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl transition-colors cursor-pointer shrink-0"
                    >
                      <IconInfoCircle className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#FF5A5F] flex items-center justify-center mx-auto">
                <IconSearch className="w-6 h-6" />
              </div>
              <h3 className="font-jakarta text-base font-bold text-[#1E3A4C]">
                No encontramos resultados para &quot;{searchTerm}&quot;
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Contamos con más de 1,000 pruebas especiales. Consúltanos directamente para ayudarte.
              </p>
              <a
                href={`https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20busco%20informaci%C3%B3n%20sobre:%20${encodeURIComponent(searchTerm)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md cursor-pointer hover:bg-[#20ba5a]"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          )}

        </section>

        {/* 5. BANNER FINAL: SERVICIO A DOMICILIO EN TACNA */}
        <section className="mt-12 bg-gradient-to-r from-red-50 via-white to-red-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-red-200/80 shadow-xl shadow-red-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white border border-red-200 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-md">
              <IconHomeHeart className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] block mb-1">
                Atención en la comodidad de tu hogar
              </span>
              <h3 className="font-jakarta text-xl sm:text-2xl font-extrabold text-[#1E3A4C]">
                ¿No puedes salir de casa? Vamos hacia ti.
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Toma de muestras de laboratorio a domicilio en todo Tacna.
              </p>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20toma%20de%20muestra%20a%20domicilio%20en%20Tacna"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <IconBrandWhatsapp className="w-5 h-5" />
            <span>Agendar Atención a Domicilio</span>
          </motion.a>
        </section>

      </div>

      {/* 6. MODAL DE INFORMACIÓN RÁPIDA */}
      <AnimatePresence>
        {activeModalExam && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Header del Modal */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-block">
                    {activeModalExam.category}
                  </span>
                  <h3 className="font-jakarta text-xl sm:text-2xl font-extrabold text-[#1E3A4C] mt-1">
                    {activeModalExam.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModalExam(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <IconX className="w-6 h-6" />
                </button>
              </div>

              {/* Resumen */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="font-extrabold text-[#1E3A4C] uppercase tracking-wider text-[11px] block">
                    ¿Para qué sirve este examen?
                  </span>
                  <p className="leading-relaxed text-slate-600 font-medium">
                    {activeModalExam.summary}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0">
                      <IconDroplet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-[#1E3A4C] block text-xs">Muestra requerida</span>
                      <span className="text-slate-600 text-xs font-medium">{activeModalExam.sampleType}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0">
                      <IconClock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-[#1E3A4C] block text-xs">Tiempo de entrega</span>
                      <span className="text-slate-600 text-xs font-medium">{activeModalExam.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp de Cotización Directa */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Consulta precios, preparación y agenda tu turno al instante:
                </p>
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={getWhatsappUrl(activeModalExam.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <IconBrandWhatsapp className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </motion.a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Services;
