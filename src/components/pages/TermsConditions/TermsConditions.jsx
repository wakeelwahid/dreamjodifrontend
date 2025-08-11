import React, { useEffect } from "react";
import "./TermsConditions.css";

const TermsConditions = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h2 className="term-section-title">General Terms</h2>
        <ul className="terms-list">
          <li>
            By accessing and using our services, you agree to be bound by these
            terms.
          </li>
          <li>
            You must be at least 18 years old to participate in any rounds.
          </li>
          <li>
            All transactions are final unless otherwise stated in our refund
            policy.
          </li>
          <li>
            We reserve the right to modify these terms at any time without prior
            notice.
          </li>
          <li>
            The company reserves the right to refuse service to anyone for any
            reason at any time.
          </li>
          <li>
            You may not use our products for any illegal or unauthorized
            purpose.
          </li>
        </ul>

        <h2 className="term-section-title">Account Rules</h2>
        <ul className="terms-list">
          <li>One account per person is strictly enforced.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials.
          </li>
          <li>Any suspicious activity must be reported immediately.</li>
          <li>Accounts may be suspended for violation of terms.</li>
          <li>
            Accounts inactive for more than 12 months may be subject to
            deactivation.
          </li>
          <li>
            You must provide accurate and complete information when creating an
            account.
          </li>
        </ul>

        <h2 className="term-section-title">Round Rules</h2>
        <ul className="terms-list">
          <li>All round results are final and cannot be disputed.</li>
          <li>Round timings and rules are subject to change without notice.</li>
          <li>
            Any attempt to manipulate round outcomes will result in permanent
            ban.
          </li>
          <li>
            Winnings are credited according to the declared payout structure.
          </li>
          <li>Minimum and maximum betting limits apply to all rounds.</li>
          <li>
            Technical errors may void plays and payouts at our discretion.
          </li>
        </ul>

        <div className="warning-box">
          <p>
            <strong>Important:</strong> We are not responsible for any legal
            consequences that may arise from participating in rounds in
            jurisdictions where such activities are prohibited.
          </p>
        </div>

        <h2 className="term-section-title">Payment Terms</h2>
        <ul className="terms-list">
          <li>
            All deposits must be from payment methods registered in your name.
          </li>
          <li>Redeems are processed within 24-48 hours of request.</li>
          <li>A minimum balance may be required for redeem requests.</li>
          <li>
            We reserve the right to request KYC documentation for any
            transaction.
          </li>
          <li>Transaction fees may apply depending on your payment method.</li>
          <li>
            Chargebacks will result in immediate account suspension and possible
            legal action.
          </li>
        </ul>

        <h2 className="term-section-title">Responsible Gaming</h2>
        <ul className="terms-list">
          <li>Set limits for your deposits and playing time.</li>
          <li>
            Do not chase losses - Context should be for entertainment only.
          </li>
          <li>
            If you feel you may have a Context problem, seek help immediately.
          </li>
          <li>We offer self-exclusion options for players who need them.</li>
          <li>
            Reality checks are available upon request to track your playing
            time.
          </li>
          <li>We provide links to professional Context help organizations.</li>
        </ul>

        <h2 className="term-section-title">Privacy Policy</h2>
        <ul className="terms-list">
          <li>
            We collect personal information to provide and improve our services.
          </li>
          <li>
            Your data may be used for identity verification and fraud
            prevention.
          </li>
          <li>
            We implement industry-standard security measures to protect your
            information.
          </li>
          <li>
            Cookies are used to enhance user experience and track preferences.
          </li>
          <li>
            We may share information with law enforcement when required by law.
          </li>
          <li>
            You have the right to request access to your personal data we hold.
          </li>
        </ul>

        <h2 className="term-section-title">Intellectual Property</h2>
        <ul className="terms-list">
          <li>All content on this platform is our exclusive property.</li>
          <li>
            Unauthorized copying, reproduction, or distribution is prohibited.
          </li>
          <li>
            Trademarks, logos, and service marks are registered and protected.
          </li>
          <li>
            User-generated content grants us a worldwide, royalty-free license.
          </li>
          <li>
            Reverse engineering or decompiling our software is strictly
            forbidden.
          </li>
        </ul>

        <h2 className="term-section-title">Limitation of Liability</h2>
        <ul className="terms-list">
          <li>
            We are not liable for any indirect, incidental, or consequential
            damages.
          </li>
          <li>
            Our total liability is limited to the amount you've paid us in the
            last 6 months.
          </li>
          <li>We do not guarantee uninterrupted or error-free service.</li>
          <li>
            We are not responsible for losses due to system failures or
            technical issues.
          </li>
          <li>
            Force majeure events may temporarily suspend our services without
            liability.
          </li>
        </ul>

        <div className="acceptance-section">
          <p className="acceptance-text">
            By continuing to use our services, you acknowledge that you have
            read, understood, and agree to be bound by these Terms and
            Conditions.
          </p>
          <button className="accept-btn">I AGREE TO THESE TERMS</button>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
