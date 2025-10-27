import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Sharing.Guru',
  description: 'Terms of Service for Sharing.Guru - Bike & Scooter Sharing Dashboard',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex-shrink-0">
                <Link href="/" className="block">
                  <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-2 font-[family-name:var(--font-italiana)]" style={{ color: 'rgb(52, 211, 153)' }}>
                    <img src="/images/logo.png" alt="Sharing.Guru Logo" className="h-8 lg:h-10 w-auto" />
                    Sharing.Guru
                  </h1>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                Live Data
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
          >
            &larr; Back to Dashboard
          </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-[family-name:var(--font-italiana)]">
          Terms of Service
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using Sharing.Guru (the &quot;Service&quot;), you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to these Terms of Service, please do
              not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Use of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Sharing.Guru provides real-time information about bike and scooter sharing systems using publicly
              available GBFS (General Bikeshare Feed Specification) data and parking information from various sources.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Service is provided for informational purposes only. We aggregate data from multiple providers
              and present it in an accessible format to help users find available bikes, scooters, and parking spots.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Data Accuracy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy,
              completeness, or timeliness of the data displayed. The information is sourced from third-party
              providers and may be subject to delays or errors.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Users should verify critical information with the respective bike/scooter sharing service providers
              before making decisions based on the data presented.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. User Responsibilities
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Use the Service in any way that violates any applicable local, state, national, or international law</li>
              <li>Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service</li>
              <li>Engage in any data mining, data harvesting, data extracting, or any other similar activity in relation to the Service</li>
              <li>Use the Service to send automated queries without our prior written consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Service displays information from third-party bike and scooter sharing providers. We are not
              affiliated with, endorsed by, or sponsored by these providers. Your use of any third-party service
              is subject to that provider&apos;s terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Service and its original content, features, and functionality are owned by Sharing.Guru and are
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In no event shall Sharing.Guru, its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Disclaimer
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided
              without warranties of any kind, whether express or implied, including, but not limited to, implied
              warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a
              material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us at info@postsea.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which
              Sharing.Guru operates, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
    </div>
  );
}
