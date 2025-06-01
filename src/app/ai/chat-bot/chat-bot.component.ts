import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-bot',
  standalone: false,
  
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
userMessage: string = '';
  messages: { from: 'user' | 'bot', text: string }[] = [];
  isListening: boolean = false;

  recognition: any;

  constructor() {
    // Vérifie si l'API Web Speech est disponible
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fr-FR';
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const voiceText = event.results[0][0].transcript;
        this.userMessage = voiceText;
        this.isListening = false;
        this.sendMessage();
      };

      this.recognition.onerror = () => {
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  sendMessage() {
    const text = this.userMessage.trim();
    if (!text) return;

    this.messages.push({ from: 'user', text });
    this.userMessage = '';

    // Simule la réponse de l’IA (remplacer par appel réel)
    setTimeout(() => {
      const botReply = `Tu as dit : "${text}".`;
      this.messages.push({ from: 'bot', text: botReply });
    }, 800);
  }

  startVoiceInput() {
    if (this.recognition) {
      this.isListening = true;
      this.recognition.start();
    } else {
      alert("Reconnaissance vocale non supportée par votre navigateur.");
    }
  }

}
