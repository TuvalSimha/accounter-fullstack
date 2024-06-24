import { ReactElement, useEffect } from 'react';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { userService } from '../services/user-service';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';


const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
})

export function LoginPage(): ReactElement {
  useEffect(() => {
    userService.logout();
  }, []);
  const navigate = useNavigate();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      userService.login(values.username, values.password).then(
        _user => {
          navigate('/');
        },
      )
      toast({
        title: 'Success',
        description: 'You have successfully logged in.',
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      })
    }
  }
  return (
    <div className="w-full flex flex-col justify-center items-center h-screen lg:grid lg:min-h-[200px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[300px]">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Accounter</h1>
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your credentials to login.
              </p>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              className='w-full font-semibold' type="submit">Login</Button>
          </form>
        </Form>
      </div>
      <div className="hidden bg-muted lg:block bg-black rounded-tl-3xl rounded-bl-3xl">
        <div className='flex flex-row justify-center items-center h-screen'>
          <svg
            width="100"
            height="100"
            viewBox="0 0 51 54"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.06194 20.2745C2.68522 20.4867 3.35002 20.6073 4.04393 20.6073C4.6672 20.6073 5.26838 20.5117 5.83612 20.3391V36.7481C5.83612 37.328 6.14561 37.8684 6.64488 38.1582L22.3391 47.2835C23.0814 46.4108 24.1808 45.8554 25.4084 45.8554C26.7446 45.8554 27.927 46.5134 28.6639 47.5218C28.6769 47.5403 28.6909 47.5576 28.7039 47.5756C28.7557 47.6494 28.8041 47.7248 28.8511 47.8026L28.9049 47.891C28.9465 47.9626 28.9849 48.0355 29.0214 48.1093C29.0414 48.1489 29.0603 48.1891 29.0792 48.2294C29.1105 48.2978 29.14 48.3673 29.1681 48.4378C29.1881 48.4882 29.2059 48.5388 29.2237 48.5899C29.2462 48.6544 29.2684 48.7195 29.2873 48.7852C29.3056 48.8477 29.3202 48.9107 29.3359 48.9737L29.3762 49.1513C29.3918 49.23 29.4021 49.3097 29.4129 49.3902C29.4188 49.4379 29.428 49.4847 29.4323 49.5324C29.4448 49.6627 29.4523 49.7941 29.4523 49.9277C29.4523 50.1406 29.4313 50.3474 29.3994 50.5516L29.3881 50.6275C29.0576 52.5406 27.4007 54 25.4084 54C23.6318 54 22.1227 52.8386 21.5809 51.2314L4.7578 41.4502C3.08905 40.4806 2.06194 38.6876 2.06194 36.7481V20.2745ZM46.0991 10.2908C48.3291 10.2908 50.1428 12.1173 50.1428 14.3631C50.1428 15.5848 49.6037 16.6794 48.755 17.4265V36.7481C48.755 38.6876 47.7279 40.4806 46.0591 41.4502L31.6051 49.8539C31.5889 48.479 31.1274 47.2135 30.3619 46.1876L44.1722 38.1582C44.6713 37.8684 44.9809 37.328 44.9809 36.7481V18.2736C43.2938 17.7838 42.0554 16.2179 42.0554 14.3631C42.0554 13.4601 42.3524 12.6277 42.8485 11.9517C42.856 11.9409 42.8641 11.9306 42.8717 11.9197C42.9655 11.7948 43.0657 11.6743 43.1725 11.5608L43.187 11.545C43.4086 11.3127 43.6567 11.1079 43.9274 10.9337C43.9553 10.9152 43.985 10.8984 44.0136 10.8804C44.1209 10.8158 44.2303 10.755 44.3435 10.7002C44.3765 10.6844 44.4094 10.6671 44.4427 10.6519C44.5846 10.5878 44.7291 10.5286 44.879 10.4814C44.879 10.4819 44.8796 10.4814 44.879 10.4814L45.173 10.3994C45.4705 10.3287 45.7805 10.2908 46.0991 10.2908ZM40.5727 19.0708V32.5386C40.5727 34.1339 39.7202 35.6206 38.3486 36.4181L27.5398 42.696L26.5424 43.2466L26.5543 42.0944V37.3194L35.4506 32.1471V27.4102L27.8779 25.24L40.5727 19.0708ZM10.2444 19.0627L15.3665 21.593V32.1467L24.1279 37.2409V43.1973L12.4684 36.4189C11.0968 35.6206 10.2444 34.1339 10.2444 32.5388V19.0627ZM23.1844 9.96788C24.5349 9.18328 26.2818 9.18328 27.6325 9.96788L39.4904 16.8956L38.3636 17.4327L33.9644 19.6061L25.4084 14.6315L16.8523 19.6061L11.3442 16.8843L12.4026 16.2425C12.4123 16.2338 12.4398 16.2153 12.4694 16.1985L23.1844 9.96788ZM25.4083 0C26.3394 0 27.27 0.242165 28.1041 0.72704L42.644 9.18112C41.5737 9.9076 40.7455 10.9637 40.2899 12.2006L26.217 4.01908C25.9718 3.87572 25.6919 3.80081 25.4083 3.80081C25.1248 3.80081 24.8454 3.87572 24.5995 4.01908L8.02283 13.6574C8.06272 13.887 8.08753 14.1216 8.08753 14.3632C8.08753 16.1154 6.98116 17.608 5.43643 18.1814C5.42457 18.1858 5.41217 18.1906 5.40031 18.1944C5.27792 18.2385 5.15392 18.2765 5.02666 18.3085L4.95065 18.328C4.83419 18.3551 4.71503 18.3764 4.59533 18.3931L4.49775 18.4079C4.3484 18.4246 4.19742 18.4356 4.04377 18.4356C3.87932 18.4356 3.71758 18.4225 3.55743 18.403C3.5143 18.3974 3.47225 18.3899 3.42965 18.3834C3.30673 18.3643 3.18595 18.34 3.06679 18.3101C3.03012 18.3008 2.99347 18.2921 2.95681 18.2819C2.64139 18.1922 2.3416 18.0679 2.06177 17.9088L1.82144 17.7607C0.725648 17.0318 0 15.7822 0 14.3632C0 12.1175 1.81431 10.2909 4.04377 10.2909C4.62229 10.2909 5.17117 10.4158 5.66881 10.6368L22.7124 0.72704C23.5465 0.242165 24.4777 0 25.4083 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};