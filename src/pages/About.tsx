import { ContentLayout } from "@/components/client-portal/content/ContentLayout";

export default function About() {
  return (
    <ContentLayout>
      <div className="prose dark:prose-invert max-w-none">
        <h1>About Us</h1>
        <p>
          Welcome to our platform dedicated to sharing inspirational quotes and
          wisdom. Our mission is to provide valuable content that enriches lives
          and promotes personal growth.
        </p>
        <h2>Our Vision</h2>
        <p>
          We believe in the power of words to inspire, motivate, and transform lives.
          Through carefully curated quotes from diverse sources, we aim to create a
          space where wisdom meets inspiration.
        </p>
        <h2>What We Offer</h2>
        <ul>
          <li>Carefully curated quotes from renowned authors and thinkers</li>
          <li>Daily inspiration to fuel your personal growth journey</li>
          <li>A community of like-minded individuals seeking wisdom</li>
          <li>Accessible content across various platforms and devices</li>
        </ul>
        <h2>Our Commitment</h2>
        <p>
          We are committed to maintaining the highest standards of quality and
          authenticity in our content. Each quote is verified and attributed to its
          original source whenever possible.
        </p>
        <h2>Join Our Community</h2>
        <p>
          Whether you're seeking daily inspiration, researching for your work, or
          simply love the power of words, we invite you to join our growing
          community of wisdom seekers.
        </p>
        <p>
          Thank you for being part of our journey to spread wisdom and inspiration
          across the globe.
        </p>
      </div>
    </ContentLayout>
  );
}