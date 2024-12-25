import { ContentLayout } from "@/components/client-portal/content/ContentLayout";

export default function Privacy() {
  return (
    <ContentLayout>
      <div className="prose dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p>
          This Privacy Policy describes how we collect, use, and handle your
          personal information when you use our services.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We may collect personal information that you provide to us directly,
          such as your name, email address, and any other information you choose
          to provide.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect for various purposes, including to
          provide and maintain our services, notify you about changes to our
          services, and provide customer support.
        </p>
        <h2>Data Security</h2>
        <p>
          We take the security of your personal information seriously and use
          reasonable measures to protect it. However, no method of transmission
          over the internet or method of electronic storage is 100% secure.
        </p>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at support@example.com.
        </p>
      </div>
    </ContentLayout>
  );
}
