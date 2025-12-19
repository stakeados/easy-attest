'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function TutorialOverlay({
  steps,
  onComplete,
  onSkip,
}: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    // Scroll to highlighted element
    if (steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target!);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
    >
      {/* Backdrop with spotlight effect */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Highlight box for target element */}
      {step.target && (
        <HighlightBox
          target={step.target}
          position={step.position || 'bottom'}
        />
      )}

      {/* Tutorial card */}
      <div className="absolute inset-x-0 bottom-0 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl mx-4 md:mx-0">
          {/* Progress bar */}
          <div className="h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
              </div>
              <button
                onClick={handleSkip}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Skip tutorial"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{step.description}</p>

            {/* Action hint */}
            {step.action && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Try it:</strong> {step.action}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HighlightBox({
  target,
  position,
}: {
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(target);
    if (element) {
      const updateRect = () => {
        setRect(element.getBoundingClientRect());
      };
      updateRect();

      // Update on scroll and resize
      window.addEventListener('scroll', updateRect);
      window.addEventListener('resize', updateRect);
      return () => {
        window.removeEventListener('scroll', updateRect);
        window.removeEventListener('resize', updateRect);
      };
    }
  }, [target]);

  if (!rect) return null;

  return (
    <>
      {/* Highlight ring */}
      <div
        className="absolute border-4 border-blue-500 rounded-lg pointer-events-none animate-pulse"
        style={{
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        }}
      />
      {/* Clear area */}
      <div
        className="absolute bg-white/5 rounded-lg pointer-events-none"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      />
    </>
  );
}

// Predefined tutorial sequences
export const schemaTutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Schema Builder',
    description:
      'Schemas define the structure of attestations. Think of them as templates that ensure consistency. Let\'s create your first schema together!',
  },
  {
    title: 'Add Your First Field',
    description:
      'Click the "Add Field" button to add a field to your schema. Each field has a name, data type, and can be marked as required or optional.',
    target: '[data-tutorial="add-field-button"]',
    position: 'top',
    action: 'Click "Add Field" to continue',
  },
  {
    title: 'Name Your Field',
    description:
      'Give your field a descriptive name like "skill", "score", or "comment". Use lowercase and avoid spaces.',
    target: '[data-tutorial="field-name-input"]',
    position: 'bottom',
    action: 'Enter a field name',
  },
  {
    title: 'Choose a Data Type',
    description:
      'Select the appropriate data type: string for text, uint256 for numbers, bool for yes/no, or address for Ethereum addresses.',
    target: '[data-tutorial="field-type-select"]',
    position: 'bottom',
    action: 'Select a data type',
  },
  {
    title: 'Mark as Required',
    description:
      'Toggle whether this field must be filled in every attestation. Required fields ensure consistency.',
    target: '[data-tutorial="field-required-toggle"]',
    position: 'bottom',
    action: 'Toggle the required checkbox',
  },
  {
    title: 'Preview Your Schema',
    description:
      'The schema preview shows the generated schema string. This is what gets registered on the blockchain.',
    target: '[data-tutorial="schema-preview"]',
    position: 'top',
  },
  {
    title: 'Submit Your Schema',
    description:
      'When you\'re ready, click "Create Schema" to register it on the blockchain. You\'ll need to approve the transaction in your wallet.',
    target: '[data-tutorial="submit-button"]',
    position: 'top',
    action: 'Click "Create Schema" when ready',
  },
  {
    title: 'You\'re All Set!',
    description:
      'After confirmation, you\'ll receive a Schema UID. Save it and share it with others who should use your schema. You can also share it on X (Twitter)!',
  },
];

export const attestationTutorialSteps: TutorialStep[] = [
  {
    title: 'Create Your First Attestation',
    description:
      'Attestations are onchain statements about someone. Let\'s create one together using an existing schema.',
  },
  {
    title: 'Select a Schema',
    description:
      'Enter a Schema UID or browse available schemas. The schema defines what information you\'ll provide.',
    target: '[data-tutorial="schema-selector"]',
    position: 'bottom',
    action: 'Select or enter a schema',
  },
  {
    title: 'Enter Recipient Address',
    description:
      'Input the Ethereum address of the person receiving this attestation. You can also use ENS names like "vitalik.eth".',
    target: '[data-tutorial="recipient-input"]',
    position: 'bottom',
    action: 'Enter a recipient address',
  },
  {
    title: 'Fill in Attestation Data',
    description:
      'Complete all required fields based on the schema. Be accurate - attestations are permanent!',
    target: '[data-tutorial="attestation-form"]',
    position: 'top',
    action: 'Fill in the form fields',
  },
  {
    title: 'Submit Your Attestation',
    description:
      'Review your information and click "Create Attestation". You\'ll need to approve the transaction in your wallet.',
    target: '[data-tutorial="submit-button"]',
    position: 'top',
    action: 'Click "Create Attestation" when ready',
  },
  {
    title: 'Share Your Attestation',
    description:
      'After confirmation, you can share your attestation to X (Twitter) or view it on a block explorer. The recipient can see it in their dashboard!',
  },
];

export const dashboardTutorialSteps: TutorialStep[] = [
  {
    title: 'Your Reputation Dashboard',
    description:
      'This is your onchain reputation hub. View all attestations you\'ve received and given.',
  },
  {
    title: 'Attestations Received',
    description:
      'These are attestations others have made about you - your onchain credentials and endorsements.',
    target: '[data-tutorial="received-tab"]',
    position: 'bottom',
  },
  {
    title: 'Attestations Given',
    description:
      'These are attestations you\'ve created for others - your endorsement history.',
    target: '[data-tutorial="given-tab"]',
    position: 'bottom',
  },
  {
    title: 'Filter and Sort',
    description:
      'Use filters to find specific attestations by schema type or date. Sort to organize your view.',
    target: '[data-tutorial="filters"]',
    position: 'bottom',
  },
  {
    title: 'Explore Attestations',
    description:
      'Click on any attestation to see full details. You can verify them on the block explorer or share them to X (Twitter).',
  },
];
