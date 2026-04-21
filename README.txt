01). GitHub Repository Link 
GitHub Repository: 

02).Team Details 
Group Number: SE_23
Member 1: IT24102342 – Ahamed A A H – Payments and billing managment system  
Member 2: IT24101987 – Sarathchandra R.L.N – Table and Reservation Managment  
Member 3: IT24102939 – Nayakarathne R M U K –  Menu and review Managment   
Member 4: IT24102852–Pallawala S R – Order Managment and user role Managment

03). Deployment Details 
Backend URL: https://restaurant-managment-system-mobileapp.onrender.com

04.)Structure

restaurant_app_SE_23/
│
frontend/
│      ├── App.jsx
│      ├── src/
│         ├── assets/
│         │
│         ├── component/  
│         │
│         ├── constant/
│         │
│         ├── screens/
│         │     ├── Auth/
│         │     ├── Customer/   
│         │     ├── staff/  
│         │     └── Admin/
│         │
│         └── script/
│              ├── api/
│              ├── storage/
│
└── backend/
    │
    ├── index.js
    │
    └── routes/
        ├── dishRoutes.js               ← API for Dishes
        ├── tableRoutes.js              ← API for Tables
        ├── orderRoutes.js              ← API for Orders
        ├── reviewRoutes.js             ← API for Reviews
        ├── tableReservationRotes.js    ← API for Table Reservations
        └── paymentRoutes.js            ← API for Payments
