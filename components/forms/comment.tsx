'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, CommentValues } from '@/lib/schemas/thread-schema';
import { addComment } from '@/lib/actions/thread.actions';
import Image from 'next/image';


interface CommentProps {
  threadId: string
  currentUserImage: string
  currentUserId: string
}

const Comment: React.FC<CommentProps> = ({ threadId, currentUserImage, currentUserId }) => {

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: '',
    },
  });

  const onSubmit = async (values: CommentValues) => {
    console.log(values);
    
    await addComment(threadId, values.comment, currentUserId, pathname);

    form.reset()
  };

  return (
    <Form {...form}>
      <form
         onSubmit={form.handleSubmit(onSubmit)}
        className='comment-form'
      >
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                  src={currentUserImage}
                  alt='profile picture'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input 
                  {...field}
                  placeholder='Type your comment here'
                  className='outline-none no-focus text-light-1'
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment