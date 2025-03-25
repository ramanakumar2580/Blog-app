# Blog Platform - Next.js

## Overview  

This project is a **Next.js** blog platform where users can explore the latest blogs, subscribe to newsletters.

## Features  

- **Latest Blogs** – Display recent blog posts.  
- **Newsletter Subscription** – Users can enter their email to receive updates.  
- **Admin Login** – Secure admin access via an email popup.  
- **Responsive UI** – Optimized for all devices.  

## Installation  

### 1. Clone the Repository  

```sh
git clone https://github.com/ramanakumar2580/BlogApp.git
cd your-repo
npm install

2. Setup Environment Variables
Create a .env.local file and add the following:
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
MONGODB_URI=Your mongodb url connection string
EMAIL_USER=your@gmail.com
EMAIL_PASS=App code

3. Start Development Server
npm run dev
