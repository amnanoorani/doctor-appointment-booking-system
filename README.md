# Doctor Appointment Booking System (MedBook)

MedBook is a web application for booking doctor appointments. Patients can create an account, look at the list of doctors and book an appointment. An admin can log in to a separate dashboard to add or remove doctors and to approve or reject appointment requests.

I made this as a learning project to practice PHP, MySQL and JavaScript together, and to understand how a front end talks to a backend through an API.

## Tech Stack

| Part | Technology |
|------|------------|
| Front end | HTML, CSS, JavaScript |
| Back end | PHP (PDO) |
| Database | MySQL |
| Local server | XAMPP (Apache + MySQL) |

The pages load the Inter font and Phosphor icons from the internet, so an internet connection is needed to see them properly.

## Features

**Patient side**
- Register and log in (passwords are stored hashed using `password_hash`)
- See the list of doctors with their specialization and experience
- Book an appointment with a doctor by choosing a date and writing a reason
- View my own appointments and their status (Pending, Approved or Rejected)
- Contact page (front end only, see Known Limitations)

**Admin side**
- Separate admin login
- Dashboard with the number of total, pending, approved and rejected appointments
- Add a new doctor or remove an existing one
- Approve or reject pending appointments

## Project Structure

```
medbook/
├── api/
│   ├── config.php          # database connection and headers
│   ├── login.php           # login for patients and admin
│   ├── register.php        # patient registration
│   ├── doctors.php         # get, add and delete doctors
│   └── appointments.php    # get, book and update appointments
├── index.html              # admin dashboard
├── admin_login.html        # admin login page
├── patient_landing.html    # patient home page
├── login.html              # patient login
├── register.html           # patient registration
├── doctors.html            # list of doctors
├── book.html               # booking form
├── appointments.html       # my appointments
├── contact.html            # contact page
├── script.js               # admin dashboard logic
├── styles.css              # admin dashboard styles
├── patient_styles.css      # patient pages styles
└── db_schema.sql           # database tables and sample data
```

## Database

The database is called `medbook_db` and has three tables:

- **users**: id, name, email (unique), password (hashed), role (`patient` or `admin`)
- **doctors**: id, name, specialization, experience
- **appointments**: id, patient_id (linked to users), patient_name, doctor_name, reason, appointment_date, status

`db_schema.sql` creates all three tables and also inserts one admin user and a few sample doctors.

## API Endpoints

| Endpoint | Method | What it does |
|----------|--------|--------------|
| `api/register.php` | POST | Create a new patient account |
| `api/login.php` | POST | Check email and password |
| `api/doctors.php` | GET | Get all doctors |
| `api/doctors.php` | POST | Add a doctor |
| `api/doctors.php` | DELETE | Remove a doctor |
| `api/appointments.php` | GET | Get all appointments, or one patient's with `?patient_id=` |
| `api/appointments.php` | POST | Book an appointment |
| `api/appointments.php` | PUT | Change the status of an appointment |

All queries use PDO prepared statements.

## How to Run on Your Computer

1. Install [XAMPP](https://www.apachefriends.org/) and start **Apache** and **MySQL** from the control panel.
2. Copy the `medbook` folder into the XAMPP `htdocs` folder.
   - Windows: `C:\xampp\htdocs\`
   - Linux: `/opt/lampp/htdocs/`
3. Open `http://localhost/phpmyadmin`, go to the **Import** tab, choose `db_schema.sql` and click Go. This creates the database, tables and sample data.
4. Check `api/config.php`. It uses the default XAMPP settings (user `root`, empty password). Change them if your MySQL setup is different.
5. Open the app in your browser:
   - Patients: `http://localhost/medbook/patient_landing.html`
   - Admin: `http://localhost/medbook/admin_login.html`

**Demo admin login (for local testing only):**
Email: `admin@medbook.com`
Password: `password`

Patients can create their own account from the Register page.

## Known Limitations

I know about these problems and I want to fix them in the next version:

- **No server-side login check.** The admin and patient pages are protected only in the browser (using `localStorage`). The API files do not check who is sending the request, so someone who calls the API directly could delete doctors or read appointments. A proper fix is to use PHP sessions or tokens and check the user role inside each API file.
- **Patient ID comes from the browser.** Because of the point above, the patient ID could be changed to see another patient's appointments.
- **Output is not escaped.** Some data is inserted into the page with `innerHTML` without cleaning it first, which can allow script injection (XSS).
- **No double booking check.** Two patients can book the same doctor at the same time.
- **Contact form is front end only.** It does not send or save the message anywhere.
- **Open CORS and default database user.** `config.php` allows requests from any origin and uses the root user with no password. This is fine for local practice but must be changed before any real deployment.

## Future Improvements

- Add PHP sessions and role checks for every API
- Let patients cancel their own appointments
- Prevent two bookings for the same doctor and time
- Escape user data before showing it on the page
- Add email notifications for approved or rejected appointments
- Save contact form messages in the database

## Author

Amna Bibi
BSCS Student, PMAS Arid Agricultural University Rawalpindi