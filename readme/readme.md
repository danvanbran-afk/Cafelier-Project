🧱 1. HTML: Systems Architecture and Semantic Structure

The HTML (HyperText Markup Language) is not just a text file; it is the initial DOM (Document Object Model). Your project uses a SPA (Single Page Application) technique, where the entire experience lives within a single document.
The DOM Tree:
<!DOCTYPE html>: Declares the HTML5 standard, allowing the use of modern tags and audio.
<div id="game-container">: This is the Root Element, the "Stage." We set position: relative here, allowing internal elements (like the Mute button or Pause Overlay) to be positioned with mathematical precision relative to this box, rather than the whole screen.
Sections (<section class="screen">): We use three sections as View States.
#screen-start: The Main Menu.
#screen-game: The Game Loop.
#screen-ranking: The Feedback Loop.
Semantic Tags (<header>, <main>, <footer>): These tags inform the browser and search engines about the content's hierarchy. Score is at the top (header), action is in the center (main), and controls are at the bottom (footer).
The <audio> Element: We use id="bg-music" for JS targeting and the loop attribute to ensure the Jazz atmosphere is continuous, creating Active Sound Immersion.

🎨 2. CSS: Visual Engineering, Design Systems, and Micro-interactions

Your CSS (Cascading Style Sheets) transforms raw data into an emotional experience.
The Variable System (:root):
We use the :root pseudo-class to define CSS Custom Properties (Variables).
Advantage: If your "client" asks to change the coffee brown color, you change the --coffee-medium variable once, and the entire code updates. This is called Code Maintainability.
The Vintage Theme (Sepia and Gradients):
linear-gradient: We apply a color layer rgba(111, 78, 55, 0.75) over the background image. This isn't just aesthetic; it’s Accessibility. The gradient darkens the light parts of the original photo so that white text has enough contrast to be readable.
background-size: cover: Ensures the image fills the entire start screen without distortion, maintaining a professional look.
Animation Engineering (@keyframes):
Animations in your game are UI Feedback mechanisms.
@keyframes serving: A Translation Transformation (translateY). It creates organic movement that keeps the user engaged with the central area.
@keyframes shake: A Rapid Oscillation animation. We use negative and positive values in short intervals (20%, 40%, etc.) to simulate a physical error. It is the visual equivalent of a "No" sound.
@keyframes popIn: Uses transform: scale(0) to scale(1). This gives visual "weight" to items, making them feel like real objects landing on the bistro table.
Layout and Positioning:
Flexbox (display: flex): Used in the body to center the game and in #active-orders to align the coffee items. Flexbox solves the historical "vertical alignment" problem in web development.
box-shadow: We used solid shadows (no blur) on buttons, which, combined with transform: translate(2px, 2px) on the :active state, creates the mechanical illusion of a physical press.

🧠 3. JavaScript: Logic, Algorithms, and State Management

JavaScript is the engine. Your script follows an Event-Driven Programming logic.
The State Object (const state):
Instead of scattering variables, we centralize everything in the state object.
Why? This prevents global scope pollution and makes the game Predictable. The state is the "single source of truth."
Navigation System (showScreen):
Method: Accepts a screenId as an argument.
Logic: Uses Object.values(screens).forEach to "clean" all screens before showing the correct one. This prevents the common bug of having two overlapping screens.
Timer Engines (setInterval and clearInterval):
Your game has two simultaneous "engines":
Countdown Timer: Reduces time every 1000ms (1 second).
Order Spawner: Creates requests every X milliseconds.
Progressive Difficulty: This is a Frequency Acceleration Algorithm. At 40s and 20s, the JS executes a clearInterval (stopping the current engine) and restarts the setInterval with a lower time (spawnSpeed). This increases the game's Tension Curve.
Dynamic DOM Manipulation:
document.createElement("li"): Your JS is a "HTML factory." It creates the element, sets the CSS class, and defines the text content on the fly.
orderListUI.removeChild(orderListUI.firstChild): We ensure the oldest order is removed first. This implements a FIFO (First-In, First-Out) data structure — a real queue.
Data Sanitization and Validation:
.trim().toLowerCase(): These string methods ensure the game doesn't fail if the player accidentally hits Space or has Caps Lock on. This is called Robust Coding.
Persistence with localStorage:
JSON.stringify and JSON.parse: LocalStorage only accepts strings. To save a complex list of players and scores, we "freeze" the array into a JSON string to save it on the Mac and "unfreeze" it back into a JS object when we need to show the ranking.
Audio Engineering and Security:
Audio Context: Modern browsers block auto-audio. Your code solves this by "unlocking" sound only inside a human click event (start-btn).
currentTime = 0: In the SFX (sound effects), we reset the time before each .play(). Without this, if you serve two coffees very fast, the second sound wouldn't trigger because the first was still playing.
Anti-Cheat (Advanced Event Listeners):
e.preventDefault() on the paste event: We capture the user's intent to paste text and cancel the action. This shows the developer considered Game Integrity.
🚀 Summary of Applied Engineering Concepts:
DRY (Don't Repeat Yourself): Use of CSS variables and reusable functions to avoid repetition.
KISS (Keep It Simple, Stupid): Clear logic without unnecessary external libraries, focusing on native performance.
Separation of Concerns: HTML handles structure, CSS handles beauty, and JS handles behavior.
UX Design: Micro-interactions, sound, and visual feedback to guide the user without a manual.
Final Pro-Tip: During your presentation, you can now answer technical questions like "How does the ranking work?" or "How did you make the error animation?" with total confidence. ☕✨

