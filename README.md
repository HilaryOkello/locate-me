# 📍 Locate-Me - Location Sharing App

A Rails + Inertia.js (React) app where users can create an account, log in/out, and add their location as a pin on a map. The landing page displays pins from all users.

🔗 **Live site:** [https://mysite-nt9e.onrender.com](https://mysite-nt9e.onrender.com)
(credentials for admin and seeded users can be found in db/seeds.rb).

---

## 🚀 Features

- User authentication (sign up, log in/out)
- Add a location pin (name, latitude, longitude)
- View all pins on the map
- Admin dashboard to manage users (delete users)

---

## 🛠 Tech Stack

- **Backend:** Ruby on Rails
- **Frontend:** React (via Inertia.js)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL

---

## 🧑‍💻 Getting Started

### ✅ Prerequisites
Get started by ensuring you have the necessary tools installed:

 - ***Ruby:***  [ruby 3.4.2](https://www.ruby-lang.org/en/documentation/installation/)
 - ***Rails:*** [Rails 8.0.2](https://gorails.com/setup/ubuntu/24.04)
 - ***Node.js & npm (or yarn)*** 
 - ***PostgreSQL:*** Installed and running.

### 1. Clone the repo
```bash
git clone https://github.com/HilaryOkello/locate-me.git
cd locate-me
```

If loaded from a zip file, then extract the folder and navigate to `locate-me`

### 2. Install dependencies
```bash
bundle install
npm install
```
### 3. Install tailwind css
```bash
./bin/bundle add tailwindcss-ruby
./bin/bundle add tailwindcss-rails
./bin/rails tailwindcss:install
```

### 3. Set up the database
```bash
rails db:create
rails db:migrate
rails db:seed
```

### 4. Start the server
```bash
rails s
```

Then go to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Deployment

App is deployed on [Render](https://mysite-nt9e.onrender.com/).

---

## ✅ Bonus Features

- Role-based access controll: Admins can delete users and added locations from a separate dashboard accessible from the navbar for the admin
- The credentials for admin and seeded users can be found in db/seeds.rb
