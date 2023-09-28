"use client"
import Image from 'next/image'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'


interface UserCardProps {
  id: string
  name: string
  image: string
  personType: string
  username: string  
}

const UserCard: React.FC<UserCardProps> = ({
  id, name, image, personType, username
}) => {

  const router = useRouter()

  return (
    <div className='user-card'>
      <div className='user-card_avatar'>
        <Image 
          src={image}
          alt={name}
          width={48}
          height={48}
          className='rounded-full'
        />
        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>
            {name}
          </h4>
          <p className='text-small-medium text-light-2'>
            @{username}
          </p>
        </div>
      </div>
      <Button
        className='user-card_btn'
        onClick={() => router.push(`/profile/${id}`)}
      >
        View
      </Button>
    </div>
  )
}

export default UserCard