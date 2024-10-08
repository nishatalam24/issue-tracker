import authOptions from "@/app/auth/authOptions";
import { patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session) return NextResponse.json({}, { status: 401 });

//   const body = await request.json();
//   const validation = patchIssueSchema.safeParse(body);
//   if (!validation.success)
//     return NextResponse.json(validation.error.format(), {
//       status: 400,
//     });

//   const { assignedToUserId, title, description } = body;

//   if (assignedToUserId) {
//     const user = await prisma.user.findUnique({
//       where: { id: assignedToUserId },
//     });
//     if (!user)
//       return NextResponse.json(
//         { error: "Invalid user." },
//         { status: 400 }
//       );
//   }

//   const issue = await prisma.issue.findUnique({
//     where: { id: parseInt(params.id) },
//   });
//   if (!issue)
//     return NextResponse.json(
//       { error: "Invalid issue" },
//       { status: 404 }
//     );

//   const updatedIssue = await prisma.issue.update({
//     where: { id: issue.id },
//     data: {
//       title,
//       description,
//       assignedToUserId
//     },
//   });

//   return NextResponse.json(updatedIssue);
// }



export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate request body using the schema
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { assignedToUserId, title, description, status } = validation.data;

  // Validate assigned user
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user) {
      return NextResponse.json({ error: 'Invalid user.' }, { status: 400 });
    }
  }

  // Validate existing issue
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id, 10) },
  });
  if (!issue) {
    return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
  }

  try {
    // Update the issue in the database
    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id },
      data: {
        title,
        description,
        status, // Include status field in the update
        assignedToUserId,
      },
    });

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue)
    return NextResponse.json(
      { error: "Invalid issue" },
      { status: 404 }
    );

  await prisma.issue.delete({
    where: { id: issue.id },
  });

  return NextResponse.json({});
}
