import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
export default function SectionTwo() {
  const features = [
    {
      name: "Peace of Mind",
      description:
        "Double confirmation process ensures accurate and secure token transfers, reducing errors and enhancing trust.",
      icon: UserIcon,
    },
    {
      name: "Flexibility",
      description:
        "Gas fee flexibility allows for smoother transactions, regardless of wallet balances or timing.",
      icon: CloudArrowUpIcon,
    },
    {
      name: "Suitable for All",
      description:
        "Designed to handle transactions of any size, from individual users to large organizations, with the same level of care and precision.",
      icon: LockClosedIcon,
    },
    {
      name: "Enhanced Security",
      description:
        "Active participation and verification from both parties boost transaction security and reliability in DeFi platforms.",
      icon: LockClosedIcon,
    },
    {
      name: "Building Trust in DeFi",
      description:
        "By ensuring mutual verification and consent, HandShake Protocol fosters a more trustworthy and secure ecosystem for digital transactions, promoting wider adoption of DeFi services.",
      icon: UserIcon,
    },
  ];

  return (
    <>
      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  Trasfer With HandShake
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  A better workflow
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  The HandShake Protocol offers several key benefits that
                  enhance the security, flexibility, and reliability of token
                  transfers in the DeFi space.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <Image
              src="/img/dashboard.jpeg"
              alt="Product screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </>
  );
}
