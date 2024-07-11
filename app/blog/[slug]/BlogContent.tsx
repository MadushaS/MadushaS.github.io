import { SanityImage } from "@/components/SanityImage";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import styles from '../../../components/Blog/post.module.css';
import { format } from 'date-fns';
import { PortableText, PortableTextReactComponents } from "next-sanity";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

export const runtime = 'edge';

async function getPostFromSanity(slug: string) {
    const query = `*[_type == "post" && slug.current == $slug]{ _id, title, description, publishedAt, author->{name}, slug, categories[]->{title}, mainImage, body }`;
    return (await client.fetch(query, {
        "slug": slug
    })).map((post: {
        publishedAt: string,
        mainImage: { _type: string, asset: { _ref: string, _type: string } },
        author: { name: string },
        slug: { current: string, _type: string },
        categories: [{ title: string }],
        title: string,
        description: string,
        body: any
    }) => {
        return {
            ...post,
            date: new Date(post.publishedAt),
            imageURL: urlForImage(post.mainImage),
            author: post.author.name,
            slug: post.slug.current,
            categories: post.categories,
            content: post.body
        }
    })[0];
}

const conversions:
    | Partial<PortableTextReactComponents> | undefined
    = {
    types: {
        image: ({ value }) => {
            return <SanityImage  {...value} />
        },
    }
}

const dateToString = (date: string) => {
    return format(new Date(date), 'MMMM dd, yyyy');
}

export default async function BlogContent({ slug }: Readonly<{ slug: string }>) {
    const post = await getPostFromSanity(slug);
    if (!post) {
        return (
            <section className="relative">
                <div className="container mx-auto p-6 md:px-12 lg:px-24 xl:px-32">
                    <div className="relative top-8 z-[2]">
                        <div className="col-span-12 lg:col-start-2 lg:col-span-10 xl:col-start-2 xl:col-span-8 mt-5 lg:mt-10 mb-6 lg:mb-8  w-full lg:w-2/3 ">
                            <h1 className="text-3xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                                Post not found
                            </h1>
                            <p className="text-lg">
                                The requested post was not found.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    const { title, description, author, date, imageURL, content } = post;
    return (
        <article id="main-content">
            <section className="relative">
                <div className="container mx-auto p-6 md:px-12 lg:px-24 xl:px-32">
                    <div className="absolute top-0 left-0 right-0 z-0 bg-slate-50 dark:bg-slate-950 h-full"></div>
                    <div className="relative top-8 z-[2]">
                        <div className="col-span-12 lg:col-start-2 lg:col-span-10 xl:col-start-2 xl:col-span-8 mt-5 lg:mt-10 mb-6 lg:mb-8  w-full lg:w-2/3 ">
                            <ul className="inline-block list-none mb-3">
                                <li className="inline-block mr-3">
                                    <a href="https://github.blog/category/education/" className="text-lg font-bold text-gradient-purple-coral">
                                        Article
                                    </a>
                                </li>
                            </ul>
                            <h1 className="text-3xl lg:text-5xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                                {title}
                            </h1>
                            <p className="text-lg">
                                {description}
                            </p>
                        </div>
                        <div className="lg:col-start-2 lg:col-span-10">
                            <div className="relative top-10 z-10">
                                <img
                                    src={imageURL}
                                    width={1600}
                                    height={850}
                                    alt="Beginner's guide to GitHub repositories: How to create your first repo"
                                    className="aspect-video object-cover rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto p-6 md:px-12 lg:px-24 xl:px-32">
                <div className="pt-8">
                    <div className="col-span-12 lg:col-start-2 lg:col-span-10">
                        <div className="flex flex-wrap items-center pb-1">
                            <div className="flex flex-wrap">
                                By {author}
                            </div>
                            <time
                                dateTime={date}
                                className="block border-1 text-mono text-slate-800 dark:text-slate-200 mb-3 ml-auto pl-7 min-h-6"
                            >
                                {dateToString(date)}
                            </time>
                        </div>
                        <div className="border-t border-2 border-slate-200 dark:border-slate-800"></div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto p-6 mt-4 md:mt-2 md:px-12 lg:px-24 xl:px-32">
                <div className="flex">
                    <section className="col-span-12 lg:col-span-7 md:col-span-8 px-2">
                        <div className={cn('mt-4 container', styles.portableText)} >
                            <PortableText
                                value={content}
                                components={conversions}
                            />
                        </div>
                    </section>

                    <div className="col-span-12 md:col-span-4 lg:col-span-3 p-6">
                        <ul className="list-none flex lg:flex-col">
                            <li className="mr-4 lg:mr-0 mb-4">
                                <a
                                    href={`https://x.com/share?text=${post.title}&amp;url=${'https://madusha.dev/blog/' + post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-center items-center border rounded-full p-2"
                                    aria-label="Share on X"
                                >
                                    <TwitterIcon />
                                </a>
                            </li>
                            <li className="mr-4 lg:mr-0 mb-4">
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${'https://madusha.dev/blog/' + post.slug}&amp;t=${post.title}`}

                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-center items-center border rounded-full p-2"
                                    aria-label="Share on LinkedIn"
                                >
                                    <FacebookIcon />
                                </a>
                            </li>
                            <li className="mr-4 lg:mr-0 mb-4">
                                <a
                                    href={encodeURI(`https://www.linkedin.com/shareArticle?url=${'https://madusha.dev/blog/' + post.slug}%2F&amp;title=${post.title}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-center items-center border rounded-full p-2"
                                    aria-label="Share on LinkedIn"
                                >
                                    <LinkedinIcon />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </article>
    )
}