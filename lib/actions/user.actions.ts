"use server"

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db'
import Thread from '../models/thread.model'
import User from '../models/user.model'

interface UpdateUserProps {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}

export async function updateUser({userId, username, name, bio, image, path}: UpdateUserProps): Promise<void> {

  
  try {

    connectDB()
    await User.findOneAndUpdate({id: userId}, {
      username,
      name,
      bio,
      image,
      onboarded: true
    }, {
      upsert: true
    })

  if(path === '/profile/edit') {
    revalidatePath(path)
  }
  } catch (error: any) {
   throw new Error(`Failed to update user: ${error.message}`)  
  }
}


export async function fetchUser(userId: string) {
  try {
    connectDB()
    return await User.findOne({id: userId})
        /* .populate({
        path: 'communities',
        model: Community
      }) */
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

export async function getUserPosts(userId: string) {
  try {
    connectDB()

    // TODO: populate community

    const threads = await User.findOne({id: userId})
      .populate({
        path: 'threads',
        model: Thread,
        populate: {
          path: 'children',
          model: Thread,
          populate: {
            path: 'user',
            model: User,
            select: "id name image"
          }
        }
      })
    
    return threads

  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
}

export async function getActivity(userId: string) {
  try {
    connectDB()
    const userThreads = await Thread.find({ user: userId })

    const childThreadsIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children)
    }, [])

    const replies = await Thread.find({
      _id: {
        $in: childThreadsIds
      },
      user: {
        $ne: userId
      }
    }).populate({
      path: 'user',
      model: User,
      select: "id name image"
    })
    return replies;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to fetch user activity: ${error.message}`)
  }

}