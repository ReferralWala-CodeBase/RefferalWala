import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "Does ReferralWala charge money for using the platform?",
    answer:
      "No. ReferralWala is offering free access to all its users throughout the year 2025.",
  },
  {
    question: "Does ReferralWala provide referrals to its users?",
    answer:
      "No, ReferralWala does not provide referrals to its user. It provides a platform where users may give referrals to other users.",
  },
  {
    question: "Is it an Indian company?",
    answer:
      "Yes, ReferralWala is an Indian company.",
  },
  {
    question: "Is there a limit to how many referrals I can make?",
    answer:
      "No, there is no limit to the number of referrals you can make. ReferralWala encourages users to actively participate in the referral ecosystem.",
  },
  {
    question: "What industries or job roles does ReferralWala support?",
    answer:
      "ReferralWala supports a wide range of industries and job roles, making it suitable for professionals across diverse domains.",
  },
  {
    question: "How can I get started with ReferralWala?",
    answer:
      "Simply sign up on the platform, complete your profile, and start exploring opportunities to give or receive referrals.",
  },

]

export default function Faq() {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-white/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-white">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-white/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-white">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-300">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
