import Head from 'next/head'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'
import Layout, { siteTitle } from '../components/layout'
import { getSortedPostsData } from '../lib/posts'
import Date from '../components/date'

import Slider from './slider/Slider'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }){
  return (
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>

        <section className={`${utilStyles.headingMd} video_preview`}>
          <p>[Your Self Introdution]</p>
          <p>
            (This is a sample website - you’ll be building a site like this on{' '}
            <a className="link" href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          </p>
        </section>

        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={`${utilStyles.listItem} link`} key={id}>
                <Link href={`/posts/${id}`} >
                  {title}
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
          </ul>
        </section>

        <Slider>
        <div className={utilStyles.dragg} >
                <div className={utilStyles.dragg_item}>
                    <div className={utilStyles.box}>
                        Drag me
                    </div>
                </div>

                <div className={utilStyles.dragg_item}>
                    <div className={utilStyles.box}>
                        Drag me
                    </div>
                </div>

                <div className={utilStyles.dragg_item}>
                    <div className={utilStyles.box}>
                        Drag me
                    </div>
                </div>

                <div className={utilStyles.dragg_item}>
                    <div className={utilStyles.box}>
                        Drag me
                    </div>
                </div>

                <div className={utilStyles.dragg_item}>
                    <div className={utilStyles.box}>
                        Drag me
                    </div>
                </div>

                <div className={utilStyles.dragg_item} ref={sliderItem}>
                    <div className={utilStyles.box}>
                        Drag me
                    </div>
                </div>

            </div>
        </Slider>
      </Layout>
    )
}
