/**
 * Seed script: Insert Terms & Conditions and Privacy Policy into SiteContent table
 * Run with: node seed-legal-pages.js (from /server directory)
 */
require('dotenv').config();
const prisma = require('./src/config/database');

const TERMS_CONTENT = {
  lastUpdated: "July 29, 2026",
  sections: [
    {
      id: 1,
      title: "Introduction",
      body: "Welcome to **St. Lawrence Next Gen Academy**. These Terms & Conditions (\"Terms\") govern your access to and use of our website, mobile application, and all educational services provided by St. Lawrence Next Gen Academy. By creating an account, accessing our platform, or using any of our services, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree with any part of these Terms, please discontinue the use of our platform."
    },
    {
      id: 2,
      title: "Eligibility",
      body: "To use our platform, you must provide accurate and complete registration information. If you are under the age required by applicable law, you must have permission from a parent or legal guardian to create an account and use our services."
    },
    {
      id: 3,
      title: "User Accounts",
      body: "To access certain features, you must create a personal account. You are responsible for:\n- Keeping your login credentials secure and confidential.\n- Ensuring all information provided during registration is accurate and up to date.\n- Not sharing your account with others.\n- Notifying us immediately if you suspect unauthorized access to your account.\n\nYou are responsible for all activities that occur under your account."
    },
    {
      id: 4,
      title: "Educational Content",
      body: "All learning materials, including but not limited to:\n- Video lessons\n- Study notes\n- Practice tests\n- Past examination questions\n- Assignments\n- Mock examinations\n- Images, graphics, and downloadable resources\n\nare the intellectual property of St. Lawrence Next Gen Academy or its licensors and are provided solely for personal educational purposes.\n\nYou may not copy, reproduce, modify, distribute, sell, publish, or share any content without prior written permission."
    },
    {
      id: 5,
      title: "Acceptable Use",
      body: "When using our platform, you agree not to:\n- Violate any applicable laws or regulations.\n- Upload malicious software or harmful code.\n- Attempt to hack, reverse engineer, or interfere with the platform.\n- Cheat during examinations or assessments.\n- Share copyrighted materials without authorization.\n- Harass, threaten, or abuse other users.\n\nAny misuse may result in suspension or permanent termination of your account."
    },
    {
      id: 6,
      title: "Payments & Subscriptions",
      body: "Certain services and premium features require payment or an active subscription.\n\nBy subscribing, you agree that:\n- All fees must be paid before access is granted.\n- Subscription prices may change with prior notice.\n- Payments are processed securely through authorized payment providers.\n- Unless otherwise stated in our Refund Policy, all payments are non-refundable.\n- Failure to complete payment may result in suspension of premium features."
    },
    {
      id: 7,
      title: "Refund Policy",
      body: "Refunds are only issued where required by law or where specifically stated in our refund policy. Requests will be reviewed on a case-by-case basis."
    },
    {
      id: 8,
      title: "Intellectual Property",
      body: "All trademarks, logos, course materials, software, graphics, designs, and other content available on the platform belong to St. Lawrence Next Gen Academy or their respective owners.\n\nNothing in these Terms grants users ownership rights to any intellectual property."
    },
    {
      id: 9,
      title: "Privacy",
      body: "Your use of the platform is also governed by our Privacy Policy. By using our services, you consent to the collection, storage, and processing of your information as described in that policy."
    },
    {
      id: 10,
      title: "Availability of Services",
      body: "While we strive to provide uninterrupted access, we do not guarantee that the platform will always be available. Maintenance, technical issues, updates, or unforeseen circumstances may occasionally interrupt service."
    },
    {
      id: 11,
      title: "Limitation of Liability",
      body: "St. Lawrence Next Gen Academy is not responsible for:\n- Loss of data.\n- Internet or network interruptions.\n- Device incompatibility.\n- Examination outcomes or academic performance.\n- Any indirect, incidental, or consequential damages resulting from the use of our platform.\n\nUsers access and use the platform at their own risk."
    },
    {
      id: 12,
      title: "Account Suspension & Termination",
      body: "We reserve the right to suspend or permanently terminate any account that:\n- Violates these Terms.\n- Engages in fraudulent activities.\n- Shares premium content without permission.\n- Uses the platform for unlawful purposes.\n- Attempts to compromise the security of the platform.\n\nUpon termination, access to purchased or subscribed content may be revoked where permitted by law."
    },
    {
      id: 13,
      title: "Changes to These Terms",
      body: "We may update these Terms from time to time to reflect changes in our services, legal requirements, or operational practices. Updated versions will be posted on this page with a revised \"Last Updated\" date. Continued use of the platform after changes take effect constitutes acceptance of the revised Terms."
    },
    {
      id: 14,
      title: "Governing Law",
      body: "These Terms shall be governed by and interpreted in accordance with the laws applicable in the jurisdiction where St. Lawrence Next Gen Academy operates, without regard to conflict of law principles."
    },
    {
      id: 15,
      title: "Contact Us",
      body: "If you have any questions, concerns, or feedback regarding these Terms & Conditions, please contact us through the official contact details provided on our website or within the application."
    }
  ]
};

