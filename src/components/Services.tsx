"use client";

import React, { useState } from 'react';
import { 
  IconSearch, 
  IconFlask, 
  IconX, 
  IconBrandWhatsapp, 
  IconMicroscope, 
  IconActivity, 
  IconHomeHeart, 
  IconStethoscope,
  IconChevronRight
} from '@tabler/icons-react';

interface ExamItem {
  id: string;
  name: string;
  category: 'Exámenes' | 'Ecografías' | 'Servicio a Domicilio' | 'Consultas Médicas';
  summary: string;
  sampleType: string;
  deliveryTime: string;
  preparation: string;
  priceNote: string;
}

const EXAMS_CATALOG: ExamItem[] = [
  {
    id: 'hemograma',
    name: 'Hemograma Completo',
    category: 'Exámenes',
    summary: 'Evalúa componentes y células de la sangre (glóbulos rojos, blancos, hemoglobina, plaquetas).',
    sampleType: 'Sangre',
    deliveryTime: 'Menos de 24 horas',
    preparation: 'No requiere ayuno estricto (se recomiendan 4h).',
    priceNote: 'Consulta tarifa promocional y disponibilidad en Tacna.'
  },
  {
    id: 'hcg-beta',
    name: 'hCG Sub Unidad Beta (Cualitativo / Cuantitativo)',
    category: 'Exámenes',
    summary: 'Detección y cuantificación hormonal de embarazo en sangre.',
    sampleType: 'Sangre',
    deliveryTime: 'Entregas el mismo día',
    preparation: 'No requiere preparación.',
    priceNote: 'Consulta tarifa especial en sede Tacna.'
  },
  {
    id: 'helicobacter',
    name: 'Helicobacter Pylori C-14 (Prueba de Aliento)',
    category: 'Exámenes',
    summary: 'Prueba no invasiva de aliento para la detección de infección gástrica activa por H. pylori.',
    sampleType: 'Aire espirado',
    deliveryTime: '24 horas',
    preparation: 'Ayuno obligatorio de 8 horas. No tomar antibióticos 15 días antes.',
    priceNote: 'Agéndalo con atención rápida vía WhatsApp.'
  },
  {
    id: 'tgp-tgo',
    name: 'Transaminasa Glutámico Pirúvica (TGP / TGO)',
    category: 'Exámenes',
    summary: 'Evaluación de la función hepática y diagnóstico de afecciones enzimáticas del hígado.',
    sampleType: 'Sangre',
    deliveryTime: '24 horas',
    preparation: 'Ayuno de 8 horas.',
    priceNote: 'Incluido en perfiles de control anual.'
  },
  {
    id: 'espermatograma',
    name: 'Espermatograma',
    category: 'Exámenes',
    summary: 'Estudio de fertilidad masculina: conteo, motilidad y morfología espermática.',
    sampleType: 'Muestra semen',
    deliveryTime: '24 - 48 horas',
    preparation: 'Abstinencia sexual previa de 3 a 5 días.',
    priceNote: 'Atención previa cita recomendada.'
  },
  {
    id: 'eco-abdominal',
    name: 'Ecografía Abdominal Completa',
    category: 'Ecografías',
    summary: 'Evaluación por imágenes de hígado, vesícula, riñones, páncreas y bazo.',
    sampleType: 'Imágenes ecográficas',
    deliveryTime: 'Entrega inmediata de informe e imágenes',
    preparation: 'Ayuno previo de 6 a 8 horas y tomar 1L de agua 1 hora antes.',
    priceNote: 'Consulta turnos y ecografistas en Tacna.'
  },
  {
    id: 'eco-obstetrica',
    name: 'Ecografía Obstétrica / 4D',
    category: 'Ecografías',
    summary: 'Seguimiento del desarrollo fetal en alta resolución y ecografía 4D.',
    sampleType: 'Imágenes ecográficas',
    deliveryTime: 'Entrega inmediata',
    preparation: 'Sin preparación previa especial.',
    priceNote: 'Incluye informe detallado e imágenes.'
  },
  {
    id: 'domicilio-toma',
    name: 'Toma de Muestras a Domicilio',
    category: 'Servicio a Domicilio',
    summary: 'Personal de enfermería capacitado acude a tu domicilio para la extracción de sangre u orina.',
    sampleType: 'Atención médica en casa',
    deliveryTime: 'Resultados digitales en 24h',
    preparation: 'Se coordinan indicaciones según los exámenes requeridos.',
    priceNote: 'Cubre Tacna y distritos aledaños.'
  },
  {
    id: 'consulta-medica',
    name: 'Consulta Médica General & Especializada',
    category: 'Consultas Médicas',
    summary: 'Evaluación médica integral, interpretación de análisis clínicos y prescripción de tratamiento.',
    sampleType: 'Atención presencial / telemedicina',
    deliveryTime: 'Atención en el día',
    preparation: 'Traer DNI y exámenes previos si los tuviera.',
    priceNote: 'Reserva tu cita al instante por WhatsApp.'
  }
];

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeModalExam, setActiveModalExam] = useState<ExamItem | null>(null);

  const categories = ['Todos', 'Exámenes', 'Ecografías', 'Servicio a Domicilio', 'Consultas Médicas'];

  const filteredExams = EXAMS_CATALOG.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exam.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || exam.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getWhatsappUrl = (examName: string) => {
    const text = encodeURIComponent(`Hola UNIDOSLAB, deseo información y precios para el servicio: ${examName} en Tacna.`);
    return `https://api.whatsapp.com/send/?phone=51952920616&text=${text}`;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-10 md:py-16 font-plex">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Banner Superior Estilo Multilab Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cerulean text-white rounded-3xl p-6 md:p-10 shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-azure-mist">
              <span className="w-2 h-2 rounded-full bg-cerulean animate-pulse"></span>
              Atención en Tacna & Sedes
            </div>
            <h2 className="font-jakarta text-3xl md:text-4xl font-extrabold tracking-tight">
              Catálogo de Exámenes y Servicios
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              Ofrecemos más de 1,000 exámenes clínicos, ecografías, consultas médicas y toma de muestras a domicilio.
            </p>
          </div>

          <a 
            href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20consultar%20por%20atenci%C3%B3n%20en%20Tacna"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <IconBrandWhatsapp className="w-5 h-5" />
            <span>Consultar a Domicilio / Tacna</span>
          </a>
        </div>

        {/* Buscador y Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cerulean/10 text-cerulean rounded-xl">
              <IconFlask className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-jakarta text-lg font-bold text-slate-800">
                Busca tu examen o servicio médico
              </h3>
              <p className="text-xs text-slate-400">
                Ingresa el nombre del examen o selecciona una categoría.
              </p>
            </div>
          </div>

          {/* Input con Botón */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ej. Hemograma, Ecografía, Helicobacter..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:border-cerulean focus:bg-white transition-all"
              />
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Pills de Categorías */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-cerulean text-white shadow-md shadow-cerulean/20' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listado Estilo Tabla Multilab */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h4 className="font-jakarta text-base font-extrabold text-slate-800">
              Exámenes y Servicios Recomendados
            </h4>
            <span className="text-xs font-bold text-slate-400">
              {filteredExams.length} servicio(s) encontrado(s)
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <div 
                  key={exam.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {exam.category}
                      </span>
                    </div>
                    <h5 className="font-jakarta text-base font-bold text-slate-800">
                      {exam.name}
                    </h5>
                    <p className="text-xs text-slate-500 max-w-2xl">
                      {exam.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveModalExam(exam)}
                    className="px-5 py-2.5 bg-white border border-slate-200 hover:border-cerulean text-cerulean hover:bg-cerulean hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Ver detalle</span>
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <p className="text-sm font-medium">No se encontraron servicios que coincidan con tu búsqueda.</p>
                <a 
                  href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20busco%20un%20examen%20espec%C3%ADfico" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:underline"
                >
                  <IconBrandWhatsapp className="w-4 h-4" />
                  <span>Consultar con un asesor por WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal de Detalle Estilo Multilab */}
      {activeModalExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cerulean bg-cerulean/10 px-2.5 py-1 rounded-md">
                  {activeModalExam.category}
                </span>
                <h3 className="font-jakarta text-2xl font-extrabold text-slate-900 mt-2">
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
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">Resumen:</span>
                <p className="leading-relaxed">{activeModalExam.summary}</p>
              </div>

              {/* Especificaciones */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-cerulean mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-bold text-slate-900">Tipo de Muestra:</span>{' '}
                    <span className="text-slate-600">{activeModalExam.sampleType}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-cerulean mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-bold text-slate-900">Tiempo de Entrega:</span>{' '}
                    <span className="text-slate-600">{activeModalExam.deliveryTime}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-cerulean mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-bold text-slate-900">Preparación Necesaria:</span>{' '}
                    <span className="text-slate-600">{activeModalExam.preparation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloque WhatsApp / Cotización Tacna */}
            <div className="pt-4 border-t border-slate-100 space-y-3 text-center">
              <p className="text-xs text-slate-500 font-medium">
                {activeModalExam.priceNote}
              </p>
              <a 
                href={getWhatsappUrl(activeModalExam.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <IconBrandWhatsapp className="w-5 h-5" />
                <span>Consultar Precio y Cita por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
