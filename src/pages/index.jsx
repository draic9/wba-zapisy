import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import IndexSectionCustomComponents1 from '../components/custom-components/IndexSectionCustomComponents1';
import IndexSectionCustomComponents2 from '../components/custom-components/IndexSectionCustomComponents2';
import IndexSectionContent10 from '../components/content/IndexSectionContent10';
import IndexSectionCallToAction11 from '../components/call-to-action/IndexSectionCallToAction11';
import IndexSectionCustomComponents3 from '../components/custom-components/IndexSectionCustomComponents3';
import IndexSectionLogoClouds7 from '../components/logo-clouds/IndexSectionLogoClouds7';
import IndexSectionTeam8 from '../components/team/IndexSectionTeam8';
import IndexSectionCustomComponents4 from '../components/custom-components/IndexSectionCustomComponents4';
import IndexSectionPortfolio9 from '../components/portfolio/IndexSectionPortfolio9';
import IndexSectionCustomComponents5 from '../components/custom-components/IndexSectionCustomComponents5';
import IndexSectionTeam12 from '../components/team/IndexSectionTeam12';
import IndexSectionCustomComponents6 from '../components/custom-components/IndexSectionCustomComponents6';

const Index = () => {
  return (
    <>
      <Head>
        <title>Wrocławski Bieg Akademicki</title>
        <link rel='icon' type='image/svg+xml' href='/wba-favicon.svg' />
        <Script
          src='js/global-16437.js'
          strategy='afterInteractive'
        />
      </Head>
      <IndexSectionCustomComponents1 />
      <IndexSectionCustomComponents2 />
      <IndexSectionContent10 />
      <IndexSectionCallToAction11 />
      <IndexSectionCustomComponents3 />
      <IndexSectionLogoClouds7 />
      <IndexSectionTeam8 />
      <IndexSectionCustomComponents4 />
      <IndexSectionPortfolio9 />
      <IndexSectionCustomComponents5 />
      <IndexSectionTeam12 />
      <IndexSectionCustomComponents6 />
    </>
  );
};

export default Index;

