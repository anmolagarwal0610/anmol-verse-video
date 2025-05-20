
import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer'; // Using a common footer

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24"> {/* Added pt-24 for navbar offset */}
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4 text-sm text-muted-foreground">Last Updated: 20 May 2025</p>

        <p className="mb-4">
          This Privacy Policy (“Policy”) describes how DumbLabs.AI (“DumbLabs”, “we”, “our”, or “us”)
          collects, uses, shares, and protects your personal information when you access and use our
          website (https://dumblabs.ai), mobile applications, and related services (collectively, the “Services”).
        </p>
        <p className="mb-6">
          By using the Services, you agree to the terms of this Policy. If you do not agree, please do not use the Services.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="mb-2">We may collect the following categories of information:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>a. Personal Information</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>Full name, email address, phone number, and other contact details</li>
                <li>Account credentials (e.g., username and password)</li>
                <li>Payment and billing information</li>
                <li>Profile data and preferences</li>
              </ul>
            </li>
            <li>
              <strong>b. User-Generated Content</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>Content you upload, generate, or submit through the Services (e.g., text, images, video, audio)</li>
                <li>Associated metadata (e.g., timestamps, location, keywords)</li>
              </ul>
            </li>
            <li>
              <strong>c. Biometric Data</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>If you use features involving voice, face, or other biometric identifiers, we may collect:</li>
                <li className="ml-4">Facial scans</li>
                <li className="ml-4">Voice data</li>
                <li>These are used only to provide requested services and not for other purposes.</li>
              </ul>
            </li>
            <li>
              <strong>d. Automatically Collected Data</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>IP address, browser type, device type</li>
                <li>Pages visited, time spent, interactions</li>
                <li>Referring URL and general geolocation</li>
                <li>Communication data (e.g., email opens, clicks)</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="mb-2">We use the collected information to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide and improve our Services</li>
            <li>Authenticate users and secure accounts</li>
            <li>Respond to inquiries and provide support</li>
            <li>Personalize your experience and content</li>
            <li>Process payments and fulfill transactions</li>
            <li>Send service updates and marketing communications (with consent)</li>
            <li>Analyze usage trends and conduct research</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. Cookies and Tracking Technologies</h2>
          <p className="mb-2">We use cookies and similar technologies to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Authenticate users and manage sessions</li>
            <li>Remember user preferences</li>
            <li>Measure site usage and performance</li>
            <li>Deliver relevant advertising</li>
          </ul>
          <p className="mt-2">
            You can control cookies through your browser settings. Disabling cookies may affect the
            functionality of the Services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Data Sharing and Disclosure</h2>
          <p className="mb-2">We do not sell your personal data. However, we may share it with:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Service providers and vendors (e.g., cloud storage, analytics, payment processors)</li>
            <li>Third-party integrations you authorize</li>
            <li>Government authorities if required by law or to protect legal rights</li>
            <li>Affiliates or acquirers in case of merger, acquisition, or restructuring</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational safeguards to protect your data.
            All data in transit is encrypted via SSL/TLS. While we strive to secure your data, no system is completely secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights and Choices</h2>
          <p className="mb-2">Subject to applicable law, you have rights to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Access or correct your personal data</li>
            <li>Delete your account and data</li>
            <li>Opt out of marketing communications</li>
            <li>Object to or restrict certain processing</li>
            <li>Request data portability</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, email us at hello@dumblabs.ai.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
          <p className="mb-2">We retain your data only for as long as necessary:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>To fulfill the purposes outlined in this Policy</li>
            <li>To comply with legal, tax, or regulatory obligations</li>
            <li>Or until you request deletion</li>
          </ul>
          <p className="mt-2">Inactive accounts may be deleted after 12 months.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy</h2>
          <p>
            The Services are not intended for individuals under 13 years old. We do not knowingly
            collect data from children without verifiable parental consent.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">9. International Data Transfers</h2>
          <p>
            If you are located outside of the country where our servers are based, your data may be
            transferred to and processed in that country. We take appropriate safeguards to ensure
            lawful transfer.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Policy periodically. We will notify you of material changes by email or
            via the Services. Continued use of the Services after such updates constitutes your
            acceptance of the changes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests related to this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">DumbLabs.AI</p>
          <p>Email: hello@dumblabs.ai</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

