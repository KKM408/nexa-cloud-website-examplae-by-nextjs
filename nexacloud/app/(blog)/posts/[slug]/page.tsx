export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <p>Post detail for {params.slug} — coming in Task 11</p>
    </div>
  );
}
