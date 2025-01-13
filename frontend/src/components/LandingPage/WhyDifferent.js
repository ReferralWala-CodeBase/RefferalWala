import { MagnifyingGlassIcon, DocumentPlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Create an account',
    description:
      'Register using your google account or email id to create a free account on our website today.',
    href: '#',
    icon: DocumentPlusIcon,
  },
  {
    name: 'Build your profile',
    description:
      'Make a strong and appealing profile to attract more samaritans.',
    href: '#',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Search and Apply',
    description:
      'Start looking for job referrals as per your preferences and apply for them.',
    href: '#',
    icon: MagnifyingGlassIcon,
  },
]

export default function WhyDifferent() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Faster referrals</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to get a referral
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
          "Sign up for free, craft a standout profile, and unlock job referrals tailored to your dreams with ReferralWala!"
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    {/* <a href={feature.href} className="text-sm font-semibold leading-6 text-indigo-400">
                      Learn more <span aria-hidden="true">→</span>
                    </a> */}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
