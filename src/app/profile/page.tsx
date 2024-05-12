import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/utils/nextAuthOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import Profile_nav from "./components/Profile_nav";
import User_Addresses from "./components/User_Addresses";
import User_Details from "./components/User_Details";
import User_Pic from "./components/User_Pic";
import User_ResetPass from "./components/User_ResetPass";

export default async function Profile_Page() {
  const userSession = await getServerSession(authOptions);
  if (!userSession?.user) return notFound();
  const user = await prisma.user.findUnique({
    where: {
      id: userSession.user.id,
    },
    select: {
      id: true,
      username: true,
      first_name: true,
      last_name: true,
      email: true,
      profile_pic: true,
      phone: true,
      address: {
        select: {
          id: true,
          address: true,
          user_id: true,
        },
      },
    },
  });
  if (!user) return notFound();
  const { address, profile_pic, ...userDetails } = user;

  return (
    <section className='profile_wrapper'>
      <Profile_nav />
      <section className='user_info sm:container sm:grid sm:grid-cols-2 md:grid-cols-3'>
        <User_Details userDetails={userDetails} />
        <div className='user_pick_address_wrapper border-y sm:border-y-0 py-2 my-5 relative sm:my-0 before:absolute before:top-0 before:left-1 before:h-full before:border-l-2  before:border-dashed sm:before:content-[""] after:absolute after:top-0 after:right-1 after:h-full after:border-l-2  after:border-dashed after:content-[""] after:hidden md:after:block'>
          <User_Pic userId={user.id} user_pic={user.profile_pic} />
          <User_Addresses session={userSession} addresses={address} />
        </div>
        <User_ResetPass />
      </section>
    </section>
  );
}
