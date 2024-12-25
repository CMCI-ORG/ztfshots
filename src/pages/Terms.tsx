import { ContentLayout } from "@/components/client-portal/content/ContentLayout";

export default function Terms() {
  return (
    <ContentLayout>
      <div className="prose dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p>
          By accessing and using this website, you accept and agree to be bound by
          the terms and provision of this agreement.
        </p>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: March 19, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome to ZTFBooks!</h2>
            <p>
              By using our website or services, you agree to the following Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Use of Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You must be at least 18 years old or have parental consent to use our services.
              </li>
              <li>
                Use our services responsibly and in accordance with applicable laws.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of your account 
                information.
              </li>
              <li>
                Notify us immediately of any unauthorized access to your account.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All content, including quotes, designs, and features, is the property of 
                ZTFBooks or its licensors.
              </li>
              <li>
                You may not reproduce or distribute content without written permission.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payments and Refunds</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments for purchases are final unless specified otherwise.</li>
              <li>
                Refunds are only issued under exceptional circumstances at our discretion.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
            <p>
              Do not misuse the platform for unauthorized activities, such as hacking or 
              posting harmful content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>
              ZTFBooks is not liable for any indirect, incidental, or consequential damages 
              arising from the use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p>
              We may update these Terms of Service periodically. Continued use of our services 
              implies acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about these terms, reach out at{" "}
              <a href="mailto:support@ztfbooks.com" className="text-[#8B5CF6] hover:underline">
                support@ztfbooks.com
              </a>
              .
            </p>
          </section>
      </div>
    </ContentLayout>
  );
}
