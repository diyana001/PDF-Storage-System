import React from 'react';
import { ArrowLeft, Check, Crown } from 'lucide-react';
import '../styles/plans.css';

export default function PlansPage({ currentPlan, onBack, onActivatePro }) {
  return (
    <main className="plans-page">
      <button className="plans-back" onClick={onBack}>
        <ArrowLeft size={17} /> Back to documents
      </button>

      <section className="plans-heading">
        <small className="eyebrow">CHOOSE YOUR WORKSPACE</small>
        <h1>Plans that grow with your library</h1>
        <p>Start free and upgrade when you need more room for your PDFs.</p>
      </section>

      <section className="plans-grid">
        <article className="plan-card">
          <small className="eyebrow">STARTER</small>
          <h2>Free</h2>
          <p className="plan-price">$0 <span>/ forever</span></p>
          <p>Everything you need to get started.</p>
          <ul>
            <li><Check size={16} /> Store up to 3 PDFs</li>
            <li><Check size={16} /> Search your documents</li>
            <li><Check size={16} /> Download your files</li>
          </ul>
          <button className="secondary plan-button" disabled={currentPlan === 'free'}>
            {currentPlan === 'free' ? 'Current plan' : 'Free plan'}
          </button>
        </article>

        <article className="plan-card pro-plan">
          <div className="pro-badge"><Crown size={14} /> RECOMMENDED</div>
          <small className="eyebrow">FOR POWER USERS</small>
          <h2>Pro</h2>
          <p className="plan-price">$9 <span>/ month</span></p>
          <p>More space for the documents that matter.</p>
          <ul>
            <li><Check size={16} /> Upload more PDFs</li>
            <li><Check size={16} /> Search your documents</li>
            <li><Check size={16} /> Download and manage files</li>
          </ul>
          <button className="primary plan-button" onClick={onActivatePro}>
            {currentPlan === 'pro' ? 'Pro activated' : 'Activate Pro'}
          </button>
        </article>
      </section>
    </main>
  );
}
