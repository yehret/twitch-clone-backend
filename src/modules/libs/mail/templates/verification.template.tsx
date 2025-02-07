import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface VerificationTemplateProps {
	domain: string
	token: string
}

export function VerificationTemplate({
	domain,
	token
}: VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`

	return (
      <Html>
         <Head />
         <Preview>Account verification</Preview>
         <Tailwind>
            <Body className='max-2-2xl mx-auto p-6 bg-slate-50'>
               <Section className='text-center mb-8'>
                  <Heading className='text-3xl text-black fond-bold'>Email verification</Heading>
                  <Text className='text-base text-black'>
                     Thank you for registration in TeaStream! Please click the button below to verify your email address:
                  </Text>
                  <Link href={verificationLink} className='inline-flex justify-center items-center rounded-md text-sm fond-medium text-white bg-[#18B9AE] px-5 py-2'>
                     Verify email
                  </Link>
               </Section>

               <Section className='text-center mt-8'>
                  <Text className='text-gray-600'>
							If you have any questions or encounter difficulties, feel free to contact our support service at{' '}
							<Link 
								href="mailto:test_mail@mail.net" 
								className="text-[#18b9ae] underline"
							>
								test_mail@mail.net
							</Link>.
						</Text>
               </Section>
            </Body>
         </Tailwind>
      </Html>
   )
}