const PRIVACY_CONTENT = {
  lastUpdated: "July 29, 2026",
  sections: [
    {
      id: 1,
      title: "Information We Collect",
      body: "We collect information that you voluntarily provide when you:\n- Create an account\n- Enroll in courses\n- Purchase a subscription\n- Contact our support team\n- Participate in quizzes, examinations, or discussions\n\nThis information may include:\n- Full name\n- Email address\n- Phone number (if provided)\n- Profile photo (optional)\n- Password (stored in encrypted form)\n- Learning preferences\n- Class or academic level\n- Payment information (processed securely by third-party payment providers)\n- Messages or feedback you send to us\n\nWe also automatically collect certain technical information, including:\n- Device type\n- Browser information\n- IP address\n- Operating system\n- Login activity\n- Pages visited\n- Time spent on the platform\n- Crash reports and diagnostic information"
    },
    {
      id: 2,
      title: "How We Use Your Information",
      body: "Your information helps us provide a better learning experience. We may use your data to:\n- Create and manage your account\n- Personalize your learning experience\n- Deliver courses, lessons, quizzes, and examinations\n- Track your academic progress and achievements\n- Process payments and subscriptions\n- Respond to support requests\n- Send important account notifications\n- Improve platform performance and user experience\n- Detect fraud, abuse, or unauthorized access\n- Comply with applicable legal obligations\n\nWe do not use your personal information for purposes unrelated to the services we provide without your consent."
    },
    {
      id: 3,
      title: "Cookies and Similar Technologies",
      body: "Our platform uses cookies and similar technologies to:\n- Keep you securely logged in\n- Remember your preferences\n- Improve website functionality\n- Measure platform performance\n- Analyze user engagement\n- Enhance security\n\nYou may disable cookies through your browser settings; however, some features of the platform may not function properly if cookies are disabled."
    },
    {
      id: 4,
      title: "Data Protection and Security",
      body: "We take the security of your personal information seriously. We implement appropriate technical and organizational safeguards, including:\n- Secure HTTPS encryption\n- Encrypted password storage\n- Access controls for authorized personnel\n- Secure servers and databases\n- Regular security monitoring\n- Routine software updates and vulnerability assessments\n\nAlthough we strive to protect your information, no method of electronic transmission or storage is completely secure. Therefore, we cannot guarantee absolute security."
    },
    {
      id: 5,
      title: "Third-Party Services",
      body: "We work with trusted third-party providers to operate our platform. These may include:\n- Payment processors\n- Cloud hosting providers\n- Email delivery services\n- Analytics providers\n- Customer support tools\n\nThese providers only receive the information necessary to perform their services and are required to protect your data in accordance with applicable privacy standards.\n\nWe do not sell, rent, or trade your personal information to advertisers or other third parties."
    },
    {
      id: 6,
      title: "Data Retention",
      body: "We retain your personal information only for as long as necessary to:\n- Provide our educational services\n- Maintain your account\n- Meet legal and regulatory requirements\n- Resolve disputes\n- Enforce our Terms & Conditions\n\nWhen your data is no longer required, it is securely deleted or anonymized."
    },
    {
      id: 7,
      title: "Your Rights",
      body: "Depending on applicable laws, you may have the right to:\n- Access your personal information\n- Correct inaccurate information\n- Update your account details\n- Request deletion of your account\n- Withdraw consent where applicable\n- Request a copy of your personal data\n- Object to certain processing activities\n\nRequests may be subject to legal or operational limitations."
    },
    {
      id: 8,
      title: "Children's Privacy",
      body: "Our services are intended for students and learners. Where required by applicable law, parents or legal guardians may be asked to provide consent before a minor's personal information is collected.\n\nIf we discover that we have collected personal information from a child without the required consent, we will take reasonable steps to remove that information."
    },
    {
      id: 9,
      title: "International Data Transfers",
      body: "If your information is processed or stored outside your country of residence, we will take appropriate measures to ensure it remains protected in accordance with applicable data protection laws."
    },
    {
      id: 10,
      title: "Changes to This Privacy Policy",
      body: "We may update this Privacy Policy from time to time to reflect changes in our services, technology, or legal requirements. Any updates will be posted on this page with a revised Last Updated date.\n\nYour continued use of the platform after changes become effective constitutes your acceptance of the updated Privacy Policy."
    },
    {
      id: 11,
      title: "Contact Us",
      body: "If you have any questions, concerns, or requests regarding this Privacy Policy or the way your information is handled, please contact St. Lawrence Next Gen Academy using the official contact information provided on our website or within the application."
    }
  ]
};

async function main() {
  console.log('🌱 Seeding legal pages...');

  await prisma.siteContent.upsert({
    where: { key: 'terms_and_conditions' },
    update: { value: JSON.stringify(TERMS_CONTENT) },
    create: { key: 'terms_and_conditions', value: JSON.stringify(TERMS_CONTENT) }
  });
  console.log('✅ Terms & Conditions seeded');

  await prisma.siteContent.upsert({
    where: { key: 'privacy_policy' },
    update: { value: JSON.stringify(PRIVACY_CONTENT) },
    create: { key: 'privacy_policy', value: JSON.stringify(PRIVACY_CONTENT) }
  });
  console.log('✅ Privacy Policy seeded');

  console.log('🎉 Done! Legal pages are now in the database.');
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
