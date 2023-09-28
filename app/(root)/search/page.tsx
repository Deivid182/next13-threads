import UserCard from '@/components/cards/user-card'
import { getUsers } from '@/lib/actions/thread.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const SearchPage = async () => {

  const user = await currentUser()

  if(!user) {
    return null
  }

  const userInfo = await fetchUser(user.id)

  if(!userInfo?.onboarded) {
    redirect('/onboarding')
  }

  const result = await getUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
    sortBy: 'desc'
  })

  console.log(result)

  return (
    <section>
      <h1 className='mb-10 head-text'>
        Search
      </h1>
      <div className='mt-14 flex flex-col gap-10'>
        {result.users.length === 0 ? (
          <p className='no-result'>No users found</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user._id.toString()}
                id={user._id.toString()}
                name={user.name}
                username={user.username}
                image={user.image}
                personType={'User'}
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}

export default SearchPage