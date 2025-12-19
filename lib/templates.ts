
export interface SchemaTemplate {
    id: string;
    title: string;
    description: string;
    schema: string;
    icon: string; // Lucide icon name or emoji
    category: 'Events' | 'Reputation' | 'Identity' | 'Professional' | 'Social';
    tags: string[];
}

export const STANDARD_TEMPLATES: SchemaTemplate[] = [
    {
        id: 'event-attendance',
        title: 'Event Attendance',
        description: 'Verify that someone attended a specific event. Useful for POAPs and community tracking.',
        schema: 'string eventId, string eventName, bool attended, string role',
        icon: 'CalendarCheck',
        category: 'Events',
        tags: ['events', 'poap', 'community'],
    },
    {
        id: 'product-review',
        title: 'Product/Service Review',
        description: 'Leave a decentralized review for a product, service, or protocol.',
        schema: 'string itemId, uint8 rating, string comment, bool recommend',
        icon: 'Star',
        category: 'Reputation',
        tags: ['review', 'rating', 'feedback'],
    },
    {
        id: 'skill-endorsement',
        title: 'Skill Endorsement',
        description: 'Endorse a colleague or friend for a specific professional skill.',
        schema: 'string skill, uint8 level, string relationship, string comment',
        icon: 'BadgeCheck',
        category: 'Professional',
        tags: ['skills', 'work', 'endorsement'],
    },
    {
        id: 'identity-verification',
        title: 'Basic Identity Verification',
        description: 'Assert that an address belongs to a real human or verified entity.',
        schema: 'bool isHuman, string verificationMethod, string country',
        icon: 'UserCheck',
        category: 'Identity',
        tags: ['kyc', 'identity', 'sybil-resistance'],
    },
    {
        id: 'membership-card',
        title: 'Membership Card',
        description: 'Issue a membership credential to a community member.',
        schema: 'string communityName, string memberTier, uint256 expirationDate',
        icon: 'CreditCard',
        category: 'Social',
        tags: ['membership', 'dao', 'community'],
    },
    {
        id: 'project-contribution',
        title: 'Project Contribution',
        description: 'Acknowledge a contribution to an open source project or DAO.',
        schema: 'string projectName, string contributionType, string description, string link',
        icon: 'GitPullRequest',
        category: 'Professional',
        tags: ['contribution', 'work', 'dao'],
    },
];
