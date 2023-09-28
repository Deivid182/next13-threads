import Image from 'next/image'
import Link from 'next/link'

interface ThreadCardProps {
  id: string
  currentUserId: string
  parentId: string | null
  text: string
  user: {
    id: string
    name: string
    image: string
  }
  createdAt: string
  community: {
    id: string,
    name: string
    image: string
  } | null
  comments: {
    user: {
      image: string
    }
  }[],
  isComment?: boolean
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  currentUserId,
  parentId,
  text,
  user,
  createdAt,
  community,
  comments,
  isComment
}) => {

  //TODO: implement the full funcionality for likes, reposts
  return (
    <article className={`w-full flex flex-col rounded-xl ${isComment ? 'px-0 xs:px-6' : 'bg-dark-2 p-6'}`}>
      <div className='flex items-center justify-between'>
        <div className='flex w-full flex-1 gap-4'>
          <div className='flex flex-col items-center'>
            <Link
              href={`/profile/${user.id}`}
              className='relative w-12 h-12'
            >
              <Image
                src={user.image}
                alt={'user image'}
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>
            <div className='thread-card_bar'/>
          </div>
          <div className='flex w-full flex-col'>
            <Link
              href={`/profile/${user.id}`}
              className='w-fit'
            >
              <h4 className='text-semibold text-light-1 cursor-pointer'>
                {user.name}
              </h4>
            </Link>
            <p className='mt-2 text-small-regular text-light-2'>
              {text}
            </p>
            <div className={`${isComment && 'mb-10'} mt-4 flex flex-col gap-4`}>
              <div className='flex gap-3'>
                <Image
                  src={'/images/heart-gray.svg'}
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Link
                  href={`/thread/${id}`}
                >
                  <Image
                    src={'/images/reply.svg'}
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Image
                  src={'/images/repost.svg'}
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src={'/images/share.svg'}
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>{comments.length} replies</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ThreadCard