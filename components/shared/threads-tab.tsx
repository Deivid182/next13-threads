import { getUserPosts } from '@/lib/actions/user.actions'
import ThreadCard from '../cards/thread-card'

interface ThreadsTabProps {
  accountId: string
  currentUserId: string
  accountType: string
}

const ThreadsTab: React.FC<ThreadsTabProps> = async ({
  accountId, currentUserId, accountType
}) => {

  const result = await getUserPosts(accountId)

  console.log(result, 'result')

  return (
    <div className='mt-10 flex flex-col gap-10'>
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          text={thread.text}
          createdAt={thread.createdAt}
          community={thread.community}
          comments={thread.comments}
          user={accountType === 'User'
            ? {
              id: result.id,
              name: result.name,
              image: result.image
            }
              :
            {
              id: thread.user.id,
              name: thread.user.name,
              image: thread.user.image
            }
          }
        />
      ))}
    </div>
  )
}

export default ThreadsTab