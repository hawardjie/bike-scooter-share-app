import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sharing.Guru',
  description: 'Privacy Policy for Sharing.Guru - Bike & Scooter Sharing Dashboard',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-[family-name:var(--font-italiana)]">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Welcome to Sharing.Guru. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard information when you use our Service.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Sharing.Guru provides a real-time dashboard for car parking, bike, and scooter sharing systems, aggregating publicly
              available data from GBFS feeds and parking information sources. We are committed to minimizing data
              collection and maintaining transparency about our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2.1 Information You Provide
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not require you to create an account or provide personal information to use our Service.
              The Service is accessible without any registration or login.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2.2 Automatically Collected Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When you access our Service, we may automatically collect certain technical information, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent on the Service</li>
              <li>Referring website</li>
              <li>General geographic location (city/country level only)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2.3 Location Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service may request access to your device&apos;s location to show nearby bike stations and parking
              facilities. This information is:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Only used within your browser session</li>
              <li>Never transmitted to our servers</li>
              <li>Not stored or retained after you close the application</li>
              <li>Completely optional - the Service works without location access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2.4 Cookies and Local Storage
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may use browser cookies and local storage to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Remember your filter preferences (bike stations, parking spots, etc.)</li>
              <li>Maintain your selected operator preference</li>
              <li>Store your theme preference (light/dark mode)</li>
              <li>Improve Service performance through caching</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can control cookie settings through your browser preferences. Disabling cookies may affect
              some functionality of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The limited information we collect is used solely to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Provide and maintain our Service</li>
              <li>Improve user experience and Service functionality</li>
              <li>Monitor usage patterns to optimize performance</li>
              <li>Debug technical issues and ensure Service security</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not use your information for marketing purposes, and we do not sell, rent, or share your
              data with third parties for their marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Third-Party Data Sources
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service displays publicly available information from:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>GBFS (General Bikeshare Feed Specification) feeds provided by bike and scooter sharing operators</li>
              <li>NYC Open Data for parking information</li>
              <li>Data.gov for federal parking datasets</li>
              <li>OpenStreetMap for geocoding and mapping services</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These third-party services may have their own privacy policies. We encourage you to review their
              policies if you have concerns about how they handle data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect the limited data we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>HTTPS encryption for all data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication for our systems</li>
              <li>Automated monitoring for suspicious activity</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we
              strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We retain minimal data and only for as long as necessary:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Technical logs are retained for up to 30 days for debugging and security purposes</li>
              <li>Aggregated, anonymized usage statistics may be retained indefinitely for analytics</li>
              <li>Your preferences stored in browser local storage remain until you clear browser data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Your Rights and Choices
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the following rights regarding your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>Access:</strong> Request information about data we have collected</li>
              <li><strong>Deletion:</strong> Clear your browser cookies and local storage at any time</li>
              <li><strong>Opt-out:</strong> Disable location services in your browser settings</li>
              <li><strong>Browser Controls:</strong> Configure privacy settings through your browser preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service is not directed to children under the age of 13. We do not knowingly collect personal
              information from children under 13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us so we can delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service may be accessed from anywhere in the world. If you access the Service from outside
              the country where our servers are located, your information may be transferred across international
              borders. By using the Service, you consent to such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Analytics and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may use privacy-respecting analytics tools to understand how users interact with our Service.
              These tools:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Do not use cookies or persistent identifiers</li>
              <li>Anonymize IP addresses</li>
              <li>Do not track users across websites</li>
              <li>Provide aggregate statistics only</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
              Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at info@postsea.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              13. GDPR Compliance (For EU Users)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights
              under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Given the minimal nature of data we collect, many of these rights can be exercised directly through
              your browser settings. For any specific requests, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              14. California Privacy Rights (CCPA)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Right to know what personal information we collect</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
