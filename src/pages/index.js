
import Link from 'next/link'
import groq from 'groq'
import client from '../../sanityClient'

const Index = ({ posts, formattedDate }) => {
  return (
    <div>
      <h1>Welcome to a blog!</h1>
      {posts.length > 0 && posts.map(
        ({ _id, title = '', slug = '', publishedAt = '' }) =>
          slug && (
            <li key={_id}>
              <Link href={`/post/${encodeURIComponent(slug.current)}`}>
                {title}
              </Link>{' '}
              ({new Date(publishedAt).toDateString()})
            </li>
          )
      )}
      <p>
        This page is server-side rendered. It was rendered on {formattedDate}.
      </p>
    </div>
  )
}

export async function getServerSideProps() {
  const renderDate = Date.now();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "long",
  }).format(renderDate);
  console.log(
    `SSR ran on ${formattedDate}. This will be logged in CloudWatch.`
  );

  const posts = await client.fetch(groq`
  *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
`)
  return {
    props: {
      posts,
      formattedDate
    }
  }

  return { props: { formattedDate } };
}

export default Index