import Link from 'next/link';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Link href="/" className="w-fit">
        <a className="flex w-fit ml-4 mt-4">
          <picture>
            <img src="/icon.png" alt="nextShare" className="w-16" />
          </picture>
        </a>
      </Link>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
