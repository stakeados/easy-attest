export type Locale = 'en' | 'es';

export interface Translations {
  metadata: {
    title: string;
    description: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    close: string;
    save: string;
    delete: string;
    edit: string;
    create: string;
    back: string;
    next: string;
    submit: string;
    retry: string;
  };
  navigation: {
    home: string;
    createSchema: string;
    createAttestation: string;
    discoverSchemas: string;
    dashboard: string;
    docs: string;
  };
  attestation: {
    form: {
      title: string;
      subtitle: string;
      connectWallet: string;
      connectWalletMessage: string;
      selectSchema: string;
      selectSchemaSubtitle: string;
      changeSchema: string;
      schemaUID: string;
      schemaUIDTooltip: string;
      loadSchema: string;
      loading: string;
      useThisSchema: string;
      schemaFound: string;
      fieldsDetected: string;
      fieldsDetectedPlural: string;
      enterSchemaUID: string;
      invalidSchemaUID: string;
      schemaNotFound: string;
      schemaFetchError: string;
      recipient: string;
      recipientTooltip: string;
      recipientPlaceholder: string;
      recipientRequired: string;
      recipientInvalid: string;
      schemaData: string;
      submit: string;
      creating: string;
      enterNumber: string;
      enterValue: string;
      fieldRequired: string;
      mustBePositiveNumber: string;
      mustBeValidHex: string;
      hexLengthError: string;
      fixErrors: string;
      dateHelper: string;
      percentageHelper: string;
    };
    success: {
      title: string;
      message: string;
      viewOnBasescan: string;
      basescanTooltip: string;
      createAnother: string;
      attestationUid: string;
      attestationUidTooltip: string;
      transactionHash: string;
      transactionHashTooltip: string;
      backToHome: string;
      shareToFarcaster: string;
      shareToFarcasterDescription: string;
      copy: string;
      copied: string;
      pendingUid: string;
      shareToX: string;
      share: string;
      shareMessage: string;
    };
    filters: {
      title: string;
      search: string;
      searchPlaceholder: string;
      filterBySchema: string;
      allSchemas: string;
      filterByAttester: string;
      allAttesters: string;
      clear: string;
      filters: string;
      active: string;
      sortByLabel: string;
      newestFirst: string;
      oldestFirst: string;
      schemaLabel: string;
      fromDate: string;
      toDate: string;
      apply: string;
      reset: string;
    };
  };
  schema: {
    create: {
      title: string;
      subtitle: string;
      connectWallet: string;
      connectWalletMessage: string;
      name: string;
      namePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      revocable: string;
      revocableTooltip: string;
      revocableDescription: string;
      allowRevocable: string;
      fields: string;
      addField: string;
      fieldName: string;
      fieldNamePlaceholder: string;
      fieldType: string;
      required: string;
      type: string;
      submit: string;
      creating: string;
      transactionPending: string;
      transactionPendingMessage: string;
      schemaPreview: string;
      generatedSchema: string;
      fieldsMustHaveOne: string;
      fixErrors: string;
      fieldNameRequired: string;
      fieldNameInvalid: string;
      fieldNameDuplicate: string;
    };
    success: {
      title: string;
      message: string;
      schemaUid: string;
      viewOnBasescan: string;
      createAttestation: string;
      createAnother: string;
    };
    discovery: {
      title: string;
      subtitle: string;
      loading: string;
      noSchemas: string;
      noSchemasMessage: string;
      subgraphUnavailable: string;
      subgraphUnavailableMessage: string;
      subgraphIndexing: string;
      subgraphIndexingMessage: string;
      learnMore: string;
      fields: string;
      uses: string;
      createdBy: string;
      found: string;
      schemas: string;
    };
    selector: {
      title: string;
      search: string;
      searchPlaceholder: string;
      noResults: string;
      select: string;
    };
    template: {
      [key: string]: {
        title: string;
        description: string;
      };
    };
    fields: {
      [key: string]: string;
    };
  };
  dashboard: {
    title: string;
    subtitle: string;
    connectWallet: string;
    connectWalletMessage: string;
    myAttestations: string;
    recentAttestations: string;
    noAttestations: string;
    noAttestationsMessage: string;
    loading: string;
    viewDetails: string;
    received: string;
    given: string;
    attestationsReceived: string;
    attestationsGiven: string;
    sortBy: string;
    newestFirst: string;
    oldestFirst: string;
    mostPopular: string;
    leastPopular: string;
    created: string;
    allTime: string;
    today: string;
    pastWeek: string;
    pastMonth: string;
    minUses: string;
    showFilters: string;
    hideFilters: string;
  };
  wallet: {
    connect: string;
    disconnect: string;
    connecting: string;
    wrongNetwork: string;
    switchNetwork: string;
    reconnect: string;
    reconnectMessage: string;
  };
  errors: {
    generic: string;
    networkError: string;
    transactionFailed: string;
    userRejected: string;
    insufficientFunds: string;
    invalidAddress: string;
    invalidInput: string;
    schemaNotFound: string;
    attestationNotFound: string;
    schemaLoadFailed: string;
  };
  tooltips: {
    theme: string;
    language: string;
    schemaUid: string;
    attestationUid: string;
    recipient: string;
    revocable: string;
    basescan: string;
    copyAddress: string;
    ensName: string;
  };
  transaction: {
    pending: string;
    pendingMessage: string;
    success: string;
    successMessage: string;
    error: string;
    errorMessage: string;
    viewTransaction: string;
  };
  home: {
    title: string;
    subtitle: string;
    createSchemaTitle: string;
    createSchemaDescription: string;
    createAttestationTitle: string;
    createAttestationDescription: string;
    dashboardTitle: string;
    dashboardDescription: string;
    discoverSchemasTitle: string;
    discoverSchemasDescription: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    features: {
      createSchemas: {
        title: string;
        description: string;
      };
      makeAttestations: {
        title: string;
        description: string;
      };
      trackReputation: {
        title: string;
        description: string;
      };
    };
    requirements: string;
    startTutorial: string;
    explore: string;
    fullGuide: string;
  };
  docs: {
    title: string;
    subtitle: string;
    backToHome: string;
    searchPlaceholder: string;
    noResults: string;
    learnMore: string;
    footer: string;
    easDocumentation: string;
  };
  tutorial: {
    schema: {
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
        action: string;
      };
      step3: {
        title: string;
        description: string;
        action: string;
      };
      step4: {
        title: string;
        description: string;
        action: string;
      };
      step5: {
        title: string;
        description: string;
        action: string;
      };
      step6: {
        title: string;
        description: string;
      };
      step7: {
        title: string;
        description: string;
        action: string;
      };
      step8: {
        title: string;
        description: string;
      };
    };
  };
  agents: {
    badge: string;
    title: string;
    subtitle: string;
    downloadSkill: string;
    viewGithub: string;
    contractsTitle: string;
    methodsTitle: string;
    method1Title: string;
    method1Desc: string;
    method2Title: string;
    method2Desc: string;
    method3Title: string;
    method3Desc: string;
    typesTitle: string;
    codeTitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
    tagNoCode: string;
    tagBrowser: string;
    tagFarcaster: string;
    tagNoWallet: string;
    tagNoGas: string;
    tagProgrammatic: string;
    tagFullControl: string;
    tagAgentSigning: string;
    tagEscrowReady: string;
  };
  footer: {
    builtWith: string;
    forCommunity: string;
    support: string;
    copied: string;
  };
}
