import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>nextShare</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen flex flex-col justify-center">
        <div className="flex flex-col px-8 gap-y-8">
          <div>
            <h1 className="text-4xl text-white font-BreezeHeader font-bold">Welcome.</h1>
            <p className="text-white font-BreezeAltHeader">
              This is the default page of a nextShare instance.
            </p>
          </div>
          
          <ul className="list-disc text-white">
            <h1 className="text-2xl text-white font-bold font-BreezeHeader">Resources</h1>
            <li>
              <Link href="/">
                <a>
                  <b className="text-lg text-orange-300 font-bold font-BreezeHeader">Configure.</b>
                  <p className="text-white font-BreezeAltHeader break-words whitespace-pre-line">
                    <b>Learn how to <b className="text-orange-300"> customise </b> your nextShare instance</b>. For those who don&apos;t have experience <br />
                    with JavaScript, or if you don&apos;t want to extend nextShare&apos;s default functionality, you <br />
                    can perform basic changes (like website redirects and basic colour customization) <br />
                    within the configuration.
                  </p>
                </a>
              </Link>
            </li>
            <li>
              <Link href="https://github.com/Dannnington/nextShare">
                <a>
                  <b className="text-lg text-red-300 font-bold font-BreezeHeader">Create.</b>
                  <p className="text-white font-BreezeAltHeader break-words whitespace-pre-line">
                    <b><b className="text-red-300"> Build </b> visually-appealing page templates for content uploaded to nextShare</b>. If you <br/>
                    have experience with Next.js and/or React and want to make file upload pages fit <br/>
                    your needs, you can easily do so. Just download the source code, create a new template, <br/>
                    and compile.
                  </p>
                </a>
              </Link>
            </li>
            <li>
              <Link href="https://github.com/Dannnington/nextShare">
                <a>
                  <b className="text-lg text-violet-300 font-bold font-BreezeHeader">Extend.</b>
                  <p className="text-white font-BreezeAltHeader break-words">
                    <b>Build upon the already powerful nextShare platform by<b className="text-violet-300"> adding custom features and <br />
                    building powerful modules </b>
                    for nextShare</b>. Truly make nextShare your own.
                  </p>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </>
  )
}
