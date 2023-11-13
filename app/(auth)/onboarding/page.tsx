import AccountProfile from '@/components/forms/account-profile'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const Home = async () => {

  const user = await currentUser()
  if(!user) {
    return null
  }

  const userInfo = await fetchUser(user.id)

  if(!userInfo?.onboarded) {
    redirect('/')
  }

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName,
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  }

  return (
    <main className='mx-auto flex max-w-3xl flex-col px-10 py-20'>
      <h3 className='head-text'>Onboarding</h3>
      <p className='text-light-2 text-base-regular mt-4'>
        Complete your profile to get started.
      </p>
      <section className='mt-10 bg-dark-2 p-10'>
        <AccountProfile
          userData={userData}
          btnTitle='Complete Profile'
        />
      </section>
    </main>
  )
}

export default Home