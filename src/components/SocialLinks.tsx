import React, { useState } from "react";
import { Github, Linkedin, Instagram, Phone, Calendar, Clock, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const SocialLinks = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-portfolio-charcoal">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Connect With Me</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <SocialButton 
            icon={<Github className="h-6 w-6" />} 
            label="GitHub" 
            href="https://github.com/Naman1223/Naman1223" 
          />
          <SocialButton 
            icon={<Linkedin className="h-6 w-6" />} 
            label="LinkedIn" 
            href="https://www.linkedin.com/in/namantiwari13/" 
          />
          <SocialButton 
            icon={<Instagram className="h-6 w-6" />} 
            label="Instagram" 
            href="https://www.instagram.com/namantiwari.ii?igsh=MWJidHBuODQzNHk3Yg%3D%3D&utm_source=qr" 
          />
          <SocialButton 
            icon={<Phone className="h-6 w-6" />} 
            label="Call Me" 
            href="tel:+916306166139" 
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
  const [isBooking, setIsBooking] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    company: "",
    purpose: ""
  });
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

  const generateCalendarEvent = () => {
    if (!selectedDate || !selectedTime || !userDetails.name || !userDetails.email) return null;

    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    const startDate = new Date(selectedDate);
    startDate.setHours(hour24, parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hour meeting

    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const eventDetails = {
      title: `Meeting with ${userDetails.name}`,
      start: formatDateForCalendar(startDate),
      end: formatDateForCalendar(endDate),
      description: `Meeting with ${userDetails.name} from ${userDetails.company || 'N/A'}.\n\nPurpose: ${userDetails.purpose}\n\nContact: ${userDetails.email}`,
      location: 'Online Meeting (Link will be shared via email)'
    };

    return eventDetails;
  };

  const sendMeetingRequest = async () => {
    const eventDetails = generateCalendarEvent();
    if (!eventDetails) return false;

    try {
      // Create a mailto link with meeting details
      const subject = encodeURIComponent(`Meeting Request: ${eventDetails.title}`);
      const body = encodeURIComponent(`
Hello Naman,

I would like to schedule a meeting with you.

Meeting Details:
- Date: ${format(selectedDate!, 'MMMM do, yyyy')}
- Time: ${selectedTime}
- Duration: 1 hour

My Details:
- Name: ${userDetails.name}
- Email: ${userDetails.email}
- Company: ${userDetails.company || 'N/A'}
- Purpose: ${userDetails.purpose}

Please confirm this meeting and share the meeting link.

Best regards,
${userDetails.name}
      `);

      const mailtoLink = `mailto:namantiwari1223@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.open(mailtoLink, '_blank');

      // Also create a calendar event for the user
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
      
      // Open Google Calendar in a new tab after a short delay
      setTimeout(() => {
        window.open(googleCalendarUrl, '_blank');
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error sending meeting request:', error);
      return false;
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !userDetails.name || !userDetails.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a date and time.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsBooking(true);
    
    try {
      const success = await sendMeetingRequest();
      
      if (success) {
        toast({
          title: "Meeting Request Sent!",
          description: `Your meeting request for ${format(selectedDate, 'MMMM do, yyyy')} at ${selectedTime} has been sent to Naman. You'll receive a confirmation email soon.`,
        });
        
        // Reset form after successful booking
        setSelectedDate(undefined);
        setSelectedTime(null);
        setUserDetails({ name: "", email: "", company: "", purpose: "" });
      } else {
        throw new Error("Failed to send meeting request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your meeting request. Please try again or contact directly.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const isFormValid = selectedDate && selectedTime && userDetails.name && userDetails.email;

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center gradient-text">Schedule a Meeting with Naman</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Details Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company/Organization</Label>
              <Input
                id="company"
                value={userDetails.company}
                onChange={(e) => setUserDetails(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your company or organization"
              />
            </div>
            <div>
              <Label htmlFor="purpose">Meeting Purpose *</Label>
              <Textarea
                id="purpose"
                value={userDetails.purpose}
                onChange={(e) => setUserDetails(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="Brief description of what you'd like to discuss"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h4 className="text-sm font-medium mb-1">Meeting Summary</h4>
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
              {selectedDate && selectedTime && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Duration: 1 hour • Meeting link will be shared via email
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button 
            onClick={handleBookAppointment} 
            disabled={!isFormValid || isBooking}
            className="w-full bg-gradient-to-r from-portfolio-purple to-portfolio-dark-purple hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isBooking ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Request...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Send Meeting Request</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SocialLinks;