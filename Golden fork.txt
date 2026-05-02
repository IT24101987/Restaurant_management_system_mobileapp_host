01). GitHub Repository Link 
GitHub Repository:  https://github.com/IT24101987/SE-23_Restaurant_management_system_mobileapp_host

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
        ├── dishRoutes.js               ← API for Dishes  (IT24102939 – Nayakarathne R M U K)
        ├── tableRoutes.js              ← API for Tables  (IT24101987 – Sarathchandra R.L.N )
        ├── orderRoutes.js              ← API for Orders   (IT24102852–Pallawala S R)
        ├── reviewRoutes.js             ← API for Reviews     (IT24102939 – Nayakarathne R M U K)
        ├── tableReservationRotes.js    ← API for Table Reservations  (IT24101987 – Sarathchandra R.L.N )
        └── paymentRoutes.js            ← API for Payments    (IT24102342 – Ahamed A A H )
