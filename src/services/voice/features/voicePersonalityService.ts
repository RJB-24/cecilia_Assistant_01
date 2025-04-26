
export class VoicePersonalityService {
  private welcomeMessage: string = "Hello, I'm Cecilia, your voice-first AI assistant. How may I help you today?";
  private personalityTraits: {
    humor: boolean;
    proactive: boolean;
    formality: string;
  } = {
    humor: true,
    proactive: true,
    formality: 'professional'
  };

  private importantEvents: Array<{date: Date, description: string}> = [];
  private lastInteractionTime: number = Date.now();
  private idleReminderInterval: number | null = null;

  constructor() {
    this.loadImportantEvents();
    this.setupIdleReminders();
  }

  private loadImportantEvents() {
    this.importantEvents = [
      { 
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        description: "Project deadline"
      },
      { 
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        description: "Team meeting"
      }
    ];
  }

  private setupIdleReminders() {
    this.idleReminderInterval = window.setInterval(() => {
      const idleTimeMinutes = (Date.now() - this.lastInteractionTime) / (1000 * 60);
      
      if (idleTimeMinutes > 30 && Math.random() < 0.3) {
        console.log("User has been idle for 30 minutes");
      }
    }, 5 * 60 * 1000);
  }

  updateLastInteraction(): void {
    this.lastInteractionTime = Date.now();
  }

  getWelcomeMessage(): string {
    let greeting = this.welcomeMessage;
    const upcomingEvent = this.getUpcomingEvent();
    
    if (upcomingEvent) {
      greeting += ` By the way, I should remind you that you have ${upcomingEvent.description} coming up in ${this.getDaysUntilEvent(upcomingEvent)} days.`;
    }
    
    if (this.personalityTraits.humor && Math.random() < 0.2) {
      greeting += " " + this.getRandomJoke();
    }
    
    return greeting;
  }

  private getUpcomingEvent() {
    if (this.importantEvents.length === 0) return null;
    const sortedEvents = [...this.importantEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
    return sortedEvents[0];
  }
  
  private getDaysUntilEvent(event: {date: Date, description: string}) {
    const diffTime = Math.abs(event.date.getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getRandomJoke(): string {
    const jokes = [
      "I tried to make a reservation at the library, but they were all booked.",
      "Why don't scientists trust atoms? Because they make up everything!",
      "I'm reading a book about anti-gravity. It's impossible to put down.",
      "Time flies like an arrow. Fruit flies like a banana.",
      "I'd tell you a chemistry joke, but I'm afraid I wouldn't get a reaction."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  setPersonalityTrait(trait: 'humor' | 'proactive' | 'formality', value: boolean | string): void {
    if (trait === 'formality' && typeof value === 'string') {
      this.personalityTraits.formality = value;
    } else if (trait !== 'formality' && typeof value === 'boolean') {
      this.personalityTraits[trait] = value;
    }
  }

  setWelcomeMessage(message: string): void {
    this.welcomeMessage = message;
  }

  addImportantEvent(date: Date, description: string): void {
    this.importantEvents.push({ date, description });
  }
}

export const voicePersonalityService = new VoicePersonalityService();
export default voicePersonalityService;
