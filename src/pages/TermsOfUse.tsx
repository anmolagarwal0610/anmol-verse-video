
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24 prose dark:prose-invert max-w-3xl">
        <h1>Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Last Updated: 20 May 2025</p>

        <p>
          Welcome to DumbLabs.AI, a platform providing AI-powered video creation services. These Terms of Use ("Terms") 
          govern your access to and use of our website, mobile applications, and other services ("Services"). 
          By using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree 
          with these Terms, please do not use our Services.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Services, you confirm that you have read, understood, and agreed to be bound by 
          these Terms, as well as our Privacy Policy.
        </p>

        <h2>2. Services Provided</h2>
        <p>
          DumbLabs.AI offers AI-driven tools for creating, editing, and managing video content. The scope and features 
          of the Services may change from time to time at our sole discretion.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>You agree that you will not:</p>
        <ul>
          <li>Violate any laws, regulations, or third-party rights.</li>
          <li>Upload or share content that is illegal, offensive, or infringing.</li>
          <li>Use the Services to distribute spam or malicious software.</li>
          <li>Attempt to gain unauthorized access to our systems or other users’ accounts.</li>
        </ul>
        <p>You are responsible for the accuracy of the information you provide and all activities under your account.</p>

        <h2>4. Account Registration</h2>
        <p>
          You may need to create an account to use certain features. You agree to provide accurate and complete 
          information during registration and to keep it updated. You are solely responsible for safeguarding your 
          login credentials.
        </p>

        <h2>5. Subscription and Payment</h2>
        <p>
          Some features of our Services may require a paid subscription. You agree to pay all applicable fees and 
          charges in accordance with the pricing and terms provided at the time of purchase.
        </p>

        <h2>6. Refund Policy</h2>
        <p>
          If you subscribed through our website, you are eligible for a full refund within 30 days of starting or 
          renewing your subscription, provided the account remains unused or nearly unused. Once the refund is 
          approved, your subscription will be canceled immediately.
        </p>
        <p>
          If you subscribed via the App Store or Google Play, refunds must be requested directly through those 
          platforms. DumbLabs.AI does not control or influence those refund decisions.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          All content, branding, technology, and features provided by DumbLabs.AI are the intellectual property of 
          DumbLabs.AI and its licensors. You may not copy, modify, distribute, or reverse engineer any part of the 
          Services without explicit permission.
        </p>

        <h2>8. Privacy</h2>
        <p>
          Our Privacy Policy explains how we collect, use, and protect your personal data. By using our Services, 
          you consent to our data practices as outlined in the Privacy Policy.
        </p>

        <h2>9. Termination</h2>
        <p>
          We may suspend or terminate your access to the Services at our discretion, without notice, if you breach 
          these Terms or engage in any unlawful or abusive behavior.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, DumbLabs.AI shall not be liable for any indirect, incidental, 
          special, or consequential damages, including loss of data, profits, or goodwill, arising out of or related 
          to your use of the Services.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction 
          of the courts located in Bijnor, Uttar Pradesh, India.
        </p>

        <h2>12. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Changes will be posted on this page, and the updated date 
          will be revised accordingly. Continued use of the Services constitutes acceptance of the updated Terms.
        </p>

        <h2>13. Contact Information</h2>
        <p>For questions, support, or legal notices, please contact:</p>
        <p>
          DumbLabs.AI<br />
          Bijnor, Uttar Pradesh, India<br />
          📧 Email: hello@dumblabs.ai<br />
          📞 Phone: +91-7774008649
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
