
import React, { useState } from "react";
import { Github, Linkedin, Instagram, Phone, Calendar, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SocialLinks = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-portfolio-charcoal">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Connect With Me</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <SocialButton 
            icon={<Github className="h-6 w-6" />} 
            label="GitHub" 
            href="https://github.com/namanportfolio" 
          />
          <SocialButton 
            icon={<Linkedin className="h-6 w-6" />} 
            label="LinkedIn" 
            href="https://linkedin.com/in/namanportfolio" 
          />
          <SocialButton 
            icon={<Instagram className="h-6 w-6" />} 
            label="Instagram" 
            href="https://instagram.com/namanportfolio" 
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const { toast } = useToast();

  // Available time slots
  const availableTimeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];
  
  // Get day name for selected date
  const getDayName = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, 'EEEE');
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Selection Required",
        description: "Please select both a date and time for your appointment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsBooked(true);
    
    setTimeout(() => {
      toast({
        title: "Appointment Scheduled!",
        description: `Your meeting is confirmed for ${format(selectedDate, 'MMMM do, yyyy')} at ${selectedTime}.`,
      });
      // Reset form after successful booking
      setSelectedDate(undefined);
      setSelectedTime(null);
      setIsBooked(false);
    }, 1500);
  };

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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center gradient-text">Schedule a Meeting with Naman</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Calendar Picker */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Select a Date</h3>
            <div className="border rounded-lg overflow-hidden">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => {
                  // Disable past dates, weekends, and dates more than 30 days in the future
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isMoreThanThirtyDays = date > new Date(today.setDate(today.getDate() + 30));
                  return date < new Date() || isWeekend || isMoreThanThirtyDays;
                }}
              />
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              {selectedDate ? `${getDayName(selectedDate)} Available Slots` : "Select a date first"}
            </h3>

            {selectedDate ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {availableTimeSlots.map((time) => (
                  <button
                    key={time}
                    className={cn(
                      "flex items-center justify-between w-full p-3 border rounded-md transition-colors",
                      selectedTime === time 
                        ? "border-portfolio-purple bg-portfolio-purple/10 text-portfolio-purple" 
                        : "hover:border-portfolio-purple/50 hover:bg-portfolio-purple/5"
                    )}
                    onClick={() => setSelectedTime(time)}
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 opacity-70" />
                      <span>{time}</span>
                    </div>
                    {selectedTime === time && (
                      <Check className="h-4 w-4 text-portfolio-purple" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">Please select a date to view available times</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Date & Time Summary */}
        {(selectedDate || selectedTime) && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
            <h4 className="text-sm font-medium mb-1">Your Selection</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {selectedDate && (
                <span className="px-2 py-1 bg-portfolio-purple/10 text-portfolio-purple rounded">
                  {format(selectedDate, 'MMM d, yyyy')}
                </span>
              )}
              {selectedTime && (
                <span className="px-2 py-1 bg-portfolio-purple/10 text-portfolio-purple rounded">
                  {selectedTime}
                </span>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button 
            onClick={handleBookAppointment} 
            disabled={!selectedDate || !selectedTime || isBooked}
            className="w-full bg-gradient-to-r from-portfolio-purple to-portfolio-dark-purple hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isBooked ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              "Book Appointment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SocialLinks;
