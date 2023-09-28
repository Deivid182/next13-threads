"use server"
import { revalidatePath } from 'next/cache'
import { connectDB } from '../db'
import Thread from '../models/thread.model'
import User from '../models/user.model'
import { FilterQuery, SortOrder } from 'mongoose'

interface IParams {
  text: string
  user: string
  communityId: string | null
  path: string
}

export async function createThread({ text, communityId, user, path }: IParams) {
  try {
    await connectDB()

    const thread = await Thread.create({
      text,
      user,
      community: null,
    })

    await User.findByIdAndUpdate(user, {
      $push: {
        threads: thread._id
      }
    })

    revalidatePath(path)

  } catch (error: any) {
    console.log(error)
  }
}

export default async function getPosts(pageNumber = 1, pageSize = 20) {
  try {
    await connectDB()

    // calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize

    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: 'desc' })
      .populate({ path: 'user', model: User })
      .populate({
        path: 'children',
        populate: {
          path: 'user',
          model: User,
          select: "_id name parentId image"
        }
      })

    const totalPosts = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

    const posts = await postsQuery.exec()

    const isNext = totalPosts > skipAmount + posts.length

    return {
      posts,
      isNext
    }

  } catch (error: any) {
    console.log(error)
  }

}

export async function getThreadById(id: string) {
  try {
    connectDB()
    const thread = await Thread.findById(id)
      .populate({
        path: 'user',
        model: User,
        select: "_id id name image"
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'user',
            model: User,
            select: "_id id name parentId image"
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'user',
              model: User,
              select: "_id id name parentId image"
            }
          }
        ]
      }).exec()
    return thread
  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to fetch thread: ${error.message}`)
  }
}

export async function addComment(threadId: string, commentText: string, userId: string, path: string) {
  try {
    connectDB()

    const thread = await getThreadById(threadId)

    if (!thread) {
      throw new Error('Thread not found')
    }

    const comment = new Thread({
      text: commentText,
      user: userId,
      parentId: threadId
    })

    const savedComment = await comment.save()

    thread.children.push(savedComment._id)

    await thread.save()

    revalidatePath(path)

  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to add comment: ${error.message}`)
  }
}

export async function getUsers(
  { userId, searchString = '', pageNumber = 1, pageSize = 20, sortBy = 'desc' }
  : { userId: string, searchString?: string, pageNumber?: number, pageSize?: number, sortBy: SortOrder }) {

  try {
    connectDB()

    const skipAmount = (pageNumber - 1) * pageSize

    const regex = new RegExp(searchString, 'i')

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    }

    if (searchString.trim() !== '') {
      query.$or = [
        { name: { $regex: regex} },
        { username: { $regex: regex} },
      ]
    }

    const sortOptions = {
      createdAt: sortBy,
    }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUsers = await User.countDocuments(query)

    const users = await usersQuery.exec()

    return {
      users,
      isNext: totalUsers > skipAmount + users.length
    }

  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}