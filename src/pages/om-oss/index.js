import Container from "/src/components/container";
// import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { getAuthors } from '/utils/authors'; 



export async function getStaticProps() {
 

     // Access the categories array
     const authors = getAuthors();
     console.log(authors)
      return {
        props: {
          authors,
        }}
};

const authors = await getAuthors();

export default function About({ authors }) {
  return (
    <Container>
      <h1 className="mt-2 mb-3 text-3xl font-semibold tracking-tight text-center lg:leading-snug text-brand-primary lg:text-4xl dark:text-white">
        Om oss
      </h1>
      <div className="text-center">
        <p className="text-lg">Vi är ett gäng som älskar spel av olika slag, givetvis är vi även föräldrar 😊</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mt-6 mb-16 md:mt-16 md:mb-32 md:gap-16">
        {Object.values(authors).map((author, index) => {
          const imageProps = '/images/' + author?.image || null;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-md aspect-square odd:translate-y-10 odd:md:translate-y-16">
              <Link href={`/author/${author.slug}`}>
                <Image
                  src={imageProps}
                  alt={author.name || " "}
                  fill
                  sizes="(max-width: 320px) 100vw, 320px"
                  className="object-cover"
                />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mx-auto prose text-center dark:prose-invert mt-14">
        <p>
          We provide real-time connectivity to enable software
          providers and financial institutions to build integrated
          products for their small business customers.
        </p>
        <p>
          Our API infrastructure is leveraged by clients ranging from
          lenders to corporate card providers and business forecasting
          tools, with use cases including automatic reconciliation,
          business dashboarding, and loan decisioning.
        </p>
        <p>
          <Link href="/contact">Get in touch</Link>
        </p>
      </div>
    </Container>
  );
}
