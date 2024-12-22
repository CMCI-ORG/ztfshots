import { MainLayout } from "@/components/layout/MainLayout";

export default function Privacy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold mb-8 text-[#8B5CF6]">Privacy Policy</h1>
          
          <p className="text-sm text-muted-foreground mb-8">Last Updated: March 19, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              At ZTFBooks, we are committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, and protect your personal information when you use our website 
              and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, and subscription preferences.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent on the site, and other analytics.
              </li>
              <li>
                <strong>Payment Data:</strong> For purchases, we collect payment details securely through 
                third-party providers.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our services.</li>
              <li>To send daily quotes and promotional emails (if subscribed).</li>
              <li>To process transactions securely.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Sharing of Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not sell your data.</li>
              <li>
                Data may be shared with trusted third-party services for payment processing 
                and analytics.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We implement encryption and access controls to safeguard your data.</li>
              <li>
                Your payment information is processed securely by compliant payment gateways.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Access, update, or delete your personal data by contacting us at{" "}
                <a href="mailto:privacy@ztfbooks.com" className="text-[#8B5CF6] hover:underline">
                  privacy@ztfbooks.com
                </a>
                .
              </li>
              <li>Opt-out of promotional emails at any time using the unsubscribe link.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
            <p>
              We may update this policy occasionally. Significant changes will be notified on 
              this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              For questions about this policy, email us at{" "}
              <a href="mailto:privacy@ztfbooks.com" className="text-[#8B5CF6] hover:underline">
                privacy@ztfbooks.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}