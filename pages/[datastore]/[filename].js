import { NextSeo } from "next-seo";
import { getServerSideProps } from "/componentry/ssr/datastoreFrontend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser, faDatabase } from "@fortawesome/free-solid-svg-icons";

export default function TemplatePage(props) {
    return (
        <>
            <main className="flex flex-col justify-center h-screen w-full">
                {
                    (() => {
                        if (props.status === "01-1") {
                            return (
                                <div className="flex flex-col px-12 gap-y-8">
                                    <NextSeo
                                        title={`nextShare - datastore not found`}
                                        additionalLinkTags={
                                            [
                                                {
                                                    rel: "icon",
                                                    href: "/favicon.ico",
                                                }
                                            ]
                                        }
                                        openGraph={{
                                            title: `${props.publicEnv.frontend.customization.name || "nextShare"} - datastore not found`,
                                            site_name: `${props.publicEnv.frontend.customization.name || "nextShare"}`,
                                            images: [
                                                {
                                                    url: `${props.publicEnv.accessURL}/banner.png`,
                                                    alt: `${props.publicEnv.frontend.customization.name || "nextShare"} banner`,
                                                    type: props.mimeType
                                                }
                                            ]
                                        }}
                                        twitter={{
                                            cardType: "summary_large_image",
                                        }}
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
                                        title={`${props.publicEnv.frontend.customization.name || "nextShare"} - file not found`}
                                        additionalLinkTags={
                                            [
                                                {
                                                    rel: "icon",
                                                    href: "/favicon.ico",
                                                }
                                            ]
                                        }
                                        openGraph={{
                                            title: `${props.publicEnv.frontend.customization.name || "nextShare"} - file not found`,
                                            site_name: `${props.publicEnv.frontend.customization.name || "nextShare"}`,
                                            images: [
                                                {
                                                    url: `${props.publicEnv.accessURL}/banner.png`,
                                                    alt: `${props.publicEnv.frontend.customization.name || "nextShare"} banner`,
                                                    type: props.mimeType
                                                }
                                            ]
                                        }}
                                        twitter={{
                                            cardType: "summary_large_image",
                                        }}
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
                                <div className="flex flex-col px-12 gap-y-8 justify-center items-center">
                                    <NextSeo
                                        title={`${props.publicEnv.frontend.customization.name || "nextShare"} - ${props.filename}.${props.extension}`}
                                        additionalLinkTags={
                                            [
                                                {
                                                    rel: "icon",
                                                    href: "/favicon.ico",
                                                }
                                            ]
                                        }
                                        additionalMetaTags={
                                            [
                                                {
                                                    name: "theme-color",
                                                    content: props.publicEnv.frontend.customization.embedColour,
                                                }
                                            ]
                                        }
                                        openGraph={{
                                            title: `${props.author} uploaded an image`,
                                            description: `An image was uploaded on the ${props.stats.creationTimeUtc.fancyDate} at ${props.stats.creationTimeUtc.time}.`,
                                            site_name: `${props.publicEnv.frontend.customization.name || "nextShare"}`,
                                            images: [
                                                {
                                                    url: `${props.publicEnv.accessURL}${props.res}`,
                                                    alt: `${props.author} uploaded an image on ${props.stats.creationTimeUtc.date} at ${props.stats.creationTimeUtc.time}`,
                                                    type: props.mimeType
                                                }
                                            ],
                                        }}
                                        twitter={{
                                            cardType: "summary_large_image",
                                        }}
                                    />
                                    <h1 className="text-3xl font-BreezeHeader font-bold">
                                        Image uploaded on <code className="text-blue-300">{props.stats.creationTimeUtc.shortDate}</code>
                                    </h1>
                                    <img src={props.res} className="flex flex-col max-w-[115%] md:max-w-[100%] lg:max-w-[60%] rounded-xl" alt="Image" />
                                    <div className="flex flex-col gap-y-2 px-4 py-4 bg-slate-800 rounded-xl w-fit">
                                        <h1 className="flex flex-row gap-x-2 items-center text-lg font-BreezeHeader font-bold">
                                            <FontAwesomeIcon icon={faClock} className="w-6" />
                                            <b className="font-bold text-blue-300">{props.stats.creationTimeUtc.date} at {props.stats.creationTimeUtc.time} (UTC)</b>
                                        </h1>
                                        <h1 className="flex flex-row gap-x-2 items-center text-lg font-BreezeHeader font-bold">
                                            <FontAwesomeIcon icon={faUser} className="w-6" />
                                            <b className="font-bold text-blue-300">{props.author}</b>
                                        </h1>
                                        <h1 className="flex flex-row gap-x-2 items-center text-lg font-BreezeHeader font-bold">
                                            <FontAwesomeIcon icon={faDatabase} className="w-6" />
                                            <b className="font-bold text-blue-300">{props.datastore}</b>
                                        </h1>
                                    </div>
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