import { prisma } from "@/lib/db/prisma";
export type T_blog = {
  tags: {
    tag: string;
  }[];
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
export type T_getBlogsRes = { success: true; blogs: T_blog[] } | { success: false; error: string };
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return new Response(
      JSON.stringify({
        success: true,
        blogs,
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "something went wrong",
      }),
    );
  }
}
