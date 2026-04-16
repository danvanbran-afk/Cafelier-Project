# 🤖 AI Usage Log - Cafélier Bistrô

This document records the collaboration between the developer and AI tools during the creation of the **Cafélier Bistrô** project, as required by the academic guidelines.

## 🎯 Objective of Collaboration
The AI was used as a **Technical Consultant** and **UX/UI Mentor**. The focus was on refining the game architecture, suggesting visual aesthetics (Vintage/Lo-fi), and structuring DOM manipulation logic following **DRY** (Don't Repeat Yourself) and **KISS** (Keep It Simple, Stupid) principles.

## 📝 Prompt & Decision Log


| Phase | Prompt Example | Outcome / Decision |
| :--- | :--- | :--- |
| **Brainstorming** | "Suggest an original low-profile game idea based on daily tasks." | Chose the **Barista Simulator** theme for its strong connection to the player's daily life. |
| **Architecture** | "How to create a 3-screen system (SPA) using only Vanilla JS and CSS?" | Implemented the `showScreen()` function and visibility management using the `.hidden` class. |
| **UX & Feedback** | "How to provide visual feedback to the player if they type the wrong word?" | Created a **CSS Shake** animation applied dynamically via JavaScript. |
| **Game Logic** | "How to synchronize removing an item from an array with removing a DOM element?" | Used `.shift()` for the logic array and `removeChild(firstChild)` for the UI. |
| **Aesthetics** | "Suggest colors and styles for a vintage bistro theme." | Applied **Sepia** tones, double borders, and monospaced typography. |

## 🛠️ AI-Assisted Features
*   **Progressive Difficulty**: The AI suggested accelerating the `spawnInterval` as time decreases to create a climax in the game.
*   **Smart Pause**: Implementation of a pause overlay to prevent reading orders while the timer is stopped, ensuring the integrity of the challenge.
*   **Data Persistence**: Guidance on using `localStorage` to maintain the **Hall of Fame** (Top 10) even after reloading the page.

## ⚖️ Ethical Reflection and Authorship
*   **Core Logic**: Although the AI suggested structures, the entire implementation of events (`addEventListener`), input validation logic, and DOM element selection were manually performed and tested by me.
*   **Transparency**: No function was simply "copy-pasted" without me being able to explain its functionality, especially the management of asynchronous timers (`setInterval`).
*   **Learning**: The AI acted as a "Pair Programming Partner," helping to unblock syntax errors (such as file paths and MIME type errors).

---
*This project was developed as part of the Frontend Fundamentals module.*
