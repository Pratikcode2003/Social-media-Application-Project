import React from "react";
import Login from "./Login";
import Register from "./Register";
import Card from "@mui/material/Card";
import { useLocation } from "react-router-dom";
import Groups3Icon from '@mui/icons-material/Groups3';

const Authentication = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="relative h-screen w-screen flex items-center">

      {/* Full Screen Background Image */}
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfkkPnSBxXY29USeSbfStLFJL8CeY_COsYWA&s"
        alt="login page image"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Welcome Message on Left Side */}
      <div className="absolute top-0 left-0 h-full w-[60%] flex flex-col justify-center items-start px-20">
        <h1 className="text-4xl font-bold text-white mb-1">
          Welcome to
        </h1>
        <h1 className="text-6xl font-bold text-white mb-2 transition-colors duration-300 hover:text-emerald-200">Social Media Application</h1>
        <p className="text-1xl  opacity-90 text-blue-200">
          Connect, share, and engage with people around you
        </p>
      </div>

      {/* Centered Card On The Right */}
      <div className="absolute top-0 right-0 h-full w-[40%] flex justify-center items-center px-10">
        <Card className="p-8 w-full max-w-[450px]">

          <div className="flex flex-col items-center mb-5 space-y-1">

            <h1 className="logo text-center font-bold text-2xl flex items-center justify-center transition-colors duration-300 hover:text-indigo-400">
              <Groups3Icon
                className="mr-2"
                sx={{ fontSize: 32 }}
              />
              TOGETHERLY
            </h1>

            <p className="text-center text-sm w-[70%]">
              Your social media application
            </p>
          </div>

          {/* Render Login or Register based on current path */}
          {isLoginPage ? <Login /> : <Register />}

        </Card>
      </div>

    </div>
  );
};

export default Authentication;