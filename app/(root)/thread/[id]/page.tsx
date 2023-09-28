import ThreadCard from '@/components/cards/thread-card'
import Comment from '@/components/forms/comment'
import { getThreadById } from '@/lib/actions/thread.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const ThreadPage = async ({ params }: { params: { id: string } }) => {

  if(!params.id) {
    return null
  }

  const user = await currentUser()

  if(!user) {
    return null
  }

  const userInfo = await fetchUser(user.id)

  if(!userInfo?.onboarded) {
    redirect('/onboarding')
  }

  const thread = await getThreadById(params.id)

  console.log(thread)

  return (
    <div className='relative'>
      <div>
        <ThreadCard 
          key={thread._id.toString()} 
          id={thread._id.toString()}
          currentUserId={user.id}
          parentId={thread.parentId}
          text={thread.text}
          user={thread.user}
          createdAt={thread.createdAt}
          community={thread.community}
          comments={thread.children}
        />
      </div>
      <div className='mt-7'>
        <Comment
          threadId={thread._id.toString()}
          currentUserImage={userInfo.image}
          currentUserId={userInfo._id.toString()}
        />
      </div>
      <div className='mt-10 space-y-4'>
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id.toString()}
            id={comment._id.toString()}
            currentUserId={user.id}
            parentId={thread._id}
            text={comment.text}
            user={comment.user}
            community={comment.community}
            comments={comment.children}
            createdAt={comment.createdAt}
            isComment
          />
        ))}
      </div>
    </div>
  )
}

export default ThreadPage