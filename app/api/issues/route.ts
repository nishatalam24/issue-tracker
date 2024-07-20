// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/prisma/client';
// import { issueSchema } from '../../validationSchemas';
// import { getServerSession } from 'next-auth';
// import authOptions from '@/app/auth/authOptions';

// export async function POST(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session)
//     return NextResponse.json({}, { status: 401 });

//   const body = await request.json();
//   const validation = issueSchema.safeParse(body);
//   if (!validation.success)
//     return NextResponse.json(validation.error.format(), { status: 400 });

//   const newIssue = await prisma.issue.create({
//     data: { title: body.title, description: body.description },
//   });

//   return NextResponse.json(newIssue, { status: 201 });
// }
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { issueSchema } from '../../validationSchemas';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate request body using the schema
  const validation = issueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // Extract validated data
  const { title, description, status } = validation.data;

  try {
    // Create a new issue in the database
    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        status, // Include status field in the data
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
