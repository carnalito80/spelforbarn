import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub-flavored markdown support (tables, task lists, etc.)
import rehypeRaw from 'rehype-raw'; // To allow raw HTML parsing
import rehypeSanitize from 'rehype-sanitize'; // To sanitize HTML and make it safe
import Image from "next/image";
import Link from "next/link";
import Container from "/src/components/container";
import { mapCategories } from '/utils/categories';  
// import { PortableText } from '/utils/portabletext';
import CategoryLabel from "/src/components/blog/category";
import AuthorCard from "/src/components/blog/authorCard";
import { getAuthorData } from '/utils/authors';  

export async function getStaticPaths() {
    const postsDirectory = path.join(process.cwd(), 'content');
    const fileNames = fs.readdirSync(postsDirectory);
  
    const paths = fileNames.map((fileName) => ({
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    }));
  
    return {
      paths,
      fallback: false, // Show 404 page for undefined slugs
    };
  }
  
  export async function getStaticProps({ params }) {
    const { slug } = params;
    const postsDirectory = path.join(process.cwd(), 'content');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent);
  
    // Access the categories array
    const categories = data.categories ? mapCategories(data.categories.map(item => item.category)) : [];
    const author = data.author ? getAuthorData(data.author) : {};
    //calculate reading time
    const wpm = 225;
    const words = content.trim().split(/\s+/).length;
    const estReadingTime = Math.ceil(words / wpm);
    
  return {
      props: {
        post: {
            title: data.title,
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : "1970-01-01",  // Ensure date format
            status: data.status,
            categories,
            estReadingTime,
            featuredImage: data.featuredImage,
            meta: data.meta,
            content,
            author: author
        },
      },
    };
  }
  
  const Post = ({ post }) => {
    
    const imageProps = post?.featuredImage ? post.featuredImage : null;
    const AuthorimageProps = post?.author?.image ? '/images/' + post.author.image : null;

    return (
        <>
         < Head>
          <title>{post.meta.title}</title>
          <meta name="description" content={post.meta.description} />
          <meta property="og:title" content={post.meta.title} />
          <meta property="og:description" content={post.meta.description} />
          <meta name="twitter:card" content={imageProps} />
          {post.meta.keywords && (
          <meta name='keywords' content={post.meta.keywords} />
          )}
          {/* Add other meta tags as needed */}
        </Head>
        <Container className="!pt-0">
          <div className="mx-auto max-w-screen-md ">
            <div className="flex justify-center">
              <CategoryLabel categories={post.categories} />
            </div>
  
            <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
              {post.title}
            </h1>
  
            <div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 flex-shrink-0">
                  {AuthorimageProps && (
                    <Link href={`/author/${post.author.slug}`}>
                      <Image
                        src={AuthorimageProps}
                        alt={post?.author?.name}
                        className="rounded-full object-cover"
                        fill
                        sizes="200px"
                      />
                    </Link>
                  )}
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-400">
                    <Link href={`/author/${post.author.slug}`}>
                      {post.author.name}
                    </Link>
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <time
                      className="text-gray-500 dark:text-gray-400"
                      dateTime={post?.datet}>
                      {new Date(post.date).toLocaleDateString("sv-SE")}
                    </time>
                    <span>· {post.estReadingTime || "5"} minuters läsning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
  
        <div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
          {imageProps && (
            <Image
              src={imageProps}
              alt={post.title || "Thumbnail"}
              loading="eager"
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>
  
        <Container>
          <article className="mx-auto max-w-screen-md ">
            <div className="prose mx-auto my-3 dark:prose-invert prose-a:text-blue-600">
              <article className="main-article">
                <ReactMarkdown 
                    components={{
                      img: ({ node, ...props }) => (
                        <figure className="flex flex-col items-center">
                        <img className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto block" {...props} />
                        {props.alt && <figcaption className="mt-2 text-sm text-gray-600 italic">{props.alt}</figcaption>}
                      </figure>

                      ),
                     
                    }}
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw, rehypeSanitize]} // Use rehype-raw and rehype-sanitize
                >
                            {post.content}
                </ReactMarkdown>
              </article>
            {/* <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} /> */}
              {/* {post.contentHtml && <PortableText value={post.contentHtml} />} */}
            </div>
            <div className="mb-7 mt-7 flex justify-center">
              <Link
                href="/posts"
                className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 ">
                ← Tillbaka till artiklar
              </Link>
            </div>
            {post.author && <AuthorCard author={post.author} />}
          </article>
        </Container>
      </>
//     );
//   }
//       <div>
//         <h1>{post.title}</h1>
//         <p>{post.date}</p>
//         <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
//       </div>
    );
  };
  
  export default Post;