
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer'; // Re-using home footer
import ContactForm from '@/components/contact/ContactForm';
import ContactDetails from '@/components/contact/ContactDetails';
import { motion } from 'framer-motion';
import BackgroundImage from '@/components/home/BackgroundImage'; // Re-using home background

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      <div className="relative w-full flex-grow">
        <BackgroundImage />
        <main className="relative container mx-auto px-4 py-16 md:py-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Get in Touch
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help and answer any question you might have. We look forward to hearing from you!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-xl -z-10" />
            <div className="relative glass-panel p-6 sm:p-8 md:p-12 rounded-xl border border-indigo-200 dark:border-indigo-900 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Send us a Message</h2>
                  <ContactForm />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mt-8 md:mt-0"
                >
                   <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Contact Information</h2>
                  <ContactDetails />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
