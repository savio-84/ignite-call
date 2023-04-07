import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, {message: 'Digite um nome de usuário com no mínimo 3 letras.'})
    .regex(/^[a-z0-9\\-]+$/i, {
      message: 'O usuário pode conter apenas letras, números e hifens.'
    })
    .transform(username => username.toLowerCase()),
  name: z
    .string()
    .min(3, {message: 'Digite um nome de usuário com no mínimo 3 letras.'})
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const { register, handleSubmit, formState: {errors, isSubmitting}, setValue} = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema)
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) setValue('username', String(router.query.username));
  }, [router.query?.username])

  async function handleRegister({name, username}: RegisterFormData) {
    try {
      await api.post('/users', {
        name,
        username,
      })
    } catch(error: any) {
      if (error instanceof AxiosError && error?.response?.data?.message) alert(error.response.data.message);
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">
              Nome de usuário
            </Text>
            <TextInput 
              prefix="ignite.com/" 
              placeholder="seu-usuario" 
              {...register('username')}
            />
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>

          <label>
            <Text size="sm">
              Nome completo
            </Text>
            <TextInput 
              placeholder="Seu nome" 
              {...register('name')}
            />
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight/>
          </Button>
        </Form>
      </Header>
    </Container>
  );
}