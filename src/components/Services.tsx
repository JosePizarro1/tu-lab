"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconSearch, 
  IconFlask, 
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
  IconCircleCheck,
  IconAlertCircle,
  IconFileCertificate,
  IconDna,
  IconSparkles,
  IconFilter
} from '@tabler/icons-react';

export interface ExamItem {
  id: string;
  name: string;
  category: 'Hematología' | 'Bioquímica' | 'Orina y Heces' | 'Hormonas y Tiroides' | 'Infecciosas' | 'Ecografías' | 'Servicio a Domicilio';
  subCategory?: string;
  summary: string;
  sampleType: string;
  deliveryTime: string;
  preparation: string;
  highlights?: string[];
  priceNote: string;
  popular?: boolean;
}

const EXAMS_CATALOG: ExamItem[] = [
  // 1. ECOGRAFÍAS
  {
    id: 'eco-completa',
    name: 'Ecografía Abdominal Completa & Órganos',
    category: 'Ecografías',
    subCategory: 'Imágenes Diagnósticas',
    summary: 'Evaluación integral por ultrasonido de alta resolución: Hígado, Vesícula Biliar, Páncreas, Bazo, Anillo Gástrico, Riñones y Vejiga.',
    sampleType: 'Exploración por Ultrasonido',
    deliveryTime: 'Entrega inmediata (Informe + Imágenes digitales)',
    preparation: 'Ayuno de 6 a 8 horas antes del examen. Tomar 1 litro de agua 1 hora antes sin orinar.',
    highlights: ['Hígado y Vesícula', 'Páncreas y Bazo', 'Riñones y Vejiga', 'Anillo Gástrico'],
    priceNote: 'Incluye informe médico especializado e imágenes de alta definición.',
    popular: true
  },
  {
    id: 'eco-pelvica-utero',
    name: 'Ecografía Pélvica / Ginecológica (Útero y Ovarios)',
    category: 'Ecografías',
    subCategory: 'Salud de la Mujer',
    summary: 'Estudio de útero, endometrio y ovarios para descarte de miomas, quistes, pólipos y control ginecológico.',
    sampleType: 'Ultrasonido pélvico',
    deliveryTime: 'Entrega inmediata',
    preparation: 'Tomar 4 a 5 vasos de agua 1 hora antes de la cita para tener la vejiga llena.',
    highlights: ['Útero (Mujeres)', 'Ovarios y Endometrio', 'Detección de quistes'],
    priceNote: 'Atención con privacidad, calidez y médicos ecografistas certificados.',
    popular: true
  },
  {
    id: 'eco-prostatica-vias',
    name: 'Ecografía Prostática y Vías Urinarias (Varones)',
    category: 'Ecografías',
    subCategory: 'Salud del Varón',
    summary: 'Evaluación de tamaño y morfología de la próstata, vejiga y residuo post-miccional en varones.',
    sampleType: 'Ultrasonido urológico',
    deliveryTime: 'Entrega inmediata',
    preparation: 'Vejiga llena al momento del examen (beber 1L de agua 1 hora antes).',
    highlights: ['Próstata (Varones)', 'Vejiga y Residuo', 'Riñones'],
    priceNote: 'Recomendado para control preventivo anual en varones a partir de los 40 años.'
  },

  // 2. HEMATOLOGÍA
  {
    id: 'hemograma-completo',
    name: 'Hemograma Completo Automatizado',
    category: 'Hematología',
    subCategory: 'Perfil Sanguíneo',
    summary: 'Conteo completo de glóbulos rojos, glóbulos blancos, plaquetas, hemoglobina y hematocrito. Diagnostica anemia, infecciones e inflamaciones.',
    sampleType: 'Muestra de Sangre (EDTA)',
    deliveryTime: 'Mismo día (2 a 4 horas)',
    preparation: 'Ayuno preferencial de 4 a 6 horas. Mantenerse bien hidratado.',
    highlights: ['Glóbulos Rojos y Blancos', 'Hemoglobina y Hematocrito', 'Plaquetas'],
    priceNote: 'Procesado en analizadores hematológicos automatizados de doble control.',
    popular: true
  },
  {
    id: 'grupo-factor-rh',
    name: 'Grupo Sanguíneo y Factor RH',
    category: 'Hematología',
    subCategory: 'Tipificación',
    summary: 'Determina el tipo de sangre (A, B, AB, O) y el factor Rh (positivo o negativo). Requerido para cirugías, licencias y trámites.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Entrega en 2 horas',
    preparation: 'No requiere ayuno estricto.',
    highlights: ['Tipo ABO', 'Factor Rh +/-', 'Carnet digital'],
    priceNote: 'Entrega rápida con certificación oficial.'
  },
  {
    id: 'coagulacion-sangria',
    name: 'Tiempo de Coagulación y Tiempo de Sangría (Perfil Pre-quirúrgico)',
    category: 'Hematología',
    subCategory: 'Hemostasia',
    summary: 'Evalúa la capacidad del organismo para formar coágulos y detener hemorragias. Esencial previo a cualquier cirugía o extracción dental.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día',
    preparation: 'Ayuno de 4 a 6 horas.',
    highlights: ['Tiempo de Coagulación', 'Tiempo de Sangría', 'Apto pre-operatorio'],
    priceNote: 'Indispensable para cirugías, cesáreas y procedimientos odontológicos.'
  },

  // 3. BIOQUÍMICA
  {
    id: 'glucosa',
    name: 'Glucosa en Sangre (Glicemia Basal)',
    category: 'Bioquímica',
    subCategory: 'Metabolismo',
    summary: 'Medición de los niveles de azúcar en sangre para detección oportuna y seguimiento de diabetes mellitus y resistencia a la insulina.',
    sampleType: 'Muestra de Sangre (Suero)',
    deliveryTime: 'Mismo día (2 a 4 horas)',
    preparation: 'Ayuno estricto de 8 a 12 horas previas a la toma de muestra.',
    highlights: ['Descarte de Diabetes', 'Resistencia a la Insulina'],
    priceNote: 'Prueba básica incluida en todos los perfiles de chequeo general.',
    popular: true
  },
  {
    id: 'hba1c-glicosilada',
    name: 'Hemoglobina Glicosilada (HbA1c - Control de Diabetes)',
    category: 'Bioquímica',
    subCategory: 'Control Metabólico',
    summary: 'Muestra el promedio de niveles de glucosa en sangre de los últimos 3 meses. El estándar de oro para el control del paciente diabético.',
    sampleType: 'Muestra de Sangre (Sangre total)',
    deliveryTime: 'Mismo día',
    preparation: 'No requiere ayuno estricto (se aconseja ayuno ligero).',
    highlights: ['Promedio 3 meses', 'Control de Diabetes', 'Máxima precisión'],
    priceNote: 'Permite saber si tu tratamiento para la diabetes está funcionando.',
    popular: true
  },
  {
    id: 'perfil-lipidico',
    name: 'Perfil Lipídico Completo (Colesterol Total, HDL, LDL, VLDL y Triglicéridos)',
    category: 'Bioquímica',
    subCategory: 'Riesgo Cardiovascular',
    summary: 'Evalúa grasas en sangre para prevenir infartos, hipertensión y enfermedades arteriales.',
    sampleType: 'Muestra de Sangre (Suero)',
    deliveryTime: 'Mismo día',
    preparation: 'Ayuno de 10 a 12 horas. Evitar comidas grasas y alcohol la noche previa.',
    highlights: ['Colesterol Total y Fracciones', 'Triglicéridos', 'Riesgo Cardiovascular'],
    priceNote: 'Fundamental para el cuidado del corazón y chequeo preventivo.',
    popular: true
  },
  {
    id: 'perfil-hepatico',
    name: 'Perfil Hepático Completo (TGO, TGP, Bilirrubinas, Fosfatasa Alcalina)',
    category: 'Bioquímica',
    subCategory: 'Función Hepática',
    summary: 'Valora la salud del hígado, vías biliares y descarte de hígado graso, hepatitis o alteraciones enzimáticas.',
    sampleType: 'Muestra de Sangre (Suero)',
    deliveryTime: 'Mismo día',
    preparation: 'Ayuno de 8 horas.',
    highlights: ['Transaminasas TGO / TGP', 'Bilirrubina Total y Fraccionada', 'Fosfatasa Alcalina'],
    priceNote: 'Recomendado si sientes pesadez, tomas medicamentos continuos o control anual.'
  },
  {
    id: 'perfil-renal',
    name: 'Perfil Renal (Creatinina, Urea y Ácido Úrico)',
    category: 'Bioquímica',
    subCategory: 'Función Renal',
    summary: 'Evalúa la capacidad de filtración y depuración de los riñones, descartando insuficiencia renal o niveles elevados de ácido úrico (gota).',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Mismo día',
    preparation: 'Ayuno de 8 horas. Evitar ejercicio extenuante el día anterior.',
    highlights: ['Creatinina Sérica', 'Urea', 'Ácido Úrico (Descarte de Gota)'],
    priceNote: 'Vital en hipertensos, diabéticos y chequeos médicos generales.'
  },

  // 4. ORINA Y HECES
  {
    id: 'examen-orina',
    name: 'Examen de Orina Completo (Físico, Químico y Sedimento)',
    category: 'Orina y Heces',
    subCategory: 'Urianálisis',
    summary: 'Detecta infecciones urinarias (ITU), presencia de hematuria, bacterias, leucocitos, cristales y cálculos renales.',
    sampleType: 'Primera orina de la mañana (chorro medio)',
    deliveryTime: 'Mismo día (2 a 3 horas)',
    preparation: 'Higiene genital previa con agua antes de recolectar el chorro intermedio en frasco estéril.',
    highlights: ['Infección Urinaria (ITU)', 'Sedimento y Cristales', 'Cálculos'],
    priceNote: 'Frascos estériles disponibles gratuitamente en nuestras sedes.',
    popular: true
  },
  {
    id: 'examen-heces-graham',
    name: 'Examen de Heces Parasitológico / Test de Graham',
    category: 'Orina y Heces',
    subCategory: 'Parasitología',
    summary: 'Detección de parásitos intestinales (quistes, trofozoítos, larvas) y oxiuros (Test de Graham). Muy solicitado para niños, escolares y chequeo digestivo.',
    sampleType: 'Muestra fecal en frasco / Cinta adhesiva matutina (Graham)',
    deliveryTime: 'Mismo día (24 horas)',
    preparation: 'Recolectar muestra en frasco estéril. Para Graham, aplicar la cinta antes del baño matutino.',
    highlights: ['Parásitos en Niños', 'Test de Graham para Oxiuros', 'Salud digestiva'],
    priceNote: 'Recomendado para toda la familia cada 6 meses.',
    popular: true
  },
  {
    id: 'urocultivo-antibiograma',
    name: 'Urocultivo + Antibiograma Automatizado',
    category: 'Orina y Heces',
    subCategory: 'Microbiología',
    summary: 'Identifica la bacteria causante de la infección urinaria y señala exactamente qué antibiótico es el más efectivo para curarla.',
    sampleType: 'Orina recolectada en condiciones estériles',
    deliveryTime: '48 a 72 horas (por tiempo de cultivo bacteriano)',
    preparation: 'No haber tomado antibióticos al menos 48h antes (salvo indicación médica). Chorro medio.',
    highlights: ['Aislamiento Bacteriano', 'Sensibilidad a Antibióticos', 'Cura de ITU recurrente'],
    priceNote: 'Evita tratamientos fallidos con el antibiograma preciso.'
  },

  // 5. HORMONAS Y PERFIL TIROIDEO
  {
    id: 'perfil-tiroideo',
    name: 'Perfil Tiroideo Completo (TSH, T3 y T4 Libre)',
    category: 'Hormonas y Tiroides',
    subCategory: 'Endocrinología',
    summary: 'Diagnostica alteraciones de la glándula tiroides (Hipotiroidismo o Hipertiroidismo), cansancio crónico, variaciones de peso y caída de cabello.',
    sampleType: 'Muestra de Sangre (Suero)',
    deliveryTime: '24 horas',
    preparation: 'Ayuno de 8 horas. No tomar levotiroxina antes de la extracción si es paciente medicado.',
    highlights: ['TSH Ultrasensible', 'T4 Libre', 'T3 Total'],
    priceNote: 'Procesado por Quimioluminiscencia de alta sensibilidad diagnóstica.',
    popular: true
  },
  {
    id: 'beta-hcg-embarazo',
    name: 'Beta HCG Cualitativa / Cuantitativa (Prueba de Embarazo en Sangre)',
    category: 'Hormonas y Tiroides',
    subCategory: 'Salud Reproductiva',
    summary: 'Prueba en sangre de máxima exactitud (100% certera) para confirmar embarazo desde los primeros días de retraso o semanas de gestación.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Entrega en 1 a 2 horas (Urgente disponible)',
    preparation: 'No requiere ayuno estricto.',
    highlights: ['Confirmación Temprana', 'Cuantificación de Semanas', '100% Precisión'],
    priceNote: 'Resultados confidenciales con entrega digital inmediata a tu WhatsApp o correo.',
    popular: true
  },

  // 6. INFECCIOSAS Y DESPISTAJE
  {
    id: 'hiv-prueba-rapida',
    name: 'HIV / SIDA (Prueba Rápida de 4ta Generación / Despistaje)',
    category: 'Infecciosas',
    subCategory: 'Inmunoserología',
    summary: 'Detección de anticuerpos y antígeno p24 de VIH con la mayor confidencialidad, discreción y rapidez.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: 'Entrega confidencial en 1 a 2 horas',
    preparation: 'No requiere ayuno estricto.',
    highlights: ['Antígeno p24 + Anticuerpos', '100% Confidencial', 'Entrega Rápida'],
    priceNote: 'Atención con absoluta reserva profesional y entrega segura.'
  },
  {
    id: 'vdrl-rpr-sifilis',
    name: 'VDRL / RPR (Despistaje Serológico de Sífilis)',
    category: 'Infecciosas',
    subCategory: 'Serología',
    summary: 'Prueba serológica no treponémica para descarte y seguimiento de sífilis. Muy solicitada para controles prenupciales, gestantes y cirugías.',
    sampleType: 'Muestra de Sangre (Suero)',
    deliveryTime: 'Mismo día',
    preparation: 'Ayuno de 4 horas.',
    highlights: ['Despistaje de Sífilis', 'Control Prenupcial y Gestantes'],
    priceNote: 'Resultado confiable y validado por tecnólogos médicos.'
  },
  {
    id: 'hepatitis-b-c',
    name: 'Perfil Hepatitis Viral B y C (HBsAg / Anti-HCV)',
    category: 'Infecciosas',
    subCategory: 'Marcadores Virales',
    summary: 'Detección del antígeno de superficie de Hepatitis B y anticuerpos contra Hepatitis C para protección hepática.',
    sampleType: 'Muestra de Sangre',
    deliveryTime: '24 horas',
    preparation: 'Ayuno de 6 horas.',
    highlights: ['HBsAg Hepatitis B', 'Anti-HCV Hepatitis C', 'Descarte Viral'],
    priceNote: 'Recomendado para personal de salud, chequeos ocupacionales y preventivos.'
  },
  {
    id: 'helicobacter-pylori',
    name: 'Helicobacter Pylori (Prueba de Aliento C-14 / Serología / Heces)',
    category: 'Infecciosas',
    subCategory: 'Gastroenterología',
    summary: 'Detección de la bacteria Helicobacter Pylori, principal causante de gastritis crónica, acidez, reflujo y úlceras gástricas.',
    sampleType: 'Prueba de Aliento C-14 / Muestra de Sangre o Heces',
    deliveryTime: '24 horas (Aliento entrega el mismo día)',
    preparation: 'Ayuno de 8 horas. No tomar antibióticos ni inhibidores de bomba (omeprazol) 15 días antes para prueba de aliento.',
    highlights: ['Prueba de Aliento C-14', 'Diagnóstico de Gastritis', 'No invasiva'],
    priceNote: 'La prueba de aliento es el método no invasivo más preciso del mercado.',
    popular: true
  },

  // 7. SERVICIO A DOMICILIO
  {
    id: 'toma-domicilio-tacna',
    name: 'Servicio de Toma de Muestras a Domicilio (Tacna)',
    category: 'Servicio a Domicilio',
    subCategory: 'Atención en Casa',
    summary: 'Personal de enfermería y tecnología médica calificado se traslada a tu hogar en Tacna para la toma de muestras de sangre, orina y cultivos.',
    sampleType: 'Atención en la comodidad de tu hogar',
    deliveryTime: 'Resultados digitales directos en WhatsApp / Web',
    preparation: 'Te indicamos los requisitos de ayuno y preparación según tus exámenes solicitados.',
    highlights: ['Ideal para Adultos Mayores y Niños', 'Puntualidad en Tacna', 'Sin colas ni tráfico'],
    priceNote: 'Cobertura en todo Tacna y distritos. Agéndalo con anticipación por WhatsApp.',
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

const ECOGRAFIA_ORGANS = [
  { name: 'Hígado', icon: '🫀', desc: 'Descarte de hígado graso y hepatomegalia' },
  { name: 'Vesícula', icon: '🟢', desc: 'Detección de cálculos biliares y pólipos' },
  { name: 'Páncreas', icon: '🧬', desc: 'Evaluación de pancreatitis y morfología' },
  { name: 'Bazo', icon: '🔬', desc: 'Medición esplénica y estructura' },
  { name: 'Anillo Gástrico', icon: '⭕', desc: 'Control de balón y anillo gástrico' },
  { name: 'Próstata (Varones)', icon: '👨‍⚕️', desc: 'Evaluación del tamaño y residuo vesical' },
  { name: 'Útero (Mujeres)', icon: '👩‍⚕️', desc: 'Descarte de miomas, quistes y endometrio' },
  { name: 'Riñones', icon: '🫘', desc: 'Detección de quistes y litiasis renal' },
  { name: 'Vejiga', icon: '💧', desc: 'Capacidad, paredes y residuo urinario' },
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
        (exam.subCategory && exam.subCategory.toLowerCase().includes(term)) ||
        (exam.highlights && exam.highlights.some(h => h.toLowerCase().includes(term)));
      
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

        {/* 1. HERO HEADER DE SERVICIOS (Estilo Blanco Pulcro y Coral UNIDOSLAB) */}
        <section className="relative bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-900/5 border border-slate-200/80 mb-10 overflow-hidden">
          
          {/* Acentos de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500/8 via-rose-300/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-400/5 via-slate-100/50 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-50 text-[#FF5A5F] text-[11px] font-extrabold uppercase tracking-widest border border-red-100/80">
                <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-pulse"></span>
                <span>Tecnología Diagnóstica · Tacna, Perú</span>
              </div>

              <h1 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A4C] tracking-tight leading-[1.15]">
                Catálogo de Exámenes <br className="hidden sm:block" />
                <span className="text-[#FF5A5F]">y Servicios Médicos.</span>
              </h1>

              <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
                Resultados precisos, confidenciales y con entrega digital inmediata. Ponemos a tu disposición tecnología automatizada de alta gama y atención médica humana en Tacna.
              </p>

              {/* 3 Badges de Valor Clínico */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-[#FF5A5F] flex items-center justify-center shrink-0">
                    <IconClock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1E3A4C]">Entrega en el Día</span>
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
                  <span className="text-xs font-bold text-[#1E3A4C]">Toma a Domicilio</span>
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
                  Cotiza tus análisis o agenda tu toma de muestra a domicilio al instante por WhatsApp.
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
                  <span>Consultar con Asesor</span>
                </motion.a>
              </div>
            </div>

          </div>
        </section>

        {/* 2. SECCIÓN ESPECIAL DESTACADA: ECOGRAFÍAS (Banner tal cual del Home) */}
        <section className="bg-gradient-to-br from-white via-red-50/30 to-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-red-200/80 shadow-xl shadow-red-500/5 mb-10 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-red-100/80">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/70 text-[#FF5A5F] text-[10px] font-extrabold uppercase tracking-widest">
                <IconSparkles className="w-3.5 h-3.5" />
                <span>Servicio Especializado de Imágenes</span>
              </div>
              <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#1E3A4C] tracking-tight">
                Ecografías Especializadas en Tacna
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl">
                Diagnóstico por ultrasonido de alta resolución con entrega inmediata de informe médico e imágenes digitales.
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('Ecografías')}
              className="px-5 py-2.5 bg-[#FF5A5F] hover:bg-[#E84A4F] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-500/20 self-start md:self-auto cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>Ver Ecografías</span>
              <IconChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Grilla de Órganos Evaluados del Banner */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3">
              Órganos y Zonas Evaluadas:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
              {ECOGRAFIA_ORGANS.map((organ, i) => (
                <div 
                  key={i}
                  className="p-3 bg-white rounded-2xl border border-red-100/70 shadow-xs hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center group cursor-pointer"
                  onClick={() => setSelectedCategory('Ecografías')}
                >
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{organ.icon}</span>
                  <span className="text-xs font-extrabold text-[#1E3A4C] leading-tight">
                    {organ.name}
                  </span>
                </div>
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
                  Filtra por especialidad clínica o escribe el nombre del análisis.
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

        {/* 4. LISTADO DE TARJETAS DE EXÁMENES (Diseño UI/UX Premium Blanco y Coral) */}
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
                Limpiar filtro
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

                    {/* Título y Resumen */}
                    <div>
                      <h4 className="font-jakarta text-base sm:text-lg font-extrabold text-[#1E3A4C] leading-snug">
                        {exam.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-medium">
                        {exam.summary}
                      </p>
                    </div>

                    {/* Badges de Información Rápida */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <IconDroplet className="w-3.5 h-3.5 text-[#FF5A5F] shrink-0" />
                        <span className="truncate"><strong>Muestra:</strong> {exam.sampleType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate"><strong>Entrega:</strong> {exam.deliveryTime}</span>
                      </div>
                    </div>

                  </div>

                  {/* Botones de acción */}
                  <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => setActiveModalExam(exam)}
                      className="w-full py-2.5 px-3 bg-white border border-slate-200 hover:border-slate-300 text-[#1E3A4C] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Ver detalles</span>
                    </button>

                    <a
                      href={getWhatsappUrl(exam.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <IconBrandWhatsapp className="w-3.5 h-3.5" />
                      <span>Cotizar</span>
                    </a>
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
                Comodidad y Cuidado Profesional
              </span>
              <h3 className="font-jakarta text-xl sm:text-2xl font-extrabold text-[#1E3A4C]">
                ¿No puedes salir de casa? Vamos hacia ti.
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Toma de muestras de laboratorio y ecografías coordinadas a domicilio en todo Tacna.
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

      {/* 6. MODAL DE FICHA TÉCNICA MÉDICA */}
      <AnimatePresence>
        {activeModalExam && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 max-h-[90vh] overflow-y-auto"
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

              {/* Resumen Clínico */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="font-extrabold text-[#1E3A4C] uppercase tracking-wider text-[11px] block">
                    Utilidad y Descripción:
                  </span>
                  <p className="leading-relaxed text-slate-600 font-medium">
                    {activeModalExam.summary}
                  </p>
                </div>

                {/* Especificaciones */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0">
                      <IconDroplet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-[#1E3A4C] block text-xs">Tipo de Muestra</span>
                      <span className="text-slate-600 text-xs font-medium">{activeModalExam.sampleType}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0">
                      <IconClock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-[#1E3A4C] block text-xs">Tiempo Estimado de Entrega</span>
                      <span className="text-slate-600 text-xs font-medium">{activeModalExam.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <IconAlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-amber-900 block text-xs">Preparación del Paciente</span>
                      <span className="text-amber-800 text-xs font-medium leading-relaxed">{activeModalExam.preparation}</span>
                    </div>
                  </div>
                </div>

                {activeModalExam.highlights && (
                  <div>
                    <span className="font-extrabold text-[#1E3A4C] text-[11px] uppercase tracking-wider block mb-2">
                      Parámetros Destacados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalExam.highlights.map((h, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                          • {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón WhatsApp de Cotización Directa */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  {activeModalExam.priceNote}
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
                  <span>Consultar Precio y Cita por WhatsApp</span>
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
