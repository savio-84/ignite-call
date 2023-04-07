import { Button, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Form, FormAnnotation } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";
import { useRouter } from "next/router";

const claimUsernameFormSchema = z.object({
  username: z
  .string()
  .min(3, {message: 'Digite um nome de usuário com no mínimo 3 letras.'})
  .regex(/^[a-z0-9\\-]+$/i, {
    message: 'O usuário pode conter apenas letras, números e hifens.'
  })
  .transform(username => username.toLowerCase())
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  async function handleClaimUseraname(data: ClaimUsernameFormData) {
    const { username } = data;
    await router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUseraname)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
          />
        <Button
          size="sm"
          type="submit"
          disabled={isSubmitting}
          >
          Reservar
          <ArrowRight/>
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username ? errors.username.message : 'Digite o nome do usuaário'}
        </Text>
      </FormAnnotation>
    </>
  );
}