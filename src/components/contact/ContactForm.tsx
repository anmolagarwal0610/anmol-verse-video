
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    form.control.handleSubmit // to ensure isSubmitting is true
    try {
      console.log('Attempting to send contact form data:', data);
      const { data: responseData, error }
        = await supabase.functions.invoke('send-contact-email', {
          body: data,
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error("Message Failed!", {
          description: `There was an issue sending your message: ${error.message}. Please try again.`,
        });
        return;
      }

      console.log('Message sent successfully:', responseData);
      toast.success("Message Sent!", {
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      form.reset();
    } catch (e: any) {
      console.error('Unexpected error sending message:', e);
      toast.error("Message Failed!", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} className="bg-white/80 dark:bg-gray-800/80 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} className="bg-white/80 dark:bg-gray-800/80 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Subject</FormLabel>
              <FormControl>
                <Input placeholder="Regarding..." {...field} className="bg-white/80 dark:bg-gray-800/80 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Your message here..." {...field} rows={5} className="bg-white/80 dark:bg-gray-800/80 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
          {!form.formState.isSubmitting && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
