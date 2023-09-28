import ThreadCard from '@/components/cards/thread-card'
import getPosts from '@/lib/actions/thread.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
const Home = async () => {

  const data = await getPosts(1, 30)
  const user = await currentUser()

  if(!user) {
    redirect('/sign-in')
  }

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {data?.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {data?.posts.map((post) => {

              console.log(post)

              return (
              <ThreadCard 
                key={post._id.toString()} 
                id={post._id.toString()}
                currentUserId={user.id}
                parentId={post.parentId}
                text={post.text}
                user={post.user}
                createdAt={post.createdAt}
                community={post.community}
                comments={post.children}
              />
            )})}
          </>
        )}
      </section>
    </>
  )
}

export default Home