'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Please enter customer name.'),
    email: z
        .string()
        .min(1, 'Please enter customer email.')
        .email('Please enter a valid email address.'),
    imageUrl: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' || val === undefined ? null : val))
        .nullable(),
});

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        imageUrl?: string[];
    };
    message?: string | null;
};
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CreateCustomer = FormSchema.omit({ id: true });
const UpdateCustomer = FormSchema.omit({ id: true });

export async function createCustomer(prevState: State, formData: FormData) {
    // Normalize raw values from FormData
    const raw = {
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        imageUrl: String(formData.get('imageUrl') ?? ''),
    };

    const validated = CreateCustomer.safeParse(raw);

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to create customer.',
        };
    }

    const { name, email, imageUrl } = validated.data;

    try {
        await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${imageUrl})
    `;
    } catch (err) {
        console.error('Database Error:', err);
        return { message: 'Failed to create customer due to server error.' };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(
  id: string,
  prevState: State,
  formData: FormData,
) {  
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('image_url'),
  });  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  const { name, email, imageUrl } = validatedFields.data;
  try {
    await sql`
    UPDATE customers
    SET name = ${name}, email = ${email}, image_url = ${imageUrl}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  // throw new Error('Failed to Delete Customer');
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }
  revalidatePath('/dashboard/customers');
}