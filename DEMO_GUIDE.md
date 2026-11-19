# MediConnect – Faculty Demonstration Guide (3–5 Minute Flow)

Follow this step-by-step presentation script to demonstrate the full-stack MERN architecture to your faculty evaluators.

---

### ⏱️ Minute 0:00 – 0:45 | Platform Architecture & Live Cluster Status
1. Open the web browser at **`http://localhost:5173`**.
2. **Key Talking Points:**
   - Mention the stack: React 19, Vite 8, Tailwind CSS v4, Express 5, and live MongoDB Atlas.
   - Scroll down to the Footer: highlight the **"MongoDB Atlas Connected"** live indicator. Explain that this is driven by `GET /api/health/db` querying `mongoose.connection.readyState`.
   - Scroll back to the **Hero Section** ("Your Health, Our Priority") and the **Medical Specialties** cards.

---

### ⏱️ Minute 0:45 – 1:45 | Doctor Directory & Patient Booking Workflow
1. Click **"Find Doctors"** in the navigation bar.
2. Filter by specialty (e.g., **Cardiology** or **Dermatology**) and show the responsive cards populated dynamically from MongoDB Atlas.
3. Click **"Book"** on **Dr. Sarah Jenkins**.
4. Since no session is active, notice how it prompts for patient authentication.
5. Click **"Login"** (or go to `/login`):
   - Click the **"Patient"** demo button to autofill:
     - `patient@mediconnect.com` / `Patient@123`
   - Click **"Sign In"**.
6. The app seamlessly redirects to the Patient Dashboard (`/dashboard`).
7. Click **"Find Doctors"** again -> Click **"Book"** on **Dr. Sarah Jenkins**:
   - Choose tomorrow's date.
   - Select an available slot (e.g., **02:00 PM**).
   - Enter reason: *"Follow-up heart rhythm consultation"*.
   - Click **"Confirm Booking"**.
8. **Show Result:** An appointment confirmation modal pops up with consultation details, and the appointment appears live under **"My Appointments"** with status **CONFIRMED**.

---

### ⏱️ Minute 1:45 – 3:00 | Doctor Portal & Digital Prescription Issuance
1. Click the logout icon in the top right.
2. Go to **`/login`** -> Click the **"Doctor"** demo button:
   - `sarah.jenkins@mediconnect.com` / `Doctor@123`
   - Click **"Sign In"**.
3. **Doctor Dashboard (`/doctor/dashboard`):**
   - Show the metrics cards: Today's visits, Pending requests, Completed consultations.
   - Find the newly booked consultation from **Alex Johnson**.
   - Click **"Add Prescription"**:
     - Diagnosis: *"Sinus tachycardia with mild fatigue"*.
     - Symptoms: *"Elevated resting pulse after exertion"*.
     - Prescribed Medication:
       - Medicine: *Metoprolol Tartrate 25mg* | Dosage: *1 tablet* | Frequency: *Twice daily* | Duration: *14 days* | Instructions: *With morning and evening meals*.
     - Click **"Finalize & Issue Record"**.
4. **Show Result:** The consultation status immediately updates to **COMPLETED**, and the prescription is written to MongoDB Atlas in the `medicalrecords` collection.
5. Click the **"Schedule & Availability"** tab:
   - Demonstrate toggling available days (Mon, Wed, Fri) and adding new time slots.

---

### ⏱️ Minute 3:00 – 3:45 | Patient Verification & In-App Notifications
1. Log out from the doctor account.
2. Log back in as **Patient** (`patient@mediconnect.com` / `Patient@123`).
3. Point out the **Notification Bell** in the top navigation:
   - Click it to show the unread alert: *"Medical Record & Prescription Available: Dr. Sarah Jenkins has added your consultation summary and prescription."*
4. Click the **"Medical Records & Prescriptions"** tab:
   - Show the newly generated clinical summary and prescribed *Metoprolol Tartrate* with dosage and instructions.
   - Explain that data isolation prevents any other patient from accessing this record.

---

### ⏱️ Minute 3:45 – 4:30 | Administrator Analytics Console
1. Log out and log in as **Admin**:
   - Click the **"Admin"** demo button (`admin@mediconnect.com` / `Admin@123`).
   - The app navigates to `/admin/dashboard`.
2. **Admin Dashboard:**
   - Review live MongoDB aggregation stats:
     - Total Patients (registered users)
     - Active Doctors (8 approved specialists)
     - Total Consultations Booked
     - Platform Volume ($ Total consultation fees)
   - Show **"Manage Doctors"**: shows all doctors, hospital affiliations, and specialties.
   - Show **"Manage Patients"**: shows patient account active toggles.
   - Show **"+ Add New Doctor"** modal: demonstrate how administrators can onboard new physicians.

---

### ⏱️ Minute 4:30 – 5:00 | Architecture & Concurrency Defense
- **Q&A Defense Points:**
  - **No Double-Booking:** Explain how `Appointment.js` enforces a MongoDB compound index on `{ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }`, guaranteeing that concurrent booking requests for the same slot are rejected at the database level with a `409 Conflict`.
  - **Security:** Passwords hashed with `bcryptjs` (salt 10), authentication tokens transmitted via HTTP-only cookies and Bearer headers, sensitive variables kept in git-ignored `.env`.
