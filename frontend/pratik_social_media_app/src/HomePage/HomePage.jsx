import React from 'react'
import { Route, Routes, useLocation } from "react-router-dom"
import MiddlePart from '../Components/MiddlePart/MiddlePart'
import Reels from '../Components/Reels/Reels'
import CreateReelsForm from '../Components/Reels/CreateReelsForm'
import Profile from '../Components/Profile/Profile'
import HomeRight from '../HomeRight/HomeRight'
import Sidebar from '../Components/Sidebar/Sidebar'
import AllUsers from '../HomeRight/AllUsers'

const HomePage = () => {
  const location = useLocation();

  const showHomeRightRoutes = [
    "/",
    "/reels",
    "/create-reels",
    "/users"
  ];

  const shouldShowHomeRight =
    showHomeRightRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/profile/");

  return (
    <div className="flex justify-center min-h-screen ">
      <div className="w-full max-w-[1400px] flex">

        {/* Left Sidebar */}
        <div className="hidden lg:block w-[17%] fixed left-0 top-0 h-screen">
          <div className="p-4 h-full overflow-hidden">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 h-screen overflow-y-auto hideScrollbar ${shouldShowHomeRight
              ? "lg:ml-[180px] lg:mr-[280px]"
              : "lg:ml-[180px]"
            } min-w-[87%]`}
        >

          <div className="w-[78%] py-4 px-4">
            <Routes>
              <Route path='/' element={<MiddlePart />} />
              <Route path='/reels' element={<Reels />} />
              <Route path='/create-reels' element={<CreateReelsForm />} />
              <Route path='/profile/:id' element={<Profile />} />
              <Route path='/users' element={<AllUsers />} />
              {/* REMOVED: <Route path='/message' element={<Message />} /> */}
            </Routes>
          </div>
        </div>

        {/* Right Sidebar */}
        {shouldShowHomeRight && (
          <div className="hidden lg:block w-[348px] fixed right-0 top-0 h-screen">
            <div className="p-4 h-full overflow-y-auto">
              <HomeRight />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage