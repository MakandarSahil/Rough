import { useQuery } from '@tanstack/react-query';

interface User {
  name: string;
}

export const fetchUser = async (): Promise<{ name: string; email: string }> => {
  await new Promise((res) => setTimeout(res, 1000));
  return { name: 'Sahil', email: 'sahil@example.com' };
};

export const useUserProfile = () =>
  useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUser,
  });
