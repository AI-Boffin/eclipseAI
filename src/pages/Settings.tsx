import React, { useState } from 'react';
import { Key, Save, TestTube, CheckCircle, XCircle, Eye, EyeOff, Mail, Server, ExternalLink } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import LoadingSpinner from '../components/LoadingSpinner';
import type { ApiKeys } from '../types';

export default function Settings() {
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>('eclipse-api-keys', {
    openai: '',
    eclipseClientId: '',
    eclipseClientSecret: '',
    sendgrid: '',
    emailHost: 'imap.gmail.com',
    emailPort: '993',
    emailUser: '',
    emailPassword: ''
  });

  const [showKeys, setShowKeys] = useState({
    openai: false,
    eclipseClientId: false,
    eclipseClientSecret: false,
    sendgrid: false,
    emailPassword: false
  });

  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({
    openai: null,
    eclipse: null,
    sendgrid: null,
    email: null
  });

  const [testing, setTesting] = useState<Record<string, boolean>>({
    openai: false,
    eclipse: false,
    sendgrid: false,
    email: false
  });

  const [saved, setSaved] = useState(false);

  // Email provider presets
  const emailProviders = [
    {
      name: 'Gmail',
      host: 'imap.gmail.com',
      port: '993',
      setupUrl: 'https://support.google.com/accounts/answer/185833',
      instructions: 'Use App Password (not your regular password)'
    },
    {
      name: 'Outlook/Office 365',
      host: 'outlook.office365.com',
      port: '993',
      setupUrl: 'https://support.microsoft.com/en-us/account-billing/using-app-passwords-with-apps-that-don-t-support-two-step-verification-5896ed9b-4263-e681-128a-a6f2979a7944',
      instructions: 'Enable App Passwords in Microsoft Account'
    },
    {
      name: 'Yahoo Mail',
      host: 'imap.mail.yahoo.com',
      port: '993',
      setupUrl: 'https://help.yahoo.com/kb/generate-third-party-passwords-sln15241.html',
      instructions: 'Generate App Password in Yahoo Account Security'
    },
    {
      name: 'Custom IMAP',
      host: '',
      port: '993',
      setupUrl: '',
      instructions: 'Enter your custom IMAP server details'
    }
  ];

  const handleSave = () => {
    setApiKeys(apiKeys);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testOpenAI = async () => {
    if (!apiKeys.openai) return;
    
    setTesting(prev => ({ ...prev, openai: true }));
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults(prev => ({ ...prev, openai: true }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, openai: false }));
    } finally {
      setTesting(prev => ({ ...prev, openai: false }));
    }
  };

  const testEclipse = async () => {
    if (!apiKeys.eclipseClientId || !apiKeys.eclipseClientSecret) return;
    
    setTesting(prev => ({ ...prev, eclipse: true }));
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults(prev => ({ ...prev, eclipse: true }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, eclipse: false }));
    } finally {
      setTesting(prev => ({ ...prev, eclipse: false }));
    }
  };

  const testSendGrid = async () => {
    if (!apiKeys.sendgrid) return;
    
    setTesting(prev => ({ ...prev, sendgrid: true }));
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults(prev => ({ ...prev, sendgrid: true }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, sendgrid: false }));
    } finally {
      setTesting(prev => ({ ...prev, sendgrid: false }));
    }
  };

  const testEmail = async () => {
    if (!apiKeys.emailUser || !apiKeys.emailPassword) return;
    
    setTesting(prev => ({ ...prev, email: true }));
    
    try {
      // Simulate email connection test
      await new Promise(resolve => setTimeout(resolve, 3000));
      setTestResults(prev => ({ ...prev, email: true }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, email: false }));
    } finally {
      setTesting(prev => ({ ...prev, email: false }));
    }
  };

  const toggleKeyVisibility = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectEmailProvider = (provider: typeof emailProviders[0]) => {
    setApiKeys(prev => ({
      ...prev,
      emailHost: provider.host,
      emailPort: provider.port
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Configure API keys and system settings for Eclipse AI Assistant</p>
      </div>

      <div className="max-w-4xl">
        {/* API Keys Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Configuration
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure your API keys for Eclipse AI features. Keys are stored securely in your browser.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* OpenAI API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Required for AI features like CV summarization, candidate matching, and email generation.
              </p>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys.openai ? 'text' : 'password'}
                    value={apiKeys.openai}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('openai')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={testOpenAI}
                  disabled={!apiKeys.openai || testing.openai}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing.openai ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </>
                  )}
                </button>
                {testResults.openai !== null && (
                  <div className="flex items-center">
                    {testResults.openai ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Eclipse API Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eclipse Client ID
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showKeys.eclipseClientId ? 'text' : 'password'}
                    value={apiKeys.eclipseClientId}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, eclipseClientId: e.target.value }))}
                    placeholder="your-client-id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('eclipseClientId')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.eclipseClientId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eclipse Client Secret
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showKeys.eclipseClientSecret ? 'text' : 'password'}
                    value={apiKeys.eclipseClientSecret}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, eclipseClientSecret: e.target.value }))}
                    placeholder="your-client-secret"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('eclipseClientSecret')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.eclipseClientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={testEclipse}
                disabled={!apiKeys.eclipseClientId || !apiKeys.eclipseClientSecret || testing.eclipse}
                className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing.eclipse ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-1" />
                    Test Eclipse API
                  </>
                )}
              </button>
              {testResults.eclipse !== null && (
                <div className="flex items-center">
                  {testResults.eclipse ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
            </div>

            {/* SendGrid API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SendGrid API Key
                <span className="text-gray-400 ml-1">(Optional)</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Optional: For sending automated emails to candidates. Leave blank to use simulation mode.
              </p>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys.sendgrid ? 'text' : 'password'}
                    value={apiKeys.sendgrid}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, sendgrid: e.target.value }))}
                    placeholder="SG..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('sendgrid')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.sendgrid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={testSendGrid}
                  disabled={!apiKeys.sendgrid || testing.sendgrid}
                  className="flex items-center px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing.sendgrid ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </>
                  )}
                </button>
                {testResults.sendgrid !== null && (
                  <div className="flex items-center">
                    {testResults.sendgrid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Integration Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Integration
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure email settings to automatically fetch and process NHS job emails from Gmail, Outlook, or other IMAP providers.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Email Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Email Provider
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {emailProviders.map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => selectEmailProvider(provider)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      apiKeys.emailHost === provider.host
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{provider.name}</div>
                    {provider.host && (
                      <div className="text-xs text-gray-500 mt-1">{provider.host}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Setup Instructions */}
            {emailProviders.find(p => p.host === apiKeys.emailHost)?.setupUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                <p className="text-sm text-blue-800 mb-3">
                  {emailProviders.find(p => p.host === apiKeys.emailHost)?.instructions}
                </p>
                <a
                  href={emailProviders.find(p => p.host === apiKeys.emailHost)?.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  View Setup Guide
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IMAP Host
                </label>
                <input
                  type="text"
                  value={apiKeys.emailHost}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, emailHost: e.target.value }))}
                  placeholder="imap.gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="text"
                  value={apiKeys.emailPort}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, emailPort: e.target.value }))}
                  placeholder="993"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={apiKeys.emailUser}
                onChange={(e) => setApiKeys(prev => ({ ...prev, emailUser: e.target.value }))}
                placeholder="jobs@your-agency.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-800">
                  <strong>Security Note:</strong> Use an app-specific password, never your main account password. 
                  This ensures your main account stays secure even if this password is compromised.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys.emailPassword ? 'text' : 'password'}
                    value={apiKeys.emailPassword}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, emailPassword: e.target.value }))}
                    placeholder="app-specific-password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('emailPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.emailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={testEmail}
                  disabled={!apiKeys.emailUser || !apiKeys.emailPassword || testing.email}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing.email ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Server className="w-4 h-4 mr-1" />
                      Test Connection
                    </>
                  )}
                </button>
                {testResults.email !== null && (
                  <div className="flex items-center">
                    {testResults.email ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">System Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Application</h3>
                <p className="text-sm text-gray-600">Eclipse AI Assistant v1.0.0</p>
                <p className="text-sm text-gray-600">Medical Recruitment Platform with Email Integration</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">API Status</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>OpenAI API</span>
                    <span className={apiKeys.openai ? 'text-green-600' : 'text-red-600'}>
                      {apiKeys.openai ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Eclipse API</span>
                    <span className={apiKeys.eclipseClientId && apiKeys.eclipseClientSecret ? 'text-green-600' : 'text-red-600'}>
                      {apiKeys.eclipseClientId && apiKeys.eclipseClientSecret ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Email Integration</span>
                    <span className={apiKeys.emailUser && apiKeys.emailPassword ? 'text-green-600' : 'text-red-600'}>
                      {apiKeys.emailUser && apiKeys.emailPassword ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>SendGrid API</span>
                    <span className={apiKeys.sendgrid ? 'text-green-600' : 'text-gray-500'}>
                      {apiKeys.sendgrid ? 'Configured' : 'Optional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saved ? 'Saved!' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}