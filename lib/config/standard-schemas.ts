import { LucideIcon } from 'lucide-react';

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
}

export interface StandardSchema {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  revocable: boolean;
  fields: SchemaField[];
  uid: string;
}

export const STANDARD_SCHEMAS: StandardSchema[] = [
  {
    "id": "vote-delegation",
    "title": "Vote Delegation",
    "description": "Delegate voting power to another address for governance proposals.",
    "revocable": true,
    "fields": [
      {
        "name": "daoId",
        "type": "bytes32",
        "required": true
      },
      {
        "name": "delegatee",
        "type": "address",
        "required": true
      },
      {
        "name": "weight",
        "type": "uint256",
        "required": false
      },
      {
        "name": "reason",
        "type": "string",
        "required": false
      }
    ],
    "uid": "0x1296ff939c4ea61a47f1707fcf456668453dc16f003879ef3d6b918420fe78d0",
    "icon": "Vote",
    "category": "Governance"
  },
  {
    "id": "grant-milestone",
    "title": "Grant Milestone",
    "description": "Attest to the completion of a grant milestone with proof.",
    "revocable": true,
    "fields": [
      {
        "name": "grantId",
        "type": "bytes32",
        "required": true
      },
      {
        "name": "milestoneIndex",
        "type": "uint8",
        "required": true
      },
      {
        "name": "isApproved",
        "type": "bool",
        "required": true
      },
      {
        "name": "proofUrl",
        "type": "string",
        "required": true
      }
    ],
    "uid": "0x45ffbc7e42a5e8c002c81f989380851f6d40c1923d043dd8ff70bb7af35e5399",
    "icon": "Flag",
    "category": "Governance"
  },
  {
    "id": "p2p-invoice",
    "title": "P2P Invoice",
    "description": "Create an onchain invoice for peer-to-peer payments.",
    "revocable": false,
    "fields": [
      {
        "name": "serviceDescription",
        "type": "string",
        "required": true
      },
      {
        "name": "amount",
        "type": "uint256",
        "required": true
      },
      {
        "name": "currencySymbol",
        "type": "string",
        "required": true
      },
      {
        "name": "txHash",
        "type": "bytes32",
        "required": false
      }
    ],
    "uid": "0x37fd428f269e8d108fff21151911320de508c38849e5b1f0ced64bfb3f57c0f5",
    "icon": "Receipt",
    "category": "Finance"
  },
  {
    "id": "loan-agreement",
    "title": "Loan Agreement",
    "description": "Record the terms of a loan agreement between two parties.",
    "revocable": true,
    "fields": [
      {
        "name": "loanAmount",
        "type": "uint256",
        "required": true
      },
      {
        "name": "repaymentDate",
        "type": "uint256",
        "required": true
      },
      {
        "name": "interestRate",
        "type": "uint256",
        "required": false
      },
      {
        "name": "termsUrl",
        "type": "string",
        "required": false
      }
    ],
    "uid": "0x92f2d933078bef7cb38ce4332e79e700e40f197517791f84d6249ab5cb4c37ce",
    "icon": "Handshake",
    "category": "Finance"
  },
  {
    "id": "document-sign",
    "title": "Document Sign",
    "description": "Sign a document onchain by referencing its hash and URL.",
    "revocable": true,
    "fields": [
      {
        "name": "documentHash",
        "type": "bytes32",
        "required": true
      },
      {
        "name": "docUrl",
        "type": "string",
        "required": true
      },
      {
        "name": "signatureType",
        "type": "string",
        "required": false
      },
      {
        "name": "signedAt",
        "type": "uint256",
        "required": true
      }
    ],
    "uid": "0x13a3d48a69f3ed210085e2e051b8de6fcc9ee5f26400c7f152f27096ee9a682a",
    "icon": "Pen",
    "category": "Legal"
  },
  {
    "id": "content-authorship",
    "title": "Content Authorship",
    "description": "Prove authorship of content by linking it to your address.",
    "revocable": true,
    "fields": [
      {
        "name": "contentHash",
        "type": "bytes32",
        "required": true
      },
      {
        "name": "contentUrl",
        "type": "string",
        "required": true
      },
      {
        "name": "licenseType",
        "type": "string",
        "required": true
      },
      {
        "name": "creationDate",
        "type": "uint256",
        "required": true
      }
    ],
    "uid": "0x4dc6fad17a2d644a435845570e860f755793ded2f559d37ec6ff8f6876272ef2",
    "icon": "Copyright",
    "category": "Legal"
  },
  {
    "id": "game-achievement",
    "title": "Game Achievement",
    "description": "Issue an achievement or badge to a player.",
    "revocable": false,
    "fields": [
      {
        "name": "gameId",
        "type": "string",
        "required": true
      },
      {
        "name": "achievementId",
        "type": "string",
        "required": true
      },
      {
        "name": "score",
        "type": "uint256",
        "required": false
      },
      {
        "name": "badgeUrl",
        "type": "string",
        "required": false
      }
    ],
    "uid": "0x3f906bca456b46764cc648e39f8dd60ab958bac681c9ee1c630694412f446b2d",
    "icon": "Trophy",
    "category": "Gaming"
  },
  {
    "id": "guild-member",
    "title": "Guild Member",
    "description": "Verify membership and rank within a gaming guild.",
    "revocable": true,
    "fields": [
      {
        "name": "guildName",
        "type": "string",
        "required": true
      },
      {
        "name": "rank",
        "type": "string",
        "required": true
      },
      {
        "name": "isOfficer",
        "type": "bool",
        "required": true
      },
      {
        "name": "joinedAt",
        "type": "uint256",
        "required": true
      }
    ],
    "uid": "0x92a6cd36e37459d8d64dac8919b54db82b9db51279741da9a5dabd5a3f773601",
    "icon": "Shield",
    "category": "Gaming"
  },
  {
    "id": "event-attendance",
    "title": "Event Attendance",
    "description": "Proof of attendance for an event or conference.",
    "revocable": false,
    "fields": [
      {
        "name": "eventId",
        "type": "string",
        "required": true
      },
      {
        "name": "eventName",
        "type": "string",
        "required": true
      },
      {
        "name": "attended",
        "type": "bool",
        "required": true
      },
      {
        "name": "role",
        "type": "string",
        "required": false
      }
    ],
    "uid": "0x1252bf3d0466920b49e08643096e9ef3860125ccac14cbd8a06dd8377de15676",
    "icon": "Calendar",
    "category": "Events"
  },
  {
    "id": "product-review",
    "title": "Product Review",
    "description": "Submit a verified review for a product or service.",
    "revocable": true,
    "fields": [
      {
        "name": "itemId",
        "type": "string",
        "required": true
      },
      {
        "name": "rating",
        "type": "uint8",
        "required": true
      },
      {
        "name": "comment",
        "type": "string",
        "required": false
      },
      {
        "name": "recommend",
        "type": "bool",
        "required": true
      }
    ],
    "uid": "0x186ac80092ec805ab6b86b394de8eb8568cbdc222b6092d444aa1808e5cc0cc5",
    "icon": "Star",
    "category": "Reputation"
  },
  {
    "id": "skill-endorsement",
    "title": "Skill Endorsement",
    "description": "Endorse a professional skill or competency.",
    "revocable": true,
    "fields": [
      {
        "name": "skill",
        "type": "string",
        "required": true
      },
      {
        "name": "level",
        "type": "uint8",
        "required": true
      },
      {
        "name": "relationship",
        "type": "string",
        "required": false
      },
      {
        "name": "comment",
        "type": "string",
        "required": false
      }
    ],
    "uid": "0x76deb329fe225a4c6be58d22260b99138d37ffceab691eafc2ef949988d472b2",
    "icon": "Award",
    "category": "Professional"
  },
  {
    "id": "identity-basic",
    "title": "Identity Basic",
    "description": "Basic identity verification fields.",
    "revocable": true,
    "fields": [
      {
        "name": "isHuman",
        "type": "bool",
        "required": true
      },
      {
        "name": "verificationMethod",
        "type": "string",
        "required": true
      },
      {
        "name": "country",
        "type": "string",
        "required": false
      }
    ],
    "uid": "0xb74369e942975e535a3c54e21f48cd88f797d7a3fc34cc52930e73c636d77e86",
    "icon": "User",
    "category": "Identity"
  },
  {
    "id": "membership-card",
    "title": "Membership Card",
    "description": "Proof of membership for a community or club.",
    "revocable": true,
    "fields": [
      {
        "name": "communityName",
        "type": "string",
        "required": true
      },
      {
        "name": "memberTier",
        "type": "string",
        "required": true
      },
      {
        "name": "expirationDate",
        "type": "uint256",
        "required": true
      }
    ],
    "uid": "0xfdcaca912dc4e22afa816efa93c8831b2429f8efcaf3f80c82aa1ddb0ba531e9",
    "icon": "IdCard",
    "category": "Social"
  },
  {
    "id": "project-contribution",
    "title": "Project Contribution",
    "description": "Record a contribution to an open source project.",
    "revocable": true,
    "fields": [
      {
        "name": "projectName",
        "type": "string",
        "required": true
      },
      {
        "name": "contributionType",
        "type": "string",
        "required": true
      },
      {
        "name": "description",
        "type": "string",
        "required": false
      },
      {
        "name": "link",
        "type": "string",
        "required": false
      }
    ],
    "uid": "0xa73e2e7e196665a228a51ed9e3c6f19832b45c8f5aa09533acae03b18b382481",
    "icon": "GitPullRequest",
    "category": "Professional"
  }
];
