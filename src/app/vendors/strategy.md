CONTEXT & STRICT RULES:
You are acting as a senior Next.js developer. Before writing any code, you MUST inspect the codebase to understand the current architecture, specifically looking at src/app/vendors/page.tsx, src/components/Hero.tsx, and the relevant backend API routes for vendors and Paystack verification.

STRICT RULE: DO NOT refactor, rewrite, or alter the existing UI, styling, or layout of any page. You are only permitted to update the underlying logic, state management, and API calls.

Please execute the following two tasks:

TASK 1: VENDOR PAYMENT & REDIRECTION LOGIC
In src/app/vendors/page.tsx and its corresponding API routes, fix the following logic:

Flawless Redirection: Fix the Paystack onSuccess callback. It currently fails to redirect users on mobile browsers after the iframe closes. Ensure it successfully saves the data and cleanly redirects to the payment confirmation/success page (passing the reference and ticketId).

Real-Time Slot Management: Ensure that upon a successful payment, the total available vendor slots correctly reduce in the database and this reduction is accurately reflected in the UI.

Email Notifications: Ensure the backend API correctly triggers an email notification to the vendor upon successful payment, which must include their Ticket Details, Ticket ID, and QR Code.

TASK 2: HERO SECTION SOUND TOGGLE
In src/components/Hero.tsx:

Completely remove the visible floating mute/unmute button.

Keep the video muted by default on load (to obey browser autoplay policies).

Attach the mute/unmute toggle logic directly to the invisible dark gradient overlay that sits over the video. The user should be able to tap anywhere on the background video to turn the sound on and off without seeing a button.

Take a deep breath, review the existing code carefully, and provide the precise logical updates required without touching my UI.