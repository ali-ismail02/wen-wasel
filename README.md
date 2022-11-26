<img src="./readme/title1.svg"/>

<div align="center">

> Hello world! Wen Wasel is aimed at organizing the lebanese public transportation systems and guiding users to their destinations.  

**[PROJECT PHILOSOPHY](https://github.com/ali-ismail02/wen-wasel#project-philosophy) • [WIREFRAMES](https://github.com/ali-ismail02/wen-wasel#wireframes) • [TECH STACK](https://github.com/ali-ismail02/wen-wasel#tech-stack) • [IMPLEMENTATION](https://github.com/ali-ismail02/wen-wasel#impplementation) • [HOW TO RUN?](https://github.com/ali-ismail02/wen-wasel#how-to-run)**

</div>

<br><br>


<img src="./readme/title2.svg" id="project-philosophy"/>

> Since your average joe (me) doesn't know how to navigate through lebanon with all the different routes of every bus and cab drivers expected payments. Wen Wasel is an app that solves all the above by guiding the user to live bus stops and previous cab rides.
> 
> The app allows bus drivers to input their routes with their arrival time and shares their live location with the users. Ensuring more passengers on their respective routes.
>
> The app allows passengers to book seats at buses and browse through different possible routes to their destination as well as providing them with live guidance to their destination.

### User Stories
- As a bus driver, I want to add routes, so that I can find more passengers.
- As a passenger, I want to find a route, so that I can reach my destination.
- As a passenger, I want to book bus seats, so that I can ensure it's availibility.

<br><br>

<img src="./readme/title3.svg" id="wireframes"/>

> This design was planned before on paper, then moved to Figma app for the fine details.
Note that i didn't use any styling library or theme, all from scratch and using pure css modules

| Landing  | Home/Search  | Routes  |
| -----| -----| -----|
| ![Landing](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/wireframes/Landing.png) | ![Home/Search](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/wireframes/Main_passenger.png) | ![Routes](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/wireframes/Expanded_Passenger.png) |

| Bus Driver  | Viewing Routes  | Adding Route  |
| -----| -----| -----|
| ![Van Driver](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/wireframes/Main%20(van).png) | ![Viewing Routes](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/wireframes/Expanded%20(van).png) | ![Adding Route](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/wireframes/Adding%20Route.png) |

| Landing  | Home/Search  | Routes  |
| -----| -----| -----|
| ![Landing](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/Landing.png) | ![Home/Search](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/Main%20npassenger.png) | ![Routes](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/Expanded%20Passenger.png) |

| Bus Driver  | Viewing Routes  | Adding Route  |
| -----| -----| -----|
| ![Van Driver](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/Main%20(van).png) | ![Viewing Routes](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/Expanded%20(van).png) | ![Adding Route](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/Adding%20Route.png) |

| Admin Panel  | Admin Analytics  |
| -----| -----|
| ![Admin Panel](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/admin_panel.png) | ![Admin Analytics](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/mockups/admin_analytics.png) |

<br><br>

<img src="./readme/title4.svg" id="impplementation"/>

Here's a brief high-level overview of the tech stack the Well app uses:

- This project uses [React Native mobile app framework](https://reactnative.dev/). React Native is an open-source UI software framework created by Meta Platforms, Inc. It is used to develop mobile applications by enabling developers to use the React framework along with native platform capabilities.
- This project uses [Angular web app framework](https://angular.io/). Angular is a TypeScript-based free and open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations.
- This project uses [Laravel PHP web framework](https://laravel.com/). Laravel is a free and open-source PHP web framework intended for the development of web applications following the model–view–controller architectural pattern and based on Symfony.
- For persistent storage (database), the app uses [MySQL](https://www.mysql.com/). MySQL is an open-source relational database management system.
- To view driver's live location, the app uses the a [NodeJS runtime environment](https://nodejs.org/en/) server.
- In order to use [Google Maps API](https://developers.google.com/maps) for location and map cabs, the app uses [react-native-maps library](https://github.com/react-native-maps/react-native-maps)



<br><br>
<img src="./readme/title5.svg" id="how-to-run"/>

> Using the above mentioned tecch stacks and the wireframes build with figma from the user sotries we have, the implementation of the app is shown as below, these are screenshots from the real app

| Landing | Light-Dark Theme | Passenger-Driver Live Location | 
|---|---|---|
| <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/login.jpg"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/dark-theme.gif"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/live-location.gif"> |

| Searching for Destination | Passenger Choosing Ride Type | Passenger Choosing Path |
|---|--- |---|
| <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/searching.gif"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/choosing-ride-type.gif"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/choosing-path%20(2).gif"> |

| Passenger Booking seat | Passenger Traversing Path | Updating Profile |
|---|---|---|
| <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/booking-seat.gif"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/traversing-route.gif"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/updating-profile.gif"> |

| Bus Choosing Presaved Route | Bus Delaying Routes | Bus Adding Routes |
|---|--- |---|
| <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/choosing-route.gif"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/delaying-routes.gif"> | <img width="230px" src="https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/adding-route.gif"> |

| Admin Bus driver |
|---|
| ![Admin bus driver](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/bus-drivers.PNG) |

| Bus Driver Information |
|---|
| ![bus driver information](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/driver-info.PNG) |

| Admin Analytics |
|---|
| ![bus driver information](https://github.com/ali-ismail02/wen-wasel/blob/main/demo/implementations/analytics.PNG) |

<br><br>
<img src="./readme/title6.svg"/>


> This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- Download and Install [Node.js](https://nodejs.org/en/)
- Download and Install [Composer](https://getcomposer.org/download/)
- Download and Install [XAMPP](https://www.apachefriends.org/download.html)

- npm
  ```sh
  npm install npm@latest -g
  ```
- Nodemon
  ```sh
  npm install -g nodemon
  ```
- Expo CLI
  ```sh
  npm install --global expo-cli
  ```
- Expo Go app for iOS and Android
  > 🤖 [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) - Android Lollipop (5) and greater.  
  > 🍎 [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) - iOS 11 and greater.
- Angular CLI
  ```sh
  npm install -g @angular/cli 
  ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/Hamze-Ammar/Parking-Finder.git
   ```

#### To Run The Mobile App

1. Navigate to the Frontend folder and install dependencies
   ```sh
   cd frontend
   npm install
   ```
2. Run the start up command
   ```sh
   expo start
   ```

#### To Run Admin panel (Angular)

1. Navigate to the admin-frontend/admin_frontend folder
   ```sh
   cd admin-frontend/admin_frontend
   ```
2. Run the follwoing command
   ```sh
   ng serve
   ```

#### To Run Laravel Server on your machine

1. Create a database locally named wen_waseldb

2. Navigate to the backend folder
   ```sh
   cd Parking-Finder/backend
   ```
3. Inside the .env file in your backend folder
   - Insert the db name as follow -> DB_DATABASE= -> DB_DATABASE=wen_waseldb
4. Run migration
   ```sh
   php artisan migrate
   ```
5. Run the seeder
   ```sh
   php artisan db:seed
   ```
6. Start the Server (local IP)
   ```sh
   php artisan serve --port 8000 --host "Your IP"
   ```
7. Start the Server (localhost)
   ```sh
   php artisan serve
   ```

#### To Run NodeJS Server (socket.io) on your machine

1. Navigate to the socket-backend/socket-server folder
   ```sh
   cd socket-backend/socket-serverd
   ```
2. Run the server
   ```sh
   npx nodemon
   ```
