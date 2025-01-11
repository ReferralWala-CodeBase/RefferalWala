const stats = [
    { id: 1, name: 'Professionals on the platform', value: '1,000+' },
    { id: 2, name: 'Job referrals available', value: '500+' },
    { id: 3, name: 'Genuine Referrals', value: '100%' },
    { id: 4, name: 'People got referrals', value: '130+' },
  ]
  
  export default function Stats() {
    return (
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by professionals worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Your trust is our greatest responsibility
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    )
  }
  