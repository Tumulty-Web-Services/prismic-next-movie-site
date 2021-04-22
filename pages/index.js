const Prismic = require('@prismicio/client');
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
const apiEndpoint = "https://my-first-app1.prismic.io/api";



export default function Home({ page, movies }) {
  return (
    <>
      <Head>
        <title>Movie Site Demo</title>
        <meta cname="description" content="This is a demo of next.js and prismic" />
      </Head>
      <h1>Movie Site Demo</h1>
      <hr />
      <h2>This is a sample of the page post type from prismic</h2>
      <h3>Everything in <span style={{color: 'green'}}><u>green</u></span> is data from the database</h3>
       <div style={{color: 'green'}}>
       <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <Link href={`/movie/${movie.id}`}>
                <a style={{color: 'green'}}>
                {movie.content.movies.movie_title.value[0].text}
                </a>
              </Link>
            </li>
          ))}
       </ul>
      <h1>{page.title.value[0].text}</h1>
      {page.content.value.filter(a => a.text !== "").map((item) => (item.type === 'image') ? (
        <Image
          src={item.url}
          // item.dimensions.width
          width={450}
          // item.dimensions.height
          height={320}
          alt="movie camera"
          key="image"
        />
      ) : (item.type === 'paragraph') ? <p key={item.text}>{item.text}</p>: null)}

       </div>    
    </>
  )
}

// getStaticPaths function is a way to interface with APIs & databases
// and return content to the component
export async function getStaticProps() {
  // create a connection between the prismic js library and my apps api on prismic.io
  const client = Prismic.client(apiEndpoint);

  // make a request for some data from my prismic database
  // I am grabbing the content with type movie_list
  const pageReq = await client.query(Prismic.Predicates.at('document.type', 'movie_list'))
    .then(res => res.results);


  // make a request for the movie posts from prismic database
  const movieReq = await client.query(Prismic.Predicates.at('document.type', 'movies'))
    .then(res => res.results);
  
  return {
    props: {
      // I am iterating through the data and boiling it down a bit
      // so its easier to use in my react component
      page: pageReq.map((page) => page.data.movie_list)[0],
      movies: movieReq.map((movie) => {
        return {
          id: movie.id,
          content:movie.data
        }
      })
    }
  }
}