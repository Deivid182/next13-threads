'use client';

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { UserSchema, UserValues } from '@/lib/schemas/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

interface AccountProfileProps {
  userData: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile: React.FC<AccountProfileProps> = ({
  userData,
  btnTitle,
}) => {

  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing('media')

  const pathname = usePathname()
  const router = useRouter()

  const form = useForm<UserValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: userData.username || '',
      name: userData.name || '',
      bio: userData.bio || '',
      image: userData.image || '',
    },
  });

  
  /**
   * Handles the image change event and updates the value using the provided onChange callback.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered by the input element.
   * @param {(value: string) => void} onChange - The callback function to update the value.
   */
  const handleImage = (e: ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    e.preventDefault()
    
    //new FileReader
    const reader = new FileReader()


    //checks if the file exists
    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      setFiles(Array.from(e.target.files))

      if(!file.type.includes('image')) {
        return
      }

      reader.onload = async (event) => {
        const result = event.target?.result?.toString() || ''

        onChange(result)
      }

      reader.readAsDataURL(file)
    }
  }
  async function onSubmit(values: UserValues) {
    const blob = values.image

    const hasImageChanged = isBase64Image(blob)

    if(hasImageChanged) {
      const imgRes = await startUpload(files)

      if(imgRes && imgRes[0].url) {
        values.image = imgRes[0].url
      }
    }

    await updateUser({
      userId: userData.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.image,
      path: pathname
    })

    if(pathname === '/profile/edit') {
      router.back()
    } else {
      router.push('/')
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-10'>
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile'
                    width={100}
                    height={100}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/images/profile.svg'
                    alt='profile'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input 
                  placeholder='Upload a photo' 
                  type='file'
                  accept='image/*'
                  className='account-form_image-input'
                  onChange={e => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input 
                  placeholder='John Doe' 
                  {...field}
                  type='text'
                  className='account-form_input m-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input 
                  placeholder='John Doe3000' 
                  {...field}
                  type='text'
                  className='account-form_input m-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Textarea
                  placeholder='A few words about you...' 
                  {...field}
                  rows={6}
                  className='account-form_input m-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='bg-primary-500' type='submit'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
