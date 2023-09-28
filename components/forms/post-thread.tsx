'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { threadSchema, ThreadValues } from '@/lib/schemas/thread-schema';
import { createThread } from '@/lib/actions/thread.actions';

interface PostThreadProps {
  userId: string;
}

const PostThread: React.FC<PostThreadProps> = ({ userId }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      thread: '',
      accountId: userId,
    },
  });

  const onSubmit = async (values: ThreadValues) => {
    console.log(values);

    console.log(userId)
    await createThread({
      text: values.thread,
      user: userId,
      path: pathname,
      communityId: null
    });

    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-10'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel
                className='text-base-semibold text-light-2'
              >
                Thread
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea {...field} rows={8}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          Post
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
