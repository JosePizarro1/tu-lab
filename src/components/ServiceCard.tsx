"use client";

import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="p-6 md:p-10 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_-15px_rgba(0,123,167,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,123,167,0.12)] hover:border-cerulean/20 transition-all duration-500 group">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-azure-mist border border-lab-border flex items-center justify-center rounded-2xl mb-6 md:mb-8 group-hover:bg-cerulean group-hover:border-cerulean transition-colors duration-500">
        <div className="text-cerulean group-hover:text-white transition-colors duration-500">
          {icon}
        </div>
      </div>
      <h3 className="font-jakarta text-xl md:text-2xl font-bold text-slate-800 mb-3 md:mb-4 group-hover:text-cerulean transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
