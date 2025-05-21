
import React from "react";
import { Github, Linkedin, Instagram, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SocialLinks = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-portfolio-charcoal">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Connect With Me</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <SocialButton 
            icon={<Github className="h-6 w-6" />} 
            label="GitHub" 
            href="https://github.com/johnportfolio" 
          />
          <SocialButton 
            icon={<Linkedin className="h-6 w-6" />} 
            label="LinkedIn" 
            href="https://linkedin.com/in/johnportfolio" 
          />
          <SocialButton 
            icon={<Instagram className="h-6 w-6" />} 
            label="Instagram" 
            href="https://instagram.com/johnportfolio" 
          />
          <SocialButton 
            icon={<Phone className="h-6 w-6" />} 
            label="Call Me" 
            href="tel:+1234567890" 
          />
          <ScheduleDialog />
        </div>
      </div>
    </section>
  );
};

const SocialButton = ({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 social-icon group"
    >
      <div className="mb-2 text-portfolio-purple group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </a>
  );
};

const ScheduleDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 social-icon group">
          <div className="mb-2 text-portfolio-purple group-hover:scale-110 transition-transform duration-300">
            <Calendar className="h-6 w-6" />
          </div>
          <span className="font-medium">Schedule</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Please select a convenient time for us to discuss your project or opportunity.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Available Slots:</p>
            <div className="space-y-2">
              {['Monday 2:00 PM', 'Tuesday 10:00 AM', 'Wednesday 4:00 PM', 'Friday 11:00 AM'].map((slot) => (
                <Button 
                  key={slot} 
                  variant="outline" 
                  className="w-full justify-start text-left hover:bg-portfolio-purple/10 hover:text-portfolio-purple"
                >
                  {slot}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Button className="w-full bg-gradient-to-r from-portfolio-purple to-portfolio-dark-purple hover:opacity-90 transition-opacity">
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialLinks;
