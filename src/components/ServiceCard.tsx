import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="p-10 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_-15px_rgba(0,123,167,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,123,167,0.12)] hover:border-cerulean/20 transition-all duration-500 group">
      <div className="w-14 h-14 bg-azure-mist border border-lab-border flex items-center justify-center rounded-2xl mb-8 group-hover:bg-cerulean group-hover:border-cerulean transition-colors duration-500">
        <div className="text-cerulean group-hover:text-white transition-colors duration-500">
          {icon}
        </div>
      </div>
      <h3 className="font-jakarta text-2xl font-bold text-slate-800 mb-4 group-hover:text-cerulean transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-500 text-base leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
