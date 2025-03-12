import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Container from "../components/container";
import PostList from "../components/postlist";
import Banner from "../components/banner";
import { mapCategories } from '/utils/categories';
import { getAuthorData } from '/utils/authors';  
import Link from 'next/link';


export async function getStaticProps() {
  // Path to the markdown content
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

     // Access the categories array
     const categories = data.categories ? mapCategories(data.categories.map(item => item.category)) : [];
     const author = data.author ? getAuthorData(data.author) : {};
      console.log(data)
    return {
      slug: fileName.replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      status: data.status,
      featured: data.featured,
      categories,
      featuredImage: data.featuredImage,
      excerpt: data.excerpt,
      author

    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Index({ posts }) {
  const featuredPost = posts.filter(item => item.featured) || null;
  //const featuredPost = posts || null;

  return (
    <>
     <Banner pic='/images/board3.webp' />
      

      <Container large>
        {featuredPost.length > 4 && (
          <>
            <div className="flex items-center justify-center mt-10">
              <h2 className="text-2xl">
                <strong>Populära inlägg</strong>
              </h2>
            </div>
            <div className="grid gap-10 mt-10 mb-20 lg:gap-10 md:grid-cols-3 lg:grid-cols-4 ">
              {featuredPost.slice(1, 2).map(post => (
                <div
                  className="md:col-span-2 md:row-span-2"
                  key={post.slug}>
                  <PostList
                    post={post}
                    preloadImage={true}
                    pathPrefix="lifestyle"
                    fontSize="large"
                    aspect="custom"
                    fontWeight="normal"
                  />
                </div>
              ))}
              {featuredPost.slice(2, 6).map(post => (
                <PostList
                  key={post.slug}
                  post={post}
                  aspect="landscape"
                  pathPrefix="lifestyle"
                  fontWeight="normal"
                  preloadImage={true}
                />
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-center mt-4">
          <h3 className="text-2xl">
            De senaste inläggen
          </h3>
        </div>
        <div className="grid gap-10 mt-10 lg:gap-10 md:grid-cols-2 xl:grid-cols-4 ">
          {posts.map(post => (
            <PostList
              key={post.slug}
              post={post}
              fontWeight="normal"
              pathPrefix="lifestyle"
              aspect="square"
            />
          ))}
        </div>
          <div className="mt-10 flex justify-center">
                    <Link
                      href="/posts"
                      className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
                      <span>View all Posts</span>
                    </Link>
                  </div>
      </Container>
    </>
  );
}



// import Container from  "../components/container"
// const Index = () => {
//     return (
//       <Container> Hej Hek </Container>
//     );
//   };
  
//   export default Index;