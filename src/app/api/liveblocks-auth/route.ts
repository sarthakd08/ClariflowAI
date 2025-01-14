import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET_KEY || '',
});

export async function POST(request: Request) {
  // Get the current user from your database
//   const user = __getUserFromDB__(request);
  const user = await currentUser();
  
  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user?.primaryEmailAddress?.emailAddress || '',
    // { userInfo: user.metadata } // Optional
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
//   session.allow(`${user.organization}:*`, session.READ_ACCESS);
//   session.allow(`${user.organization}:${user.group}:*`, session.FULL_ACCESS);
    const {room} = await request.json();
    session.allow(room, session?.FULL_ACCESS)

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}