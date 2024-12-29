import { chain } from '@/app/chain';
import { client } from '@/app/client';
import React from 'react';
import { ConnectEmbed } from 'thirdweb/react';

const StaticCont = () => {
  const mainStyle: React.CSSProperties = {
    minHeight: '100vh',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align content to the top
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Ensure items align to the top
    maxWidth: '1200px',
    width: '100%',
    padding: '20px', // Adjusted overall padding
    marginTop: '0', // Remove any margin from the top
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    paddingRight: '20px',
    paddingTop: '30px', // Adjusted top padding
  };

  const embedStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginTop: '16px',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={mainStyle}>
      <div style={containerStyle}>
        {/* Left Side Content */}
        <div style={contentStyle}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '24px',
              background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginTop: '0', // Remove any inherent top margin
            }}
          >
            Accountability Through Action
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#a1a1aa',
              marginBottom: '48px',
              lineHeight: '1.6',
              marginTop: '0', // Remove any inherent top margin
            }}
          >
            Lock your crypto, achieve your goals, and build better habits.
            Connect your wallet to start your journey towards self-improvement.
          </p>

          <button
            style={{
              ...buttonStyle,
              maxWidth: '300px',
              margin: '0 auto',
            }}
          >
            Connect Wallet
          </button>
        </div>

        {/* Right Side ConnectEmbed */}
        <div style={embedStyle}>
          <ConnectEmbed chain={chain} client={client} />
        </div>
      </div>
    </div>
  );
};

export default StaticCont;
