GENERAL ACCESS FLOW
 1. A fixed QR code must be generated and printed for display at all event entry points.
 2. Scanning the QR code must open a web page that:
 • Prompts the user to enter their Ticket ID
 • Has a Verify button
 3. Upon submission, the system must:
 • Validate the Ticket ID
 • Check ticket status (unused / used)
 • Display booking details if valid
 4. If valid, the system must display:
 • Name
 • Ticket Type (Regular / VIP tier)
 • Access Type (Attendee or Vendor)
 • Status: VALID
 • Instruction: Proceed to wristband issuance
 5. Once verified:
 • The system must automatically mark the Ticket ID as USED
 • Log the entry time and access type
 6. If the Ticket ID has already been used:
 • Display “Ticket Already Used”
 • Deny access
 7. If the Ticket ID is invalid:
 • Display “Invalid Ticket ID”
 • Deny access

⸻

STAFF ROLE AT ENTRY
 • Staff must only:
 • View the confirmation screen
 • Issue wristband or access tag
 • Staff must NOT:
 • Input Ticket IDs
 • Override system decisions
 • Manually validate tickets

⸻

2️⃣ VENDOR ACCESS RULES
 1. Vendor Ticket IDs must be configured with 5 total access allowances.
 2. Each successful verification must reduce the remaining access count by 1.
 3. The system must display:
 • Vendor Name
 • Access used (e.g. 3 of 5)
 • Remaining access
 4. Once the access limit is reached:
 • Further access must be blocked automatically.

⸻

3️⃣ MANUAL / CASH TICKETING SYSTEM

PURPOSE

To allow controlled, system-tracked ticket sales at the gate without bypassing the access system.

⸻

MANUAL TICKET CREATION (ADMIN ONLY)
 1. Create an Admin-only Manual Ticket Booking module.
 2. Access must be restricted to a Gate Sales Officer role.

⸻

MANUAL BOOKING REQUIREMENTS

Admin must be able to:
 • Select ticket type (Regular / VIP tier)
 • Select quantity
 • Input buyer phone number (mandatory)
 • Choose payment method: Cash
 • Submit booking

⸻

SYSTEM ACTIONS ON MANUAL BOOKING

Upon submission, the system must:
 1. Generate a unique Ticket ID for each ticket
 2. Mark ticket status as PAID
 3. Tag ticket as Cash Sale
 4. Make the Ticket ID usable immediately in the general access system

⸻

MANUAL TICKET USAGE
 • Manually created Ticket IDs must follow the same verification process as online tickets.
 • No wristband may be issued without successful QR verification.

⸻

4️⃣ SYSTEM LOGGING & DATA

The system must log:
 • Ticket ID
 • Ticket type
 • Access type (Attendee / Vendor)
 • Payment method (Online / Cash)
 • Time of entry
 • Entry status (Success / Blocked)

⸻

5️⃣ SECURITY & CONTROL RULES
 1. Manual ticket creation must be:
 • Role-restricted
 • Logged with admin ID
 2. Manual sales should be capped per ticket type (configurable).
 3. Once event capacity is reached:
 • Manual ticket creation must be auto-disabled.
 4. Ticket IDs must be single-use for attendees.

⸻

6️⃣ NON-FUNCTIONAL REQUIREMENTS
 • System must work on mobile devices (Android & iOS browsers).
 • Verification response must be under 3 seconds.
 • QR page must be lightweight and reliable on poor network.
 • Admin dashboard must show:
 • Total tickets sold
 • Cash vs online breakdown
 • Total entries logged

⸻

7️⃣ UX COPY REQUIREMENT

On QR verification page, display:

“Scan this code, enter your Ticket ID, and show the confirmation screen to event staff for wristband issuance.”

⸻

END OF SCOPE
