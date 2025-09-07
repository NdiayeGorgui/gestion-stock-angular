import { Component } from '@angular/core';
import { HttpEventType, HttpDownloadProgressEvent } from '@angular/common/http';
import { StockService } from '../../services/stock.service';

type ChatMessage = {
  from: 'user' | 'bot';
  text: string;
};

@Component({
  selector: 'app-chat-bot',
  standalone: false,
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
  userMessage: string = '';
  messages: ChatMessage[] = [];
  isListening: boolean = false;
  isSpeaking: boolean = false;
  isVoiceMode: boolean = false;
  isLoading = false;

  recognition: any;

  constructor(private stockService: StockService) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fr-FR';
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const voiceText = event.results[0][0].transcript;
        this.userMessage = voiceText;
        this.isListening = false;
        this.isVoiceMode = true; // ✅ on note que c'est issu du micro
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
  this.isLoading = true; // ✅ démarrer le spinner

  const botMessage: ChatMessage = {
    from: 'bot',
    text: ''
  };
  this.messages.push(botMessage);

  let completeResponse = '';

  this.stockService.getAgentStreamingResponse(text).subscribe({
    next: (event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        const chunk = (event as HttpDownloadProgressEvent).partialText || '';
        completeResponse = chunk;
        botMessage.text = chunk;
      }
    },
    complete: () => {
      // ✅ arrêter le spinner seulement à la fin
      this.isLoading = false;

      if (this.isVoiceMode && completeResponse.trim()) {
        this.speak(completeResponse);
      }
      this.isVoiceMode = false; // reset après usage
    },
    error: () => {
      this.isLoading = false; // ✅ aussi en cas d'erreur
      botMessage.text = "⚠️ Erreur lors de l'appel au serveur.";
    }
  });
}


  startVoiceInput() {
    if (this.recognition) {
      this.isVoiceMode = true;
      this.isListening = true;
      this.recognition.start();
    } else {
      alert("🎙️ La reconnaissance vocale n'est pas supportée par votre navigateur.");
    }
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const plainText = this.stripMarkdown(text); // ✅ Nettoyage Markdown ici

      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'fr-FR';
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        console.warn("Erreur lors de la synthèse vocale.");
      };

      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.lang === 'fr-FR') || null;

      window.speechSynthesis.speak(utterance);
    }
  }

  // 🔧 Méthode pour supprimer le Markdown + backticks
stripMarkdown(text: string): string {
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2')       // gras **text** ou __text__
    .replace(/(\*|_)(.*?)\1/g, '$2')          // italique *text* ou _text_
    .replace(/`([^`]+)`/g, '$1')              // code inline `code`
    .replace(/~~(.*?)~~/g, '$1')              // barré ~~text~~
    .replace(/!\[.*?\]\(.*?\)/g, '')          // images ![alt](url)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // liens [text](url)
    .replace(/#+\s?(.*)/g, '$1')              // titres Markdown
    .replace(/> (.*)/g, '$1')                 // citations > quote
    .replace(/[-*+] /g, '')                   // listes - item
    .replace(/`/g, '')                        // ✅ supprime tout backtick restant
    .replace(/\r?\n|\r/g, ' ')                // suppressions des sauts de ligne
    .replace(/\s{2,}/g, ' ')                  // espaces multiples
    .trim();
}


  stopSpeaking() {
    if ('speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}
