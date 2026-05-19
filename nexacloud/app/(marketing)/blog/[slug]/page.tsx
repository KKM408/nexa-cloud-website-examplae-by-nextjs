// app/(marketing)/blog/[slug]/page.tsx
export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  return <div>博客详情: {params.slug} — 建设中</div>;
}
