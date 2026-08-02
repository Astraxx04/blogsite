import Container from '@/app/_components/container';
import { HeroPost } from '@/app/_components/hero-post';
import { Intro } from '@/app/_components/intro';
import { MoreStories } from '@/app/_components/more-stories';
import { getAllPosts } from '@/lib/api';
import { readingTime } from '@/lib/reading-time';

export default function Index() {
    const allPosts = getAllPosts();

    const heroPost = allPosts[0];

    const morePosts = allPosts.slice(1);

    return (
        <main id="content">
            <Container>
                <Intro />
                {heroPost && (
                    <HeroPost
                        title={heroPost.title}
                        postKey={heroPost.postKey}
                        coverImage={heroPost.coverImage}
                        date={heroPost.date}
                        author={heroPost.author}
                        slug={heroPost.slug}
                        excerpt={heroPost.excerpt}
                        minutes={readingTime(heroPost.content)}
                    />
                )}
                {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </Container>
        </main>
    );
}
