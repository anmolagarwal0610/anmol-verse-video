
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // Added MapPin for a generic location feel

const ContactDetails = () => {
  const contactItems = [
    {
      icon: <Mail className="h-6 w-6 text-indigo-500" />,
      label: "Email Us",
      value: "hello@dumblabs.ai",
      href: "mailto:hello@dumblabs.ai",
    },
    {
      icon: <Phone className="h-6 w-6 text-indigo-500" />,
      label: "Call Us",
      value: "+91-7774008649",
      href: "tel:+917774008649",
    },
    {
      icon: <MapPin className="h-6 w-6 text-indigo-500" />,
      label: "Our Location",
      value: "Innovating Remotely, Worldwide", // Generic location
      href: "#", // No specific map link
    },
  ];

  return (
    <div className="space-y-8">
      {contactItems.map((item, index) => (
        <a 
          key={index} 
          href={item.href}
          target={item.href.startsWith('http') || item.href.startsWith('mailto') || item.href.startsWith('tel') ? "_blank" : "_self"}
          rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
          className="flex items-start p-4 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 group"
        >
          <div className="flex-shrink-0 mr-4 mt-1 bg-indigo-100 dark:bg-indigo-800/50 p-3 rounded-full group-hover:bg-indigo-200 dark:group-hover:bg-indigo-700/70 transition-colors duration-200">
            {item.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{item.label}</h3>
            <p className="text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">{item.value}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ContactDetails;
