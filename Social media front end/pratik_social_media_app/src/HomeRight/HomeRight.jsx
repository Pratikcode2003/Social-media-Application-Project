import React from 'react'
import { Card } from '@mui/material'
import SearchUserHomeRight from './SearchUserHomeRight'
import { useNavigate } from 'react-router-dom'

const HomeRight = () => {
  const navigate = useNavigate()

  return (
    <Card className="px-5 py-3">
      <div className="flex justify-between py-5 items-center">
        <p className="font-semibold opacity-70">Suggestions for you</p>
        <p
          onClick={() => navigate("/users")}
          className="font-semibold opacity-95 cursor-pointer hover:scale-110 transition"
        >
          View All
        </p>
      </div>

      <SearchUserHomeRight />
    </Card>
  )
}

export default HomeRight
