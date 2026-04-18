# ClayCove – MERN E-Commerce Website

<p align="center">
  <b>Handmade Clay Creations Marketplace</b><br/>
  A full-stack MERN e-commerce platform with modern UI, smart cart system, and admin analytics.
</p>

<img width="1370" height="849" alt="image" src="https://github.com/user-attachments/assets/eee6f3be-a39d-4ca7-b6da-3579980f8bb2" />

<img width="1376" height="848" alt="image" src="https://github.com/user-attachments/assets/f084c008-6fd6-4c57-9558-209de7f5ced5" />

## Features

### User Experience
- Browse products by categories  
- Product detail page with image gallery & reviews  
- Add to cart (Guest + Logged-in support)  
- Wishlist system  
- Secure authentication (JWT)  
- Profile with shipping address  
- Order history tracking  

### Smart Cart System
- Guest cart (localStorage)  
- Logged-in cart (MongoDB)  
- Auto sync after login  
- Stock validation (no over-ordering)  
- Real-time quantity updates  


### Wishlist
- Add/remove products  
- Persistent storage  
- Smooth UI interactions  

### Orders
- Place orders with product snapshot  
- Auto clear cart after checkout  
- Order history with images  


### Admin Dashboard
- Total products, orders, and sales  
- Inventory tracking  
- Product management (CRUD)  
- Order status updates
- 
## Advanced Logic

- Stock synchronization across frontend & backend  
- Prevent invalid cart quantities  
- Auto-adjust cart if stock changes  
- Dynamic rating calculation  


## Tech Stack

### Frontend
-  React (Vite)  
-  Tailwind CSS  
-  Context API  

### Backend
-  Node.js  
-  Express.js  
-  MongoDB + Mongoose  
-  JWT Authentication  

### Services
-  Cloudinary (Image Uploads)  


##  UI Highlights

- Clean and modern design  
- Fully responsive layout  
- Smooth animations  
- Premium cart & wishlist UI  

## Getting Started

### Clone the repo
```bash
git clone https://github.com/RojuChitrakar/claycove.git
cd claycove
```
## Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run the app

### Backend
```bash
cd backend
npm run dev
```
### Frontend
```bash
cd frontend
npm run dev
```

## Environment Variables
### Backend .env
```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_URL=your_cloudinary_url
```
### Frontend .env
```bash
VITE_API_URL=http://localhost:5000/api
```

## Author

Roju Chitrakar
