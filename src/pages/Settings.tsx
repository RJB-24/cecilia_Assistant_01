
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const generalFormSchema = z.object({
  groqApiKey: z.string().min(1, "Groq API Key is required"),
  screenpipeApiKey: z.string().min(1, "Screenpipe API Key is required"),
  assistantName: z.string().min(1, "Assistant name is required"),
  language: z.string().min(1, "Language is required"),
});

const privacyFormSchema = z.object({
  localProcessing: z.boolean(),
  screenRedaction: z.boolean(),
  dataRetention: z.boolean(),
  anonymousUsage: z.boolean(),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  desktopNotifications: z.boolean(),
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
});

const Settings = () => {
  const generalForm = useForm({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      groqApiKey: "",
      screenpipeApiKey: "",
      assistantName: "Cecilia",
      language: "English",
    },
  });

  const privacyForm = useForm({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      localProcessing: true,
      screenRedaction: true,
      dataRetention: false,
      anonymousUsage: true,
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      desktopNotifications: true,
      quietHoursEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
    },
  });

  const onGeneralSubmit = (data: z.infer<typeof generalFormSchema>) => {
    toast.success("General settings updated");
    console.log(data);
  };

  const onPrivacySubmit = (data: z.infer<typeof privacyFormSchema>) => {
    toast.success("Privacy settings updated");
    console.log(data);
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    toast.success("Notification settings updated");
    console.log(data);
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <h1 className="text-2xl font-bold text-groqflow-navy">Settings & Configuration</h1>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Application Settings</CardTitle>
            <CardDescription>
              Configure your GroqFlow assistant preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="mt-4">
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="groqApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Groq API Key</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your Groq API key" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your Groq API key for natural language processing
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="screenpipeApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Screenpipe API Key</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your Screenpipe API key" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your Screenpipe API key for desktop automation
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="assistantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assistant Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter assistant name" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            The name you want to use for your assistant
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Language</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter preferred language" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            The primary language for voice commands (e.g., English, Hindi)
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="bg-groqflow-navy hover:bg-groqflow-navy/80 mt-4"
                    >
                      Save General Settings
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-4">
                <Form {...privacyForm}>
                  <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-4">
                    <FormField
                      control={privacyForm.control}
                      name="localProcessing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Local Processing</FormLabel>
                            <FormDescription>
                              Process voice commands locally when possible
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={privacyForm.control}
                      name="screenRedaction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Screen Redaction</FormLabel>
                            <FormDescription>
                              Automatically blur sensitive information during screen analysis
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={privacyForm.control}
                      name="dataRetention"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Data Retention</FormLabel>
                            <FormDescription>
                              Store command history for future reference
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={privacyForm.control}
                      name="anonymousUsage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Anonymous Usage Analytics</FormLabel>
                            <FormDescription>
                              Share anonymous usage data to improve the system
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="bg-groqflow-navy hover:bg-groqflow-navy/80 mt-4"
                    >
                      Save Privacy Settings
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-4">
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive task updates via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="desktopNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Desktop Notifications</FormLabel>
                            <FormDescription>
                              Show desktop notifications for important events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="quietHoursEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-0.5">
                            <FormLabel>Quiet Hours</FormLabel>
                            <FormDescription>
                              Disable notifications during specified hours
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {notificationForm.watch("quietHoursEnabled") && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={notificationForm.control}
                          name="quietHoursStart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="quietHoursEnd"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    <Button 
                      type="submit"
                      className="bg-groqflow-navy hover:bg-groqflow-navy/80 mt-4"
                    >
                      Save Notification Settings
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
