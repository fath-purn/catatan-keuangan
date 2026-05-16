// "use server";

// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
// import { formatDate, CATEGORY_LABELS, formatCamelCase } from "@/lib/utils";
// import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

// // POST
// export const getPost = unstable_cache(
//   async (currentPage, limit, search, category, publishedOnly = true) => {
//     try {
//       const page = Number(currentPage) || 1;
//       const take = Number(limit) || 10;
//       const skip = (page - 1) * take;

//       const whereClause: Prisma.PostWhereInput = {};

//       if (publishedOnly) {
//         whereClause.published = true;
//       }

//       if (search) {
//         whereClause.title = {
//           contains: search,
//           mode: "insensitive",
//         };
//       }

//       if (category) whereClause.category = category;

//       const [rows, totalPost] = await prisma.$transaction([
//         prisma.post.findMany({
//           where: whereClause,
//           skip,
//           take,
//           orderBy: { createdAt: "desc" },
//         }),
//         prisma.post.count({ where: whereClause }),
//       ]);

//       const post = rows.map((item) => ({
//         ...item,
//         createdAt: formatDate(item.createdAt.toISOString()),
//         categoryLabel:
//           CATEGORY_LABELS[item.category] || formatCamelCase(item.category),
//       }));

//       return {
//         data: post,
//         totalPages: Math.ceil(totalPost / take),
//         currentPage: page,
//         totalData: totalPost,
//         published: post.filter((p: { published: boolean }) => p.published)
//           .length,
//       };
//     } catch (err) {
//       console.error("Error fetching post:", err);
//       throw err;
//     }
//   },
//   ["post-list"],
//   {
//     revalidate: 1800,
//     tags: ["post"],
//   },
// );

// export const getPostById = unstable_cache(
//   async (id: string) => {
//     try {
//       const post = await prisma.post.findUnique({
//         where: { id },
//       });

//       return post;
//     } catch (err) {
//       console.error("Error fetching post by Id:", err);
//       return null;
//     }
//   },
//   ["post-detail-id"],
//   {
//     revalidate: 1800,
//     tags: ["post"],
//   },
// );
