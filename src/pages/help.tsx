import React from 'react';

import { BackgroundTheme } from '../components/drawing/background-theme';
import { Link } from '../components/link/link';
import { HelpItems } from '../data/help-items';
import { RouteToHelpdesk } from '../paths';

export function Help(): JSX.Element {
  return (
    <div className="page-container">
      <BackgroundTheme layout="layout3" />
      <div className="page-content">
        <div className="page-header">
          <h2>Help</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <div className="help-text title">
              Got a question? Check out each section below for FAQs on the
              different sides of Swash.
            </div>
            <div className="help-grid-container">
              {HelpItems.map(({ title, image, className, link }, index) => (
                <Link
                  url={link}
                  className={`help-option ${className}`}
                  external={link.startsWith('http')}
                  newTab={link.startsWith('http')}
                  key={`help-option-${index}`}
                >
                  <img src={image} alt={title} />
                  <div className="help-option-title title">{title}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="simple-card">
            <div className="help-title title">
              Can’t find your answer? Contact Swash.
            </div>
            <div className="help-text title">
              Submit a support request{' '}
              <Link url={RouteToHelpdesk.submitTicket} external newTab>
                here
              </Link>{' '}
              and someone will get back to you within 48 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
