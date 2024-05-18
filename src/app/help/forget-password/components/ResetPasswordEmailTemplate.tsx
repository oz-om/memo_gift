import { Body, Link, Container, Head, Hr, Html, Img, Preview, Section, Tailwind, Text } from "@react-email/components";
import React from "react";

export default function ResetPasswordTemplate({ confirmURL }: { confirmURL: string }) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Reset your Memory-Gift password, Forgot your password? No problem, we&apos;ve all been there.</Preview>
        <Body className='bg-white font-sans'>
          <Container className='mx-auto pt-5 pb-12 '>
            <Section>
              <Img src={`https://omzid.serv00.net/images/app-mail-logo.png`} width='170' height='90' alt='Memory_Gift' className='mx-auto' />
            </Section>
            <Text className='text-lg'>Hi dear,</Text>
            <Text className='text-lg'>Forgot your password? No problem, we&apos;ve all been there. Click the button below to reset your password.</Text>
            <Section className='text-center cursor-pointer'>
              <Link href={confirmURL} target='_blank' className='cursor-pointer max-w-40 mx-auto bg-slate-500 text-teal-300 rounded p-3 text-center no-underline block'>
                Reset Password
              </Link>
            </Section>
            <Text className='text-lg'>
              Best,
              <br />
              The Memory_Gift team
            </Text>
            <Hr className='bg-slate-500 h-[1px]' />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
