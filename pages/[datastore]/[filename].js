import { NextSeo } from "next-seo";
import { getServerSideProps } from "/componentry/ssr/datastoreFrontend";

export default function TemplatePage(props) {
    return (
        <>
            <img src="/nextShareLogo.png" alt="nextShare" className="ml-4 mt-4 w-16" />
            <main className="flex flex-col justify-center h-screen">
                {
                    (() => {
                        if (props.status === "01-1") {
                            return (
                                <div className="flex flex-col px-12 gap-y-8">
                                    <NextSeo
                                        title={`nextShare - datastore not found`}
                                    />
                                    <h1 className="text-8xl text-white font-BreezeMono font-bold">404.</h1>
                                    <div className="flex flex-col gap-y-2">
                                        <h1 className="text-4xl text-white font-BreezeHeader font-bold">Oops.</h1>
                                        <p className="text-white font-BreezeText">
                                            Looks like the datastore <code className="text-red-300 font-bold">{props.datastore}</code> couldn&apos;t be found. <b className="text-blue-300">Check the name of the datastore that you&apos;re accessing and try again</b>.
                                        </p>
                                    </div>
                                </div>
                            );
                        } else if (props.status === "01-2") {
                            return (
                                <div className="flex flex-col px-12 gap-y-8">
                                    <NextSeo
                                        title={`nextShare - file not found`}
                                    />
                                    <h1 className="text-8xl text-white font-BreezeMono font-bold">404.</h1>
                                    <div className="flex flex-col gap-y-2">
                                        <h1 className="text-4xl text-white font-BreezeHeader font-bold">Oops.</h1>
                                        <p className="text-white font-BreezeText">
                                            Looks like the file <code className="text-red-300 font-bold">{props.filename}</code> couldn&apos;t be found. <b className="text-blue-300">Check the name of the file that you&apos;re accessing and try again</b>.
                                        </p>
                                    </div>
                                </div>
                            );
                        } else if (props.status === "02-1") {
                            return (
                                <div className="flex flex-col px-12 gap-y-8 items-center">
                                    <NextSeo
                                        title={`nextShare - ${props.filename}.${props.extension}`}
                                    />
                                    <h1 className="text-4xl text-white font-BreezeMono font-bold">my cat is sideways</h1>
                                    <img src={props.res} className="max-w-[75%]" alt="Image" />
                                </div>
                            );
                        };
                    })()
                }
            </main>
        </>
    );
};

export { getServerSideProps };