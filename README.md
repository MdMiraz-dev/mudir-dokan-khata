# 🏪 Mudir Dokan Khata Smart AI (মুদির দোকান খাতা স্মার্ট এআই)

> **Empowering Bangladeshi Retail & Grocery Shopkeepers with Real-time Voice AI, Automated POS Checkout, and Smart Credit Ledgers.**

[![Developer](https://img.shields.io/badge/Founder-Merajul%20Islam-amber.svg)](https://github.com/MdMiraz-dev)
[![Website](https://img.shields.io/badge/Website-mdmiraz--dev.github.io-teal.svg)](https://mdmiraz-dev.github.io/)
[![YouTube](https://img.shields.io/badge/YouTube-Miraz%20Learning%20Story-red.svg)](https://youtube.com/@mdmiraz-489?si=FuDX4kA1f76NZbMB)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 About the Project

**Mudir Dokan Khata Smart AI** is a state-of-the-art enterprise-grade web application built specifically for traditional Bangladeshi grocery stores (*Mudir Dokan*), departmental shops, and retail merchants. It bridges classic Islamic ethical commercial standards with modern **Google Gemini 3.8 Live real-time audio streaming**, automated barcode inventory, and digital credit khata (*বাকির খাতা*) management.

---

## 👨‍💻 Founder & Lead Developer

- **Founder & Architect:** **Merajul Islam (মিরাজ)**
- **Father:** Md. Abdul Kadir
- **Location:** Borotolla, Ashuganj, Brahmanbaria, Bangladesh
- **Education:**
  - 🎓 **Dawrah-e-Hadith (Masters Equivalent in Hadith & Islamic Studies)** — Jamia Arabia Imdadul Uloom Faridabad Madrasah, Dhaka
  - 📖 **Meshkat Alumnus** — Jamia Islamia Darul Uloom Madania Jatrabari, Dhaka
  - 📜 **Nadim & Fazil** — Tongi Sadequl Uloom Fazil Madrasah, Aura, Brahmanbaria
  - 🏆 **Honor:** Young Islamic Scholar Reception & Honor (IEB Auditorium, Dhaka)
- **Tech Training:** **As-Sunnah Skill Development Institute** (Founded by Shaykh Ahmadullah) — AI Automation & Software Development
- **Profiles:**
  - 🌐 **Portfolio Website:** [mdmiraz-dev.github.io](https://mdmiraz-dev.github.io/)
  - 📘 **Facebook:** [facebook.com/mdmiraz.dev](https://www.facebook.com/mdmiraz.dev)
  - 📺 **YouTube:** [@mdmiraz-489 (Miraz Learning Story)](https://youtube.com/@mdmiraz-489?si=FuDX4kA1f76NZbMB)
  - 🐙 **GitHub:** [@MdMiraz-dev](https://github.com/MdMiraz-dev)

---

## ✨ Key Features

1. 🎙️ **Gemini 3.8 Live Real-Time Voice AI (Male Voice — Puck/Fenrir):**
   - Natural two-way conversation in Bengali for wholesale commodity rates (চাল, ডাল, তেল), inventory checks, and business advice.
   - Immediate recognition and introduction of the founder, Merajul Islam.
2. 🛒 **Smart POS Cash Counter:**
   - Quick search, barcode scanner integration, vocal cart additions (*ভয়েস কার্ট*), customizable thermal receipts, and real-time stock deductions.
3. 📒 **Digital Due Khata & Customer Reminders (বাকির খাতা):**
   - Customer credit balance tracking, payment histories, and automated Bengali SMS reminder templates for polite and effective recovery.
4. 📦 **Inventory & Stock Management:**
   - Low-stock alerts, AI product image scanning, cost vs. selling price analytics, and wholesale reorder recommendations.
5. 📊 **Financial Reports & Audit:**
   - Daily profit and loss statements, revenue graphs, exportable JSON/CSV backups, and expense logging.
6. ⚖️ **Islamic Business Jurisprudence (ব্যবসায়িক মাসায়েল):**
   - Authentic rulings from Sahih Bukhari and Muslim regarding honest weights, non-usurious transactions, and credit ethics.
7. 📄 **Professional 1-Page Resume / CV:**
   - Interactive CV with print preview and instant copy capabilities.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend & Middleware:** Node.js, Express, tsx
- **AI & LLM Integration:** Google GenAI SDK (`@google/genai`), Gemini 3.8 Live API over WebSockets, Gemini 3.5 Flash
- **Audio Processing:** PCM 16kHz audio streaming with Web Audio API and SpeechSynthesis fallback

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or bun

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/MdMiraz-dev/mudir-dokan-khata-ai.git
   cd mudir-dokan-khata-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Developed with passion and dedication by [Merajul Islam](https://github.com/MdMiraz-dev).*
