import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '../../models/user/user';


type NewUser = Omit<User, 'id'>;

const UserController = (supabase: SupabaseClient) => {
  const create = async (user: NewUser): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data as User;
  };

  const findById = async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }

    return data as User;
  };

  const deleteById = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user by ID:', error);
      return false;
    }

    return true;
  };

  return { create, findById, deleteById };
};

export { UserController, User, NewUser };