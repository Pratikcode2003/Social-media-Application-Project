import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersAction } from "../Redux/Auth/auth.action";
import PopularUserCard from "./PopularUserCard";
import { Card, Skeleton } from "@mui/material";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, loading } = useSelector(store => store.auth);

  useEffect(() => {
    dispatch(getAllUsersAction());
  }, [dispatch]);

  return (
    <Card className="p-6 rounded-xl shadow-md bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold tracking-wide">
          Discover People
        </h2>
        <span className="text-sm text-gray-400">
          {allUsers?.length || 0} users
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={60}
              sx={{ bgcolor: "rgba(255,255,255,0.08)", borderRadius: "12px" }}
            />
          ))}
        </div>
      )}

      {/* Users List */}
      {!loading && (
        <div className="space-y-3">
          {allUsers?.map(user => (
            <div
              key={user.id}
              className="transition-all duration-300 hover:scale-[1.02]"
            >
              <PopularUserCard user={user} />
            </div>
          ))}

          {allUsers?.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              No users found
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default AllUsers;
