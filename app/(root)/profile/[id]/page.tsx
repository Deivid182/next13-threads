import ProfileHeader from '@/components/shared/profile-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { profileTabs } from '@/constants'
import Image from 'next/image'
import ThreadsTab from '@/components/shared/threads-tab'

const ProfilePage = async ({ params }: { params: { id: string } }) => {

  const user = await currentUser()

  if(!user) {
    return null
  }

  const userInfo = await fetchUser(params.id)

  if(!userInfo?.onboarded) {
    redirect('/onboarding')
  }

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authId={userInfo.id}
        name={userInfo.name}
        username={userInfo.username}
        image={userInfo.image}
        bio={userInfo.bio}  
      />

      <div className='mt-8'>
        <Tabs defaultValue='threads'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                className='tab'
              >
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>
                {tab.label === 'Threads' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              <ThreadsTab
                accountId={userInfo.id}
                currentUserId={user.id}
                accountType='User'
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default ProfilePage